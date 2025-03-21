import MarketModel from "../models/Market.model.js"
import MarketStatModel from "../models/MarketStat.model.js";
import mongoose from "mongoose";
// controllers/marketController.js
// Add this new function to your existing controller

export const autoResetDaily = async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Set time to beginning of current day for comparison
        const startOfDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            0, 0, 0
        );

        // Delete records from previous days
        const deleteResult = await MarketModel.deleteMany({
            date: { $lt: startOfDay }
        });

        // Get current day's supply after reset
        const currentSupply = await MarketModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSupply: { $sum: "$weight" }
                }
            }
        ]);

        // Return success response
        res.status(200).json({
            reset: true,
            message: 'Daily data reset successful',
            deletedCount: deleteResult.deletedCount,
            currentDaySupply: currentSupply[0]?.totalSupply || 0,
            resetTime: currentDate
        });

    } catch (error) {
        console.error('Daily reset error:', error);
        res.status(500).json({ 
            message: 'Failed to reset daily data',
            error: error.message 
        });
    }
};

export const autoReset = async (req, res) => {
    try {
        const { view, lastUpdate, currentTime } = req.body;

        if (!view || !lastUpdate || !currentTime) {
            return res.status(400).json({ 
                message: "Missing required parameters: view, lastUpdate, currentTime" 
            });
        }

        const lastUpdateDate = new Date(lastUpdate);
        const currentTimeDate = new Date(currentTime);

        // Calculate time difference in hours
        const timeDifference = currentTimeDate - lastUpdateDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        // Define reset thresholds
        const resetThresholds = {
            daily: 24,
            monthly: 720 // 30 days
        };

        // Check if reset is needed
        if (hoursDifference < resetThresholds[view]) {
            return res.status(200).json({
                reset: false,
                message: 'Reset not required'
            });
        }

        // Perform reset based on view type
        let cutoffDate;
        if (view === 'daily') {
            cutoffDate = new Date(currentTimeDate);
            cutoffDate.setHours(cutoffDate.getHours() - 24);
        } else if (view === 'monthly') {
            cutoffDate = new Date(currentTimeDate);
            cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        } else {
            return res.status(400).json({ 
                message: "Invalid view type. Must be 'daily' or 'monthly'" 
            });
        }

        // Delete old records
        const deleteResult = await MarketModel.deleteMany({
            date: { $lt: cutoffDate }
        });

        // Return success response
        res.status(200).json({
            reset: true,
            message: 'Data reset successful',
            deletedCount: deleteResult.deletedCount,
            resetTime: currentTimeDate,
            view: view
        });

    } catch (error) {
        console.error('Auto-reset error:', error);
        res.status(500).json({ 
            message: 'Failed to reset data',
            error: error.message 
        });
    }
};


// export const getDaily = async (req, res) => {
//   try {
//       const dailySupply = await MarketModel.aggregate([
//           {
//               $group: {
//                   _id: {
//                       day: { $dayOfMonth: "$date" },
//                       month: { $month: "$date" },
//                       year: { $year: "$date" },
//                   },
//                   totalSupply: { $sum: "$weight" },
//               },
//           },
//           { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//       ]);

//       // Reshape the data to fit Nivo's format
//       const formattedData = [
//           {
//               id: "Daily Supply",
//               data: dailySupply.map((item) => ({
//                   month: `${item._id.year}-${item._id.month}-${item._id.day}`,  // Format the date as needed
//                   supply: item.totalSupply,
//               })),
//           },
//       ];

