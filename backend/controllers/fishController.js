// import MarketModel from "../models/Market.model.js"

// // export const getFish = async (req, res) => {
// //   const { month, year } = req.query;

// //   try {
// //       const monthlySupply = await MarketModel.aggregate([
// //           {
// //               $match: {
// //                   date: {
// //                       $gte: new Date(year, month - 1, 1),
// //                       $lt: new Date(year, month, 1),
// //                   },
// //               },
// //           },
// //           {
// //               $group: {
// //                   _id: "$fishType",
// //                   totalSupply: { $sum: "$weight" },
// //               },
// //           },
// //           { $sort: { totalSupply: -1 } },
// //       ]);

// //       // Format data to display fish types at the bottom
// //       const formattedData = monthlySupply.map((item) => ({
// //           fishType: item._id,
// //           supply: item.totalSupply,
// //       }));

// //       res.status(200).json(formattedData);
// //   } catch (error) {
// //       res.status(500).json({ message: error.message });
// //   }
// // };

// export const getFish = async (req, res) => {
//     const { month, year } = req.query;

//     try {
//         const monthlySupply = await MarketModel.aggregate([
//             {
//                 $match: {
//                     date: {
//                         $gte: new Date(year, month - 1, 1),
//                         $lt: new Date(year, month, 1),
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: { fishType: "$fishType", source: "$source" },
//                     totalSupply: { $sum: "$weight" },
//                 },
//             },
//             { $sort: { "totalSupply": -1 } },
//         ]);

//         // Format the data
//         const formattedData = monthlySupply.map((item) => ({
//             fishType: item._id.fishType,
//             source: item._id.source,
//             supply: item.totalSupply,
//         }));

//         res.status(200).json(formattedData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// //source
// // export const getSource = async (req, res) => {
// //     try {
// //         // Get the start and end of the current day
// //         const today = new Date();
// //         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
// //         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

// //         // Aggregate data for the current day, grouped by "source"
// //         const dailySupply = await MarketModel.aggregate([
// //             {
// //                 $match: {
// //                     date: {
// //                         $gte: startOfDay,
// //                         $lt: endOfDay,
// //                     },
// //                 },
// //             },
// //             {
// //                 $group: {
// //                     _id: "$source", // Group by source field
// //                     totalSupply: { $sum: "$weight" }, // Sum weights for each source
// //                 },
// //             },
// //             { 
// //                 $sort: { totalSupply: -1 } // Sort by total supply in descending order
// //             },
// //         ]);

// //         // Format the data to return a readable format
// //         const formattedData = dailySupply.map((item) => ({
// //             source: item._id,
// //             supply: item.totalSupply,
// //         }));

// //         // Send the response
// //         res.status(200).json(formattedData);
// //     } catch (error) {
// //         console.error("Error in getSource:", error);
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// export const getFishHistory = async (req, res) => {
//     const { fishType, start, end } = req.query;

//     try {
//         const matchStage = {
//             ...(fishType && { fishType }),
//             date: {
//                 ...(start && { $gte: new Date(start) }),
//                 ...(end && { $lte: new Date(end) }),
//             },
//         };

//         // Group data by month and include all months even if no data
//         const history = await MarketModel.aggregate([
//             { $match: matchStage },
//             {
//                 $group: {
//                     _id: { month: { $month: "$date" }, source: "$source" },
//                     totalSupply: { $sum: "$weight" },
//                 },
//             },
//             { $sort: { "_id.month": 1 } }, // Sort by month
//         ]);

//         // Format data to include all months (Jan-Dec)
//         const monthlyData = Array.from({ length: 12 }, (_, i) => ({
//             month: i + 1,
//         }));

//         history.forEach((item) => {
//             const monthIndex = item._id.month - 1;
//             const source = item._id.source;
//             const supply = item.totalSupply;

//             if (!monthlyData[monthIndex][source]) {
//                 monthlyData[monthIndex][source] = 0;
//             }
//             monthlyData[monthIndex][source] += supply;
//         });

//         res.status(200).json(monthlyData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// export const getSource = async (req, res) => {
//     try {
//         const today = new Date();
//         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//         const dailySupply = await MarketModel.aggregate([
//             {
//                 $match: {
//                     date: {
//                         $gte: startOfDay,
//                         $lt: endOfDay,
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$source",
//                     totalSupply: { $sum: "$weight" },
//                 },
//             },
//             { $sort: { totalSupply: -1 } },
//         ]);

//         const threshold = 500; // Example threshold in kg
//         const notifications = dailySupply.filter(item => item.totalSupply >= threshold)
//             .map(item => `Source ${item._id} has reached ${item.totalSupply} kg.`);

//         const formattedData = dailySupply.map(item => ({
//             source: item._id,
//             supply: item.totalSupply,
//         }));

//         res.status(200).json({ data: formattedData, notifications });
//     } catch (error) {
//         console.error("Error in getSource:", error);
//         res.status(500).json({ message: error.message });
//     }
// };



import MarketModel from "../models/Market.model.js";

