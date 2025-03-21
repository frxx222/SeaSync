import express from "express";
import {
    addLocalDemand,
    getLocalDemands,
    updateLocalDemand,
    deleteLocalDemand,
    getUnsatisfiedDemands,
} from "../controllers/demandController.js";

const router = express.Router();

router.post("/local-demand", addLocalDemand); // Add a new demand
router.get("/local-demand", getLocalDemands); // Get all demands
router.put("/local-demand/:id", updateLocalDemand); // Update an existing demand
router.delete("/local-demand/:id", deleteLocalDemand); // Delete a demand

router.get("/local-demand/unsatisfied", getUnsatisfiedDemands);


export default router;


// import express from "express";
// import { 
//     getAutomatedDemands, 
//     updateDemandStatus,
//     updateAutomatedDemands 
// } from "../controllers/demandController.js";

// const router = express.Router();

// // Get all automated demands
// router.get("/automated-demand", getAutomatedDemands);

// // Update demand status
// router.put("/automated-demand/:id/status", updateDemandStatus);

// // Manually trigger demand update (can be called by cron job)
// router.post("/automated-demand/update", async (req, res) => {
//     try {
//         const result = await updateAutomatedDemands();
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// export default router;