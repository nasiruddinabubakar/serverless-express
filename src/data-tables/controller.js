const CustomDataService = require('./service');

class CustomDataController {
  constructor() {
    this.service = new CustomDataService();
      // Bind all methods automatically
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter(prop => typeof this[prop] === 'function')
      .forEach(method => {
        this[method] = this[method].bind(this);
      });
  }

  async getAllCustomDataTypes(req, res) {
    try {
      const data = await this.service.getAllCustomDataTypes();
      res.status(200).json({ success: true, data });
    } catch (e) {
      res.status(500).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async createCustomDataType(req, res) {
    try {
      const result = await this.service.createCustomDataType(req.body || {});
      res.status(201).json({ 
        success: true, 
        message: 'Custom data Type has been created successfully',
        data: result 
      });
    } catch (e) {
      res.status(400).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async getCustomDataTypeById(req, res) {
    try {
      console.log("id in controller",req.params.id);
      const data = await this.service.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async updateCustomDataType(req, res) {
    try {
      const data = await this.service.update(req.params.id, req.body || {});
      res.json({ success: true, data });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async deleteCustomDataType(req, res) {
    try {
      await this.service.deleteCustomDataType(req.params.id);
      res.status(204).end();
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  // Field management endpoints
  async getFieldsByCustomDataTypeId(req, res) {
    try {
      const fields = await this.service.getFieldsByCustomDataTypeId(req.params.id);
      res.json({ success: true, data: fields });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async addFieldToCustomDataType(req, res) {
    try {
      const field = await this.service.addFieldToCustomDataType(req.params.id, req.body || {});
      res.status(201).json({ success: true, data: field });
    } catch (e) {
      res.status(400).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async updateField(req, res) {
    try {
      const field = await this.service.updateField(req.params.fieldId, req.body || {});
      res.json({ success: true, data: field });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async deleteField(req, res) {
    try {
      await this.service.deleteField(req.params.fieldId);
      res.status(204).end();
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  // Custom data values endpoints
  async createCustomDataValue(req, res) {
    try {
      const value = await this.service.createCustomDataValue(req.body || {});
      res.status(201).json({ success: true, data: value });
    } catch (e) {
      res.status(400).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async getCustomDataValueById(req, res) {
    try {
      const value = await this.service.getCustomDataValueById(req.params.valueId);
      res.json({ success: true, data: value });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async getValuesByCustomDataTypeId(req, res) {
    try {
      const values = await this.service.getValuesByCustomDataTypeId(req.params.id);
      res.json({ success: true, data: values });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async getRowsByCustomDataTypeId(req, res) {
    try {
      const data = await this.service.getRowsByCustomDataTypeId(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async getValuesByUuid(req, res) {
    try {
      const values = await this.service.getValuesByUuid(req.params.uuid);
      res.json({ success: true, data: values });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async updateCustomDataValue(req, res) {
    try {
      const value = await this.service.updateCustomDataValue(req.params.valueId, req.body || {});
      res.json({ success: true, data: value });
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  async deleteCustomDataValue(req, res) {
    try {
      await this.service.deleteCustomDataValue(req.params.valueId);
      res.status(204).end();
    } catch (e) {
      res.status(404).json({ 
        success: false, 
        error: { msg: e.message } 
      });
    }
  }

  // CSV upload endpoint
  async uploadCsvData(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { msg: 'No CSV file uploaded' }
        });
      }

      const customDataId = req.params.id;
      const csvBuffer = req.file.buffer;
      
      const result = await this.service.processCsvUpload(customDataId, csvBuffer);
      
      res.status(200).json({
        success: true,
        message: 'CSV data uploaded and processed successfully',
        data: result
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        error: { msg: e.message }
      });
    }
  }
}

module.exports = new CustomDataController();
