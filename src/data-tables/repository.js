const { CustomData, CustomDataField, CustomDataValue, CustomDataRow } = require('../shared/db/models/index');
const BaseRepository = require('../shared/repositories/BaseRepository');
const csv = require('csv-parser');
const { randomUUID } = require('crypto');
const { Console } = require('console');

class CustomDataRepository extends BaseRepository {
  async createCustomData(customData) {
    return await CustomData.create(customData);
  }

  async findCustomDataByName(name) {
    return await CustomData.findOne({ where: { name } });
  }

  async getCustomDataById(id) {
    return await CustomData.findByPk(id, {
      include: [
        { model: CustomDataField, as: 'fields' },
        { model: CustomDataValue, as: 'values' }
      ]
    });
  }

  async getAllCustomData() {
    return await CustomData.findAll({
      include: [
        { model: CustomDataField, as: 'fields' }
      ]
    });
  }

  async updateCustomData(id, updateData) {
    const customData = await CustomData.findByPk(id);
    if (!customData) return null;
    return await customData.update(updateData);
  }

  async deleteCustomData(id) {
    const customData = await CustomData.findByPk(id);
    if (!customData) return false;
    await customData.destroy();
    return true;
  }

  async createCustomDataField(fieldData) {
    return await CustomDataField.create(fieldData);
  }

  async bulkCreateCustomDataFields(fields) {
    return await CustomDataField.bulkCreate(fields);
  }

  async getCustomDataFieldById(id) {
    return await CustomDataField.findByPk(id, {
      include: [
        { model: CustomData, as: 'customData' },
        { model: CustomDataValue, as: 'values' }
      ]
    });
  }

  async getFieldsByCustomDataId(customDataId) {
    return await CustomDataField.findAll({
      where: { custom_data_id: customDataId },
    });
  }

  async updateCustomDataField(id, updateData) {
    const field = await CustomDataField.findByPk(id);
    if (!field) return null;
    return await field.update(updateData);
  }

  async deleteCustomDataField(id) {
    const field = await CustomDataField.findByPk(id);
    if (!field) return false;
    await field.destroy();
    return true;
  }

  async createCustomDataValue(valueData) {
    return await CustomDataValue.create(valueData);
  }

  async getCustomDataValueById(id) {
    return await CustomDataValue.findByPk(id, {
      include: [
        { model: CustomData, as: 'customData' },
        { model: CustomDataField, as: 'customField' }
      ]
    });
  }

  async getValuesByCustomDataId(customDataId) {
    return await CustomDataValue.findAll({
      where: { custom_data_id: customDataId },
      include: [
        { model: CustomDataField, as: 'customField' }
      ]
    });
  }

  async getRowsByCustomDataId(customDataId) {
    // Get all rows for the custom data type
    const rows = await CustomDataRow.findAll({
      where: { custom_data_id: customDataId },
      order: [['created_at', 'ASC']]
    });

    // Get all fields for the custom data type to map IDs to names
    const fields = await CustomDataField.findAll({
      where: { custom_data_id: customDataId },
      attributes: ['id', 'name', 'field_type', 'is_required', 'key_field', 'filter']
    });

    // Create a map of field ID to field info
    const fieldMap = {};
    fields.forEach(field => {
      fieldMap[field.id] = {
        name: field.name,
        field_type: field.field_type,
        is_required: field.is_required,
        key_field: field.key_field,
        filter: field.filter
      };
    });

    // Transform rows to map field IDs to field names
    const transformedRows = rows.map(row => {
      const transformedRow = {
        id: row.id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        // fields: {}                                   //only return key and value, no need to create nested objects
      };

      // Map each field ID in row_data to its corresponding field name
      for (const [fieldId, value] of Object.entries(row.row_data)) {
        const fieldInfo = fieldMap[fieldId];
        if (fieldInfo) {
          transformedRow[fieldInfo.name] = value
          //   value: value,
          //   field_type: fieldInfo.field_type,
          //   is_required: fieldInfo.is_required,
          //   key_field: fieldInfo.key_field,
          //   filter: fieldInfo.filter
          // };
        }
      }

      return transformedRow;
    });

    return {
      custom_data_id: customDataId,
      total_rows: transformedRows.length,
      fields: fields.map(field => ({
        id: field.id,
        name: field.name,
        field_type: field.field_type,
        is_required: field.is_required,
        key_field: field.key_field,
        filter: field.filter
      })),
      rows: transformedRows
    };
  }

  async getValuesByUuid(uuid) {
    return await CustomDataValue.findAll({
      where: { uuid },
      include: [
        { model: CustomData, as: 'customData' },
        { model: CustomDataField, as: 'customField' }
      ]
    });
  }

  async updateCustomDataValue(id, updateData) {
    const value = await CustomDataValue.findByPk(id);
    if (!value) return null;
    return await value.update(updateData);
  }

  async deleteCustomDataValue(id) {
    const value = await CustomDataValue.findByPk(id);
    if (!value) return false;
    await value.destroy();
    return true;
  }

  // CSV processing method
  async processCsvData(customDataId, csvBuffer, fields) {
    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];
      let rowsProcessed = 0;
      let rowsStored = 0;

      // Create a readable stream from the buffer
      const stream = require('stream');
      const readableStream = new stream.Readable();
      readableStream.push(csvBuffer);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rowsProcessed++;
          results.push(row);
        })
        .on('end', async () => {
          try {
            // Process and store the data
            const storedRows = await this.storeCsvRows(customDataId, results, fields);
            rowsStored = storedRows.length;
            
            resolve({
              rowsProcessed,
              rowsStored,
              errors
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // Store CSV rows in CustomDataRow table
  async storeCsvRows(customDataId, rows, fields) {
    const storedRows = [];
  
    // Build a map of CSV column -> fieldId
    // Example: { product_id: "uuid-123", product_name: "uuid-456" }
    const fieldMap = {};
    for (const field of fields) {
      fieldMap[field.name] = field.id; 
      // field.name is the CSV column name
      // field.id is your stable internal ID
    }
  
    for (const row of rows) {
      try {
        const rowData = {};
  
        // For each column in the row
        for (const [columnName, value] of Object.entries(row)) {
          const fieldId = fieldMap[columnName]; // Find the matching fieldId
          if (fieldId) {
            rowData[fieldId] = value; // Store under ID, not name
          }
        }
  
        // Save row with ID-based keys
        const customDataRow = await CustomDataRow.create({
          custom_data_id: customDataId,
          row_data: rowData
        });
  
        storedRows.push(customDataRow);
      } catch (error) {
        console.error(`Error storing row:`, error);
      }
    }
  
    return storedRows;
  }
  
  

  // Convert CSV string values to appropriate data types
  convertDataType(value, fieldType) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    switch (fieldType.toUpperCase()) {
      case 'INTEGER':
        return parseInt(value, 10);
      case 'DECIMAL':
      case 'FLOAT':
        return parseFloat(value);
      case 'BOOLEAN':
        return value.toLowerCase() === 'true' || value === '1';
      case 'DATE':
        return new Date(value).toISOString();
      case 'STRING':
      case 'TEXT':
      default:
        return value.toString();
    }
  }
}

module.exports = CustomDataRepository;
