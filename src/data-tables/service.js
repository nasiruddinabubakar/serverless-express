const CustomDataRepository = require('./repository');

class CustomDataService {
  constructor() {
    this.repository = new CustomDataRepository();
  }

  async createCustomDataType(data) {
    const { custom_data_name: name, fields } = data;

    // Validate input
    if (!name || !fields || fields.length === 0) {
      throw new Error('Name or fields missing');
    }

    // Check if a type with the same name already exists
    const existingType = await this.repository.findCustomDataByName(name);
    if (existingType) {
      throw new Error('A Type with this name already exists.');
    }

    // Create the custom data type
    const customData = await this.repository.createCustomData({ name });

    // Prepare fields data to include custom_data_id for each field
    const fieldsWithCustomDataId = fields.map(field => ({
      ...field,
      custom_data_id: customData.id
    }));

    // Create all fields in bulk
    await this.repository.bulkCreateCustomDataFields(fieldsWithCustomDataId);

    return {
      id: customData.id,
      name: customData.name,
      fields_count: fields.length,
      created_at: customData.created_at
    };
  }

  async getCustomDataTypeById(id) {
    const customData = await this.repository.getCustomDataById(id);
    if (!customData) {
      throw new Error('Custom data type not found');
    }
    return customData;
  }

  async getAllCustomDataTypes() {
    return await this.repository.getAllCustomData();
  }

  async updateCustomDataType(id, updateData) {
    const customData = await this.repository.updateCustomData(id, updateData);
    if (!customData) {
      throw new Error('Custom data type not found');
    }
    return customData;
  }

  async deleteCustomDataType(id) {
    const deleted = await this.repository.deleteCustomData(id);
    if (!deleted) {
      throw new Error('Custom data type not found');
    }
    return { message: 'Custom data type deleted successfully' };
  }

  async getFieldsByCustomDataTypeId(customDataId) {
    return await this.repository.getFieldsByCustomDataId(customDataId);
  }

  async addFieldToCustomDataType(customDataId, fieldData) {
    // Verify the custom data type exists
    const customData = await this.repository.getCustomDataById(customDataId);
    if (!customData) {
      throw new Error('Custom data type not found');
    }

    // Add the custom_data_id to the field data
    const fieldWithCustomDataId = {
      ...fieldData,
      custom_data_id: customDataId
    };

    return await this.repository.createCustomDataField(fieldWithCustomDataId);
  }

  async updateField(fieldId, updateData) {
    const field = await this.repository.updateCustomDataField(fieldId, updateData);
    if (!field) {
      throw new Error('Field not found');
    }
    return field;
  }

  async deleteField(fieldId) {
    const deleted = await this.repository.deleteCustomDataField(fieldId);
    if (!deleted) {
      throw new Error('Field not found');
    }
    return { message: 'Field deleted successfully' };
  }

  // Custom data values operations
  async createCustomDataValue(valueData) {
    return await this.repository.createCustomDataValue(valueData);
  }

  async getCustomDataValueById(id) {
    const value = await this.repository.getCustomDataValueById(id);
    if (!value) {
      throw new Error('Custom data value not found');
    }
    return value;
  }

  async getValuesByCustomDataTypeId(customDataId) {
    return await this.repository.getValuesByCustomDataId(customDataId);
  }

  async getValuesByUuid(uuid) {
    return await this.repository.getValuesByUuid(uuid);
  }

  async updateCustomDataValue(id, updateData) {
    const value = await this.repository.updateCustomDataValue(id, updateData);
    if (!value) {
      throw new Error('Custom data value not found');
    }
    return value;
  }

  async deleteCustomDataValue(id) {
    const deleted = await this.repository.deleteCustomDataValue(id);
    if (!deleted) {
      throw new Error('Custom data value not found');
    }
    return { message: 'Custom data value deleted successfully' };
  }
}

module.exports = CustomDataService;