//       res.status(200).json(formattedData);
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };
export const getDaily = async (req, res) => {
    try {
        const { role, username, _id } = req.user;
        const { month, year } = req.query;

        // Prepare date filtering
        const matchCondition = {};
        if (month && year) {
            const targetMonth = parseInt(month);
            const targetYear = parseInt(year);
            
            matchCondition.date = {
                $gte: new Date(targetYear, targetMonth - 1, 1),
                $lt: new Date(targetYear, targetMonth, 1)
            };
        }

        // Apply role-specific filtering
        if (role === 'LGU') {
            // LGU can only see their own and sourced records
            matchCondition['$or'] = [
                { source: username },
                { userId: new mongoose.Types.ObjectId(_id) }
            ];
        } else if (role === 'BFAR') {
            // BFAR sees all records without userId filtering
            // You can add additional filtering if needed
            // For example, filtering by a specific field or removing sensitive data
        } else {
            // Other roles strictly filter by userId
            matchCondition.userId = new mongoose.Types.ObjectId(_id);
        }

        const dailySupply = await MarketModel.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    totalSupply: { $sum: "$weight" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);

        // Reshape the data to fit Nivo's format
        const formattedData = [
            {
                id: "Daily Supply",
                data: dailySupply.map((item) => ({
                    month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
                    supply: item.totalSupply,
                })),
            },
        ];

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error in getDaily:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getMonthlySupply = async (req, res) => {
    try {
        const { role, username, _id } = req.user;
        const { year } = req.query;

        // Use current year if not specified
        const selectedYear = parseInt(year) || new Date().getFullYear();

        // Base match condition for the year
        let matchCondition = {
            date: {
                $gte: new Date(selectedYear, 0, 1),
                $lte: new Date(selectedYear, 11, 31, 23, 59, 59)
            }
        };

        // If user is LGU, filter by both username/source and userId
        if (role === 'LGU') {
            matchCondition['$or'] = [
                { source: username },
                { 'userId': new mongoose.Types.ObjectId(_id) }
            ];
        }

        const monthlySupply = await MarketModel.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: { 
                        month: { $month: "$date" }, 
                        year: { $year: "$date" } 
                    },
                    totalSupply: { $sum: "$weight" },
                },
            },
            { 
                $sort: { "_id.year": 1, "_id.month": 1 } 
            },
        ]);

        // Prepare all months array
        const allMonths = Array.from({length: 12}, (_, i) => ({
            month: i + 1,
            supply: 0
        }));

        // Map the actual data to the months
        const formattedMonthlyData = allMonths.map(monthObj => {
            const matchedMonth = monthlySupply.find(
                supply => supply._id.month === monthObj.month
            );
            return {
                month: monthObj.month,
                supply: matchedMonth ? matchedMonth.totalSupply : 0
            };
        });

        const formattedData = [{
            id: "Monthly Supply",
            data: formattedMonthlyData.map(item => ({
                month: `${selectedYear}-${item.month}`,
                supply: item.supply
            })),
        }];
        console.log('User Details:', { role, username, _id });
        console.log('Match Condition:', matchCondition);
        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error in getMonthlySupply:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getDailySupply = async (req, res) => {
    try {
        // Get today's date at start of day
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const dailySupply = await MarketModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    totalSupply: { $sum: "$weight" },
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }
            }
        ]);

        // Log the time range and results for debugging
        console.log("Fetching supply for time range:", {
            start: startOfDay.toLocaleString(),
            end: endOfDay.toLocaleString(),
            results: dailySupply
        });

        // Reshape the data to fit Nivo's format
        const formattedData = [{
            id: "Daily Supply",
            data: dailySupply.map((item) => ({
                month: `${item._id.year}-${item._id.month}-${item._id.day}`,
                supply: item.totalSupply,
                timestamp: new Date(
                    item._id.year,
                    item._id.month - 1,
                    item._id.day
                ).toISOString()
            })),
        }];

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error in getDailySupply:", error);
        res.status(500).json({ message: error.message });
    }
};

// export const getMonthlySupply = async (req, res) => {
//   try {
//       const monthlySupply = await MarketModel.aggregate([
//           {
//               $group: {
//                   _id: { month: { $month: "$date" }, year: { $year: "$date" } },
//                   totalSupply: { $sum: "$weight" },
//               },
//           },
//           { $sort: { "_id.year": 1, "_id.month": 1 } },
//       ]);

