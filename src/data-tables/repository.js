const { CustomData, CustomDataField, CustomDataValue } = require('../shared/db/models');

class CustomDataRepository {
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
      include: [
        { model: CustomDataValue, as: 'values' }
      ]
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
}

module.exports = CustomDataRepository;
