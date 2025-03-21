// import React, { useState, useEffect } from "react";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     Legend,
//     LineChart,
//     Line
// } from "recharts";
// import {
//     Box,
//     Card,
//     CardContent,
//     FormControl,
//     MenuItem,
//     Select,
//     Typography,
//     Grid,
//     IconButton,
//     TextField,
//     InputLabel,
//     Skeleton,
//     Alert,
//     Stack,
//     ButtonGroup,
//     Button
// } from '@mui/material';
// import { Download, RefreshCw, Table, BarChart as BarChartIcon } from "lucide-react";

// const sourceColors = {
//     "Boac": "#C62E2E",
//     "Mogpog": "#16C47F",
//     "Gasan": "#E82561",
//     "Buenavista": "#FFE31A",
//     "Torrijos": "#EC8305",
//     "Sta Cruz": "#4C1F7A",
// };

// const FishChart = () => {
//     const [data, setData] = useState([]);
//     const [view, setView] = useState("weekly");
//     const [selectedFish, setSelectedFish] = useState(null);
//     const [historicalData, setHistoricalData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [mainChartType, setMainChartType] = useState("bar");
//     const [historicalChartType, setHistoricalChartType] = useState("line");
//     const [historicalView, setHistoricalView] = useState("daily");
//     const [dateRange, setDateRange] = useState({
//         start: new Date().getFullYear() + "-01-01",
//         end: new Date().getFullYear() + "-12-31"
//     });

//     // New function to set full year range
//     const setFullYearRange = () => {
//         const currentYear = new Date().getFullYear();
//         setDateRange({
//             start: `${currentYear}-01-01`,
//             end: `${currentYear}-12-31`
//         });
//     };

//     const getCurrentDateInfo = () => ({
//         week: Math.ceil(new Date().getDate() / 7),
//         month: new Date().getMonth() + 1,
//         year: new Date().getFullYear(),
//     });

