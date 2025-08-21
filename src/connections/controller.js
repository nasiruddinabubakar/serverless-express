const ConnectionService = require('./service');
// const svc = new ConnectionService();

class ConnectionController {
  constructor() {
    this.service = new ConnectionService();
    // Bind all methods automatically
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter(prop => typeof this[prop] === 'function')
      .forEach(method => {
        this[method] = this[method].bind(this);
      });
  }

  // Basic CRUD operations
  async create(req, res) {
    try {
      const created = await this.service.create(req.body || {});
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      res.status(400).json({ success: false, error: { msg: e.message } });
    }
  }
  
  async list(req, res) { 
    try {
     
        const connections = await this.service.list();
        res.json({ success: true, data: connections });
      
    } catch (e) {
      res.status(400).json({ success: false, error: { msg: e.message } });
    }
  }
  
  async getById(req, res) {
    try { 
      const connection = await this.service.getById(req.params.id);
      res.json({ success: true, data: connection }); 
    }
    catch (e) { res.status(404).json({ success: false, error: { msg: e.message } }); }
  }
  
  async update(req, res) {
    try { res.json({ success: true, data: await svc.update(req.params.id, req.body || {}) }); }
    catch (e) { res.status(404).json({ success: false, error: { msg: e.message } }); }
  }
  
  async remove(req, res) {
    try { 
      await svc.deactivateConnection(req.params.id); 
      res.status(204).end(); 
    }
    catch (e) { res.status(404).json({ success: false, error: { msg: e.message } }); }
  }

  // Salesforce OAuth endpoints
  async initiateSalesforceLogin(req, res) {
    try {
      // const { username, connectionName } = req.body;
      
      // if (!username) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Username is required'
      //   });
      // }

    const sessionKey = req.query.sessionKey || 'default';
    const result = await this.service.initiateSalesforceLogin(sessionKey);
      res.json(result);
    } catch (error) {
      console.error('Login initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initiate login'
      });
    }
  }

  async handleSalesforceCallback(req, res) {
    try {
      const { code, username, connectionName } = req.query;
      const sessionKey = req.query.state || 'default';

      console.log("code", code);
      console.log("sessionKey", sessionKey);
      console.log("username", username);
      console.log("connectionName", connectionName);
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Authorization code is required'
        });
      }

      const result = await this.service.handleSalesforceCallback(code, sessionKey, username, connectionName);
      res.json(result);
    } catch (error) {
      console.error('Callback error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Authentication failed'
      });
    }
  }

  async handleSalesforceCallbackFromNextJS(req, res) {
    try {
      const { code, redirectUrl, sessionKey, username, connectionName } = req.body;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Authorization code is required'
        });
      }

      if (!redirectUrl) {
        return res.status(400).json({
          success: false,
          message: 'Redirect URL is required'
        });
      }

      const result = await this.service.handleSalesforceCallbackFromNextJS(code, redirectUrl, sessionKey, username, connectionName);
      res.json(result);
    } catch (error) {
      console.error('Callback from NextJS error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Authentication failed'
      });
    }
  }

  // Connection status check
  async checkConnectionStatus(req, res) {
    try {
      const { connectionId } = req.params;
      
      if (!connectionId) {
        return res.status(400).json({
          success: false,
          message: 'Connection ID is required'
        });
      }

      const result = await this.service.checkConnectionStatus(connectionId);
      res.json(result);
    } catch (error) {
      console.error('Check connection status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check connection status'
      });
    }
  }

  // Salesforce report endpoints
  async fetchSalesforceReport(req, res) {
    try {
      const { connectionId, reportId } = req.params;
      
      if (!connectionId) {
        return res.status(400).json({
          success: false,
          message: 'Connection ID is required'
        });
      }

      if (!reportId) {
        return res.status(400).json({
          success: false,
          message: 'Report ID is required'
        });
      }

      const result = await this.service.fetchSalesforceReport(connectionId, reportId);
      res.send(result.data);
    } catch (error) {
      console.error('Fetch report error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch report'
      });
    }
  }

  async getSalesforceReportsList(req, res) {
    try {
      const { connectionId } = req.params;
      
      if (!connectionId) {
        return res.status(400).json({
          success: false,
          message: 'Connection ID is required'
        });
      }

      const result = await this.service.getSalesforceReportsList(connectionId);
      res.json(result);
    } catch (error) {
      console.error('Get reports list error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch reports list'
      });
    }
  }

  async getSalesforceReportMetadata(req, res) {
    try {
      const { connectionId, reportId } = req.params;
      
      if (!connectionId) {
        return res.status(400).json({
          success: false,
          message: 'Connection ID is required'
        });
      }

      if (!reportId) {
        return res.status(400).json({
          success: false,
          message: 'Report ID is required'
        });
      }

      const result = await this.service.getSalesforceReportMetadata(connectionId, reportId);
      res.json(result);
    } catch (error) {
      console.error('Get report metadata error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch report metadata'
      });
    }
  }
};

module.exports = new ConnectionController();