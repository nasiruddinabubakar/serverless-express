const jsforce = require('jsforce');
const crypto = require('crypto');
const axios = require('axios');
const { Connection } = require('../db/models');

class IntegrationService {
  constructor() {
    this.codeVerifierStore = new Map();
  }

  // Generate PKCE code_verifier and code_challenge
  generatePKCE() {
    const codeVerifier = crypto.randomBytes(64).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    return { codeVerifier, codeChallenge };
  }

  // Salesforce OAuth methods
  getSalesforceAuthUrl() {
    const { codeVerifier, codeChallenge } = this.generatePKCE();
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI;
    const authBaseUrl = 'https://login.salesforce.com';

    const authUrl = `${authBaseUrl}/services/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=openid id api refresh_token`;

    return { authUrl, codeVerifier };
  }

  async handleSalesforceCallback(code, codeVerifier, username, connectionName) {
    try {
      const authBaseUrl = 'https://login.salesforce.com';
      const clientId = process.env.SALESFORCE_CLIENT_ID;
      const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
      const redirectUri = process.env.SALESFORCE_REDIRECT_URI;

      const tokenResponse = await axios.post(
        `${authBaseUrl}/services/oauth2/token`,
        null,
        {
          params: {
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            // code_verifier: codeVerifier // Uncomment if using PKCE
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const result = tokenResponse.data;

      const conn = new jsforce.Connection({
        accessToken: result.access_token,
        instanceUrl: result.instance_url
      });

      const userInfo = await conn.identity();

      // Calculate token expiration (Salesforce tokens typically expire in 2 hours)
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 2);

      const connectionData = {
        type: 'salesforce',
        name: connectionName || 'Salesforce Connection',
        username,
        organization_name: userInfo.organization_name,
        organization_id: userInfo.organization_id,
        instance_url: result.instance_url,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        token_expires_at: tokenExpiresAt,
        last_login: new Date(),
        is_active: true,
        config: {
          user_id: userInfo.user_id,
          username: userInfo.username,
          display_name: userInfo.display_name
        }
      };

      // Check if connection already exists
      let connection = await Connection.findOne({
        where: {
          username,
          type: 'salesforce',
          organization_id: userInfo.organization_id
        }
      });

      if (connection) {
        // Update existing connection
        await connection.update(connectionData);
      } else {
        // Create new connection
        connection = await Connection.create(connectionData);
      }

      return {
        success: true,
        connection: {
          id: connection.id,
          name: connection.name,
          username: connection.username,
          organization_name: connection.organization_name,
          organization_id: connection.organization_id,
          instance_url: connection.instance_url,
          last_login: connection.last_login
        },
        sessionId: result.access_token
      };
    } catch (error) {
      console.error('Salesforce OAuth callback error:', error?.response?.data || error.message);
      throw new Error('Failed to authenticate with Salesforce');
    }
  }

  async refreshSalesforceToken(connectionId) {
    try {
      const connection = await Connection.findByPk(connectionId);
      if (!connection || connection.type !== 'salesforce' || !connection.refresh_token) {
        throw new Error('Connection or refresh token not found');
      }

      const authBaseUrl = 'https://login.salesforce.com';
      const clientId = process.env.SALESFORCE_CLIENT_ID;
      const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;

      const response = await axios.post(
        `${authBaseUrl}/services/oauth2/token`,
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: connection.refresh_token,
            client_id: clientId,
            client_secret: clientSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const result = response.data;

      // Update token and expiration
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 2);

      await connection.update({
        access_token: result.access_token,
        token_expires_at: tokenExpiresAt,
        last_login: new Date()
      });

      return result.access_token;
    } catch (error) {
      console.error('Salesforce token refresh error:', error?.response?.data || error.message);
      throw new Error('Failed to refresh Salesforce token');
    }
  }

  async testSalesforceConnection(connectionId) {
    try {
      const connection = await Connection.findByPk(connectionId);
      if (!connection || connection.type !== 'salesforce') {
        throw new Error('Salesforce connection not found');
      }

      const conn = new jsforce.Connection({
        accessToken: connection.access_token,
        instanceUrl: connection.instance_url
      });

      await conn.identity();
      return true;
    } catch (error) {
      if (error.errorCode === 'INVALID_SESSION_ID') {
        try {
          await this.refreshSalesforceToken(connectionId);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  async fetchSalesforceReport(connectionId, reportId) {
    try {
      const connection = await Connection.findByPk(connectionId);
      if (!connection || connection.type !== 'salesforce') {
        throw new Error('Salesforce connection not found');
      }

      // Test and refresh token if needed
      const isValid = await this.testSalesforceConnection(connectionId);
      if (!isValid) {
        throw new Error('Invalid Salesforce connection');
      }

      // Reload connection to get updated token
      await connection.reload();

      const response = await fetch(
        `${connection.instance_url}/services/data/v59.0/analytics/reports/${reportId}?export=1&enc=UTF-8&xf=csv`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${connection.access_token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Salesforce fetch error: ${errorText}`);
      }

      const reportData = await response.text();
      
      return {
        success: true,
        reportId,
        data: reportData,
        metadata: reportData.reportMetadata,
        records: reportData.factMap
      };
    } catch (error) {
      console.error('Salesforce report fetch error:', error.message);
      throw new Error(`Failed to fetch Salesforce report: ${error.message}`);
    }
  }

  async getSalesforceReportsList(connectionId) {
    try {
      const connection = await Connection.findByPk(connectionId);
      if (!connection || connection.type !== 'salesforce') {
        throw new Error('Salesforce connection not found');
      }

      // Test and refresh token if needed
      const isValid = await this.testSalesforceConnection(connectionId);
      if (!isValid) {
        throw new Error('Invalid Salesforce connection');
      }

      // Reload connection to get updated token
      await connection.reload();

      const conn = new jsforce.Connection({
        accessToken: connection.access_token,
        instanceUrl: connection.instance_url
      });

      const reports = await conn.query(`
        SELECT Id, Name, DeveloperName, Description 
        FROM Report 
        WHERE IsDeleted = false 
        ORDER BY Name
      `);

      return {
        success: true,
        reports: reports.records
      };
    } catch (error) {
      console.error('Salesforce reports list error:', error.message);
      throw new Error(`Failed to fetch Salesforce reports list: ${error.message}`);
    }
  }

  // Tableau OAuth methods (example for future integration)
  getTableauAuthUrl() {
    const { codeVerifier, codeChallenge } = this.generatePKCE();
    const clientId = process.env.TABLEAU_CLIENT_ID;
    const redirectUri = process.env.TABLEAU_REDIRECT_URI;
    const authBaseUrl = 'https://tableau.com';

    const authUrl = `${authBaseUrl}/auth/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=tableau:views:embed` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    return { authUrl, codeVerifier };
  }

  async handleTableauCallback(code, codeVerifier, username, connectionName) {
    try {
      const authBaseUrl = 'https://tableau.com';
      const clientId = process.env.TABLEAU_CLIENT_ID;
      const clientSecret = process.env.TABLEAU_CLIENT_SECRET;
      const redirectUri = process.env.TABLEAU_REDIRECT_URI;

      const tokenResponse = await axios.post(
        `${authBaseUrl}/auth/oauth2/token`,
        null,
        {
          params: {
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const result = tokenResponse.data;

      // Calculate token expiration (Tableau tokens typically expire in 1 hour)
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

      const connectionData = {
        type: 'tableau',
        name: connectionName || 'Tableau Connection',
        username,
        organization_name: result.site_name || 'Tableau Site',
        organization_id: result.site_id,
        instance_url: result.site_url,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        token_expires_at: tokenExpiresAt,
        last_login: new Date(),
        is_active: true,
        config: {
          user_id: result.user_id,
          username: result.username
        }
      };

      // Check if connection already exists
      let connection = await Connection.findOne({
        where: {
          username,
          type: 'tableau',
          organization_id: result.site_id
        }
      });

      if (connection) {
        // Update existing connection
        await connection.update(connectionData);
      } else {
        // Create new connection
        connection = await Connection.create(connectionData);
      }

      return {
        success: true,
        connection: {
          id: connection.id,
          name: connection.name,
          username: connection.username,
          organization_name: connection.organization_name,
          organization_id: connection.organization_id,
          instance_url: connection.instance_url,
          last_login: connection.last_login
        },
        sessionId: result.access_token
      };
    } catch (error) {
      console.error('Tableau OAuth callback error:', error?.response?.data || error.message);
      throw new Error('Failed to authenticate with Tableau');
    }
  }

  async testTableauConnection(connectionId) {
    try {
      const connection = await Connection.findByPk(connectionId);
      if (!connection || connection.type !== 'tableau') {
        throw new Error('Tableau connection not found');
      }

      // Test connection by making a simple API call
      const response = await axios.get(
        `${connection.instance_url}/api/3.4/sites/${connection.organization_id}/users/current`,
        {
          headers: {
            'Authorization': `Bearer ${connection.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await this.refreshTableauToken(connectionId);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  async refreshTableauToken(connectionId) {
    try {
      const connection = await Connection.findByPk(connectionId);
      if (!connection || connection.type !== 'tableau' || !connection.refresh_token) {
        throw new Error('Connection or refresh token not found');
      }

      const authBaseUrl = 'https://tableau.com';
      const clientId = process.env.TABLEAU_CLIENT_ID;
      const clientSecret = process.env.TABLEAU_CLIENT_SECRET;

      const response = await axios.post(
        `${authBaseUrl}/auth/oauth2/token`,
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: connection.refresh_token,
            client_id: clientId,
            client_secret: clientSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const result = response.data;

      // Update token and expiration
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

      await connection.update({
        access_token: result.access_token,
        token_expires_at: tokenExpiresAt,
        last_login: new Date()
      });

      return result.access_token;
    } catch (error) {
      console.error('Tableau token refresh error:', error?.response?.data || error.message);
      throw new Error('Failed to refresh Tableau token');
    }
  }

  // Generic connection methods
  async getConnectionsByUser(username, type = null) {
    const whereClause = { username, is_active: true };
    if (type) {
      whereClause.type = type;
    }

    return await Connection.findAll({
      where: whereClause,
      attributes: { exclude: ['access_token', 'refresh_token'] }
    });
  }

  async getConnectionById(connectionId) {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    return connection;
  }

  async deactivateConnection(connectionId) {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    
    await connection.update({ is_active: false });
    return connection;
  }

  // Store code verifier for OAuth flow
  storeCodeVerifier(sessionKey, codeVerifier) {
    this.codeVerifierStore.set(sessionKey, codeVerifier);
  }

  getCodeVerifier(sessionKey) {
    return this.codeVerifierStore.get(sessionKey);
  }

  removeCodeVerifier(sessionKey) {
    this.codeVerifierStore.delete(sessionKey);
  }
}

module.exports = new IntegrationService();
