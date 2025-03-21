import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Notifications, FilterList } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Menu,
  MenuItem,
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Paper
} from "@mui/material";

const COLORS = [
  "#EC8305",
  "#C62E2E",
  "#FFE31A",
  "#16C47F",
  "#4C1F7A",
  "#FFD65A"
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { source, supply } = payload[0].payload;
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="body1" fontWeight="medium">
          {source}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supply: {supply}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const DashboardPie = () => {
  // Data from API for the pie chart and top contributors.
  const [data, setData] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);

  // Notifications fetched from API.
  const [notifications, setNotifications] = useState([]);
  // Read notifications – we store the notification’s message as an identifier.
  const [readNotifications, setReadNotifications] = useState([]);
  // Controls the visibility of the notifications dialog.
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Time range state – "daily" or "monthly"
  const [timeRange, setTimeRange] = useState("daily");
  const [anchorEl, setAnchorEl] = useState(null);

  // Menu handlers for switching time range.
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Mark a notification as read by saving its unique identifier.
  const markNotificationAsRead = (notification) => {
    setReadNotifications((prev) => [...prev, notification.message]);
  };

  // Get notifications that have not been marked as read.
  const getVisibleNotifications = () => {
    return notifications.filter(
      (notification) => !readNotifications.includes(notification.message)
    );
  };

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch supply and demand data concurrently.
        const [supplyResponse, demandResponse] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_BASE_URL}/api/supply/source?timeRange=${timeRange}`
          ),
          fetch(`${import.meta.env.VITE_BASE_URL}/api/local-demand/unsatisfied`)
        ]);

        if (!supplyResponse.ok || !demandResponse.ok)
          throw new Error("Network response was not ok");

        const supplyResult = await supplyResponse.json();
        const demandResult = await demandResponse.json();

        setData(supplyResult.data);
        const total = supplyResult.data.reduce(
          (sum, item) => sum + item.supply,
          0
        );
        setTotalSupply(total);

        // Build notifications based on the demand results and supply data.
        const thresholdNotifications = [];
        demandResult.forEach((demand) => {
          const supplyItem = supplyResult.data.find(
            (supply) => supply.source === demand.municipality
          );

          if (supplyItem) {
            const supplyAmount = supplyItem.supply;
            const demandAmount = demand.dailyDemand;
            const ratio = (supplyAmount / demandAmount) * 100;

            if (ratio > 120) {
              thresholdNotifications.push({
                type: "oversupply",
                message: `${demand.municipality} has excess supply: ${supplyAmount.toFixed(
                  1
                )} kg's vs ${demandAmount.toFixed(
                  1
                )} units daily demand (${Math.round(ratio)}% of daily demand)`,
                severity: "warning"
              });
            } else if (ratio >= 90 && ratio <= 120) {
              thresholdNotifications.push({
                type: "met",
                message: `${demand.municipality} supply meets demand: ${supplyAmount.toFixed(
                  1
                )} kg's vs ${demandAmount.toFixed(
                  1
                )} kg's daily demand (${Math.round(ratio)}% of daily demand)`,
                severity: "success"
              });
            } else if (ratio < 50) {
              thresholdNotifications.push({
                type: "undersupply",
                message: `${demand.municipality} has critical supply shortage: ${supplyAmount.toFixed(
                  1
                )} kg's vs ${demandAmount.toFixed(
                  1
                )} kg's daily demand (${Math.round(ratio)}% of daily demand)`,
                severity: "critical"
              });
            } else {
              thresholdNotifications.push({
                type: "lowSupply",
                message: `${demand.municipality} has low supply: ${supplyAmount.toFixed(
                  1
                )} kg's vs ${demandAmount.toFixed(
                  1
                )} kg's daily demand (${Math.round(ratio)}% of daily demand)`,
                severity: "warning"
              });
            }
          } else if (demand.shortage > 0) {
            thresholdNotifications.push({
              type: "unmetDemand",
              message: `${demand.municipality} has no supply against daily demand of ${demand.dailyDemand} kg's for ${demand.fishType}`,
              severity: "critical"
            });
          }
        });

        // Generate notifications with a unique id.
        // Here we use the message as an identifier.
        const notificationsWithId = thresholdNotifications.map((notification) => ({
          ...notification,
          id: notification.message
        }));

        // Update notifications state.
        setNotifications(notificationsWithId);

        // Setup auto-refresh using the provided refreshInterval.
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(
          fetchData,
          supplyResult.metadata.refreshInterval
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeRange]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Source,Supply", ...data.map((row) => `${row.source},${row.supply}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `supply_data_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <Typography
        variant="h5"
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ml: 3
        }}
      >
        Supply by Municipality
      </Typography>
      <CardHeader
        sx={{ mr: 40 }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleMenuClick}
                startIcon={<FilterList />}
                sx={{
                  borderColor: "#000000",
                  color: "#000000",
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "primary.light"
                  }
                }}
              >
                Time Range
              </Button>
              <Typography variant="body2" color="#000000">
                ({timeRange})
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setTimeRange("daily");
                  handleMenuClose();
                }}
              >
                Daily
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTimeRange("monthly");
                  handleMenuClose();
                }}
              >
                Monthly
              </MenuItem>
            </Menu>
            <Badge badgeContent={getVisibleNotifications().length} color="error">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowNotifications(true)}
                sx={{
                  minWidth: "40px",
                  borderColor: "grey.400",
                  color: "grey.700",
                  "&:hover": {
                    borderColor: "grey.600",
                    backgroundColor: "grey.50"
                  }
                }}
              >
                <Notifications />
              </Button>
            </Badge>
          </Box>
        }
      />

      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3
          }}
        >
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="supply"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={80}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Card variant="outlined">
              <CardHeader
                title="Summary"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Supply
                    </Typography>
                    <Typography variant="h4">{totalSupply}</Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Municipalities
                    </Typography>
                    <Typography variant="h4">{data.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader
                title="Top Contributors"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent sx={{ maxHeight: 200, overflow: "auto" }}>
                {[...data]
                  .sort((a, b) => b.supply - a.supply)
                  .map((item, index) => (
                    <Box
                      key={item.source}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: COLORS[index % COLORS.length],
                            mr: 1
                          }}
                        />
                        <Typography>{item.source}</Typography>
                      </Box>
                      <Typography>
                        {((item.supply / totalSupply) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </CardContent>

      <Dialog
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 300, overflow: "auto", mt: 2 }}>
            {getVisibleNotifications().length > 0 ? (
              getVisibleNotifications().map((notification) => (
                <Paper
                  key={notification.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:last-child": { mb: 0 },
                    "&:hover": { bgcolor: "action.hover" }
                  }}
                >
                  <Typography>{notification.message}</Typography>
                  <Button
                    size="small"
                    color="#ddd"
                    variant="outlined"
                    onClick={() => markNotificationAsRead(notification)}
                  >
                    Mark as Read
                  </Button>
                </Paper>
              ))
            ) : (
              <Typography
                color="text.secondary"
                align="center"
                sx={{ p: 2 }}
              >
                No notifications
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DashboardPie;





// import React, { useState, useEffect } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// import { Notifications, Refresh, GetApp, FilterList } from '@mui/icons-material';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   Button,
//   Menu,
//   MenuItem,
//   Badge,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Box,
//   Paper
// } from "@mui/material";

// const COLORS = ["#EC8305", "#C62E2E", "#FFE31A", "#16C47F", "#4C1F7A", "#FFD65A"];

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload?.length) {
//     const { source, supply } = payload[0].payload;
//     return (
//       <Paper elevation={3} sx={{ p: 2 }}>
//         <Typography variant="body1" fontWeight="medium">{source}</Typography>
//         <Typography variant="body2" color="text.secondary">
//           Supply: {supply}
//         </Typography>
//       </Paper>
//     );
//   }
//   return null;
// };

// const DashboardPie = () => {
//   const [data, setData] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [timeRange, setTimeRange] = useState("daily");
//   const [totalSupply, setTotalSupply] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [summary, setSummary] = useState(null);

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/api/supply/${timeRange}`
//       );
//       if (!response.ok) throw new Error("Network response was not ok");

//       const result = await response.json();
      
//       // Update data format to match the new API response
//       setData(result.data.map(item => ({
//         source: item.source,
//         supply: item.supply,
//         percentage: item.percentage,
//         avgPrice: item.avgPrice,
//         transactions: item.transactions
//       })));

//       // Set total supply from summary
//       setTotalSupply(Number(result.summary.totalSupply));
//       setSummary(result.summary);

//       // Create enhanced notifications based on thresholds and changes
//       const thresholdNotifications = result.data
//         .filter(item => {
//           const percentage = Number(item.percentage);
//           return percentage > 30 || percentage < 10; // Notify for very high or low percentages
//         })
//         .map(item => ({
//           message: `${item.source} represents ${item.percentage}% of total supply (${item.supply} units)`,
//           severity: Number(item.percentage) > 30 ? 'warning' : 'info'
//         }));

//       setNotifications(thresholdNotifications.map(note => note.message));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTimeRangeChange = (newRange) => {
//     setTimeRange(newRange);
//     handleMenuClose();
//   };

//   useEffect(() => {
//     fetchData();
//   }, [timeRange]);

//   return (
//     <Card sx={{ maxWidth: 1200, margin: '0 auto' }}>
//       <Typography variant="h5" component="div" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 3}}>
//         Supply by Municipality
//       </Typography>
      
//       <CardHeader sx={{ mr: 40 }}
//         action={
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={handleMenuClick}
//                 startIcon={<FilterList />}
//                 sx={{ 
//                   borderColor: '#000000',
//                   color: '#000000',
//                   '&:hover': {
//                     borderColor: 'primary.dark',
//                     backgroundColor: 'primary.light',
//                   }
//                 }}
//               >
//                 Time Range
//               </Button>
//               <Typography variant="body2" color="#000000">
//                 ({timeRange})
//               </Typography>
//             </Box>

//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//             >
//               <MenuItem onClick={() => handleTimeRangeChange("daily")}>
//                 Daily
//               </MenuItem>
//               <MenuItem onClick={() => handleTimeRangeChange("weekly")}>
//                 Weekly
//               </MenuItem>
//               <MenuItem onClick={() => handleTimeRangeChange("monthly")}>
//                 Monthly
//               </MenuItem>
//             </Menu>

//             <Badge badgeContent={notifications.length} color="error">
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => setShowNotifications(true)}
//                 sx={{ 
//                   minWidth: '40px',
//                   borderColor: 'grey.400',
//                   color: 'grey.700',
//                   '&:hover': {
//                     borderColor: 'grey.600',
//                     backgroundColor: 'grey.50',
//                   }
//                 }}
//               >
//                 <Notifications />
//               </Button>
//             </Badge>
//           </Box>
//         }
//       />

//       <CardContent>
//         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
//           <Box sx={{ height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data}
//                   dataKey="supply"
//                   nameKey="source"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={150}
//                   innerRadius={80}
//                   paddingAngle={2}
//                 >
//                   {data.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Box>

//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <Card variant="outlined">
//               <CardHeader title="Summary" titleTypographyProps={{ variant: 'h6' }} />
//               <CardContent>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                   <Box>
//                     <Typography color="text.secondary" variant="body2">
//                       Total Supply
//                     </Typography>
//                     <Typography variant="h4">
//                       {totalSupply}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography color="text.secondary" variant="body2">
//                       Municipalities
//                     </Typography>
//                     <Typography variant="h4">
//                       {data.length}
//                     </Typography>
//                   </Box>
//                   {summary && (
//                     <Box>
//                       <Typography color="text.secondary" variant="body2">
//                         Average Supply per Source
//                       </Typography>
//                       <Typography variant="h4">
//                         {summary.averageSupplyPerSource}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>

//             <Card variant="outlined">
//               <CardHeader title="Top Contributors" titleTypographyProps={{ variant: 'h6' }} />
//               <CardContent sx={{ maxHeight: 200, overflow: 'auto' }}>
//                 {data.map((item, index) => (
//                   <Box
//                     key={item.source}
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       mb: 2
//                     }}
//                   >
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Box
//                         sx={{
//                           width: 12,
//                           height: 12,
//                           borderRadius: '50%',
//                           backgroundColor: COLORS[index % COLORS.length],
//                           mr: 1
//                         }}
//                       />
//                       <Typography>{item.source}</Typography>
//                     </Box>
//                     <Typography>
//                       {item.percentage}%
//                     </Typography>
//                   </Box>
//                 ))}
//               </CardContent>
//             </Card>
//           </Box>
//         </Box>
//       </CardContent>

//       <Dialog
//         open={showNotifications}
//         onClose={() => setShowNotifications(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Notifications</DialogTitle>
//         <DialogContent>
//           <Box sx={{ maxHeight: 300, overflow: 'auto', mt: 2 }}>
//             {notifications.length > 0 ? (
//               notifications.map((note, index) => (
//                 <Paper
//                   key={index}
//                   sx={{
//                     p: 2,
//                     mb: 1,
//                     '&:last-child': { mb: 0 },
//                     '&:hover': { bgcolor: 'action.hover' }
//                   }}
//                 >
//                   <Typography>{note}</Typography>
//                 </Paper>
//               ))
//             ) : (
//               <Typography
//                 color="text.secondary"
//                 align="center"
//                 sx={{ p: 2 }}
//               >
//                 No notifications
//               </Typography>
//             )}
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default DashboardPie;



// import React, { useState, useEffect, useCallback } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   Button,
//   Menu,
//   MenuItem,
//   Badge,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Box,
//   Paper,
//   IconButton,
//   Alert,
//   Snackbar
// } from "@mui/material";
// import {
//   Notifications,
//   Refresh,
//   FilterList,
//   Close as CloseIcon
// } from "@mui/icons-material";

// const COLORS = ["#EC8305", "#C62E2E", "#FFE31A", "#16C47F", "#4C1F7A", "#FFD65A"];

// const getAlertSeverity = (severity) => {
//   switch (severity) {
//     case 'critical':
//       return 'error';
//     case 'warning':
//       return 'warning';
//     case 'success':
//       return 'success';
//     default:
//       return 'info';
//   }
// };

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload?.length) {
//     const { source, supply } = payload[0].payload;
//     return (
//       <Paper elevation={3} sx={{ p: 2 }}>
//         <Typography variant="body1" fontWeight="medium">{source}</Typography>
//         <Typography variant="body2" color="text.secondary">
//           Supply: {supply}
//         </Typography>
//       </Paper>
//     );
//   }
//   return null;
// };

// const DashboardPie = () => {
//   const [data, setData] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [timeRange, setTimeRange] = useState("daily");
//   const [totalSupply, setTotalSupply] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [lastRefresh, setLastRefresh] = useState(new Date());
//   const [refreshError, setRefreshError] = useState(null);

//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const [supplyResponse, demandResponse] = await Promise.all([
//         fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/source?timeRange=${timeRange}`),
//         fetch(`${import.meta.env.VITE_BASE_URL}/api/local-demand/unsatisfied`)
//       ]);

//       if (!supplyResponse.ok || !demandResponse.ok)
//         throw new Error("Network response was not ok");

//       const supplyResult = await supplyResponse.json();
//       const demandResult = await demandResponse.json();

//       setData(supplyResult.data);
//       const total = supplyResult.data.reduce((sum, item) => sum + item.supply, 0);
//       setTotalSupply(total);

//       const thresholdNotifications = [];

//       demandResult.forEach(demand => {
//         const supplyItem = supplyResult.data.find(
//           supply => supply.source === demand.municipality
//         );

//         if (supplyItem) {
//           const supplyAmount = supplyItem.supply;
//           const demandAmount = demand.dailyDemand;
//           const ratio = (supplyAmount / demandAmount) * 100;

//           if (ratio > 120) {
//             thresholdNotifications.push({
//               type: 'oversupply',
//               message: `${demand.municipality} has excess supply: ${supplyAmount.toFixed(1)} units vs ${demandAmount.toFixed(1)} units daily demand (${Math.round(ratio)}% of daily demand)`,
//               severity: 'warning'
//             });
//           } else if (ratio >= 90 && ratio <= 120) {
//             thresholdNotifications.push({
//               type: 'met',
//               message: `${demand.municipality} supply meets demand: ${supplyAmount.toFixed(1)} units vs ${demandAmount.toFixed(1)} units daily demand (${Math.round(ratio)}% of daily demand)`,
//               severity: 'success'
//             });
//           } else if (ratio < 50) {
//             thresholdNotifications.push({
//               type: 'undersupply',
//               message: `${demand.municipality} has critical supply shortage: ${supplyAmount.toFixed(1)} units vs ${demandAmount.toFixed(1)} units daily demand (${Math.round(ratio)}% of daily demand)`,
//               severity: 'critical'
//             });
//           } else {
//             thresholdNotifications.push({
//               type: 'lowSupply',
//               message: `${demand.municipality} has low supply: ${supplyAmount.toFixed(1)} units vs ${demandAmount.toFixed(1)} units daily demand (${Math.round(ratio)}% of daily demand)`,
//               severity: 'warning'
//             });
//           }
//         } else if (demand.shortage > 0) {
//           thresholdNotifications.push({
//             type: 'unmetDemand',
//             message: `${demand.municipality} has no supply against daily demand of ${demand.dailyDemand} units for ${demand.fishType}`,
//             severity: 'critical'
//           });
//         }
//       });

//       setNotifications(thresholdNotifications);
//       setLastRefresh(new Date());
//       setRefreshError(null);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setRefreshError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [timeRange]);

//   useEffect(() => {
//     const getRefreshInterval = () => {
//       switch (timeRange) {
//         case 'daily':
//           return 24 * 60 * 60 * 1000; // 24 hours
//         case 'weekly':
//           return 7 * 24 * 60 * 60 * 1000; // 7 days
//         case 'monthly':
//           return 30 * 24 * 60 * 60 * 1000; // 30 days
//         default:
//           return 60 * 60 * 1000; // 1 hour default
//       }
//     };

//     fetchData(); // Initial fetch

//     const intervalId = setInterval(fetchData, getRefreshInterval());

//     return () => clearInterval(intervalId);
//   }, [timeRange, fetchData]);

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleTimeRangeChange = (newRange) => {
//     setTimeRange(newRange);
//     handleMenuClose();
//   };

//   const handleManualRefresh = () => {
//     fetchData();
//   };

//   return (
//     <Card sx={{ maxWidth: 1200, margin: '0 auto' }}>
//       <CardHeader
//         title={
//           <Typography variant="h5" component="div">
//             Supply by Municipality
//           </Typography>
//         }
//         action={
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={handleMenuClick}
//                 startIcon={<FilterList />}
//               >
//                 Time Range ({timeRange})
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={handleManualRefresh}
//                 disabled={isLoading}
//                 startIcon={<Refresh className={isLoading ? 'spin' : ''} />}
//               >
//                 Refresh
//               </Button>
//               <Typography variant="caption" color="textSecondary">
//                 Last updated: {lastRefresh.toLocaleTimeString()}
//               </Typography>
//             </Box>

//             <Badge badgeContent={notifications.length} color="error">
//               <IconButton onClick={() => setShowNotifications(true)}>
//                 <Notifications />
//               </IconButton>
//             </Badge>
//           </Box>
//         }
//       />

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={() => handleTimeRangeChange("daily")}>Daily</MenuItem>
//         <MenuItem onClick={() => handleTimeRangeChange("weekly")}>Weekly</MenuItem>
//         <MenuItem onClick={() => handleTimeRangeChange("monthly")}>Monthly</MenuItem>
//       </Menu>

//       <CardContent>
//         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
//           <Box sx={{ height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data}
//                   dataKey="supply"
//                   nameKey="source"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={150}
//                   innerRadius={80}
//                   paddingAngle={2}
//                 >
//                   {data.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Box>

//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <Card variant="outlined">
//               <CardHeader title="Summary" titleTypographyProps={{ variant: 'h6' }} />
//               <CardContent>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                   <Box>
//                     <Typography color="text.secondary" variant="body2">
//                       Total Supply
//                     </Typography>
//                     <Typography variant="h4">
//                       {totalSupply}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography color="text.secondary" variant="body2">
//                       Municipalities
//                     </Typography>
//                     <Typography variant="h4">
//                       {data.length}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>

//             <Card variant="outlined">
//               <CardHeader title="Top Contributors" titleTypographyProps={{ variant: 'h6' }} />
//               <CardContent sx={{ maxHeight: 200, overflow: 'auto' }}>
//                 {[...data]
//                   .sort((a, b) => b.supply - a.supply)
//                   .map((item, index) => (
//                     <Box
//                       key={item.source}
//                       sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         mb: 2
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box
//                           sx={{
//                             width: 12,
//                             height: 12,
//                             borderRadius: '50%',
//                             backgroundColor: COLORS[index % COLORS.length],
//                             mr: 1
//                           }}
//                         />
//                         <Typography>{item.source}</Typography>
//                       </Box>
//                       <Typography>
//                         {((item.supply / totalSupply) * 100).toFixed(1)}%
//                       </Typography>
//                     </Box>
//                   ))}
//               </CardContent>
//             </Card>
//           </Box>
//         </Box>
//       </CardContent>

//       <Dialog
//         open={showNotifications}
//         onClose={() => setShowNotifications(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           Notifications
//           <IconButton
//             aria-label="close"
//             onClick={() => setShowNotifications(false)}
//             sx={{ position: 'absolute', right: 8, top: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ mt: 2 }}>
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <Alert
//                   key={index}
//                   severity={getAlertSeverity(notification.severity)}
//                   sx={{ mb: 2 }}
//                 >
//                   {notification.message}
//                 </Alert>
//               ))
//             ) : (
//               <Typography color="textSecondary" align="center">
//                 No notifications
//               </Typography>
//             )}
//           </Box>
//         </DialogContent>
//       </Dialog>

//       <Snackbar
//         open={!!refreshError}
//         autoHideDuration={6000}
//         onClose={() => setRefreshError(null)}
//         message={refreshError}
//         action={
//           <IconButton
//             size="small"
//             color="inherit"
//             onClick={() => setRefreshError(null)}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         }
//       />
//     </Card>
//   );
// };

// export default DashboardPie;