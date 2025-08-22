const GenericService = require("../shared/services/GenericService");
const IntegrationService = require("../shared/services/IntegrationService");
const { Connection } = require("../shared/db/models/index");
const connectionRepository = require("./repository");

class ConnectionService extends GenericService {
    constructor() {
        super(Connection);
        this.repository = new connectionRepository();
    }

    // Salesforce OAuth methods
    async initiateSalesforceLogin(sessionKey) {
        try {
            const authData = IntegrationService.getSalesforceAuthUrl();
            
            // Store code verifier with a unique key
            // const sessionKey = `${}_${Date.now()}`;
            console.log("sessionKey***", sessionKey);
            IntegrationService.storeCodeVerifier(sessionKey, authData.codeVerifier);
            
            return {
                success: true,
                authUrl: authData.authUrl,
                sessionKey: sessionKey,
                message: 'Redirect user to this URL for Salesforce authentication'
            };
        } catch (error) {
            console.error('Salesforce login initiation error:', error);
            throw new Error('Failed to initiate Salesforce login');
        }
    }

    async handleSalesforceCallback(code, sessionKey, username, connectionName) {
        try {
            if (!code) {
                throw new Error('Authorization code is required');
            }

            // Retrieve code verifier
            // const codeVerifier = IntegrationService.getCodeVerifier(sessionKey);
            // if (!codeVerifier) {
            //     throw new Error('Code verifier not found. Please restart the OAuth flow.');
            // }

            const result = await IntegrationService.handleSalesforceCallback(code, username, connectionName);
            
            // Clean up code verifier
            IntegrationService.removeCodeVerifier(sessionKey);
            
            return result;
        } catch (error) {
            console.error('Salesforce callback error:', error);
            throw error;
        }
    }

    async handleSalesforceCallbackFromNextJS(code, redirectUrl, sessionKey, ) {
        try {
            if (!code) {
                throw new Error('Authorization code is required');
            }

            if (!redirectUrl) {
                throw new Error('Redirect URL is required');
            }

            // Retrieve code verifier
            const key = sessionKey || 'default';
            const codeVerifier = IntegrationService.getCodeVerifier(key);

            const result = await IntegrationService.handleSalesforceCallback(code);
            
            // Clean up code verifier
            IntegrationService.removeCodeVerifier(key);
            
            return {
                ...result,
                redirectUrl: redirectUrl
            };
        } catch (error) {
            console.error('Salesforce callback from NextJS error:', error);
            throw error;
        }
    }

    // Connection management methods
    async getConnectionsByUser(username, type = null) {
        return await IntegrationService.getConnectionsByUser(username, type);
    }

    // async getConnectionById(connectionId) {
    //     return await this.repo.getById(connectionId);
    // }

    async checkConnectionStatus(connectionId) {
        try {
            const connection = await IntegrationService.getConnectionById(connectionId);
            
            if (connection.type === 'salesforce') {
                const isValid = await IntegrationService.testSalesforceConnection(connectionId);
                return {
                    success: true,
                    authenticated: isValid,
                    connection: {
                        id: connection.id,
                        name: connection.name,
                        username: connection.username,
                        organization_name: connection.organization_name,
                        organization_id: connection.organization_id,
                        instance_url: connection.instance_url,
                        last_login: connection.last_login,
                        type: connection.type
                    }
                };
            }
            
            // Add other integration types here
            return {
                success: true,
                authenticated: false,
                message: 'Integration type not supported for status check'
            };
        } catch (error) {
            console.error('Check connection status error:', error);
            throw new Error('Failed to check connection status');
        }
    }

    async deactivateConnection(connectionId) {
        return await IntegrationService.deactivateConnection(connectionId);
    }

    // Salesforce report methods
    async fetchSalesforceReport(connectionId, reportId) {
        return await IntegrationService.fetchSalesforceReport(connectionId, reportId);
    }

    async getSalesforceReportsList(connectionId) {
        return await IntegrationService.getSalesforceReportsList(connectionId);
    }

    async getSalesforceReportMetadata(connectionId, reportId) {
        const result = await IntegrationService.fetchSalesforceReport(connectionId, reportId);
        return {
            success: true,
            message: 'Report metadata fetched successfully',
            reportId,
            metadata: result.metadata
        };
    }

    async createSalesforceReport(connectionId, reportData) {
        return await this.repository.createSalesforceReport(connectionId, reportData);
    }
}

module.exports = ConnectionService;