// import { Router } from "express";
// const router = Router();

// // import all controller

// import * as controller from '../controllers/userController.js';
// import { registerMail } from '../controllers/mailer.js'
// import Auth, { localVariables } from '../middleware/auth.js'
// import { restrictToRole } from "../middleware/auth.js";

// //POST method
// router.route('/register').post(controller.register); //register user
// router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end()) //authenticate user
// router.route('/registerMail').post(registerMail)
// router.route('/login').post(controller.verifyUser, controller.login)//login

// //get method
// router.route('/user/:username').get(controller.getUser)//user with username
// router.route('/generateOTP').get(localVariables, controller.generateOTP)//generate random otp
// router.route('/verifyOTP').get(controller.verifyOTP)//verify generate otp
// router.route('/createResetSession').get(controller.createResetSession)//reset all the variables
// router.route('/user/:username')
//     .get(Auth, restrictToRole(["BFAR Admin", "LGU Admin"]), controller.getUser);

// router.route('/BFAR')
//     .get(Auth, restrictToRole(["BFAR Admin"]), (req, res) => res.send("Welcome BFAR Admin!"));
// router.route('/LGU')
//     .get(Auth, restrictToRole(["LGU Admin"]), (req, res) => res.send("Welcome LGU Admin!"));

// // PUT method
// router.route('/updateuser').put(Auth, controller.updateUser)//update the user profile
// router.route('/resetpassword').put(controller.resetPassword)//use to reset the password




// export default router;


import { Router } from "express";
const router = Router();

// Import all controllers
import * as controller from '../controllers/userController.js';
import { registerMail } from '../controllers/mailer.js';
import Auth, { localVariables, AuthRole } from '../middleware/auth.js';

// POST method
router.route('/register').post(controller.register); // Register user
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // Authenticate user
router.route('/registerMail').post(registerMail);
router.route('/login').post(controller.verifyUser, controller.login); // Login

// GET method
router.route('/user/:username').get(controller.getUser); // User with username
router.route('/generateOTP').get(localVariables, controller.generateOTP); // Generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP); // Verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // Reset all variables
router.route('/BFAR/dashboard').get(
    Auth, 
    AuthRole('BFAR'), 
    (req, res) => res.status(200).send({ msg: "Welcome to the BFAR dashboard" })
);

router.route('/LGU/dashboard').get(
    Auth, 
    AuthRole('LGU'),
    (req, res) => res.status(200).send({ msg: "Welcome to the LGU dashboard" })
);

// Protected routes with role-based access
router.route('/applications').get(
    Auth,
    AuthRole(['BFAR', 'LGU']),
    controller.getApplications
);

// PUT method
router.route('/updateuser').put(Auth, controller.updateUser); // Update user profile
router.route('/resetpassword').put(controller.resetPassword); // Reset password
// ------------- Security Question Endpoints -------------
// Get the security question for a user (expects { username } in body)
router.route('/getSecurityQuestion').post(controller.getSecurityQuestion);

// Reset password using the security question method (expects { username, securityAnswer, newPassword } in body)
router.route('/resetPasswordSecurity').put(controller.resetPasswordWithSecurityQuestion);

export default router;
