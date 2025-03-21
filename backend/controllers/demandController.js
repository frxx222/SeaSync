import LocalDemandModel from "../models/Demand.models.js";
import MarketModel from "../models/Market.model.js"

export const addLocalDemand = async (req, res) => {
    try {
        const { municipality, fishType, dailyDemand, monthlyDemand, date, time } = req.body;

        // Validate required fields
        if (!municipality || !fishType || !dailyDemand || !monthlyDemand || !time) {
            return res.status(400).json({
                message: "All fields (municipality, fishType, dailyDemand, monthlyDemand, time) are required",
            });
        }

        // Create a new demand entry
        const newDemand = new LocalDemandModel({
            municipality,
            fishType,
            dailyDemand,
            monthlyDemand,
            date,
            time,
        });

        // Save to the database
        const savedDemand = await newDemand.save();
        res.status(201).json({ message: "Local demand added successfully", data: savedDemand });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getLocalDemands = async (req, res) => {
    try {
        const demands = await LocalDemandModel.find();
        res.status(200).json(demands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateLocalDemand = async (req, res) => {
    try {
        const updatedDemand = await LocalDemandModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDemand) {
            return res.status(404).json({ message: "Local demand not found" });
        }

        res.status(200).json(updatedDemand);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteLocalDemand = async (req, res) => {
    try {
        const result = await LocalDemandModel.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Local demand not found" });
        }

        res.status(200).json({ message: "Local demand deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// export const getUnsatisfiedDemands = async (req, res) => {
//     try {
//         // Only get active demands
//         const demands = await LocalDemandModel.find({ status: 'Active' });
//         const supplies = await MarketModel.aggregate([
//             {
//                 $group: {
//                     _id: { municipality: "$source", fishType: "$fishType" },
//                     totalSupply: { $sum: "$weight" },
//                 }
//             }
//         ]);

//         const unsatisfiedDemands = demands.map((demand) => {
//             const supply = supplies.find(
//                 (s) => s._id.municipality === demand.municipality && s._id.fishType === demand.fishType
//             );
            
//             const currentSupply = supply?.totalSupply || 0;
//             const shortage = Math.max(0, demand.dailyDemand - currentSupply);
            
//             return {
//                 municipality: demand.municipality,
//                 fishType: demand.fishType,
//                 dailyDemand: demand.dailyDemand,
//                 monthlyDemand: demand.monthlyDemand,
//                 supplied: currentSupply,
//                 shortage: shortage,
//                 status: demand.status
//             };
//         });

//         res.status(200).json(unsatisfiedDemands);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


export const getUnsatisfiedDemands = async (req, res) => {
    try {
        const demands = await LocalDemandModel.find({ status: 'Active' });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const supplies = await MarketModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: today }
                }
            },
            {
                $group: {
                    _id: { municipality: "$source", fishType: "$fishType" },
                    totalSupply: { $sum: "$weight" },
                    supplies: { 
                        $push: { 
                            weight: "$weight",
                            date: "$createdAt"
                        }
                    }
                }
            }
        ]);

        const unsatisfiedDemands = demands.map((demand) => {
            const supply = supplies.find(
                (s) => s._id.municipality === demand.municipality && s._id.fishType === demand.fishType
            );
            
            const currentSupply = supply?.totalSupply || 0;
            const shortage = Math.max(0, demand.dailyDemand - currentSupply);
            
            return {
                municipality: demand.municipality,
                fishType: demand.fishType,
                dailyDemand: demand.dailyDemand,
                monthlyDemand: demand.monthlyDemand,
                supplied: currentSupply,
                supplies: supply?.supplies || [],
                shortage: shortage,
                status: demand.status
            };
        });

        res.status(200).json(unsatisfiedDemands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// import AutomatedDemand from "../models/Demand.models.js";
// import MarketModel from "../models/Market.model.js";

// const calculateSeasonalFactors = (historicalData) => {
//     const monthlyAverages = new Array(12).fill(0);
//     const monthCounts = new Array(12).fill(0);
    
//     // Calculate average demand for each month
//     historicalData.forEach(record => {
//         const month = new Date(record.date).getMonth();
//         monthlyAverages[month] += record.weight;
//         monthCounts[month]++;
//     });
    
//     // Calculate monthly averages
//     const averages = monthlyAverages.map((sum, index) => 
//         monthCounts[index] > 0 ? sum / monthCounts[index] : 0
//     );
    
//     // Calculate overall average
//     const overallAverage = averages.reduce((a, b) => a + b, 0) / 12;
    
//     // Calculate seasonal factors
//     return averages.map((avg, month) => ({
//         month: month + 1,
//         factor: avg > 0 ? avg / overallAverage : 1
//     }));
// };

// const calculateDailyDemand = (historicalData, days = 30) => {
//     const recentData = historicalData
//         .filter(record => {
//             const recordDate = new Date(record.date);
//             const cutoffDate = new Date();
//             cutoffDate.setDate(cutoffDate.getDate() - days);
//             return recordDate >= cutoffDate;
//         });
    
//     return recentData.reduce((sum, record) => sum + record.weight, 0) / days;
// };

// export const updateAutomatedDemands = async () => {
//     try {
//         // Get historical market data
//         const today = new Date();
//         const thirtyDaysAgo = new Date(today);
//         thirtyDaysAgo.setDate(today.getDate() - 30);

//         const historicalData = await MarketModel.find({
//             createdAt: { $gte: thirtyDaysAgo }
//         });

//         // Group data by municipality and fish type
//         const groupedData = {};
//         historicalData.forEach(record => {
//             const key = `${record.source}-${record.fishType}`;
//             if (!groupedData[key]) {
//                 groupedData[key] = [];
//             }
//             groupedData[key].push(record);
//         });

//         // Update or create demand forecasts for each group
//         for (const [key, data] of Object.entries(groupedData)) {
//             const [municipality, fishType] = key.split('-');
            
//             const seasonalFactors = calculateSeasonalFactors(data);
//             const dailyDemand = calculateDailyDemand(data);
//             const monthlyDemand = dailyDemand * 30;
            
//             // Calculate forecasted demand using seasonal factors
//             const currentMonth = new Date().getMonth() + 1;
//             const seasonalFactor = seasonalFactors.find(sf => sf.month === currentMonth)?.factor || 1;
//             const forecastedDemand = dailyDemand * seasonalFactor;

//             // Calculate confidence level based on data consistency
//             const stdDev = calculateStandardDeviation(data.map(d => d.weight));
//             const confidenceLevel = Math.max(0, Math.min(1, 1 - (stdDev / dailyDemand)));

//             await AutomatedDemand.findOneAndUpdate(
//                 { municipality, fishType },
//                 {
//                     dailyDemand,
//                     monthlyDemand,
//                     forecastedDemand,
//                     confidenceLevel,
//                     seasonalFactors,
//                     lastUpdated: new Date()
//                 },
//                 { upsert: true, new: true }
//             );
//         }

//         return { success: true, message: "Automated demands updated successfully" };
//     } catch (error) {
//         console.error("Error updating automated demands:", error);
//         return { success: false, error: error.message };
//     }
// };

// // Helper function to calculate standard deviation
// function calculateStandardDeviation(values) {
//     const avg = values.reduce((a, b) => a + b, 0) / values.length;
//     const squareDiffs = values.map(value => Math.pow(value - avg, 2));
//     const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
//     return Math.sqrt(avgSquareDiff);
// }

// export const getAutomatedDemands = async (req, res) => {
//     try {
//         const demands = await AutomatedDemand.find({
//             archived: false,
//             status: 'Active'
//         });
//         res.status(200).json(demands);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updateDemandStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;
        
//         const updatedDemand = await AutomatedDemand.findByIdAndUpdate(
//             id,
//             { status },
//             { new: true }
//         );
        
//         res.status(200).json(updatedDemand);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };