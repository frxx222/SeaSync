import express from "express";
import { getDailySupply, getMonthlySupply, getDaily, getSupplyBySource, getSupplyByFishType, getSupplyByTimeRange, getTimeRangeAnalytics  } from "../controllers/marketController.js";
import { getFish } from "../controllers/fishController.js";
import { getSource } from "../controllers/fishController.js";
import { getFishHistory } from "../controllers/fishController.js";
import { auth } from '../middleware/auth.js';
// import { AuthRole } from '../middleware/auth.js';
const router = express.Router();

router.get("/supply/daily", getDailySupply);
router.get("/supply/daily-supply", auth, getDaily);
router.get("/supply/monthly", auth, getMonthlySupply);
router.get("/supply/fish", getFish);
router.get("/supply/source", getSource);
router.get("/supply/fish-history", getFishHistory);
router.get("/supply/by-source", getSupplyBySource);
router.get("/supply/by-fish", getSupplyByFishType);
router.get('/supply/:timeRange', getSupplyByTimeRange);
router.get('/analytics/:timeRange', getTimeRangeAnalytics);

export default router;
// //update this

// import express from "express";
// import { getSupply } from "../controllers/statController.js";

// const router = express.Router();

// router.get("/supply", getSupply);

// export default router;