//       // Reshape the data to fit Nivo's format
//       const formattedData = [
//           {
//               id: "Monthly Supply",
//               data: monthlySupply.map((item) => ({
//                   month: `${item._id.year}-${item._id.month}`, // Format as "year-month"
//                   supply: item.totalSupply,
//               })),
//           },
//       ];

//       res.status(200).json(formattedData);
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };


// export async function marketData(req, res) {
//     try {
//         const data = await MarketModel.find();

//         const SupplyStat = await Promise.all(
//             data.map(async (data) => {
//                 const stat = await MarketStatModel.find({
//                     marketId: data._id,
//                 });
//                 return {
//                     ...data._doc,
//                     stat,
//                 }
//             })
//         )
//         res.status(200).json(SupplyStat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
export async function marketData(req, res) {
    try {
        const { _id, role } = req.user;
        console.log('User role:', role);
        console.log('User ID:', _id);

        let query = {};
        // If BFAR, fetch all data. If LGU, fetch only their data
        if (role === 'LGU') {
            query.userId = _id;
        }

        const data = await MarketModel.find(query)
            .populate('userId', 'username role') // Populate user details if needed
            .lean();
        
        console.log('Found data:', data);

        const SupplyStat = await Promise.all(
            data.map(async (data) => {
                const stat = await MarketStatModel.find({
                    marketId: data._id,
                    ...(role === 'LGU' ? { userId: _id } : {})
                }).lean();
                
                return {
                    ...data,
                    stat,
                }
            })
        );

        res.status(200).json(SupplyStat);
    } catch (err) {
        console.error('Market Data Error:', err);
        res.status(500).json({ message: err.message });
    }
}


// export async function updateMarketUserIds(req, res) {
//     try {
//         // Define the mapping of municipalities to their userIds
//         const municipalityMap = {
        
//             'StaCruz': '678dbd981d10e0a0bfcf3a04'
//         };

//         // Create an array to store all update operations
//         const updatePromises = [];

//         // Update for each municipality
//         for (const [municipality, userId] of Object.entries(municipalityMap)) {
//             const updateOperation = MarketModel.updateMany(
//                 { source: municipality }, // find all documents where source matches the municipality
//                 { $set: { userId: userId } } // update the userId field
//             );
//             updatePromises.push(updateOperation);
//         }

//         // Execute all updates
//         const results = await Promise.all(updatePromises);

//         // Calculate total number of documents modified
//         const totalModified = results.reduce((acc, result) => acc + result.modifiedCount, 0);

//         res.status(200).json({
//             message: 'Market userIds updated successfully',
//             totalModified,
//             details: results.map((result, index) => ({
//                 municipality: Object.keys(municipalityMap)[index],
//                 modifiedCount: result.modifiedCount
//             }))
//         });

//     } catch (err) {
//         console.error('Update Market UserIds Error:', err);
//         res.status(500).json({ message: err.message });
//     }
// }
// updateMarketUserIds();

// export async function marketData(req, res) {
//     try {
//         // Extract user info from token
//         const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
//         const userRole = decoded.role;
//         const userMunicipality = decoded.username;

//         let query = {};
        
//         // Filter data based on user role
//         if (userRole === 'LGU') {
//             query.source = userMunicipality;  // LGU users only see their municipality
//         }
//         // BFAR users see all data (empty query)

//         const data = await MarketModel.find(query);

//         const SupplyStat = await Promise.all(
//             data.map(async (data) => {
//                 const stat = await MarketStatModel.find({
//                     marketId: data._id,
//                 });
//                 return {
//                     ...data._doc,
//                     stat,
//                 }
//             })
//         )
//         res.status(200).json(SupplyStat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

