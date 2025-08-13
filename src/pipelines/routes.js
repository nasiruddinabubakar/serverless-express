const { Router } = require('express');
const ctrl = require('./controller');
const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/start', ctrl.start);

module.exports = router;
