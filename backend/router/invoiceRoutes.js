import { Router } from 'express';
import { auth } from '../middleware/auth.js'

import * as controller from '../controllers/invoiceController.js';

const router = Router();

// POST method to create a new permit
router.route('/invoice-data').post(auth, controller.invoice);
router.route('/createPermitFromInvoice/:invoiceId').post(controller.createPermitFromInvoice);
// GET method to retrieve all permits
router.route('/invoice').get(auth, controller.invoiceData);

// PUT method to update a permit by ID
router.route('/invoice-data/:id').put(controller.updateInvoice);

// DELETE method to delete a permit by ID
router.route('/invoice-data/:id').delete(controller.deleteInvoice); 

// POST account status
router.route('/changeAccountStatusInvoice').post(controller.statusUpdate);

// Get Permit Status
router.route('/invoice-stats').get(controller.getInvoiceStats);

export default router;
