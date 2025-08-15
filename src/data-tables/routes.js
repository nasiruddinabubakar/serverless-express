const { Router } = require('express');
const ctrl = require('./controller');
const router = Router();

// Instantiate the controller


router.get('/', ctrl.getAllCustomDataTypes);
router.get('/:id', ctrl.getCustomDataTypeById);
// router.post('/', ctrl.createCustomDataType.bind(ctrl));
// router.put('/:id', ctrl.updateCustomDataType.bind(ctrl));
// router.delete('/:id', ctrl.deleteCustomDataType.bind(ctrl));

module.exports = router;
