const { Router } = require('express');
const CustomDataController = require('./controller');
const router = Router();

// Instantiate the controller
const ctrl = new CustomDataController();

router.get('/', ctrl.getAllCustomDataTypes.bind(ctrl));
// router.get('/:id', ctrl.getCustomDataTypeById.bind(ctrl));
// router.post('/', ctrl.createCustomDataType.bind(ctrl));
// router.put('/:id', ctrl.updateCustomDataType.bind(ctrl));
// router.delete('/:id', ctrl.deleteCustomDataType.bind(ctrl));

module.exports = router;
