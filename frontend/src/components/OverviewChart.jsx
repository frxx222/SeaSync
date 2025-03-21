


// // import React, { useState, useEffect } from "react";
// // import {
// //     BarChart,
// //     Bar,
// //     XAxis,
// //     YAxis,
// //     CartesianGrid,
// //     Tooltip,
// //     ResponsiveContainer,
// //     Legend,
// // } from "recharts";
// // import { Box, Select, MenuItem } from "@mui/material";
// // import { useTheme } from "@mui/material";

// // const OverviewChart = ({ view }) => {
// //     const theme = useTheme();
// //     const [data, setData] = useState([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
// //     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

// //     const fetchData = async () => {
// //         setIsLoading(true);
// //         try {
// //             let response;
// //             if (view === "daily") {
// //                 // Fetch daily data for the specific month and year
// //                 response = await fetch(
// //                     `${import.meta.env.VITE_BASE_URL}/api/supply/daily?month=${selectedMonth}&year=${selectedYear}`
// //                 );
// //             } else if (view === "monthly") {
// //                 // Fetch monthly data
// //                 response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/monthly`);
// //             }

// //             if (!response.ok) throw new Error("Network response was not ok");
// //             const result = await response.json();

// //             if (view === "daily") {
// //                 const filteredData = result[0].data
// //                     .filter((entry) => {
// //                         const entryDate = new Date(entry.month);
// //                         return (
// //                             entryDate.getFullYear() === selectedYear &&
// //                             entryDate.getMonth() + 1 === selectedMonth
// //                         );
// //                     })
// //                     .map((entry) => ({
// //                         ...entry,
// //                         day: new Date(entry.month).getDate(), // Add 'day' field for daily view
// //                     }));
// //                 setData(filteredData);
// //             } else if (view === "monthly") {
// //                 // Define all months (Jan-Dec) with default values
// //                 const months = [
// //                     { month: "Jan", supply: 0 },
// //                     { month: "Feb", supply: 0 },
// //                     { month: "Mar", supply: 0 },
// //                     { month: "Apr", supply: 0 },
// //                     { month: "May", supply: 0 },
// //                     { month: "Jun", supply: 0 },
// //                     { month: "Jul", supply: 0 },
// //                     { month: "Aug", supply: 0 },
// //                     { month: "Sep", supply: 0 },
// //                     { month: "Oct", supply: 0 },
// //                     { month: "Nov", supply: 0 },
// //                     { month: "Dec", supply: 0 },
// //                 ];

// //                 // Filter result data to include only the selected year
// //                 const filteredMonthlyData = result[0]?.data.filter(
// //                     (entry) => new Date(entry.month).getFullYear() === selectedYear
// //                 );

// //                 // Merge with fetched data, replacing default values if data is available
// //                 const monthlyData = months.map((defaultMonth, index) => {
// //                     const monthData = filteredMonthlyData.find(
// //                         (entry) => new Date(entry.month).getMonth() === index
// //                     );
// //                     return {
// //                         ...defaultMonth,
// //                         supply: monthData ? monthData.supply : defaultMonth.supply,
// //                     };
// //                 });

// //                 setData(monthlyData);
// //             }
// //         } catch (error) {
// //             console.error("Error fetching data:", error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchData();
// //     }, [view, selectedMonth, selectedYear]);

// //     if (isLoading) return <div>Loading...</div>;

// //     return (
// //         <Box display="flex" flexDirection="column" alignItems="center" style={{ width: "70vw", height: "70vh" }}>
// //             {view === "daily" && (
// //                 <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
// //                     <Select
// //                         value={selectedMonth}
// //                         onChange={(e) => setSelectedMonth(e.target.value)}
// //                         displayEmpty
// //                         style={{ marginRight: "8px" }}
// //                     >
// //                         {[...Array(12)].map((_, index) => (
// //                             <MenuItem key={index + 1} value={index + 1}>
// //                                 {new Date(0, index).toLocaleString("default", { month: "long" })}
// //                             </MenuItem>
// //                         ))}
// //                     </Select>
// //                     <Select
// //                         value={selectedYear}
// //                         onChange={(e) => setSelectedYear(Number(e.target.value))}
// //                         displayEmpty
// //                     >
// //                         {[...Array(5)].map((_, index) => (
// //                             <MenuItem key={index} value={new Date().getFullYear() - index}>
// //                                 {new Date().getFullYear() - index}
// //                             </MenuItem>
// //                         ))}
// //                     </Select>
// //                 </Box>
// //             )}
// //             <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis
// //                         dataKey={view === "daily" ? "day" : "month"} // Use 'day' for daily view, 'month' for monthly view
// //                         interval={0}
// //                     />
// //                     <YAxis />
// //                     <Tooltip />
// //                     <Legend />
// //                     <Bar dataKey="supply" fill="#2563eb" />
// //                 </BarChart>
// //             </ResponsiveContainer>
// //         </Box>
// //     );
// // };

// // export default OverviewChart;



// import React, { useState, useEffect } from "react";
// import {
//     AreaChart,
//     Area,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     Legend,
// } from "recharts";
// import { Box, Select, MenuItem } from "@mui/material";
// import { useTheme } from "@mui/material";

