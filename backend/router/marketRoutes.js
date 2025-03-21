import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { AuthRole } from '../middleware/auth.js'
const router = Router()


import * as controller from '../controllers/marketController.js'

router.route('/market-data').post(auth, AuthRole('LGU'), controller.addMarket);//post method

router.route('/market/:fishType').get(controller.getMarket);//get fish type

router.route('/data').get(auth, controller.marketData)

router.route('/market-data/:id').put(controller.updateMarket);
router.route('/:id').patch(controller.updateFish)

router.route('/market-data/:id').delete(controller.deleteData);

router.route('/data/:id').put(auth, AuthRole('LGU'), controller.updateMarket);
router.route('/data/:id').delete(auth, AuthRole(['LGU', 'BFAR']), controller.deleteData);

export default router;
// import { Router } from 'express';
// import jwt from 'jsonwebtoken';

// // Middleware to extract user info from token
// const extractUserInfo = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ message: 'Authentication required' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = {
//             username: decoded.username,
//             role: decoded.role
//         };
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// // Update your routes to use the middleware
// const router = Router();

// import * as controller from '../controllers/marketController.js'

// router.route('/market-data').post(extractUserInfo, controller.addMarket);
// router.route('/market/:fishType').get(extractUserInfo, controller.getMarket);
// router.route('/data').get(extractUserInfo, controller.marketData);
// router.route('/market-data/:id').put(extractUserInfo, controller.updateMarket);
// router.route('/:id').patch(extractUserInfo, controller.updateFish);
// router.route('/market-data/:id').delete(extractUserInfo, controller.deleteData);

// export default router;
// import { Router } from 'express';
// import * as controller from '../controllers/marketController.js';
// import { auth } from '../controllers/marketController.js';

// const router = Router();

// // Protect all routes with authentication middleware
// router.use(auth);

// // Market data routes
// router.route('/market-data').post(controller.addMarket);
// router.route('/market/:fishType').get(controller.getMarket);
// router.route('/data').get(controller.marketData);
// router.route('/market-data/:id').put(controller.updateMarket);
// router.route('/:id').patch(controller.updateFish);
// router.route('/market-data/:id').delete(controller.deleteData);

// // Supply data routes
// router.route('/daily-supply').get(controller.getDailySupply);
// router.route('/monthly-supply').get(controller.getMonthlySupply);

// export default router;