//     const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//         const { week, month, year } = getCurrentDateInfo();
//         try {
//             const response = await fetch(
//                 `${import.meta.env.VITE_BASE_URL}/api/supply/fish?week=${week}&month=${month}&year=${year}&view=${view}`
//             );
//             if (!response.ok) throw new Error('Failed to fetch data');
//             const result = await response.json();
//             setData(result);
//         } catch (error) {
//             setError(error.message);
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchHistoricalData = async (fishType) => {
//         setLoading(true);
//         try {
//             let start, end;
//             // If the view is daily or weekly, restrict to the current month.
//             if (historicalView === 'daily' || historicalView === 'weekly') {
//                 const now = new Date();
//                 // First day of current month
//                 start = new Date(now.getFullYear(), now.getMonth(), 1)
//                     .toISOString()
//                     .split('T')[0];
//                 // Last day of current month
//                 end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//                     .toISOString()
//                     .split('T')[0];
//             } else {
//                 // For monthly view (or others), use the selected dateRange
//                 start = dateRange.start;
//                 end = dateRange.end;
//             }
            
//             const response = await fetch(
//                 `${import.meta.env.VITE_BASE_URL}/api/supply/fish-history?fishType=${fishType}&start=${start}&end=${end}&view=${historicalView}`
//             );
//             if (!response.ok) throw new Error('Failed to fetch historical data');
//             const result = await response.json();
//             setHistoricalData(result);
//         } catch (error) {
//             setError(error.message);
//             console.error("Error fetching historical data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [view]);

//     useEffect(() => {
//         if (selectedFish) {
//             fetchHistoricalData(selectedFish);
//         }
//     }, [historicalView, dateRange.start, dateRange.end]);

//     const handleFishClick = (fishType) => {
//         setSelectedFish(fishType);
//         fetchHistoricalData(fishType);
//     };

//     const handleRefresh = () => {
//         fetchData();
//         if (selectedFish) {
//             fetchHistoricalData(selectedFish);
//         }
//     };

//     const handleDownload = () => {
//         const csvData = data.map(row => 
//             `${row.fishType},${row.source},${row.supply}`
//         ).join('\n');
        
//         const blob = new Blob([`Fish Type,Source,Supply\n${csvData}`], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `fish-supply-${view}-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//     };

//     const groupedData = data.reduce((acc, item) => {
//         const { fishType, source, supply } = item;
//         if (!acc[fishType]) acc[fishType] = {};
//         acc[fishType][source] = supply;
//         return acc;
//     }, {});

//     const chartData = Object.entries(groupedData).map(([fishType, sources]) => ({
//         fishType,
//         ...sources,
//     }));

//     const formatHistoricalDate = (item) => {
//         switch (historicalView) {
//             case 'daily':
//                 return new Date(item.date).toLocaleDateString();
//             case 'weekly':
//                 return `Week ${item.week}`;
//             case 'monthly':
//                 return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item.month - 1];
//             default:
//                 return item.date;
//         }
//     };

//     const processedHistoricalData = historicalData.map((item) => ({
//         date: formatHistoricalDate(item),
//         ...item,
//     }));

//     const renderChart = (data, type) => {
//         const ChartComponent = type === "bar" ? BarChart : LineChart;
//         const DataComponent = type === "bar" ? Bar : Line;

//         return (
//             <ChartComponent data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
//                 onClick={(e) => e && data === chartData && handleFishClick(e.activeLabel)}
//             >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey={data === chartData ? "fishType" : "date"} />
//                 <YAxis />
//                 <Tooltip />
//                 {Object.keys(sourceColors).map((source) => (
//                     <DataComponent 
//                         key={source} 
//                         type="monotone"
//                         dataKey={source} 
//                         fill={sourceColors[source]}
//                         stroke={sourceColors[source]} 
//                         strokeWidth={type === "line" ? 2 : 0}
//                         stackId={type === "bar" ? "sources" : undefined}
//                     />
//                 ))}
//                 <Legend />
//             </ChartComponent>
//         );
//     };



//     return (
//         <Box sx={{ p: 3 }}>
//             <Stack spacing={3}>
//             {error && (
//                     <Alert severity="error" sx={{ mb: 2 }}>
//                         {error}
//                     </Alert>
//                 )}
//                 <Card>
//                     <CardContent>
//                         <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//                             <Grid item xs={12} md={6}>
//                                 <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//                                     Fish Supply Dashboard
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                                     <FormControl size="small">
//                                         <InputLabel>View</InputLabel>
//                                         <Select
//                                             value={view}
//                                             onChange={(e) => setView(e.target.value)}
//                                             label="View"
//                                         >
//                                             <MenuItem value="weekly">Weekly</MenuItem>
//                                             <MenuItem value="monthly">Monthly</MenuItem>
//                                         </Select>
//                                     </FormControl>
//                                     <IconButton onClick={() => setMainChartType(prev => prev === "bar" ? "line" : "bar")}>
//                                         {mainChartType === "bar" ? <Table /> : <BarChartIcon />}
//                                     </IconButton>
//                                     <IconButton onClick={handleRefresh}>
//                                         <RefreshCw />
//                                     </IconButton>
//                                     <IconButton onClick={handleDownload}>
//                                         <Download />
//                                     </IconButton>
//                                 </Box>
//                             </Grid>
//                         </Grid>

//                         {loading ? (
//                             <Skeleton variant="rectangular" height={400} />
//                         ) : (
//                             <Box sx={{ height: 400 }}>
//                                 <ResponsiveContainer>
//                                     {renderChart(chartData, mainChartType)}
//                                 </ResponsiveContainer>
//                             </Box>
//                         )}
//                     </CardContent>
//                 </Card>
//                 {selectedFish && (
//                     <Card>
//                         <CardContent>
//                             <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//                                 <Grid item xs={12} md={6}>
//                                     <Typography variant="h6">
//                                         Historical Data for {selectedFish}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                                         <ButtonGroup size="small">
//                                         <Button 
//                                                 variant={historicalView === "daily" ? "contained" : "outlined"}
//                                                 onClick={() => setHistoricalView("daily")}
//                                                 sx={{ 
//                                                     bgcolor: '#2C3E50',
//                                                     '&:hover': { bgcolor: 'success.dark' },
//                                                     color: 'white'
//                                                   }}                                               
//                                             >
//                                                 Daily
//                                             </Button>
//                                             <Button 
//                                                 variant={historicalView === "weekly" ? "contained" : "outlined"}
//                                                 onClick={() => setHistoricalView("weekly")}
//                                                 sx={{ 
//                                                     bgcolor: '#2C3E50',
//                                                     '&:hover': { bgcolor: 'success.dark' },
//                                                     color: 'white'
//                                                   }} 
//                                             >
//                                                 Weekly
//                                             </Button>
//                                             <Button 
//                                                 variant={historicalView === "monthly" ? "contained" : "outlined"}
//                                                 onClick={() => setHistoricalView("monthly")}
//                                                 sx={{ 
//                                                     bgcolor: '#2C3E50',
//                                                     '&:hover': { bgcolor: 'success.dark' },
//                                                     color: 'white'
//                                                   }} 
//                                             >
//                                                 Monthly
//                                             </Button>
//                                         </ButtonGroup>
//                                         <IconButton onClick={() => setHistoricalChartType(prev => prev === "bar" ? "line" : "bar")}>
//                                             {historicalChartType === "bar" ? <Table /> : <BarChartIcon />}
//                                         </IconButton>
//                                     </Box>
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                                         <TextField
//                                             type="date"
//                                             label="Start Date"
//                                             value={dateRange.start}
//                                             onChange={(e) => setDateRange(prev => ({
//                                                 ...prev,
//                                                 start: e.target.value
//                                             }))}
//                                             size="small"
//                                             InputLabelProps={{ shrink: true }}
//                                         />
//                                         <TextField
//                                             type="date"
//                                             label="End Date"
//                                             value={dateRange.end}
//                                             onChange={(e) => setDateRange(prev => ({
//                                                 ...prev,
//                                                 end: e.target.value
//                                             }))}
//                                             size="small"
//                                             InputLabelProps={{ shrink: true }}
//                                         />
//                                         <Button 
//                                             variant="outlined"
//                                             onClick={setFullYearRange}
//                                             sx={{ 
//                                                 bgcolor: '#2C3E50',
//                                                 '&:hover': { bgcolor: 'success.dark' },
//                                                 color: 'white'
//                                             }}
//                                         >
//                                             Full Year
//                                         </Button>
//                                     </Box>
//                                 </Grid>
//                             </Grid>

//                             {loading ? (
//                                 <Skeleton variant="rectangular" height={300} />
//                             ) : (
//                                 <Box sx={{ height: 300 }}>
//                                     <ResponsiveContainer>
//                                         {renderChart(processedHistoricalData, historicalChartType)}
//                                     </ResponsiveContainer>
//                                 </Box>
//                             )}
//                         </CardContent>
//                     </Card>
//                 )}
//             </Stack>
//         </Box>
//     );
// };

// export default FishChart;





// import React, { useState, useEffect } from "react";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     Legend,
//     LineChart,
//     Line
// } from "recharts";
// import {
//     Box,
//     Card,
//     CardContent,
//     FormControl,
//     MenuItem,
//     Select,
//     Typography,
//     Grid,
//     IconButton,
//     TextField,
//     InputLabel,
//     Skeleton,
//     Alert,
//     Stack
// } from '@mui/material';
// import { Download, RefreshCw, Table, BarChart as BarChartIcon } from "lucide-react";

// const sourceColors = {
//     "Boac": "",
//     "Mogpog": "yellow",
//     "Gasan": "red",
//     "Buenavista": "green",
//     "Torrijos": "#22177A",
//     "Sta Cruz": "blue",
// };

// const FishChart = () => {
//     const [data, setData] = useState([]);
//     const [view, setView] = useState("monthly");
//     const [selectedFish, setSelectedFish] = useState(null);
//     const [historicalData, setHistoricalData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [chartType, setChartType] = useState("bar");
//     const [dateRange, setDateRange] = useState({
//         start: new Date().getFullYear() + "-01-01",
//         end: new Date().getFullYear() + "-12-31"
//     });

//     const getCurrentDateInfo = () => ({
//         month: new Date().getMonth() + 1,
//         year: new Date().getFullYear(),
//     });

//     // Add new state for tracking last data update
//     const [lastUpdate, setLastUpdate] = useState({
//         timestamp: new Date(),
//         view: 'daily'
//     });

//     // Function to check if reset is needed
//     const checkResetNeeded = () => {
//         const currentDate = new Date();
//         const lastUpdateDate = new Date(lastUpdate.timestamp);

//         if (view === 'daily') {
//             // Reset needed if last update was on a different day
//             return lastUpdateDate.getDate() !== currentDate.getDate() ||
//                    lastUpdateDate.getMonth() !== currentDate.getMonth() ||
//                    lastUpdateDate.getFullYear() !== currentDate.getFullYear();
//         } else if (view === 'monthly') {
//             // Reset needed if last update was in a different month
//             return lastUpdateDate.getMonth() !== currentDate.getMonth() ||
//                    lastUpdateDate.getFullYear() !== currentDate.getFullYear();
//         }
//         return false;
//     };

//     // Function to perform automatic reset
//     const performAutoReset = async () => {
//         try {
//             // Get current date for comparison
//             const currentDate = new Date();
//             const lastUpdateDate = lastUpdate?.timestamp ? new Date(lastUpdate.timestamp) : null;
    
//             // Check if day has changed
//             if (!lastUpdateDate || 
//                 currentDate.getDate() !== lastUpdateDate.getDate() ||
//                 currentDate.getMonth() !== lastUpdateDate.getMonth() ||
//                 currentDate.getFullYear() !== lastUpdateDate.getFullYear()) {
                
//                 // Fetch fresh data for new day
//                 await fetchData();
                
//                 // Update timestamp
//                 const newTimestamp = new Date();
//                 setLastUpdate({
//                     timestamp: newTimestamp,
//                     view
//                 });
    
//                 localStorage.setItem('fishChartLastUpdate', JSON.stringify({
//                     timestamp: newTimestamp,
//                     view
//                 }));
//             }
    
//         } catch (error) {
//             console.error('Auto-reset failed:', error);
//             setError('Failed to perform automatic data reset');
//         }
//     };
//     // Setup automatic reset check
//     useEffect(() => {
//         // Check for reset need on component mount and view change
//         if (checkResetNeeded()) {
//             performAutoReset();
//         }

//         // Set up interval to check for reset need
//         const resetCheckInterval = setInterval(() => {
//             if (checkResetNeeded()) {
//                 performAutoReset();
//             }
//         }, 60000); // Check every minute

//         // Cleanup interval on unmount
//         return () => clearInterval(resetCheckInterval);
//     }, [view, lastUpdate]);

//     // Modified fetchData function to update lastUpdate
//     const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//         const { month, year } = getCurrentDateInfo();
//         try {
//             const response = await fetch(
//                 `${import.meta.env.VITE_BASE_URL}/api/supply/fish?month=${month}&year=${year}`
//             );
//             if (!response.ok) throw new Error('Failed to fetch data');
//             const result = await response.json();
//             setData(result);
            
//             // Update last update timestamp after successful fetch
//             setLastUpdate({
//                 timestamp: new Date(),
//                 view
//             });
//             localStorage.setItem('fishChartLastUpdate', JSON.stringify({
//                 timestamp: new Date(),
//                 view
//             }));

//         } catch (error) {
//             setError(error.message);
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchHistoricalData = async (fishType) => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `${import.meta.env.VITE_BASE_URL}/api/supply/fish-history?fishType=${fishType}&start=${dateRange.start}&end=${dateRange.end}`
//             );
//             if (!response.ok) throw new Error('Failed to fetch historical data');
//             const result = await response.json();
//             setHistoricalData(result);
//         } catch (error) {
//             setError(error.message);
//             console.error("Error fetching historical data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [view]);

//     const handleFishClick = (fishType) => {
//         setSelectedFish(fishType);
//         fetchHistoricalData(fishType);
//     };

//     const handleRefresh = () => {
//         fetchData();
//         if (selectedFish) {
//             fetchHistoricalData(selectedFish);
//         }
//     };

//     const handleDownload = () => {
//         const csvData = data.map(row => 
//             `${row.fishType},${row.source},${row.supply}`
//         ).join('\n');
        
//         const blob = new Blob([`Fish Type,Source,Supply\n${csvData}`], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `fish-supply-${view}-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//     };

//     const groupedData = data.reduce((acc, item) => {
//         const { fishType, source, supply } = item;
//         if (!acc[fishType]) acc[fishType] = {};
//         acc[fishType][source] = supply;
//         return acc;
//     }, {});

//     const chartData = Object.entries(groupedData).map(([fishType, sources]) => ({
//         fishType,
//         ...sources,
//     }));

//     const monthLabels = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ];
    
//     const processedHistoricalData = historicalData.map((item) => ({
//         date: monthLabels[item.month - 1],
//         ...item,
//     }));

//     // Add last update display to the UI
//     const renderLastUpdateInfo = () => {
//         const lastUpdateDate = new Date(lastUpdate.timestamp);
//         const formattedDate = lastUpdateDate.toLocaleDateString();
//         const formattedTime = lastUpdateDate.toLocaleTimeString();

//         return (
//             <Typography variant="body2" color="text.secondary">
//                 Last updated: {formattedDate} {formattedTime}
//                 {checkResetNeeded() && " (Reset pending...)"}
//             </Typography>
//         );
//     };

//     const renderChart = (data, type) => {
//         if (type === "bar") {
//             return (
//                 <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
//                 onClick={(e) => e && handleFishClick(e.activeLabel)}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey={data === chartData ? "fishType" : "date"} />
//                     <YAxis />
//                     <Tooltip />
//                     {Object.keys(sourceColors).map((source) => (
//                         <Bar key={source} dataKey={source} fill={sourceColors[source]} stackId="sources" />
//                     ))}
//                     <Legend />
//                 </BarChart>
//             );
//         } else {
//             return (
//                 <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey={data === chartData ? "fishType" : "date"} />
//                     <YAxis />
//                     <Tooltip />
//                     {Object.keys(sourceColors).map((source) => (
//                         <Line 
//                             key={source} 
//                             type="monotone" 
//                             dataKey={source} 
//                             stroke={sourceColors[source]} 
//                             strokeWidth={2}
//                         />
//                     ))}
//                     <Legend />
//                 </LineChart>
//             );
//         }
//     };

//     // Modify the return JSX to include last update info
//     return (
//             <Box sx={{ p: 3 }}>
//                 <>
//                     <Stack spacing={3}>
//                         {error && (
//                             <Alert severity="error" sx={{ mb: 2 }}>
//                                 {error}
//                             </Alert>
//                         )}
        
//                         <Card>
//                             <CardContent>
//                                 <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//                                     <Grid item xs={12} md={6}>
//                                         <Typography variant="h5" sx={{ fontWeight: 'bold', color: '' }}>
//                                             Fish Supply Dashboard
//                                         </Typography>
//                                         {renderLastUpdateInfo()}
//                                     </Grid>
//                                     <Grid item xs={12} md={6}>
//                                         <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                                             <FormControl size="small">
//                                                 <InputLabel>View</InputLabel>
//                                                 <Select
//                                                     value={view}
//                                                     onChange={(e) => setView(e.target.value)}
//                                                     label="View"
//                                                 >
//                                                     <MenuItem value="monthly">Monthly</MenuItem>
//                                                     <MenuItem value="daily">Daily</MenuItem>
//                                                 </Select>
//                                             </FormControl>
//                                             <IconButton onClick={() => setChartType(prev => prev === "bar" ? "line" : "bar")}>
//                                                 {chartType === "bar" ? <Table /> : <BarChartIcon />}
//                                             </IconButton>
//                                             <IconButton onClick={handleRefresh}>
//                                                 <RefreshCw />
//                                             </IconButton>
//                                             <IconButton onClick={handleDownload}>
//                                                 <Download />
//                                             </IconButton>
//                                         </Box>
//                                     </Grid>
//                                 </Grid>
        
//                                 {loading ? (
//                                     <Skeleton variant="rectangular" height={400} />
//                                 ) : (
//                                     <Box sx={{ height: 400 }}>
//                                         <ResponsiveContainer>
//                                             {renderChart(chartData, chartType)}
//                                         </ResponsiveContainer>
//                                     </Box>
//                                 )}
//                             </CardContent>
//                         </Card>
        
//                         {selectedFish && (
//                             <Card>
//                                 <CardContent>
//                                     <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//                                         <Grid item xs={12} md={6}>
//                                             <Typography variant="h6">
//                                                 Historical Data for {selectedFish}
//                                             </Typography>
//                                         </Grid>
//                                         <Grid item xs={12} md={6}>
//                                             <Box sx={{ display: 'flex', gap: 2 }}>
//                                                 <TextField
//                                                     type="date"
//                                                     label="Start Date"
//                                                     value={dateRange.start}
//                                                     onChange={(e) => setDateRange(prev => ({
//                                                         ...prev,
//                                                         start: e.target.value
//                                                     }))}
//                                                     size="small"
//                                                     InputLabelProps={{ shrink: true }}
//                                                 />
//                                                 <TextField
//                                                     type="date"
//                                                     label="End Date"
//                                                     value={dateRange.end}
//                                                     onChange={(e) => setDateRange(prev => ({
//                                                         ...prev,
//                                                         end: e.target.value
//                                                     }))}
//                                                     size="small"
//                                                     InputLabelProps={{ shrink: true }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
        
//                                     {loading ? (
//                                         <Skeleton variant="rectangular" height={300} />
//                                     ) : (
//                                         <Box sx={{ height: 300 }}>
//                                             <ResponsiveContainer>
//                                                 {renderChart(processedHistoricalData, chartType)}
//                                             </ResponsiveContainer>
//                                         </Box>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         )}
//                     </Stack>
//                 </>
//             </Box>
//     );
// };

// export default FishChart;



import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line
} from "recharts";
import {
    Box,
    Card,
    CardContent,
    FormControl,
    MenuItem,
    Select,
    Typography,
    Grid,
    IconButton,
    TextField,
    InputLabel,
    Skeleton,
    Alert,
    Stack,
    ButtonGroup,
    Button
} from '@mui/material';
import { Download, RefreshCw, Table, BarChart as BarChartIcon } from "lucide-react";