// const OverviewChart = ({ view }) => {
//     const theme = useTheme();
//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//     const fetchData = async () => {
//         setIsLoading(true);
//         try {
//             let response;
//             if (view === "daily") {
//                 // Fetch daily data for the specific month and year
//                 response = await fetch(
//                     `${import.meta.env.VITE_BASE_URL}/api/supply/daily?month=${selectedMonth}&year=${selectedYear}`
//                 );
//             } else if (view === "monthly") {
//                 // Fetch monthly data
//                 response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/monthly`);
//             }

//             if (!response.ok) throw new Error("Network response was not ok");
//             const result = await response.json();

//             if (view === "daily") {
//                 const filteredData = result[0].data
//                     .filter((entry) => {
//                         const entryDate = new Date(entry.month);
//                         return (
//                             entryDate.getFullYear() === selectedYear &&
//                             entryDate.getMonth() + 1 === selectedMonth
//                         );
//                     })
//                     .map((entry) => ({
//                         ...entry,
//                         day: new Date(entry.month).getDate(), // Add 'day' field for daily view
//                     }));
//                 setData(filteredData);
//             } else if (view === "monthly") {
//                 // Define all months (Jan-Dec) with default values
//                 const months = [
//                     { month: "Jan", supply: 0 },
//                     { month: "Feb", supply: 0 },
//                     { month: "Mar", supply: 0 },
//                     { month: "Apr", supply: 0 },
//                     { month: "May", supply: 0 },
//                     { month: "Jun", supply: 0 },
//                     { month: "Jul", supply: 0 },
//                     { month: "Aug", supply: 0 },
//                     { month: "Sep", supply: 0 },
//                     { month: "Oct", supply: 0 },
//                     { month: "Nov", supply: 0 },
//                     { month: "Dec", supply: 0 },
//                 ];

//                 // Filter result data to include only the selected year
//                 const filteredMonthlyData = result[0]?.data.filter(
//                     (entry) => new Date(entry.month).getFullYear() === selectedYear
//                 );

//                 // Merge with fetched data, replacing default values if data is available
//                 const monthlyData = months.map((defaultMonth, index) => {
//                     const monthData = filteredMonthlyData.find(
//                         (entry) => new Date(entry.month).getMonth() === index
//                     );
//                     return {
//                         ...defaultMonth,
//                         supply: monthData ? monthData.supply : defaultMonth.supply,
//                     };
//                 });

//                 setData(monthlyData);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [view, selectedMonth, selectedYear]);

//     if (isLoading) return <div>Loading...</div>;

//     return (
//         <Box display="flex" flexDirection="column" alignItems="center" style={{ width: "70vw", height: "65vh" }}>
//             <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
//                 {/* Month Selector (only for daily view) */}
//                 {view === "daily" && (
//                     <Select
//                         value={selectedMonth}
//                         onChange={(e) => setSelectedMonth(e.target.value)}
//                         displayEmpty
//                         style={{ marginRight: "8px" }}
//                     >
//                         {[...Array(12)].map((_, index) => (
//                             <MenuItem key={index + 1} value={index + 1}>
//                                 {new Date(0, index).toLocaleString("default", { month: "long" })}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 )}
                
//                 {/* Year Selector (for both daily and monthly view) */}
//                 <Select
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(Number(e.target.value))}
//                     displayEmpty
//                 >
//                     {[...Array(5)].map((_, index) => (
//                         <MenuItem key={index} value={new Date().getFullYear() - index}>
//                             {new Date().getFullYear() - index}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </Box>

//             <ResponsiveContainer width="100%" height="100%">
//                 {view === "daily" ? (
//                     <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" interval={0} />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Area type="monotone" dataKey="supply" stroke="#2563eb" fill="#2563eb" />
//                     </AreaChart>
//                 ) : (
//                     <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" interval={0} />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="supply" fill="#2563eb" />
//                     </BarChart>
//                 )}
//             </ResponsiveContainer>
//         </Box>
//     );
// };

// export default OverviewChart;

import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Box, Select, MenuItem } from "@mui/material";

const DashboardChart = () => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/supply/fish?month=${selectedMonth}&year=${selectedYear}`
            );
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear]);

    return (
        <div style={{ 
            width: "37vw", 
            height: '50vh', 
            padding: '10px', 
            border: '2px solid #000000', // Border color and thickness
            borderRadius: '8px',      // Optional: Rounded corners
            boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.1)' // Shadow effect
        }}>
            <Box display="flex" alignItems="center" mb={2}>
                <label style={{ marginRight: "8px" }}>Month: </label>
                <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    displayEmpty
                    style={{ marginRight: "16px" }}
                >
                    {[...Array(12)].map((_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                            {new Date(0, index).toLocaleString("default", { month: "long" })}
                        </MenuItem>
                    ))}
                </Select>
                <label style={{ marginRight: "8px" }}>Year: </label>
                <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    displayEmpty
                >
                    {[...Array(5)].map((_, index) => (
                        <MenuItem key={index} value={new Date().getFullYear() - index}>
                            {new Date().getFullYear() - index}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid  />
                    <XAxis dataKey="fishType" interval={0} angle={0} textAnchor="middle" tick={{ fontSize:15}}  />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="supply" fill="#2563eb" barSize={60} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardChart;
