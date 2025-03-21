// import React, { useState, useEffect } from "react";
// import Header from '../../components/Header';
// import { motion } from "framer-motion";
// import FishSupply from '../../components/FishSupply'
// import PieChart from '../../components/PieChart'

// const OverviewPage = () => {
//     const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

//     useEffect(() => {
//         const fetchPermitData = async () => {
//             try {
//                 const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/permit-stats`);
//                 const data = await response.json();
//                 console.log("Permit Stats Data:", data);
//                 setStats(data);
//             } catch (error) {
//                 console.error("Error fetching permit stats:", error);
//             }
//         };

//         fetchPermitData();
//     }, []);

//     return (
//         <div  style={{ marginTop: '50px', marginLeft:'30px' }} > {/*className="flex-1 overflow-auto relative z-10"*/}
//             <Header title="Overview"  />

//             <main style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent:'center', gap: "20px", marginBottom: '30px', marginTop:'40px' }} >
//                 {/* STATS */}
//                 <motion.div
//                     style={{ display:'flex' , height:'50vh', gap:'20px', marginRight:'30px' }}
//                     className="flex flex-row justify-between space-x-4 mb-8"
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                         hidden: { opacity: 0, y: 30 },
//                         visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.8 } }
//                     }}
//                 >
//                     {/* Pending Applications */}
//                     <motion.div
//                         className="flex-1 bg-blue-100 bg-opacity-80 backdrop-blur-md overflow-hidden rounded-lg shadow-md"
//                         style={{ borderTop: "30px solid #F59E0B", }}
//                         whileHover={{ y: -5, scale: 1.03 }}
//                         variants={{
//                             hidden: { opacity: 0, y: 20 },
//                             visible: { opacity: 1, y: 0 }
//                         }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <div className="px-4 py-4 text-center" >
//                             <span  style={{ fontSize:'25px', fontFamily: 'Segoe UI, sans-serif', fontWeight:'bold'}} >Pending</span>
//                             <p style={{ color: "#F59E0B", fontSize:'25px', fontFamily: 'Segoe UI, sans-serif', fontWeight:'bold' }}>{stats.pending}</p>
//                         </div>
//                     </motion.div>

//                     {/* Approved Applications */}
//                     <motion.div
//                         className="flex-1 bg-green-100 bg-opacity-80 backdrop-blur-md overflow-hidden rounded-lg shadow-md"
//                         style={{ borderTop: "30px solid #10B981" }}
//                         whileHover={{ y: -5, scale: 1.03 }}
//                         variants={{
//                             hidden: { opacity: 0, y: 20 },
//                             visible: { opacity: 1, y: 0 }
//                         }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <div className="px-4 py-4 text-center">
//                             <span style={{ fontSize:'25px', fontFamily: 'Segoe UI, sans-serif', fontWeight:'bold'}}>Approved</span>
//                             <p style={{ fontSize:'25px', fontFamily: 'Segoe UI, sans-serif', fontWeight:'bold', color: "#10B981" }}>{stats.approved}</p>
//                         </div>
//                     </motion.div>

//                     {/* Rejected Applications */}
//                     <motion.div
//                         className="flex-1 bg-red-100 bg-opacity-80 backdrop-blur-md overflow-hidden rounded-lg shadow-md"
//                         style={{ borderTop: "30px solid #EF4444" }}
//                         whileHover={{ y: -5, scale: 1.03 }}
//                         variants={{
//                             hidden: { opacity: 0, y: 20 },
//                             visible: { opacity: 1, y: 0 }
//                         }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <div className="px-4 py-4 text-center" style={{ backgroundColor:'', borderBottomRightRadius:'20px', borderBottomLeftRadius:'20px' }}>
//                             <span style={{ fontSize:'25px', fontFamily: 'Segoe UI, sans-serif', fontWeight:'bold'}}>Rejected</span>
//                             <p style={{ color: "#EF4444", fontSize:'25px', fontFamily: 'Segoe UI, sans-serif', fontWeight:'bold' }}>{stats.rejected}</p>
//                         </div>
//                     </motion.div>
//                 </motion.div>