export async function getMarket(req, res) {
    try {
        // Check if ingredients query parameter exists
        if (!req.params.fishType) {
            // If not, return a 400 Bad Request response
            return res.status(400).json({ message: 'Missing Fish Type query parameter' });
        }
        
        // Use regular expression to perform case-insensitive search for ingredients
        const data = await MarketModel.find({ fishType: { $regex: req.params.fishType, $options: 'i' } });
        
        // Send the matched recipes as the response
        res.json(data);
    } catch (err) {
        // Handle any errors
        res.status(500).json({ message: err.message });
    }
}

export async function addMarket(req, res) {
    try {
        const { name, fishType, source, price, weight, time, date } = req.body;
        
        // Get userId from authenticated user
        const userId = req.user._id;  // This comes from your auth middleware

        // Validate all required fields
        if (!name || !fishType || !source || !price || !weight || !time || !date) {
            return res.status(400).json({ 
                message: "All fields (name, fishType, source, price, weight, time, date) are required" 
            });
        }

        // Create a new market entry with userId
        const newData = new MarketModel({
            name,
            fishType,
            source,
            price,
            weight,
            time,
            date,
            userId    // Add this field
        });

        // Save the new entry to the database
        const savedData = await newData.save();

        res.status(201).json({ 
            message: "New data created successfully", 
            data: savedData 
        });
    } catch (err) {
        console.error('Add Market Error:', err);
        res.status(400).json({ message: err.message });
    }
}

// export async function addMarket(req, res) {
//     try {
//         const { name, fishType, source, price, weight, time, date } = req.body;

//         // Extract user info from token
//         const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
//         const userRole = decoded.role;
//         const userMunicipality = decoded.username;

//         // For LGU users, verify they're adding data for their municipality
//         if (userRole === 'LGU' && source !== userMunicipality) {
//             return res.status(403).json({ 
//                 message: "LGU users can only add data for their own municipality" 
//             });
//         }

//         // Create new market entry with user info
//         const newData = new MarketModel({
//             name,
//             fishType,
//             source,
//             price,
//             weight,
//             time,
//             date,
//             createdBy: userMunicipality,
//             userRole: userRole
//         });

//         const savedData = await newData.save();
//         res.status(201).json({ message: "New data created successfully", data: savedData });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

export async function updateMarket(req, res) {
    try {
        // Find the market data by ID and update with new data from req.body
        const updatedData = await MarketModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Options: new: true returns updated data, runValidators ensures schema validation
        );

        // If no data is found for the given ID, return a 404 Not Found
        if (!updatedData) {
            return res.status(404).json({ message: "Market data not found" });
        }

        // Return the updated data as JSON
        res.json(updatedData);
    } catch (err) {
        // If the error is related to an invalid ObjectId format, return a 400 Bad Request
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // For other errors, return a 500 Internal Server Error with the error message
        res.status(500).json({ message: err.message });
    }
}

export async function updateFish(req, res) {
    try {
        if (req.body.fishType !== undefined) {
            res.data.fishType = req.body.fishType;
        }
        const updatedData = await res.data.save();
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const deleteData = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
        const result = await MarketModel.deleteOne({ _id: id }); // Use deleteOne with the correct ID
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
 
export const getSupplyBySource = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const supplyBySource = await MarketModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: "$source",
                    supply: { $sum: "$weight" }
                }
            },
            {
                $project: {
                    source: "$_id",
                    supply: 1,
                    _id: 0
                }
            }
        ]);

        // Format data for the frontend
        const formattedData = supplyBySource.map(item => ({
            source: item.source || 'Unknown',
            supply: Number(item.supply.toFixed(2))
        }));

        res.status(200).json([{
            id: "Supply by Source",
            data: formattedData
        }]);
    } catch (error) {
        console.error("Error in getSupplyBySource:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getSupplyByFishType = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const supplyByFishType = await MarketModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: "$fishType",
                    supply: { $sum: "$weight" },
                    avgPrice: { $avg: "$price" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    fishType: "$_id",
                    supply: 1,
                    avgPrice: 1,
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { supply: -1 } // Sort by supply in descending order
            }
        ]);

        // Format data for the frontend
        const formattedData = supplyByFishType.map(item => ({
            fishType: item.fishType || 'Unknown',
            supply: Number(item.supply.toFixed(2)),
            avgPrice: Number(item.avgPrice.toFixed(2)),
            count: item.count
        }));

        res.status(200).json([{
            id: "Supply by Fish Type",
            data: formattedData
        }]);
    } catch (error) {
        console.error("Error in getSupplyByFishType:", error);
        res.status(500).json({ message: error.message });
    }
};
 
const getDateRanges = (timeRange) => {
    const currentDate = new Date();
    let startDate, endDate;

    switch (timeRange) {
        case 'daily':
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                0, 0, 0
            );
            endDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                23, 59, 59
            );
            break;

        case 'weekly':
            // Get the first day of the current week (Sunday)
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - currentDate.getDay());
            startDate.setHours(0, 0, 0, 0);
            
            // Get the last day of the current week (Saturday)
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'monthly':
            // Get first day of the current month
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1,
                0, 0, 0
            );
            
            // Get the last day of the current month
            // We'll set the date to the first of next month, then subtract one day
            endDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0,
                23, 59, 59, 999
            );

            // If no data is found for current month, check if we have data from previous weeks
            // that fall within this month
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            
            // Include data from the previous month if we're in the first week
            if (currentDate.getDate() <= 7) {
                startDate = new Date(
                    currentYear,
                    currentMonth - 1,
                    21,  // Start from 21st of previous month
                    0, 0, 0
                );
            }
            break;

        default:
            throw new Error('Invalid time range specified');
    }

    return { startDate, endDate };
};

export const getSupplyByTimeRange = async (req, res) => {
    try {
        const { timeRange } = req.params;
        let { startDate, endDate } = getDateRanges(timeRange);

        console.log(`Fetching ${timeRange} data from ${startDate} to ${endDate}`);

        // First try to get data for the exact time range
        let supplyData = await MarketModel.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$source",
                    supply: { $sum: "$weight" },
                    avgPrice: { $avg: "$price" },
                    transactions: { $sum: 1 }
                }
            },
            {
                $project: {
                    source: "$_id",
                    supply: { $round: ["$supply", 2] },
                    avgPrice: { $round: ["$avgPrice", 2] },
                    transactions: 1,
                    _id: 0
                }
            },
            {
                $sort: { supply: -1 }
            }
        ]);

        // If no data found and it's monthly view, try to get data from the current month
        if (timeRange === 'monthly' && supplyData.length === 0) {
            const currentDate = new Date();
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            );
            endDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0,
                23, 59, 59, 999
            );

            supplyData = await MarketModel.aggregate([
                {
                    $match: {
                        date: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: "$source",
                        supply: { $sum: "$weight" },
                        avgPrice: { $avg: "$price" },
                        transactions: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        source: "$_id",
                        supply: { $round: ["$supply", 2] },
                        avgPrice: { $round: ["$avgPrice", 2] },
                        transactions: 1,
                        _id: 0
                    }
                },
                {
                    $sort: { supply: -1 }
                }
            ]);
        }

        // Calculate total supply
        const totalSupply = supplyData.reduce((sum, item) => sum + item.supply, 0);

        // Format data for frontend with percentages
        const formattedData = {
            data: supplyData.map(item => ({
                source: item.source || 'Unknown',
                supply: item.supply,
                percentage: ((item.supply / totalSupply) * 100).toFixed(1),
                avgPrice: item.avgPrice,
                transactions: item.transactions
            })),
            period: {
                start: startDate,
                end: endDate,
                timeRange: timeRange
            },
            summary: {
                totalSupply: totalSupply.toFixed(2),
                totalSources: supplyData.length,
                averageSupplyPerSource: (totalSupply / supplyData.length).toFixed(2)
            }
        };

        res.status(200).json(formattedData);

    } catch (error) {
        console.error(`Error in getSupplyByTimeRange (${req.params.timeRange}):`, error);
        res.status(500).json({ 
            message: error.message,
            timeRange: req.params.timeRange
        });
    }
};

