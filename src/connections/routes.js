const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

// Basic CRUD operations
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// Salesforce OAuth endpoints
router.get('/salesforce/initiate-login', ctrl.initiateSalesforceLogin);
router.get('/salesforce/callback', ctrl.handleSalesforceCallback);
router.post('/salesforce/callback-nextjs', ctrl.handleSalesforceCallbackFromNextJS);

// Connection status check
router.get('/:connectionId/salesforce/status', ctrl.checkConnectionStatus);

// Salesforce report endpoints
router.get('/:connectionId/salesforce/reports', ctrl.getSalesforceReportsList);
router.get('/:connectionId/salesforce/reports/:reportId', ctrl.fetchSalesforceReport);
router.get('/:connectionId/salesforce/reports/:reportId/metadata', ctrl.getSalesforceReportMetadata);

module.exports = router;
