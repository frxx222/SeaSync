import { Router } from 'express';
import * as controller from '../controllers/permitController.js';

const router = Router();

// POST method to create a new permit
router.route('/permit-data').post(controller.permit);

// GET method to retrieve all permits
router.route('/permit').get(controller.permitData);

// PUT method to update a permit by ID
router.route('/permit-data/:id').put(controller.updatePermit);

// DELETE method to delete a permit by ID
router.route('/permit-data/:id').delete(controller.deletePermit); 

// POST account status
router.route('/changeAccountStatus').post(controller.statusUpdate);

// Get Permit Status
router.route('/permit-stats').get(controller.getPermitStats);
router.route('/permits/status/:permitId').put(controller.updatePermitStatus);

export default router;