//                 {/* CHARTS */}
//                 <div  >
//                    <PieChart />
//                 </div>
//             </main>
//             <div  >
//                    <FishSupply />
//                 </div>  
//         </div>
        
//     );
// };

// export default OverviewPage;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Header from '../../components/Header';
import FishSupply from '../../components/FishSupply';
import PieChart from '../../components/PieChart';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InventoryIcon from '@mui/icons-material/Inventory';

const OverviewPage = () => {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [dailySupply, setDailySupply] = useState(0);
  
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const fetchDailySupply = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/daily`);
      const data = await response.json();
      const totalSupply = data[0]?.data.reduce((sum, item) => sum + (Number(item.supply) || 0), 0);
      setDailySupply(totalSupply || 0);
      
      // Store last update time
      localStorage.setItem('lastSupplyUpdate', new Date().toISOString());
    } catch (error) {
      console.error("Error fetching daily supply:", error);
    }
  };

  // Fetch permit stats
  const fetchPermitStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/permit-stats`);
      const data = await response.json();
      
      // Check if it's a new month
      const currentMonth = new Date().getMonth();
      const lastMonth = localStorage.getItem('lastStatsMonth');
      
      if (lastMonth !== currentMonth.toString()) {
        setStats({ pending: 0, approved: 0, rejected: 0 });
        localStorage.setItem('lastStatsMonth', currentMonth.toString());
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching permit stats:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDailySupply();
    fetchPermitStats();
    
    // Daily reset for supply
    const supplyInterval = setInterval(fetchDailySupply, 86400000); // 24 hours
    
    // Monthly stats check
    const statsInterval = setInterval(fetchPermitStats, 86400000); // 24 hours
    
    return () => {
      clearInterval(supplyInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const statsCards = [
    {
      title: 'Pending Applications',
      value: stats.pending,
      icon: <PendingIcon sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: theme.palette.warning.main,
      lightColor: theme.palette.warning.light
    },
    {
      title: 'Approved Applications',
      value: stats.approved,
      icon: <CheckCircleIcon sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: theme.palette.success.main,
      lightColor: theme.palette.success.light
    },
    // {
    //   title: 'Rejected Applications',
    //   value: stats.rejected,
    //   icon: <CancelIcon sx={{ fontSize: isMobile ? 30 : 40 }} />,
    //   color: theme.palette.error.main,
    //   lightColor: theme.palette.error.light
    // },
    {
      title: 'Total Daily Supply',
      value: dailySupply + ' kg', 
      icon: <InventoryIcon sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'blue',
      lightColor: theme.palette.primary.light
    }
  ];

  return (
    <Box sx={{ py: isMobile ? 2 : 4 }}>
      <Container maxWidth="xl">
        <Header title="Overview" />
        
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mt: isMobile ? 1 : 2 }}>
          {/* Stats Cards */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={isMobile ? 2 : 3} >
              {statsCards.map((card, index) => (
                <Grid item xs={12} sm={card.title === 'Total Daily Supply' ? 12 : 6}  key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${card.color}, ${card.lightColor})`,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: isMobile ? 'none' : 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color: 'white',
                          py: isMobile ? 1 : 2
                        }}
                      >
                        {card.icon}
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{
                            mt: isMobile ? 1 : 2,
                            mb: 1,
                            fontWeight: 500,
                            textAlign: 'center'
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant={isMobile ? "h4" : "h3"}
                          component="div"
                          sx={{
                            fontWeight: 600,
                            fontFamily: 'monospace'
                          }}
                        >
                          {card.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={3}
              sx={{
                p: isMobile ? 2 : 3,
                height: '100%',
                minHeight: isTablet ? 300 : 400,
                backgroundColor: theme.palette.background.paper
              }}
            >
              <PieChart />
            </Paper>
          </Grid>

          {/* Fish Supply Section */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: isMobile ? 2 : 3,
                backgroundColor: theme.palette.background.paper
              }}
            >
              <FishSupply />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OverviewPage;