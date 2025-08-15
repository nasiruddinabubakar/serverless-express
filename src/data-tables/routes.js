const { Router } = require('express');
const ctrl = require('./controller');
const router = Router();

// Instantiate the controller


router.get('/', ctrl.getAllCustomDataTypes);
router.get('/:id', ctrl.getCustomDataTypeById);
router.post('/', ctrl.createCustomDataType);
router.put('/:id', ctrl.updateCustomDataType);
router.delete('/:id', ctrl.deleteCustomDataType);

module.exports = router;