export const getFish = async (req, res) => {
    const { week, month, year, view } = req.query;

    try {
        let matchStage = {};
        let groupStage = {};

        if (view === 'weekly') {
            // Calculate the start and end dates for the specified week
            const startDate = new Date(year, month - 1, (week - 1) * 7 + 1);
            const endDate = new Date(year, month - 1, week * 7 + 1);

            matchStage = {
                date: {
                    $gte: startDate,
                    $lt: endDate,
                },
            };
        } else {
            // Monthly view
            matchStage = {
                date: {
                    $gte: new Date(year, month - 1, 1),
                    $lt: new Date(year, month, 1),
                },
            };
        }

        const supplyData = await MarketModel.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: { fishType: "$fishType", source: "$source" },
                    totalSupply: { $sum: "$weight" },
                },
            },
            { $sort: { "totalSupply": -1 } },
        ]);

        // Format the data
        const formattedData = supplyData.map((item) => ({
            fishType: item._id.fishType,
            source: item._id.source,
            supply: item.totalSupply,
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFishHistory = async (req, res) => {
    const { fishType, start, end, view } = req.query;

    try {
        const matchStage = {
            ...(fishType && { fishType }),
            date: {
                ...(start && { $gte: new Date(start) }),
                ...(end && { $lte: new Date(end) }),
            },
        };

        let groupStage = {};
        let resultArray = [];

        switch (view) {
            case 'daily':
                groupStage = {
                    _id: { 
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        source: "$source"
                    },
                    totalSupply: { $sum: "$weight" }
                };
                // Create array of all dates in range
                resultArray = generateDateArray(new Date(start), new Date(end));
                break;

            case 'weekly':
                groupStage = {
                    _id: { 
                        week: { $week: "$date" },
                        year: { $year: "$date" },
                        source: "$source"
                    },
                    totalSupply: { $sum: "$weight" }
                };
                // Create array of all weeks in range
                resultArray = generateWeekArray(new Date(start), new Date(end));
                break;

            case 'monthly':
            default:
                groupStage = {
                    _id: { 
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                        source: "$source"
                    },
                    totalSupply: { $sum: "$weight" }
                };
                // Create array of all months in range
                resultArray = generateMonthArray(new Date(start), new Date(end));
                break;
        }

        const history = await MarketModel.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.date": 1 } }
        ]);

        // Process the aggregated data based on view type
        history.forEach((item) => {
            let index;
            switch (view) {
                case 'daily':
                    index = resultArray.findIndex(d => d.date === item._id.date);
                    break;
                case 'weekly':
                    index = resultArray.findIndex(w => 
                        w.week === item._id.week && w.year === item._id.year);
                    break;
                case 'monthly':
                default:
                    index = resultArray.findIndex(m => 
                        m.month === item._id.month && m.year === item._id.year);
                    break;
            }

            if (index !== -1) {
                if (!resultArray[index][item._id.source]) {
                    resultArray[index][item._id.source] = 0;
                }
                resultArray[index][item._id.source] += item.totalSupply;
            }
        });

        res.status(200).json(resultArray);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper functions for generating date arrays
function generateDateArray(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push({
            date: currentDate.toISOString().split('T')[0],
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            day: currentDate.getDate()
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

function generateWeekArray(startDate, endDate) {
    const weeks = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const week = getWeekNumber(currentDate);
        const year = currentDate.getFullYear();
        
        // Only add if not already present
        if (!weeks.find(w => w.week === week && w.year === year)) {
            weeks.push({
                week,
                year,
                month: currentDate.getMonth() + 1
            });
        }
        currentDate.setDate(currentDate.getDate() + 7);
    }
    return weeks;
}

function generateMonthArray(startDate, endDate) {
    const months = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        months.push({
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// export const getSource = async (req, res) => {
//     try {
//         const today = new Date();
//         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//         const dailySupply = await MarketModel.aggregate([
//             {
//                 $match: {
//                     date: {
//                         $gte: startOfDay,
//                         $lt: endOfDay,
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$source",
//                     totalSupply: { $sum: "$weight" },
//                 },
//             },
//             { $sort: { totalSupply: -1 } },
//         ]);

//         const threshold = 500; // Example threshold in kg
//         const notifications = dailySupply.filter(item => item.totalSupply >= threshold)
//             .map(item => `Source ${item._id} has reached ${item.totalSupply} kg.`);

//         const formattedData = dailySupply.map(item => ({
//             source: item._id,
//             supply: item.totalSupply,
//         }));

//         res.status(200).json({ data: formattedData, notifications });
//     } catch (error) {
//         console.error("Error in getSource:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

export const getSource = async (req, res) => {
    try {
        const timeRange = req.query.timeRange || 'daily';
        const now = new Date();
        let startDate, endDate;

        // Calculate date ranges based on timeRange
        switch (timeRange) {
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
            default: // daily
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
                break;
        }

        const supply = await MarketModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$source",
                    totalSupply: { $sum: "$weight" },
                },
            },
            { $sort: { totalSupply: -1 } },
        ]);

        const threshold = 500;
        const notifications = supply
            .filter(item => item.totalSupply >= threshold)
            .map(item => `Source ${item._id} has reached ${item.totalSupply} kg.`);

        const formattedData = supply.map(item => ({
            source: item._id,
            supply: item.totalSupply,
        }));

        // Calculate refresh interval based on time range
        const getRefreshInterval = () => {
            return timeRange === 'monthly' 
                ? 30 * 24 * 60 * 60 * 1000  // 30 days in milliseconds
                : 24 * 60 * 60 * 1000;      // 24 hours in milliseconds
        };

        res.status(200).json({
            data: formattedData,
            notifications,
            metadata: {
                timeRange,
                startDate,
                endDate,
                refreshInterval: getRefreshInterval()
            }
        });
    } catch (error) {
        console.error("Error in getSource:", error);
        res.status(500).json({ message: error.message });
    }
};