// Get detailed analytics for a specific time range
export const getTimeRangeAnalytics = async (req, res) => {
    try {
        const { timeRange } = req.params;
        const { startDate, endDate } = getDateRanges(timeRange);

        const analytics = await MarketModel.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $facet: {
                    // Supply by source
                    sourceStats: [
                        {
                            $group: {
                                _id: "$source",
                                totalSupply: { $sum: "$weight" },
                                avgPrice: { $avg: "$price" },
                                transactions: { $sum: 1 }
                            }
                        },
                        { $sort: { totalSupply: -1 } }
                    ],
                    // Supply by fish type
                    fishTypeStats: [
                        {
                            $group: {
                                _id: "$fishType",
                                totalSupply: { $sum: "$weight" },
                                avgPrice: { $avg: "$price" },
                                transactions: { $sum: 1 }
                            }
                        },
                        { $sort: { totalSupply: -1 } }
                    ],
                    // Overall statistics
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                totalSupply: { $sum: "$weight" },
                                avgPrice: { $avg: "$price" },
                                totalTransactions: { $sum: 1 },
                                minPrice: { $min: "$price" },
                                maxPrice: { $max: "$price" }
                            }
                        }
                    ]
                }
            }
        ]);

        const formattedAnalytics = {
            timeRange,
            period: {
                start: startDate,
                end: endDate
            },
            sources: analytics[0].sourceStats.map(source => ({
                name: source._id,
                supply: source.totalSupply.toFixed(2),
                avgPrice: source.avgPrice.toFixed(2),
                transactions: source.transactions
            })),
            fishTypes: analytics[0].fishTypeStats.map(type => ({
                name: type._id,
                supply: type.totalSupply.toFixed(2),
                avgPrice: type.avgPrice.toFixed(2),
                transactions: type.transactions
            })),
            overall: analytics[0].overallStats[0] ? {
                totalSupply: analytics[0].overallStats[0].totalSupply.toFixed(2),
                averagePrice: analytics[0].overallStats[0].avgPrice.toFixed(2),
                totalTransactions: analytics[0].overallStats[0].totalTransactions,
                priceRange: {
                    min: analytics[0].overallStats[0].minPrice.toFixed(2),
                    max: analytics[0].overallStats[0].maxPrice.toFixed(2)
                }
            } : null
        };

        res.status(200).json(formattedAnalytics);

    } catch (error) {
        console.error(`Error in getTimeRangeAnalytics (${req.params.timeRange}):`, error);
        res.status(500).json({ 
            message: error.message,
            timeRange: req.params.timeRange
        });
    }
};

// import MarketModel from "../models/Market.model.js"
// import MarketStatModel from "../models/MarketStat.model.js";

// // Add authentication middleware
// import jwt from 'jsonwebtoken';

// export const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//         if (!token) {
//             return res.status(401).json({ message: 'No authentication token' });
//         }
        
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = { id: decoded.userId };
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Please authenticate' });
//     }
// };

// export const getDailySupply = async (req, res) => {
//     try {
//         const dailySupply = await MarketModel.aggregate([
//             {
//                 $match: { userId: req.user.id } // Filter by user ID
//             },
//             {
//                 $group: {
//                     _id: {
//                         day: { $dayOfMonth: "$date" },
//                         month: { $month: "$date" },
//                         year: { $year: "$date" },
//                     },
//                     totalSupply: { $sum: "$weight" },
//                 },
//             },
//             { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//         ]);

