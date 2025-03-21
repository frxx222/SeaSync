import { Router} from 'express';
import * as controller from '../controllers/appUserController.js';

const router = Router();

// Route for user registration
router.route('/user_register').post(controller.register);

// Route for user login
router.route('/user_login').post(controller.login);

export default router;
