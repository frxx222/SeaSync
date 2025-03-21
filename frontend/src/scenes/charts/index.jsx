import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Select,
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Container,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAuthStore } from '../../store/store';
const FishSupply = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [view, setView] = useState("monthly");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);

  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     let response;
  //     if (view === "daily") {
  //       response = await fetch(
  //         `${import.meta.env.VITE_BASE_URL}/api/supply/daily-supply?month=${selectedMonth}&year=${selectedYear}`
  //       );
  //     } else {
  //       response = await fetch(
  //         `${import.meta.env.VITE_BASE_URL}/api/supply/monthly`
  //       );
  //     }

  //     if (!response.ok) throw new Error("Network response was not ok");
  //     const result = await response.json();

  //     if (view === "daily") {
  //       const filteredData = result[0].data
  //         .filter((entry) => {
  //           const entryDate = new Date(entry.month);
  //           return (
  //             entryDate.getFullYear() === selectedYear &&
  //             entryDate.getMonth() + 1 === selectedMonth
  //           );
  //         })
  //         .map((entry) => ({
  //           ...entry,
  //           day: new Date(entry.month).getDate(),
  //         }));
  //       setData(filteredData);
  //     } else {
  //       const months = [
  //         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //       ].map(month => ({ month, supply: 0 }));

  //       const filteredMonthlyData = result[0]?.data.filter(
  //         (entry) => new Date(entry.month).getFullYear() === selectedYear
  //       );

  //       const monthlyData = months.map((defaultMonth, index) => {
  //         const monthData = filteredMonthlyData.find(
  //           (entry) => new Date(entry.month).getMonth() === index
  //         );
  //         return {
  //           ...defaultMonth,
  //           supply: monthData ? monthData.supply : defaultMonth.supply,
  //         };
  //       });

  //       setData(monthlyData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [view, selectedMonth, selectedYear]);
  const { auth } = useAuthStore(); // Get auth state
    
  const fetchData = async () => {
    setIsLoading(true);
    try {
        const headers = {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
        };
        
        let response;
        if (view === "daily") {
            response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/supply/daily-supply?month=${selectedMonth}&year=${selectedYear}`,
                { headers }
            );
        } else {
            response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/supply/monthly?year=${selectedYear}`,
                { headers }
            );
        }

        

          if (!response.ok) throw new Error("Network response was not ok");
          const result = await response.json();

          // Process data as before...
          if (view === "daily") {
              const filteredData = result[0].data
                  .filter((entry) => {
                      const entryDate = new Date(entry.month);
                      return (
                          entryDate.getFullYear() === selectedYear &&
                          entryDate.getMonth() + 1 === selectedMonth
                      );
                  })
                  .map((entry) => ({
                      ...entry,
                      day: new Date(entry.month).getDate(),
                  }));
              setData(filteredData);
          } else {
            const months = [
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ].map(month => ({ month, supply: 0 }));
            
                    const filteredMonthlyData = result[0]?.data.filter(
                      (entry) => new Date(entry.month).getFullYear() === selectedYear
                    );
            
                    const monthlyData = months.map((defaultMonth, index) => {
                      const monthData = filteredMonthlyData.find(
                        (entry) => new Date(entry.month).getMonth() === index
                      );
                      return {
                        ...defaultMonth,
                        supply: monthData ? monthData.supply : defaultMonth.supply,
                      };
                    });
            
                    setData(monthlyData);
                  }
          
      } catch (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
      } finally {
          setIsLoading(false);
      }
  };
  useEffect(() => {
    fetchData();
  }, [view, selectedMonth, selectedYear]);

  const chartHeight = isMobile ? "50vh" : isTablet ? "60vh" : "70vh";

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ 
      padding: {  sm: '2rem', md: '3rem' },
      width: { xs: '100%', md: '80vw' },
      mt: isMobile ? '4rem' : '0rem'
  }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div>
        <Typography variant="h4" component="h1" gutterBottom color="#000000" fontWeight="bold">
          Supply Overview
        </Typography>
        <Typography variant="subtitle1" color="#000000" gutterBottom>
          Track daily and monthly supply trends
        </Typography>
        </div>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <ExpandLessIcon /> : <FilterListIcon />}
        </IconButton>
        </Box>

        <Collapse in={showFilters}>
        <Grid container spacing={2} sx={{ mb: 4, mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>View</InputLabel>
              <Select
                value={view}
                label="View"
                onChange={(e) => setView(e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {view === "daily" && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {[...Array(12)].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {new Date(0, index).toLocaleString("default", {
                        month: "long",
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[...Array(5)].map((_, index) => (
                  <MenuItem key={index} value={new Date().getFullYear() - index}>
                    {new Date().getFullYear() - index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        </Collapse>

        <Box height={chartHeight} width="100%">
          <ResponsiveContainer>
            {view === "daily" ? (
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: isMobile ? 10 : 30,
                  left: isMobile ? 0 : 20,
                  bottom: isMobile ? 80 : 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  interval={isMobile ? 2 : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={40}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="supply"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={!isMobile}
                />
              </LineChart>
            ) : (
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: isMobile ? 10 : 30,
                  left: isMobile ? 0 : 20,
                  bottom: isMobile ? 80 : 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  interval={0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={40}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="supply"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default FishSupply;