const sourceColors = {
    "Boac": "#C62E2E",
    "Mogpog": "#16C47F",
    "Gasan": "#E82561",
    "Buenavista": "#FFE31A",
    "Torrijos": "#EC8305",
    "StaCruz": "#4C1F7A",
};

const FishChart = () => {
    const [data, setData] = useState([]);
    const [view, setView] = useState("weekly");
    const [selectedFish, setSelectedFish] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainChartType, setMainChartType] = useState("bar");
    const [historicalChartType, setHistoricalChartType] = useState("line");
    const [historicalView, setHistoricalView] = useState("daily");
    const [dateRange, setDateRange] = useState({
        start: new Date().getFullYear() + "-01-01",
        end: new Date().getFullYear() + "-12-31"
    });

    const getCurrentDateInfo = () => ({
        week: Math.ceil(new Date().getDate() / 7),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const { week, month, year } = getCurrentDateInfo();
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/supply/fish?week=${week}&month=${month}&year=${year}&view=${view}`
            );
            if (!response.ok) throw new Error('Failed to fetch data');
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // const fetchHistoricalData = async (fishType) => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch(
    //             `${import.meta.env.VITE_BASE_URL}/api/supply/fish-history?fishType=${fishType}&start=${dateRange.start}&end=${dateRange.end}&view=${historicalView}`
    //         );
    //         if (!response.ok) throw new Error('Failed to fetch historical data');
    //         const result = await response.json();
    //         setHistoricalData(result);
    //     } catch (error) {
    //         setError(error.message);
    //         console.error("Error fetching historical data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchHistoricalData = async (fishType) => {
        setLoading(true);
        try {
            let start, end;
            // If the view is daily or weekly, restrict to the current month.
            if (historicalView === 'daily' || historicalView === 'weekly') {
                const now = new Date();
                // First day of current month
                start = new Date(now.getFullYear(), now.getMonth(), 1)
                    .toISOString()
                    .split('T')[0];
                // Last day of current month
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                    .toISOString()
                    .split('T')[0];
            } else {
                // For monthly view (or others), use the selected dateRange
                start = dateRange.start;
                end = dateRange.end;
            }
            
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/supply/fish-history?fishType=${fishType}&start=${start}&end=${end}&view=${historicalView}`
            );
            if (!response.ok) throw new Error('Failed to fetch historical data');
            const result = await response.json();
            setHistoricalData(result);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching historical data:", error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, [view]);

    useEffect(() => {
        if (selectedFish) {
            fetchHistoricalData(selectedFish);
        }
    }, [historicalView, dateRange.start, dateRange.end]);

    const handleFishClick = (fishType) => {
        setSelectedFish(fishType);
        fetchHistoricalData(fishType);
    };

    const handleRefresh = () => {
        fetchData();
        if (selectedFish) {
            fetchHistoricalData(selectedFish);
        }
    };

    const handleDownload = () => {
        const csvData = data.map(row => 
            `${row.fishType},${row.source},${row.supply}`
        ).join('\n');
        
        const blob = new Blob([`Fish Type,Source,Supply\n${csvData}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fish-supply-${view}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const groupedData = data.reduce((acc, item) => {
        const { fishType, source, supply } = item;
        if (!acc[fishType]) acc[fishType] = {};
        acc[fishType][source] = supply;
        return acc;
    }, {});

    const chartData = Object.entries(groupedData).map(([fishType, sources]) => ({
        fishType,
        ...sources,
    }));

    const formatHistoricalDate = (item) => {
        switch (historicalView) {
            case 'daily':
                return new Date(item.date).toLocaleDateString();
            case 'weekly':
                return `Week ${item.week}`;
            case 'monthly':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item.month - 1];
            default:
                return item.date;
        }
    };

    const processedHistoricalData = historicalData.map((item) => ({
        date: formatHistoricalDate(item),
        ...item,
    }));

    const renderChart = (data, type) => {
        const ChartComponent = type === "bar" ? BarChart : LineChart;
        const DataComponent = type === "bar" ? Bar : Line;

        return (
            <ChartComponent data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                onClick={(e) => e && data === chartData && handleFishClick(e.activeLabel)}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={data === chartData ? "fishType" : "date"} />
                <YAxis />
                <Tooltip />
                {Object.keys(sourceColors).map((source) => (
                    <DataComponent 
                        key={source} 
                        type="monotone"
                        dataKey={source} 
                        fill={sourceColors[source]}
                        stroke={sourceColors[source]} 
                        strokeWidth={type === "line" ? 2 : 0}
                        stackId={type === "bar" ? "sources" : undefined}
                    />
                ))}
                <Legend />
            </ChartComponent>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Card>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Fish Supply Dashboard
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <FormControl size="small">
                                        <InputLabel>View</InputLabel>
                                        <Select
                                            value={view}
                                            onChange={(e) => setView(e.target.value)}
                                            label="View"
                                        >
                                            <MenuItem value="weekly">Weekly</MenuItem>
                                            <MenuItem value="monthly">Monthly</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <IconButton onClick={() => setMainChartType(prev => prev === "bar" ? "line" : "bar")}>
                                        {mainChartType === "bar" ? <Table /> : <BarChartIcon />}
                                    </IconButton>
                                    <IconButton onClick={handleRefresh}>
                                        <RefreshCw />
                                    </IconButton>
                                    <IconButton onClick={handleDownload}>
                                        <Download />
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>

                        {loading ? (
                            <Skeleton variant="rectangular" height={400} />
                        ) : (
                            <Box sx={{ height: 400 }}>
                                <ResponsiveContainer>
                                    {renderChart(chartData, mainChartType)}
                                </ResponsiveContainer>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {selectedFish && (
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6">
                                        Historical Data for {selectedFish}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <ButtonGroup size="small">
                                            <Button 
                                                variant={historicalView === "daily" ? "contained" : "outlined"}
                                                onClick={() => setHistoricalView("daily")}
                                                sx={{ 
                                                    bgcolor: '#2C3E50',
                                                    '&:hover': { bgcolor: 'success.dark' },
                                                    color: 'white'
                                                  }}                                               
                                            >
                                                Daily
                                            </Button>
                                            <Button 
                                                variant={historicalView === "weekly" ? "contained" : "outlined"}
                                                onClick={() => setHistoricalView("weekly")}
                                                sx={{ 
                                                    bgcolor: '#2C3E50',
                                                    '&:hover': { bgcolor: 'success.dark' },
                                                    color: 'white'
                                                  }} 
                                            >
                                                Weekly
                                            </Button>
                                            <Button 
                                                variant={historicalView === "monthly" ? "contained" : "outlined"}
                                                onClick={() => setHistoricalView("monthly")}
                                                sx={{ 
                                                    bgcolor: '#2C3E50',
                                                    '&:hover': { bgcolor: 'success.dark' },
                                                    color: 'white'
                                                  }} 
                                            >
                                                Monthly
                                            </Button>
                                        </ButtonGroup>
                                        <IconButton onClick={() => setHistoricalChartType(prev => prev === "bar" ? "line" : "bar")}>
                                            {historicalChartType === "bar" ? <Table /> : <BarChartIcon />}
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            type="date"
                                            label="Start Date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange(prev => ({
                                                ...prev,
                                                start: e.target.value
                                            }))}
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            type="date"
                                            label="End Date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange(prev => ({
                                                ...prev,
                                                end: e.target.value
                                            }))}
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {loading ? (
                                <Skeleton variant="rectangular" height={300} />
                            ) : (
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer>
                                        {renderChart(processedHistoricalData, historicalChartType)}
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Box>
    );
};

export default FishChart;