//         const formattedData = [{
//             id: "Daily Supply",
//             data: dailySupply.map((item) => ({
//                 month: `${item._id.year}-${item._id.month}-${item._id.day}`,
//                 supply: item.totalSupply,
//             })),
//         }];

//         res.status(200).json(formattedData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getMonthlySupply = async (req, res) => {
//     try {
//         const monthlySupply = await MarketModel.aggregate([
//             {
//                 $match: { userId: req.user.id } // Filter by user ID
//             },
//             {
//                 $group: {
//                     _id: { month: { $month: "$date" }, year: { $year: "$date" } },
//                     totalSupply: { $sum: "$weight" },
//                 },
//             },
//             { $sort: { "_id.year": 1, "_id.month": 1 } },
//         ]);

//         const formattedData = [{
//             id: "Monthly Supply",
//             data: monthlySupply.map((item) => ({
//                 month: `${item._id.year}-${item._id.month}`,
//                 supply: item.totalSupply,
//             })),
//         }];

//         res.status(200).json(formattedData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export async function marketData(req, res) {
//     try {
//         const data = await MarketModel.find({ userId: req.user.id }); // Filter by user ID

//         const SupplyStat = await Promise.all(
//             data.map(async (data) => {
//                 const stat = await MarketStatModel.find({
//                     marketId: data._id,
//                     userId: req.user.id // Filter stats by user ID
//                 });
//                 return {
//                     ...data._doc,
//                     stat,
//                 }
//             })
//         )
//         res.status(200).json(SupplyStat);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// export async function getMarket(req, res) {
//     try {
//         if (!req.params.fishType) {
//             return res.status(400).json({ message: 'Missing Fish Type query parameter' });
//         }
        
//         const data = await MarketModel.find({ 
//             fishType: { $regex: req.params.fishType, $options: 'i' },
//             userId: req.user.id // Filter by user ID
//         });
        
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// export async function addMarket(req, res) {
//     try {
//         const { name, fishType, source, price, weight, time, date } = req.body;

//         if (!name || !fishType || !source || !price || !weight || !time || !date) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const newData = new MarketModel({
//             name,
//             fishType,
//             source,
//             price,
//             weight,
//             time,
//             date,
//             userId: req.user.id // Add user ID to new entries
//         });

//         const savedData = await newData.save();
//         res.status(201).json({ message: "New data created successfully", data: savedData });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// export async function updateMarket(req, res) {
//     try {
//         // Check if user owns the data before updating
//         const marketData = await MarketModel.findOne({ 
//             _id: req.params.id,
//             userId: req.user.id
//         });

//         if (!marketData) {
//             return res.status(404).json({ message: "Market data not found or unauthorized" });
//         }

//         const updatedData = await MarketModel.findByIdAndUpdate(
//             req.params.id, 
//             { ...req.body, userId: req.user.id }, // Ensure userId remains unchanged
//             { new: true, runValidators: true }
//         );

//         res.json(updatedData);
//     } catch (err) {
//         if (err.kind === "ObjectId") {
//             return res.status(400).json({ message: "Invalid ID format" });
//         }
//         res.status(500).json({ message: err.message });
//     }
// }

// export async function updateFish(req, res) {
//     try {
//         // Check if user owns the data before updating
//         const marketData = await MarketModel.findOne({ 
//             _id: req.params.id,
//             userId: req.user.id
//         });

//         if (!marketData) {
//             return res.status(404).json({ message: "Data not found or unauthorized" });
//         }

//         if (req.body.fishType !== undefined) {
//             marketData.fishType = req.body.fishType;
//         }
//         const updatedData = await marketData.save();
//         res.json(updatedData);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// export const deleteData = async (req, res) => {
//     try {
//         // Check if user owns the data before deleting
//         const result = await MarketModel.deleteOne({ 
//             _id: req.params.id,
//             userId: req.user.id
//         });
        
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: "Item not found or unauthorized" });
//         }
        
//         res.status(200).json({ message: "Item deleted successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };