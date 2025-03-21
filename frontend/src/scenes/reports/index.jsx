// // import React, { useState, useEffect } from 'react';
// // import {
// //     Box,
// //     Typography,
// //     Grid,
// //     Card,
// //     CardContent,
// //     CardHeader,
// //     CircularProgress,
// //     Alert,
// //     Button,
// //     useTheme,
// //     useMediaQuery,
// // } from '@mui/material';
// // import {
// //     LineChart,
// //     Line,
// //     BarChart,
// //     Bar,
// //     XAxis,
// //     YAxis,
// //     CartesianGrid,
// //     Tooltip,
// //     Legend,
// //     ResponsiveContainer,
// //     ComposedChart
// // } from 'recharts';
// // import {
// //     CalendarMonth as CalendarIcon,
// //     Download as DownloadIcon
// // } from '@mui/icons-material';
// // import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
// // import PropTypes from 'prop-types';
// // import { useAuthStore } from '../../store/store';

// // // PDF Styles
// // const pdfStyles = StyleSheet.create({
// //     page: {
// //         padding: 30,
// //         backgroundColor: '#ffffff',
// //     },
// //     header: {
// //         marginBottom: 24,
// //     },
// //     title: {
// //         fontSize: 24,
// //         marginBottom: 8,
// //         color: '#1976d2',
// //         textAlign: 'center',
// //         fontWeight: 'bold',
// //     },
// //     subtitle: {
// //         fontSize: 16,
// //         marginBottom: 24,
// //         color: 'rgba(0, 0, 0, 0.6)',
// //         textAlign: 'center',
// //     },
// //     section: {
// //         marginBottom: 24,
// //     },
// //     sectionTitle: {
// //         fontSize: 18,
// //         marginBottom: 12,
// //         color: '#1976d2',
// //         backgroundColor: '#f5f5f5',
// //         padding: 8,
// //         borderRadius: 4,
// //     },
// //     table: {
// //         display: 'table',
// //         width: '100%',
// //         marginBottom: 12,
// //     },
// //     tableRow: {
// //         flexDirection: 'row',
// //         borderBottomWidth: 1,
// //         borderBottomColor: 'rgba(224, 224, 224, 1)',
// //         borderBottomStyle: 'solid',
// //         minHeight: 36,
// //     },
// //     tableHeader: {
// //         backgroundColor: '#f5f5f5',
// //     },
// //     tableCell: {
// //         flex: 1,
// //         fontSize: 12,
// //         padding: 8,
// //         textAlign: 'left',
// //         color: 'rgba(0, 0, 0, 0.87)',
// //     },
// //     tableCellHeader: {
// //         flex: 1,
// //         fontSize: 12,
// //         padding: 8,
// //         textAlign: 'left',
// //         color: 'rgba(0, 0, 0, 0.87)',
// //         fontWeight: 'bold',
// //     },
// //     footer: {
// //         position: 'absolute',
// //         bottom: 30,
// //         left: 30,
// //         right: 30,
// //         textAlign: 'center',
// //         color: 'rgba(0, 0, 0, 0.6)',
// //         fontSize: 10,
// //     },
// // });

// // // PDF Document Component
// // const MonthlyReportPDF = ({ monthName, marketData, monthlySupplyData, permitData, fishTypeData }) => (
// //     <Document>
// //         <Page size="A4" style={pdfStyles.page}>
// //             <View style={pdfStyles.header}>
// //                 <Text style={pdfStyles.title}>Monthly Report</Text>
// //                 <Text style={pdfStyles.subtitle}>{monthName}</Text>
// //             </View>

// //             <View style={pdfStyles.section}>
// //                 <Text style={pdfStyles.sectionTitle}>Market Supply by Source</Text>
// //                 <View style={pdfStyles.table}>
// //                     <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
// //                         <Text style={pdfStyles.tableCellHeader}>Source</Text>
// //                         <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
// //                     </View>
// //                     {marketData.map((item, index) => (
// //                         <View key={index} style={pdfStyles.tableRow}>
// //                             <Text style={pdfStyles.tableCell}>{item.source}</Text>
// //                             <Text style={pdfStyles.tableCell}>
// //                                 {item.supply.toLocaleString(undefined, { minimumFractionDigits: 2 })}
// //                             </Text>
// //                         </View>
// //                     ))}
// //                 </View>
// //             </View>

// //             <View style={pdfStyles.section}>
// //                 <Text style={pdfStyles.sectionTitle}>Monthly Supply Data</Text>
// //                 <View style={pdfStyles.table}>
// //                     <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
// //                         <Text style={pdfStyles.tableCellHeader}>Month</Text>
// //                         <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
// //                     </View>
// //                     {monthlySupplyData.map((item, index) => (
// //                         <View key={index} style={pdfStyles.tableRow}>
// //                             <Text style={pdfStyles.tableCell}>{item.month}</Text>
// //                             <Text style={pdfStyles.tableCell}>
// //                                 {item.supply.toLocaleString(undefined, { minimumFractionDigits: 2 })}
// //                             </Text>
// //                         </View>
// //                     ))}
// //                 </View>
// //             </View>

// //             <View style={pdfStyles.section}>
// //                 <Text style={pdfStyles.sectionTitle}>Permit Statistics</Text>
// //                 <View style={pdfStyles.table}>
// //                     <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
// //                         <Text style={pdfStyles.tableCellHeader}>Status</Text>
// //                         <Text style={pdfStyles.tableCellHeader}>Count</Text>
// //                     </View>
// //                     {Object.entries(permitData).map(([status, count], index) => (
// //                         <View key={index} style={pdfStyles.tableRow}>
// //                             <Text style={pdfStyles.tableCell}>
// //                                 {status.charAt(0).toUpperCase() + status.slice(1)}
// //                             </Text>
// //                             <Text style={pdfStyles.tableCell}>{count}</Text>
// //                         </View>
// //                     ))}
// //                 </View>
// //             </View>

// //             <Text style={pdfStyles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
// //         </Page>
// //     </Document>
// // );

// // // Main Report Component
// // const Report = () => {
// //     const [marketData, setMarketData] = useState([]);
// //     const [permitData, setPermitData] = useState({ approved: 0, rejected: 0, pending: 0 });
// //     const [monthlySupplyData, setMonthlySupplyData] = useState([]);
// //     const [fishTypeData, setFishTypeData] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

// //     const colors = {
// //         primary: '#2C3E50',
// //         secondary: '#3498DB',
// //         success: '#27AE60',
// //         warning: '#F39C12',
// //         error: '#E74C3C',
// //         background: '#ECF0F1',
// //         price: '#E67E22'
// //     };

// //     const getPreviousMonthDates = () => {
// //         const now = new Date();
// //         const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
// //         const startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
// //         const endDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
        
// //         return {
// //             startDate,
// //             endDate,
// //             monthName: prevMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
// //         };
// //     };

// //     const { monthName } = getPreviousMonthDates();
// //     const { auth } = useAuthStore();

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             setLoading(true);
// //             try {
// //                 const headers = {
// //                     'Authorization': `Bearer ${auth.token}`,
// //                     'Content-Type': 'application/json'
// //                 };
// //                 // Existing fetch calls remain the same
// //                 const [marketResponse, monthlySupplyResponse, permitResponse, fishTypeResponse] = await Promise.all([
// //                     fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-source`),
// //                     fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/monthly`, { headers }),
// //                     fetch(`${import.meta.env.VITE_BASE_URL}/api/permit-stats`),
// //                     fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-fish`)
// //                 ]);

// //                 const [marketResult, monthlySupplyResult, permitStats, fishTypeResult] = await Promise.all([
// //                     marketResponse.json(),
// //                     monthlySupplyResponse.json(),
// //                     permitResponse.json(),
// //                     fishTypeResponse.json()
// //                 ]);

// //                 setMarketData(marketResult[0]?.data || []);
// //                 setMonthlySupplyData(processMonthlyData(monthlySupplyResult[0]?.data || []));
// //                 setPermitData(permitStats);
// //                 setFishTypeData(fishTypeResult[0]?.data || []);

// //             } catch (err) {
// //                 setError('Failed to fetch report data');
// //                 console.error('Error fetching report data:', err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchData();
// //     }, []);

// //     const processMonthlyData = (data) => {
// //                 const months = [
// //                     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
// //                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// //                 ];
        
// //                 return months.map(month => {
// //                     const monthData = data.find(item => {
// //                         const itemDate = new Date(item.month);
// //                         return months[itemDate.getMonth()] === month;
// //                     });
        
// //                     return {
// //                         month,
// //                         supply: monthData ? Number(monthData.supply.toFixed(2)) : 0
// //                     };
// //                 });
// //             };

// //     const permitChartData = [
// //                 { status: 'Approved', value: permitData.approved },
// //                 { status: 'Rejected', value: permitData.rejected },
// //                 { status: 'Pending', value: permitData.pending }
// //             ];
        
// //             if (loading) {
// //                 return (
// //                     <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
// //                         <CircularProgress />
// //                     </Box>
// //                 );
// //             }
        
// //             if (error) {
// //                 return (
// //                     <Alert severity="error" sx={{ m: 2 }}>
// //                         {error}
// //                     </Alert>
// //                 );
// //             }

// //     const PDFDownloadButton = () => (
// //         <PDFDownloadLink
// //             document={
// //                 <MonthlyReportPDF
// //                     monthName={monthName}
// //                     marketData={marketData}
// //                     monthlySupplyData={monthlySupplyData}
// //                     permitData={permitData}
// //                     fishTypeData={fishTypeData}
// //                 />
// //             }
// //             fileName={`monthly-report-${monthName.toLowerCase().replace(' ', '-')}.pdf`}
// //             style={{ textDecoration: 'none' }}
// //         >
// //             {({ loading: pdfLoading, error: pdfError }) => (
// //                 <Box sx={{ display: 'inline-block' }}>
// //                     <Button
// //                         variant="contained"
// //                         disabled={pdfLoading}
// //                         startIcon={pdfLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
// //                         sx={{
// //                             backgroundColor: theme.palette.success.main,
// //                             '&:hover': {
// //                                 backgroundColor: theme.palette.success.dark,
// //                             },
// //                             '&:disabled': {
// //                                 backgroundColor: theme.palette.action.disabledBackground,
// //                             }
// //                         }}
// //                     >
// //                         {pdfLoading ? 'Generating PDF...' : 'Download Report'}
// //                     </Button>
// //                     {pdfError && (
// //                         <Box sx={{ color: theme.palette.error.main, mt: 1 }}>
// //                             Error generating PDF. Please try again.
// //                         </Box>
// //                     )}
// //                 </Box>
// //             )}
// //         </PDFDownloadLink>
// //     );

// //     if (loading) {
// //         return (
// //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
// //                 <CircularProgress />
// //             </Box>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <Alert severity="error" sx={{ m: 2 }}>
// //                 {error}
// //             </Alert>
// //         );
// //     }

// //     return (
// //         <Box sx={{ p: theme.spacing(3) }}>
// //             <Card elevation={2} sx={{ p: theme.spacing(3) }}>
// //                 <Box sx={{ 
// //                     display: 'flex',
// //                     flexDirection: isMobile ? 'column' : 'row',
// //                     justifyContent: 'space-between',
// //                     alignItems: isMobile ? 'flex-start' : 'center',
// //                     mb: 3,
// //                     gap: 2
// //                 }}>
// //                     <Box>
// //                         <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
// //                             Monthly Report
// //                         </Typography>
// //                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                             <CalendarIcon color="action" />
// //                             <Typography variant="subtitle1" color="textSecondary">
// //                                 {monthName}
// //                             </Typography>
// //                         </Box>
// //                     </Box>
// //                     <PDFDownloadButton />
// //                 </Box>

// //                 <Grid container spacing={3}>
// //                      {/* Monthly Supply Chart */}
// //                     <Grid item xs={12}>
// //                         <Card>
// //                             <CardHeader 
// //                                 title="Monthly Supply Trends"
// //                                 sx={{
// //                                     backgroundColor: theme.palette.grey[50],
// //                                     borderBottom: `1px solid ${theme.palette.divider}`
// //                                 }}
// //                             />
// //                             <CardContent>
// //                                 <Box sx={{ height: 400, width: '100%' }}>
// //                                     <ResponsiveContainer>
// //                                         <LineChart data={monthlySupplyData}>
// //                                             <CartesianGrid strokeDasharray="3 3" />
// //                                             <XAxis dataKey="month" />
// //                                             <YAxis />
// //                                             <Tooltip />
// //                                             <Legend />
// //                                             <Line 
// //                                                 type="monotone"
// //                                                 dataKey="supply" 
// //                                                 stroke={colors.success}
// //                                                 name="Supply (kg)"
// //                                                 strokeWidth={2}
// //                                             />
// //                                         </LineChart>
// //                                     </ResponsiveContainer>
// //                                 </Box>
// //                             </CardContent>
// //                         </Card>
// //                     </Grid>

// //                     {/* Market Supply Chart */}
// //                     <Grid item xs={12} md={6}>
// //                         <Card>
// //                             <CardHeader 
// //                                 title="Market Supply by Source"
// //                                 sx={{
// //                                     backgroundColor: theme.palette.grey[50],
// //                                     borderBottom: `1px solid ${theme.palette.divider}`
// //                                 }}
// //                             />
// //                             <CardContent>
// //                                 <Box sx={{ height: 400, width: '100%' }}>
// //                                     <ResponsiveContainer>
// //                                         <BarChart data={marketData}>
// //                                             <CartesianGrid strokeDasharray="3 3" />
// //                                             <XAxis dataKey="source" />
// //                                             <YAxis />
// //                                             <Tooltip />
// //                                             <Legend />
// //                                             <Bar 
// //                                                 dataKey="supply" 
// //                                                 fill={colors.primary} 
// //                                                 name="Supply (kg)"
// //                                             />
// //                                         </BarChart>
// //                                     </ResponsiveContainer>
// //                                 </Box>
// //                             </CardContent>
// //                         </Card>
// //                     </Grid>

// //                     {/* Permit Statistics Chart */}
// //                     <Grid item xs={12} md={6}>
// //                         <Card>
// //                             <CardHeader 
// //                                 title="Permit Statistics"
// //                                 sx={{
// //                                     backgroundColor: theme.palette.grey[50],
// //                                     borderBottom: `1px solid ${theme.palette.divider}`
// //                                 }}
// //                             />
// //                             <CardContent>
// //                                 <Box sx={{ height: 400, width: '100%' }}>
// //                                     <ResponsiveContainer>
// //                                         <BarChart data={permitChartData}>
// //                                             <CartesianGrid strokeDasharray="3 3" />
// //                                             <XAxis dataKey="status" />
// //                                             <YAxis />
// //                                             <Tooltip />
// //                                             <Legend />
// //                                             <Bar 
// //                                                 dataKey="value" 
// //                                                 fill={colors.secondary} 
// //                                                 name="Count"
// //                                             />
// //                                         </BarChart>
// //                                     </ResponsiveContainer>
// //                                 </Box>
// //                             </CardContent>
// //                         </Card>
// //                     </Grid>

// //                     <Grid item xs={12}>
// //                         <Card>
// //                             <CardHeader 
// //                                 title="Supply and Price by Fish Type"
// //                                 sx={{
// //                                     backgroundColor: theme.palette.grey[50],
// //                                     borderBottom: `1px solid ${theme.palette.divider}`
// //                                 }}
// //                             />
// //                             <CardContent>
// //                                 <Box sx={{ height: 400, width: '100%' }}>
// //                                     <ResponsiveContainer>
// //                                         <ComposedChart data={fishTypeData}>
// //                                             <CartesianGrid strokeDasharray="3 3" />
// //                                             <XAxis 
// //                                                 dataKey="fishType" 
// //                                                 angle={-45}
// //                                                 textAnchor="end"
// //                                                 height={70}
// //                                             />
// //                                             <YAxis 
// //                                                 yAxisId="left"
// //                                                 label={{ 
// //                                                     value: 'Supply (kg)', 
// //                                                     angle: -90, 
// //                                                     position: 'insideLeft' 
// //                                                 }}
// //                                             />
// //                                             <YAxis 
// //                                                 yAxisId="right"
// //                                                 orientation="right"
// //                                                 label={{ 
// //                                                     value: 'Average Price (₱)', 
// //                                                     angle: 90, 
// //                                                     position: 'insideRight' 
// //                                                 }}
// //                                             />
// //                                             <Tooltip />
// //                                             <Legend />
// //                                             <Bar 
// //                                                 yAxisId="left"
// //                                                 dataKey="supply" 
// //                                                 fill={colors.primary} 
// //                                                 name="Supply (kg)"
// //                                             />
// //                                             <Line
// //                                                 yAxisId="right"
// //                                                 type="monotone"
// //                                                 dataKey="avgPrice"
// //                                                 stroke={colors.price}
// //                                                 name="Average Price (₱)"
// //                                                 strokeWidth={2}
// //                                             />
// //                                         </ComposedChart>
// //                                     </ResponsiveContainer>
// //                                 </Box>
// //                             </CardContent>
// //                         </Card>
// //                     </Grid>
// //                 </Grid>
// //             </Card>
// //         </Box>
// //     );
// // };

// // MonthlyReportPDF.propTypes = {
// //     monthName: PropTypes.string.isRequired,
// //     marketData: PropTypes.arrayOf(
// //       PropTypes.shape({
// //         source: PropTypes.string,
// //         supply: PropTypes.number
// //       })
// //     ).isRequired,
// //     monthlySupplyData: PropTypes.arrayOf(
// //       PropTypes.shape({
// //         month: PropTypes.string,
// //         supply: PropTypes.number
// //       })
// //     ).isRequired,
// //     permitData: PropTypes.shape({
// //       approved: PropTypes.number,
// //       rejected: PropTypes.number,
// //       pending: PropTypes.number
// //     }).isRequired,
// //     fishTypeData: PropTypes.arrayOf(
// //       PropTypes.shape({
// //         fishType: PropTypes.string,
// //         supply: PropTypes.number,
// //         avgPrice: PropTypes.number,
// //         count: PropTypes.number
// //       })
// //     ).isRequired
// //   };
  
// //   // MUI Download Button Component with data validation
// //   const PDFDownloadButton = ({ data }) => {
// //     const theme = createTheme();
  
// //     // Validate required data
// //     const isDataValid = data && 
// //       data.monthName &&
// //       Array.isArray(data.marketData) &&
// //       Array.isArray(data.monthlySupplyData) &&
// //       data.permitData &&
// //       Array.isArray(data.fishTypeData);
  
// //     if (!isDataValid) {
// //       return (
// //         <Box sx={{ display: 'inline-block' }}>
// //           <Button
// //             variant="contained"
// //             disabled
// //             startIcon={<DownloadIcon />}
// //             sx={{
// //               backgroundColor: theme.palette.error.main,
// //               '&:hover': {
// //                 backgroundColor: theme.palette.error.dark,
// //               }
// //             }}
// //           >
// //             Invalid Data
// //           </Button>
// //         </Box>
// //       );
// //     }
  
// //     return (
// //       <PDFDownloadLink
// //         document={<MonthlyReportPDF {...data} />}
// //         fileName={`monthly-report-${data.monthName.toLowerCase().replace(' ', '-')}.pdf`}
// //         style={{ textDecoration: 'none' }}
// //       >
// //         {({ loading, error }) => (
// //           <Box sx={{ display: 'inline-block' }}>
// //             <Button
// //               variant="contained"
// //               disabled={loading}
// //               startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
// //               sx={{
// //                 backgroundColor: theme.palette.success.main,
// //                 '&:hover': {
// //                   backgroundColor: theme.palette.success.dark,
// //                 },
// //                 '&:disabled': {
// //                   backgroundColor: theme.palette.action.disabledBackground,
// //                 }
// //               }}
// //             >
// //               {loading ? 'Generating PDF...' : 'Download Report'}
// //             </Button>
// //             {error && (
// //               <Box sx={{ color: theme.palette.error.main, mt: 1 }}>
// //                 Error generating PDF. Please try again.
// //               </Box>
// //             )}
// //           </Box>
// //         )}
// //       </PDFDownloadLink>
// //     );
// //   };
  
// //   // Add PropTypes for the Download Button Component
// //   PDFDownloadButton.propTypes = {
// //     data: PropTypes.shape({
// //       monthName: PropTypes.string.isRequired,
// //       marketData: PropTypes.array.isRequired,
// //       monthlySupplyData: PropTypes.array.isRequired,
// //       permitData: PropTypes.object.isRequired,
// //       fishTypeData: PropTypes.array.isRequired
// //     }).isRequired
// //   };
  
// //   // Add default props
// //   PDFDownloadButton.defaultProps = {
// //     data: {
// //       monthName: '',
// //       marketData: [],
// //       monthlySupplyData: [],
// //       permitData: { approved: 0, rejected: 0, pending: 0 },
// //       fishTypeData: []
// //     }
// //   };

// // export default Report;

// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     CardHeader,
//     CircularProgress,
//     Alert,
//     Button,
//     useTheme,
//     useMediaQuery,
//     FormGroup,
//     FormControlLabel,
//     Checkbox,
//     RadioGroup,
//     Radio,
//     FormControl,
//     FormLabel,
//     createTheme,
// } from '@mui/material';
// import {
//     LineChart,
//     Line,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     ComposedChart
// } from 'recharts';
// import {
//     CalendarMonth as CalendarIcon,
//     Download as DownloadIcon
// } from '@mui/icons-material';
// import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
// import * as XLSX from 'xlsx';
// import PropTypes from 'prop-types';
// import { useAuthStore } from '../../store/store';

// // PDF Styles
// const pdfStyles = StyleSheet.create({
//     page: {
//         padding: 30,
//         backgroundColor: '#ffffff',
//     },
//     header: {
//         marginBottom: 24,
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 8,
//         color: '#1976d2',
//         textAlign: 'center',
//         fontWeight: 'bold',
//     },
//     subtitle: {
//         fontSize: 16,
//         marginBottom: 24,
//         color: 'rgba(0, 0, 0, 0.6)',
//         textAlign: 'center',
//     },
//     section: {
//         marginBottom: 24,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         marginBottom: 12,
//         color: '#1976d2',
//         backgroundColor: '#f5f5f5',
//         padding: 8,
//         borderRadius: 4,
//     },
//     table: {
//         display: 'table',
//         width: '100%',
//         marginBottom: 12,
//     },
//     tableRow: {
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: 'rgba(224, 224, 224, 1)',
//         borderBottomStyle: 'solid',
//         minHeight: 36,
//     },
//     tableHeader: {
//         backgroundColor: '#f5f5f5',
//     },
//     tableCell: {
//         flex: 1,
//         fontSize: 12,
//         padding: 8,
//         textAlign: 'left',
//         color: 'rgba(0, 0, 0, 0.87)',
//     },
//     tableCellHeader: {
//         flex: 1,
//         fontSize: 12,
//         padding: 8,
//         textAlign: 'left',
//         color: 'rgba(0, 0, 0, 0.87)',
//         fontWeight: 'bold',
//     },
//     footer: {
//         position: 'absolute',
//         bottom: 30,
//         left: 30,
//         right: 30,
//         textAlign: 'center',
//         color: 'rgba(0, 0, 0, 0.6)',
//         fontSize: 10,
//     },
// });

// // PDF Document Component
// const MonthlyReportPDF = ({ monthName, marketData, monthlySupplyData, permitData, fishTypeData, selectedSections }) => (
//     <Document>
//         <Page size="A4" style={pdfStyles.page}>
//             <View style={pdfStyles.header}>
//                 <Text style={pdfStyles.title}>Monthly Report</Text>
//                 <Text style={pdfStyles.subtitle}>{monthName}</Text>
//             </View>

//             {selectedSections.includes('monthlySupply') && (
//                 <View style={pdfStyles.section}>
//                     <Text style={pdfStyles.sectionTitle}>Monthly Supply Trends</Text>
//                     <View style={pdfStyles.table}>
//                         <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//                             <Text style={pdfStyles.tableCellHeader}>Month</Text>
//                             <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//                         </View>
//                         {monthlySupplyData.map((item, index) => (
//                             <View key={index} style={pdfStyles.tableRow}>
//                                 <Text style={pdfStyles.tableCell}>{item.month}</Text>
//                                 <Text style={pdfStyles.tableCell}>
//                                     {item.supply.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                 </Text>
//                             </View>
//                         ))}
//                     </View>
//                 </View>
//             )}

//             {selectedSections.includes('marketSupply') && (
//                 <View style={pdfStyles.section}>
//                     <Text style={pdfStyles.sectionTitle}>Market Supply by Source</Text>
//                     {/* Market supply table content */}
//                 </View>
//             )}

//             {selectedSections.includes('permits') && (
//                 <View style={pdfStyles.section}>
//                     <Text style={pdfStyles.sectionTitle}>Permit Statistics</Text>
//                     {/* Permit statistics table content */}
//                 </View>
//             )}

//             {selectedSections.includes('fishType') && (
//                 <View style={pdfStyles.section}>
//                     <Text style={pdfStyles.sectionTitle}>Supply and Price by Fish Type</Text>
//                     {/* Fish type data table content */}
//                 </View>
//             )}

//             <Text style={pdfStyles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
//         </Page>
//     </Document>
// );

// // Main Report Component
// const Report = () => {
    
//         const [marketData, setMarketData] = useState([]);
//         const [permitData, setPermitData] = useState({ approved: 0, rejected: 0, pending: 0 });
//         const [monthlySupplyData, setMonthlySupplyData] = useState([]);
//         const [fishTypeData, setFishTypeData] = useState([]);
//         const [loading, setLoading] = useState(true);
//         const [error, setError] = useState(null);
        
//         // New state for section selection and file type
//         const [selectedSections, setSelectedSections] = useState({
//             monthlySupply: true,
//             marketSupply: true,
//             permits: true,
//             fishType: true
//         });
//         const [fileType, setFileType] = useState('pdf');
    
//         const theme = useTheme();
//         const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//         const { auth } = useAuthStore();

//     const colors = {
//         primary: '#2C3E50',
//         secondary: '#3498DB',
//         success: '#27AE60',
//         warning: '#F39C12',
//         error: '#E74C3C',
//         background: '#ECF0F1',
//         price: '#E67E22'
//     };

//     const getPreviousMonthDates = () => {
//         const now = new Date();
//         const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
//         const startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
//         const endDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
        
//         return {
//             startDate,
//             endDate,
//             monthName: prevMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
//         };
//     };

//     const { monthName } = getPreviousMonthDates();
  

//     const exportToExcel = () => {
//         const workbook = XLSX.utils.book_new();
        
//         if (selectedSections.monthlySupply) {
//             const monthlySupplySheet = XLSX.utils.json_to_sheet(monthlySupplyData);
//             XLSX.utils.book_append_sheet(workbook, monthlySupplySheet, "Monthly Supply");
//         }
        
//         if (selectedSections.marketSupply) {
//             const marketDataSheet = XLSX.utils.json_to_sheet(marketData);
//             XLSX.utils.book_append_sheet(workbook, marketDataSheet, "Market Supply");
//         }
        
//         if (selectedSections.permits) {
//             const permitDataSheet = XLSX.utils.json_to_sheet([permitData]);
//             XLSX.utils.book_append_sheet(workbook, permitDataSheet, "Permits");
//         }
        
//         if (selectedSections.fishType) {
//             const fishTypeSheet = XLSX.utils.json_to_sheet(fishTypeData);
//             XLSX.utils.book_append_sheet(workbook, fishTypeSheet, "Fish Types");
//         }

//         XLSX.writeFile(workbook, `monthly-report-${monthName.toLowerCase().replace(' ', '-')}.xlsx`);
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const headers = {
//                     'Authorization': `Bearer ${auth.token}`,
//                     'Content-Type': 'application/json'
//                 };
//                 // Existing fetch calls remain the same
//                 const [marketResponse, monthlySupplyResponse, permitResponse, fishTypeResponse] = await Promise.all([
//                     fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-source`),
//                     fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/monthly`, { headers }),
//                     fetch(`${import.meta.env.VITE_BASE_URL}/api/permit-stats`),
//                     fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-fish`)
//                 ]);

//                 const [marketResult, monthlySupplyResult, permitStats, fishTypeResult] = await Promise.all([
//                     marketResponse.json(),
//                     monthlySupplyResponse.json(),
//                     permitResponse.json(),
//                     fishTypeResponse.json()
//                 ]);

//                 setMarketData(marketResult[0]?.data || []);
//                 setMonthlySupplyData(processMonthlyData(monthlySupplyResult[0]?.data || []));
//                 setPermitData(permitStats);
//                 setFishTypeData(fishTypeResult[0]?.data || []);

//             } catch (err) {
//                 setError('Failed to fetch report data');
//                 console.error('Error fetching report data:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const processMonthlyData = (data) => {
//                 const months = [
//                     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//                 ];
        
//                 return months.map(month => {
//                     const monthData = data.find(item => {
//                         const itemDate = new Date(item.month);
//                         return months[itemDate.getMonth()] === month;
//                     });
        
//                     return {
//                         month,
//                         supply: monthData ? Number(monthData.supply.toFixed(2)) : 0
//                     };
//                 });
//             };

//     const permitChartData = [
//                 { status: 'Approved', value: permitData.approved },
//                 { status: 'Rejected', value: permitData.rejected },
//                 { status: 'Pending', value: permitData.pending }
//             ];
        
//             if (loading) {
//                 return (
//                     <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//                         <CircularProgress />
//                     </Box>
//                 );
//             }
        
//             if (error) {
//                 return (
//                     <Alert severity="error" sx={{ m: 2 }}>
//                         {error}
//                     </Alert>
//                 );
//             }

//             const DownloadButton = () => (
//                 <Box>
//                     {fileType === 'pdf' ? (
//                         <PDFDownloadLink
//                             document={
//                                 <MonthlyReportPDF
//                                     monthName={monthName}
//                                     marketData={marketData}
//                                     monthlySupplyData={monthlySupplyData}
//                                     permitData={permitData}
//                                     fishTypeData={fishTypeData}
//                                     selectedSections={Object.keys(selectedSections).filter(key => selectedSections[key])}
//                                 />
//                             }
//                             fileName={`monthly-report-${monthName.toLowerCase().replace(' ', '-')}.pdf`}
//                             style={{ textDecoration: 'none' }}
//                         >
//                             {({ loading: pdfLoading, error: pdfError }) => (
//                                 <Button
//                                     variant="contained"
//                                     disabled={pdfLoading}
//                                     color='success'
//                                     startIcon={pdfLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
//                                     sx={{
//                                         backgroundColor: theme.palette.success.main,
//                                         '&:hover': {
//                                             backgroundColor: theme.palette.success.dark,
//                                         }
//                                     }}
//                                 >
//                                     {pdfLoading ? 'Generating PDF...' : 'Download Report'}
//                                 </Button>
//                             )}
//                         </PDFDownloadLink>
//                     ) : (
//                         <Button
//                             variant="contained"
//                             onClick={exportToExcel}
//                             startIcon={<DownloadIcon />}
//                             color='success'
//                             sx={{
//                                 backgroundColor: theme.palette.success.main,
//                                 '&:hover': {
//                                     backgroundColor: theme.palette.success.dark,
//                                 }
//                             }}
//                         >
//                             Download Excel
//                         </Button>
//                     )}
//                 </Box>
//             );
        
//             if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;
//             if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
        
//             return (
//                 <Box sx={{ p: theme.spacing(3) }}>
//                     <Card elevation={2} sx={{ p: theme.spacing(3) }}>
//                         <Box sx={{ 
//                             display: 'flex',
//                             flexDirection: isMobile ? 'column' : 'row',
//                             justifyContent: 'space-between',
//                             alignItems: isMobile ? 'flex-start' : 'center',
//                             mb: 3,
//                             gap: 2
//                         }}>
//                             <Box>
//                                 <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
//                                     Monthly Report
//                                 </Typography>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <CalendarIcon color="action" />
//                                     <Typography variant="subtitle1" color="textSecondary">
//                                         {monthName}
//                                     </Typography>
//                                 </Box>
//                             </Box>
                            
//                             {/* New Export Options Section */}
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                                 <FormControl component="fieldset">
//                                     <FormLabel component="legend" color='#000000'>Export Format</FormLabel>
//                                     <RadioGroup
//                                         row
//                                         value={fileType}
//                                         onChange={(e) => setFileType(e.target.value)}
//                                     >
//                                         <FormControlLabel value="pdf"  control={<Radio sx={{color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },}} />} label="PDF" />
//                                         <FormControlLabel value="excel" control={<Radio sx={{color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },}} />} label="Excel" />
//                                     </RadioGroup>
//                                 </FormControl>
                                
//                                 <FormControl component="fieldset">
//                                     <FormLabel component="legend">Sections to Include</FormLabel>
//                                     <FormGroup row>
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedSections.monthlySupply}
//                                                     onChange={(e) => setSelectedSections(prev => ({
//                                                         ...prev,
//                                                         monthlySupply: e.target.checked
//                                                     }))}
//                                                     sx={{color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },}}
//                                                 />
//                                             }
//                                             label="Monthly Supply"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedSections.marketSupply}
//                                                     onChange={(e) => setSelectedSections(prev => ({
//                                                         ...prev,
//                                                         marketSupply: e.target.checked
//                                                     }))}
//                                                     sx={{color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },}}
//                                                 />
//                                             }
//                                             label="Market Supply"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedSections.permits}
//                                                     onChange={(e) => setSelectedSections(prev => ({
//                                                         ...prev,
//                                                         permits: e.target.checked
//                                                     }))}
//                                                     sx={{color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },}}
//                                                 />
//                                             }
//                                             label="Permits"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedSections.fishType}
//                                                     onChange={(e) => setSelectedSections(prev => ({
//                                                         ...prev,
//                                                         fishType: e.target.checked
//                                                     }))}
//                                                     sx={{color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },}}
//                                                 />
//                                             }
//                                             label="Fish Types"
//                                         />
//                                     </FormGroup>
//                                 </FormControl>
                                
//                                 <DownloadButton />
//                             </Box>
//                         </Box>

//                 <Grid container spacing={3}>
//                      {/* Monthly Supply Chart */}
//                     <Grid item xs={12}>
//                         <Card>
//                             <CardHeader 
//                                 title="Monthly Supply Trends"
//                                 sx={{
//                                     backgroundColor: theme.palette.grey[50],
//                                     borderBottom: `1px solid ${theme.palette.divider}`
//                                 }}
//                             />
//                             <CardContent>
//                                 <Box sx={{ height: 400, width: '100%' }}>
//                                     <ResponsiveContainer>
//                                         <LineChart data={monthlySupplyData}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis dataKey="month" />
//                                             <YAxis />
//                                             <Tooltip />
//                                             <Legend />
//                                             <Line 
//                                                 type="monotone"
//                                                 dataKey="supply" 
//                                                 stroke={colors.success}
//                                                 name="Supply (kg)"
//                                                 strokeWidth={2}
//                                             />
//                                         </LineChart>
//                                     </ResponsiveContainer>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>

//                     {/* Market Supply Chart */}
//                     <Grid item xs={12} md={6}>
//                         <Card>
//                             <CardHeader 
//                                 title="Market Supply by Source"
//                                 sx={{
//                                     backgroundColor: theme.palette.grey[50],
//                                     borderBottom: `1px solid ${theme.palette.divider}`
//                                 }}
//                             />
//                             <CardContent>
//                                 <Box sx={{ height: 400, width: '100%' }}>
//                                     <ResponsiveContainer>
//                                         <BarChart data={marketData}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis dataKey="source" />
//                                             <YAxis />
//                                             <Tooltip />
//                                             <Legend />
//                                             <Bar 
//                                                 dataKey="supply" 
//                                                 fill={colors.primary} 
//                                                 name="Supply (kg)"
//                                             />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>

//                     {/* Permit Statistics Chart */}
//                     <Grid item xs={12} md={6}>
//                         <Card>
//                             <CardHeader 
//                                 title="Permit Statistics"
//                                 sx={{
//                                     backgroundColor: theme.palette.grey[50],
//                                     borderBottom: `1px solid ${theme.palette.divider}`
//                                 }}
//                             />
//                             <CardContent>
//                                 <Box sx={{ height: 400, width: '100%' }}>
//                                     <ResponsiveContainer>
//                                         <BarChart data={permitChartData}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis dataKey="status" />
//                                             <YAxis />
//                                             <Tooltip />
//                                             <Legend />
//                                             <Bar 
//                                                 dataKey="value" 
//                                                 fill={colors.secondary} 
//                                                 name="Count"
//                                             />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>

//                     <Grid item xs={12}>
//                         <Card>
//                             <CardHeader 
//                                 title="Supply and Price by Fish Type"
//                                 sx={{
//                                     backgroundColor: theme.palette.grey[50],
//                                     borderBottom: `1px solid ${theme.palette.divider}`
//                                 }}
//                             />
//                             <CardContent>
//                                 <Box sx={{ height: 400, width: '100%' }}>
//                                     <ResponsiveContainer>
//                                         <ComposedChart data={fishTypeData}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis 
//                                                 dataKey="fishType" 
//                                                 angle={-45}
//                                                 textAnchor="end"
//                                                 height={70}
//                                             />
//                                             <YAxis 
//                                                 yAxisId="left"
//                                                 label={{ 
//                                                     value: 'Supply (kg)', 
//                                                     angle: -90, 
//                                                     position: 'insideLeft' 
//                                                 }}
//                                             />
//                                             <YAxis 
//                                                 yAxisId="right"
//                                                 orientation="right"
//                                                 label={{ 
//                                                     value: 'Average Price (₱)', 
//                                                     angle: 90, 
//                                                     position: 'insideRight' 
//                                                 }}
//                                             />
//                                             <Tooltip />
//                                             <Legend />
//                                             <Bar 
//                                                 yAxisId="left"
//                                                 dataKey="supply" 
//                                                 fill={colors.primary} 
//                                                 name="Supply (kg)"
//                                             />
//                                             <Line
//                                                 yAxisId="right"
//                                                 type="monotone"
//                                                 dataKey="avgPrice"
//                                                 stroke={colors.price}
//                                                 name="Average Price (₱)"
//                                                 strokeWidth={2}
//                                             />
//                                         </ComposedChart>
//                                     </ResponsiveContainer>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </Card>
//         </Box>
//     );
// };

// MonthlyReportPDF.propTypes = {
//     monthName: PropTypes.string.isRequired,
//     marketData: PropTypes.arrayOf(
//       PropTypes.shape({
//         source: PropTypes.string,
//         supply: PropTypes.number
//       })
//     ).isRequired,
//     monthlySupplyData: PropTypes.arrayOf(
//       PropTypes.shape({
//         month: PropTypes.string,
//         supply: PropTypes.number
//       })
//     ).isRequired,
//     permitData: PropTypes.shape({
//       approved: PropTypes.number,
//       rejected: PropTypes.number,
//       pending: PropTypes.number
//     }).isRequired,
//     fishTypeData: PropTypes.arrayOf(
//       PropTypes.shape({
//         fishType: PropTypes.string,
//         supply: PropTypes.number,
//         avgPrice: PropTypes.number,
//         count: PropTypes.number
//       })
//     ).isRequired
//   };
  
//   // MUI Download Button Component with data validation
//   const PDFDownloadButton = ({ data }) => {
//     const theme = createTheme();
  
//     // Validate required data
//     const isDataValid = data && 
//       data.monthName &&
//       Array.isArray(data.marketData) &&
//       Array.isArray(data.monthlySupplyData) &&
//       data.permitData &&
//       Array.isArray(data.fishTypeData);
  
//     if (!isDataValid) {
//       return (
//         <Box sx={{ display: 'inline-block' }}>
//           <Button
//             variant="contained"
//             disabled
//             startIcon={<DownloadIcon />}
//             sx={{
//               backgroundColor: theme.palette.error.main,
//               '&:hover': {
//                 backgroundColor: theme.palette.error.dark,
//               }
//             }}
//           >
//             Invalid Data
//           </Button>
//         </Box>
//       );
//     }
  
//     return (
//       <PDFDownloadLink
//         document={<MonthlyReportPDF {...data} />}
//         fileName={`monthly-report-${data.monthName.toLowerCase().replace(' ', '-')}.pdf`}
//         style={{ textDecoration: 'none' }}
//       >
//         {({ loading, error }) => (
//           <Box sx={{ display: 'inline-block' }}>
//             <Button
//               variant="contained"
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
//               sx={{
//                 backgroundColor: theme.palette.success.main,
//                 '&:hover': {
//                   backgroundColor: theme.palette.success.dark,
//                 },
//                 '&:disabled': {
//                   backgroundColor: theme.palette.action.disabledBackground,
//                 }
//               }}
//             >
//               {loading ? 'Generating PDF...' : 'Download Report'}
//             </Button>
//             {error && (
//               <Box sx={{ color: theme.palette.error.main, mt: 1 }}>
//                 Error generating PDF. Please try again.
//               </Box>
//             )}
//           </Box>
//         )}
//       </PDFDownloadLink>
//     );
//   };
  
//   // Add PropTypes for the Download Button Component
//   PDFDownloadButton.propTypes = {
//     data: PropTypes.shape({
//       monthName: PropTypes.string.isRequired,
//       marketData: PropTypes.array.isRequired,
//       monthlySupplyData: PropTypes.array.isRequired,
//       permitData: PropTypes.object.isRequired,
//       fishTypeData: PropTypes.array.isRequired
//     }).isRequired
//   };
  
//   // Add default props
//   PDFDownloadButton.defaultProps = {
//     data: {
//       monthName: '',
//       marketData: [],
//       monthlySupplyData: [],
//       permitData: { approved: 0, rejected: 0, pending: 0 },
//       fishTypeData: []
//     }
//   };

// export default Report;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardHeader,
//   CircularProgress,
//   Alert,
//   Button,
//   useTheme,
//   useMediaQuery,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   RadioGroup,
//   Radio,
//   FormControl,
//   FormLabel,
// } from '@mui/material';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   ComposedChart,
// } from 'recharts';
// import {
//   CalendarMonth as CalendarIcon,
//   Download as DownloadIcon,
// } from '@mui/icons-material';
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   PDFDownloadLink,
// } from '@react-pdf/renderer';
// import * as XLSX from 'xlsx';
// import PropTypes from 'prop-types';
// import { useAuthStore } from '../../store/store';

// // -----------------
// // PDF Styles
// // -----------------
// const pdfStyles = StyleSheet.create({
//   page: {
//     padding: 30,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 8,
//     color: '#1976d2',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 24,
//     color: 'rgba(0, 0, 0, 0.6)',
//     textAlign: 'center',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     marginBottom: 12,
//     color: '#1976d2',
//     backgroundColor: '#f5f5f5',
//     padding: 8,
//     borderRadius: 4,
//   },
//   table: {
//     display: 'table',
//     width: '100%',
//     marginBottom: 12,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(224, 224, 224, 1)',
//     borderBottomStyle: 'solid',
//     minHeight: 36,
//   },
//   tableHeader: {
//     backgroundColor: '#f5f5f5',
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 12,
//     padding: 8,
//     textAlign: 'left',
//     color: 'rgba(0, 0, 0, 0.87)',
//   },
//   tableCellHeader: {
//     flex: 1,
//     fontSize: 12,
//     padding: 8,
//     textAlign: 'left',
//     color: 'rgba(0, 0, 0, 0.87)',
//     fontWeight: 'bold',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     left: 30,
//     right: 30,
//     textAlign: 'center',
//     color: 'rgba(0, 0, 0, 0.6)',
//     fontSize: 10,
//   },
// });

// // -----------------
// // PDF Document Component
// // -----------------
// const MonthlyReportPDF = ({
//   monthName,
//   marketData,
//   monthlySupplyData,
//   permitData,
//   fishTypeData,
//   selectedSections,
// }) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       <View style={pdfStyles.header}>
//         <Text style={pdfStyles.title}>Monthly Report</Text>
//         <Text style={pdfStyles.subtitle}>{monthName}</Text>
//       </View>

//       {selectedSections.includes('monthlySupply') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Monthly Supply Trends</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Month</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//             </View>
//             {monthlySupplyData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.month}</Text>
//                 <Text style={pdfStyles.tableCell}>
//                   {item.supply.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                   })}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {selectedSections.includes('marketSupply') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Market Supply by Source</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Source</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//             </View>
//             {marketData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.source}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.supply}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {selectedSections.includes('permits') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Permit Statistics</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Status</Text>
//               <Text style={pdfStyles.tableCellHeader}>Count</Text>
//             </View>
//             {[
//               { status: 'Approved', count: permitData.approved },
//               { status: 'Rejected', count: permitData.rejected },
//               { status: 'Pending', count: permitData.pending },
//             ].map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.status}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.count}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {selectedSections.includes('fishType') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>
//             Supply and Price by Fish Type
//           </Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//               <Text style={pdfStyles.tableCellHeader}>Avg Price (₱)</Text>
//             </View>
//             {fishTypeData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.supply}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.avgPrice}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       <Text style={pdfStyles.footer}>
//         Generated on {new Date().toLocaleDateString()}
//       </Text>
//     </Page>
//   </Document>
// );

// MonthlyReportPDF.propTypes = {
//   monthName: PropTypes.string.isRequired,
//   marketData: PropTypes.arrayOf(
//     PropTypes.shape({
//       source: PropTypes.string,
//       supply: PropTypes.number,
//     })
//   ).isRequired,
//   monthlySupplyData: PropTypes.arrayOf(
//     PropTypes.shape({
//       month: PropTypes.string,
//       supply: PropTypes.number,
//     })
//   ).isRequired,
//   permitData: PropTypes.shape({
//     approved: PropTypes.number,
//     rejected: PropTypes.number,
//     pending: PropTypes.number,
//   }).isRequired,
//   fishTypeData: PropTypes.arrayOf(
//     PropTypes.shape({
//       fishType: PropTypes.string,
//       supply: PropTypes.number,
//       avgPrice: PropTypes.number,
//       count: PropTypes.number,
//     })
//   ).isRequired,
//   selectedSections: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

// // -----------------
// // Main Report Component
// // -----------------
// const Report = () => {
//   const [marketData, setMarketData] = useState([]);
//   const [permitData, setPermitData] = useState({
//     approved: 0,
//     rejected: 0,
//     pending: 0,
//   });
//   const [monthlySupplyData, setMonthlySupplyData] = useState([]);
//   const [fishTypeData, setFishTypeData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Section selection and file type states
//   const [selectedSections, setSelectedSections] = useState({
//     monthlySupply: true,
//     marketSupply: true,
//     permits: true,
//     fishType: true,
//   });
//   const [fileType, setFileType] = useState('pdf');

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const { auth } = useAuthStore();

//   const colors = {
//     primary: '#2C3E50',
//     secondary: '#3498DB',
//     success: '#27AE60',
//     warning: '#F39C12',
//     error: '#E74C3C',
//     background: '#ECF0F1',
//     price: '#E67E22',
//   };

//   const getPreviousMonthDates = () => {
//     const now = new Date();
//     const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
//     const startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
//     const endDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
//     return {
//       startDate,
//       endDate,
//       monthName: prevMonth.toLocaleString('default', {
//         month: 'long',
//         year: 'numeric',
//       }),
//     };
//   };

//   const { monthName } = getPreviousMonthDates();

//   // -----------------
//   // Excel Export Function
//   // -----------------
//   const exportToExcel = () => {
//     const workbook = XLSX.utils.book_new();

//     if (selectedSections.monthlySupply) {
//       const monthlySupplySheet = XLSX.utils.json_to_sheet(monthlySupplyData);
//       XLSX.utils.book_append_sheet(workbook, monthlySupplySheet, 'Monthly Supply');
//     }

//     if (selectedSections.marketSupply) {
//       const marketDataSheet = XLSX.utils.json_to_sheet(marketData);
//       XLSX.utils.book_append_sheet(workbook, marketDataSheet, 'Market Supply');
//     }

//     if (selectedSections.permits) {
//       const permitDataSheet = XLSX.utils.json_to_sheet([permitData]);
//       XLSX.utils.book_append_sheet(workbook, permitDataSheet, 'Permits');
//     }

//     if (selectedSections.fishType) {
//       const fishTypeSheet = XLSX.utils.json_to_sheet(fishTypeData);
//       XLSX.utils.book_append_sheet(workbook, fishTypeSheet, 'Fish Types');
//     }

//     XLSX.writeFile(
//       workbook,
//       `monthly-report-${monthName.toLowerCase().replace(' ', '-')}.xlsx`
//     );
//   };

//   // -----------------
//   // Data Fetching
//   // -----------------
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const headers = {
//           Authorization: `Bearer ${auth.token}`,
//           'Content-Type': 'application/json',
//         };
//         const [
//           marketResponse,
//           monthlySupplyResponse,
//           permitResponse,
//           fishTypeResponse,
//         ] = await Promise.all([
//           fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-source`),
//           fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/monthly`, { headers }),
//           fetch(`${import.meta.env.VITE_BASE_URL}/api/permit-stats`),
//           fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-fish`),
//         ]);

//         const [
//           marketResult,
//           monthlySupplyResult,
//           permitStats,
//           fishTypeResult,
//         ] = await Promise.all([
//           marketResponse.json(),
//           monthlySupplyResponse.json(),
//           permitResponse.json(),
//           fishTypeResponse.json(),
//         ]);

//         setMarketData(marketResult[0]?.data || []);
//         setMonthlySupplyData(processMonthlyData(monthlySupplyResult[0]?.data || []));
//         setPermitData(permitStats);
//         setFishTypeData(fishTypeResult[0]?.data || []);
//       } catch (err) {
//         setError('Failed to fetch report data');
//         console.error('Error fetching report data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const processMonthlyData = (data) => {
//     const months = [
//       'Jan',
//       'Feb',
//       'Mar',
//       'Apr',
//       'May',
//       'Jun',
//       'Jul',
//       'Aug',
//       'Sep',
//       'Oct',
//       'Nov',
//       'Dec',
//     ];

//     return months.map((month) => {
//       const monthData = data.find((item) => {
//         const itemDate = new Date(item.month);
//         return months[itemDate.getMonth()] === month;
//       });

//       return {
//         month,
//         supply: monthData ? Number(monthData.supply.toFixed(2)) : 0,
//       };
//     });
//   };

//   const permitChartData = [
//     { status: 'Approved', value: permitData.approved },
//     { status: 'Rejected', value: permitData.rejected },
//     { status: 'Pending', value: permitData.pending },
//   ];

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ m: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   // -----------------
//   // Download Button Component
//   // -----------------
//   const DownloadButton = () => (
//     <Box>
//       {fileType === 'pdf' ? (
//         <PDFDownloadLink
//           document={
//             <MonthlyReportPDF
//               monthName={monthName}
//               marketData={marketData}
//               monthlySupplyData={monthlySupplyData}
//               permitData={permitData}
//               fishTypeData={fishTypeData}
//               selectedSections={Object.keys(selectedSections).filter(
//                 (key) => selectedSections[key]
//               )}
//             />
//           }
//           fileName={`monthly-report-${monthName.toLowerCase().replace(' ', '-')}.pdf`}
//           style={{ textDecoration: 'none' }}
//         >
//           {({ loading: pdfLoading, error: pdfError }) => (
//             <Button
//               variant="contained"
//               disabled={pdfLoading}
//               color='success'
//               startIcon={pdfLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
//               sx={{
//                 backgroundColor: theme.palette.success.main,
//                 '&:hover': {
//                   backgroundColor: theme.palette.success.dark,
//                 },
//               }}
//             >
//               {pdfLoading ? 'Generating PDF...' : 'Download Report'}
//             </Button>
//           )}
//         </PDFDownloadLink>
//       ) : (
//         <Button
//           variant="contained"
//           onClick={exportToExcel}
//           color='success'
//           startIcon={<DownloadIcon />}
//           sx={{
//             backgroundColor: theme.palette.success.main,
//             '&:hover': {
//               backgroundColor: theme.palette.success.dark,
//             },
//           }}
//         >
//           Download Excel
//         </Button>
//       )}
//     </Box>
//   );

//   return (
//     <Box sx={{ p: theme.spacing(3) }}>
//       <Card elevation={2} sx={{ p: theme.spacing(3) }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: isMobile ? 'column' : 'row',
//             justifyContent: 'space-between',
//             alignItems: isMobile ? 'flex-start' : 'center',
//             mb: 3,
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Monthly Report
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <CalendarIcon color="action" />
//               <Typography variant="subtitle1" color="textSecondary">
//                 {monthName}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Export Options */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <FormControl component="fieldset" >
//               <FormLabel component="legend" color='#000000' sx={{color: '#000000'}}>Export Format</FormLabel>
//               <RadioGroup
//                 row
//                 value={fileType}
//                 onChange={(e) => setFileType(e.target.value)}
//               >
//                 <FormControlLabel value="pdf" control={<Radio sx={{color: 'primary', // Unchecked color
//                         '&.Mui-checked': {
//                         color: 'green', // Checked color
//                         },}} />} label="PDF" />
//                 <FormControlLabel value="excel" control={<Radio sx={{color: 'primary', // Unchecked color
//                         '&.Mui-checked': {
//                         color: 'green', // Checked color
//                         },}} />} label="Excel" />
//               </RadioGroup>
//             </FormControl>

//             <FormControl component="fieldset">
//               <FormLabel component="legend" color='#000000' sx={{color: '#000000'}}>Sections to Include</FormLabel>
//               <FormGroup row>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedSections.monthlySupply}
//                       onChange={(e) =>
//                         setSelectedSections((prev) => ({
//                           ...prev,
//                           monthlySupply: e.target.checked,
//                         }))
//                       }
//                       sx={{color: 'primary', // Unchecked color
//                         '&.Mui-checked': {
//                         color: 'green', // Checked color
//                         },}}
//                     />
//                   }
//                   label="Monthly Supply"
//                 />
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedSections.marketSupply}
//                       onChange={(e) =>
//                         setSelectedSections((prev) => ({
//                           ...prev,
//                           marketSupply: e.target.checked,
//                         }))
//                       }
//                       sx={{color: 'primary', // Unchecked color
//                         '&.Mui-checked': {
//                         color: 'green', // Checked color
//                         },}}
//                     />
//                   }
//                   label="Market Supply"
//                 />
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedSections.permits}
//                       onChange={(e) =>
//                         setSelectedSections((prev) => ({
//                           ...prev,
//                           permits: e.target.checked,
//                         }))
//                       }
//                       sx={{color: 'primary', // Unchecked color
//                         '&.Mui-checked': {
//                         color: 'green', // Checked color
//                         },}}
//                     />
//                   }
//                   label="Permits"
//                 />
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedSections.fishType}
//                       onChange={(e) =>
//                         setSelectedSections((prev) => ({
//                           ...prev,
//                           fishType: e.target.checked,
//                         }))
//                       }
//                       sx={{color: 'primary', // Unchecked color
//                         '&.Mui-checked': {
//                         color: 'green', // Checked color
//                         },}}
//                     />
//                   }
//                   label="Fish Types"
//                 />
//               </FormGroup>
//             </FormControl>

//             <DownloadButton />
//           </Box>
//         </Box>

//         {/* Report Charts (Rendered only on-screen) */}
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Card>
//               <CardHeader
//                 title="Monthly Supply Trends"
//                 sx={{
//                   backgroundColor: theme.palette.grey[50],
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 }}
//               />
//               <CardContent>
//                 <Box sx={{ height: 400, width: '100%' }}>
//                   <ResponsiveContainer>
//                     <LineChart data={monthlySupplyData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="supply"
//                         stroke={colors.success}
//                         name="Supply (kg)"
//                         strokeWidth={2}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardHeader
//                 title="Market Supply by Source"
//                 sx={{
//                   backgroundColor: theme.palette.grey[50],
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 }}
//               />
//               <CardContent>
//                 <Box sx={{ height: 400, width: '100%' }}>
//                   <ResponsiveContainer>
//                     <BarChart data={marketData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="source" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar
//                         dataKey="supply"
//                         fill={colors.primary}
//                         name="Supply (kg)"
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardHeader
//                 title="Permit Statistics"
//                 sx={{
//                   backgroundColor: theme.palette.grey[50],
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 }}
//               />
//               <CardContent>
//                 <Box sx={{ height: 400, width: '100%' }}>
//                   <ResponsiveContainer>
//                     <BarChart data={permitChartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="status" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar
//                         dataKey="value"
//                         fill={colors.secondary}
//                         name="Count"
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12}>
//             <Card>
//               <CardHeader
//                 title="Supply and Price by Fish Type"
//                 sx={{
//                   backgroundColor: theme.palette.grey[50],
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 }}
//               />
//               <CardContent>
//                 <Box sx={{ height: 400, width: '100%' }}>
//                   <ResponsiveContainer>
//                     <ComposedChart data={fishTypeData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis
//                         dataKey="fishType"
//                         angle={-45}
//                         textAnchor="end"
//                         height={70}
//                       />
//                       <YAxis
//                         yAxisId="left"
//                         label={{
//                           value: 'Supply (kg)',
//                           angle: -90,
//                           position: 'insideLeft',
//                         }}
//                       />
//                       <YAxis
//                         yAxisId="right"
//                         orientation="right"
//                         label={{
//                           value: 'Average Price (₱)',
//                           angle: 90,
//                           position: 'insideRight',
//                         }}
//                       />
//                       <Tooltip />
//                       <Legend />
//                       <Bar
//                         yAxisId="left"
//                         dataKey="supply"
//                         fill={colors.primary}
//                         name="Supply (kg)"
//                       />
//                       <Line
//                         yAxisId="right"
//                         type="monotone"
//                         dataKey="avgPrice"
//                         stroke={colors.price}
//                         name="Average Price (₱)"
//                         strokeWidth={2}
//                       />
//                     </ComposedChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Card>
//     </Box>
//   );
// };

// export default Report;

import React, { useState, useEffect } from 'react';
import domtoimage from 'dom-to-image';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../store/store';

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return '#2ca02c'; // Green
    case 'Pending':
      return '#ff7f0e'; // Orange
    default:
      return '#ffffff'; // Default purple
  }
};

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
}

// -----------------
// PDF Styles
// -----------------
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#1976d2',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 224, 224, 1)',
    borderBottomStyle: 'solid',
    minHeight: 36,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    padding: 8,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 12,
    padding: 8,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});
// const pdfStyles = StyleSheet.create({
//   page: {
//     padding: 30,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 8,
//     color: '#1976d2',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 24,
//     color: 'rgba(0, 0, 0, 0.6)',
//     textAlign: 'center',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     marginBottom: 12,
//     color: '#1976d2',
//     backgroundColor: '#f5f5f5',
//     padding: 8,
//     borderRadius: 4,
//   },
//   table: {
//     display: 'table',
//     width: '100%',
//     marginBottom: 12,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(224, 224, 224, 1)',
//     borderBottomStyle: 'solid',
//     minHeight: 36,
//   },
//   tableHeader: {
//     backgroundColor: '#f5f5f5',
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 12,
//     padding: 8,
//     textAlign: 'left',
//     color: 'rgba(0, 0, 0, 0.87)',
//   },
//   tableCellHeader: {
//     flex: 1,
//     fontSize: 12,
//     padding: 8,
//     textAlign: 'left',
//     color: 'rgba(0, 0, 0, 0.87)',
//     fontWeight: 'bold',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     left: 30,
//     right: 30,
//     textAlign: 'center',
//     color: 'rgba(0, 0, 0, 0.6)',
//     fontSize: 10,
//   },
// });

// -----------------
// PDF Document Component
// -----------------
// const MonthlyReportPDF = ({
//   monthName,
//   marketData,
//   monthlySupplyData,
//   permitData,
//   fishTypeData,
//   demandData,
//   selectedSections,
// }) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       <View style={pdfStyles.header}>
//         <Text style={pdfStyles.title}>Monthly Report</Text>
//         <Text style={pdfStyles.subtitle}>{monthName}</Text>
//       </View>

//       {selectedSections.includes('monthlySupply') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Monthly Supply Trends</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Month</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//             </View>
//             {monthlySupplyData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.month}</Text>
//                 <Text style={pdfStyles.tableCell}>
//                   {item.supply.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                   })}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {selectedSections.includes('marketSupply') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Market Supply by Source</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Source</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//             </View>
//             {marketData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.source}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.supply}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {selectedSections.includes('permits') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Permit Statistics</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Status</Text>
//               <Text style={pdfStyles.tableCellHeader}>Count</Text>
//             </View>
//             {[
//               { status: 'Approved', count: permitData.approved },
//               { status: 'Rejected', count: permitData.rejected },
//               { status: 'Pending', count: permitData.pending },
//             ].map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.status}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.count}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {selectedSections.includes('fishType') && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>
//             Supply and Price by Fish Type
//           </Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//               <Text style={pdfStyles.tableCellHeader}>Avg Price (₱)</Text>
//             </View>
//             {fishTypeData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.supply}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.avgPrice}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}
//       {selectedSections.includes('demand') && (
//           <View style={pdfStyles.section}>
//             <Text style={pdfStyles.sectionTitle}>Daily Market Demand</Text>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//                 <Text style={pdfStyles.tableCellHeader}>Municipality</Text>
//                 <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
//                 <Text style={pdfStyles.tableCellHeader}>Daily Demand (kg)</Text>
//               </View>
//               {demandData.map((item, index) => (
//                 <View key={index} style={pdfStyles.tableRow}>
//                   <Text style={pdfStyles.tableCell}>{item.municipality}</Text>
//                   <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
//                   <Text style={pdfStyles.tableCell}>{item.dailyDemand}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//           )}

//       <Text style={pdfStyles.footer}>
//         Generated on {new Date().toLocaleDateString()}
//       </Text>
//     </Page>
//   </Document>
// );
// const MonthlyReportPDF = ({
//   monthName,
//   marketData,
//   monthlySupplyData,
//   permitData,
//   fishTypeData,
//   demandData,
//   selectedSections,
// }) => (
//   <Document>
//     {/* Cover Page */}
//     <Page size="A4" style={pdfStyles.page}>
//       <View style={pdfStyles.header}>
//         <Text style={pdfStyles.title}>Monthly Report</Text>
//         <Text style={pdfStyles.subtitle}>{monthName}</Text>
//       </View>
//       <Text style={pdfStyles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
//     </Page>

//     {/* Monthly Supply Page */}
//     {selectedSections.includes('monthlySupply') && (
//       <Page size="A4" style={pdfStyles.page}>
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Monthly Supply Trends</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Month</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//             </View>
//             {monthlySupplyData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.month}</Text>
//                 <Text style={pdfStyles.tableCell}>
//                   {item.supply.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                   })}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>
//         <Text style={pdfStyles.pageNumber}>Page 2</Text>
//       </Page>
//     )}

//     {/* Market Supply Page */}
//     {selectedSections.includes('marketSupply') && (
//       <Page size="A4" style={pdfStyles.page}>
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Market Supply by Source</Text>

//           {chartDataUrl && (
//         <Image
//           style={pdfStyles.chart} // Define styling for the chart image (width, height, margin, etc.)
//           src={chartDataUrl}
//         />
//       )}
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Source</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//             </View>
//             {marketData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.source}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.supply}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//         <Text style={pdfStyles.pageNumber}>Page 3</Text>
//       </Page>
//     )}

//     {/* Permits Page */}
//     {selectedSections.includes('permits') && (
//       <Page size="A4" style={pdfStyles.page}>
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Permit Statistics</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Status</Text>
//               <Text style={pdfStyles.tableCellHeader}>Count</Text>
//             </View>
//             {[
//               { status: 'Approved', count: permitData.approved },
              
//               { status: 'Pending', count: permitData.pending },
//             ].map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.status}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.count}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//         <Text style={pdfStyles.pageNumber}>Page 4</Text>
//       </Page>
//     )}

//     {/* Fish Type Page */}
//     {selectedSections.includes('fishType') && (
//       <Page size="A4" style={pdfStyles.page}>
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Supply and Price by Fish Type</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
//               <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
//               <Text style={pdfStyles.tableCellHeader}>Avg Price (₱)</Text>
//             </View>
//             {fishTypeData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.supply}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.avgPrice}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//         <Text style={pdfStyles.pageNumber}>Page 5</Text>
//       </Page>
//     )}

//     {/* Demand Data Page */}
//     {selectedSections.includes('demand') && (
//       <Page size="A4" style={pdfStyles.page}>
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.sectionTitle}>Daily Market Demand</Text>
//           <View style={pdfStyles.table}>
//             <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
//               <Text style={pdfStyles.tableCellHeader}>Municipality</Text>
//               <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
//               <Text style={pdfStyles.tableCellHeader}>Daily Demand (kg)</Text>
//             </View>
//             {demandData.map((item, index) => (
//               <View key={index} style={pdfStyles.tableRow}>
//                 <Text style={pdfStyles.tableCell}>{item.municipality}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
//                 <Text style={pdfStyles.tableCell}>{item.dailyDemand}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//         <Text style={pdfStyles.pageNumber}>Page 6</Text>
//       </Page>
//     )}
//   </Document>
// );

// MonthlyReportPDF.propTypes = {
//   monthName: PropTypes.string.isRequired,
//   marketData: PropTypes.arrayOf(
//     PropTypes.shape({
//       source: PropTypes.string,
//       supply: PropTypes.number,
//     })
//   ).isRequired,
//   monthlySupplyData: PropTypes.arrayOf(
//     PropTypes.shape({
//       month: PropTypes.string,
//       supply: PropTypes.number,
//     })
//   ).isRequired,
//   permitData: PropTypes.shape({
//     approved: PropTypes.number,
    
//     pending: PropTypes.number,
//   }).isRequired,
//   fishTypeData: PropTypes.arrayOf(
//     PropTypes.shape({
//       fishType: PropTypes.string,
//       supply: PropTypes.number,
//       avgPrice: PropTypes.number,
//       count: PropTypes.number,
//     })
//   ).isRequired,
//   selectedSections: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

// -----------------
// Main Report Component
// -----------------
const Report = () => {
  const [marketData, setMarketData] = useState([]);
  const [demandData, setDemandData] = useState([]);
  const [permitData, setPermitData] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [monthlySupplyData, setMonthlySupplyData] = useState([]);
  const [fishTypeData, setFishTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartDataUrl, setChartDataUrl] = useState(null);

  // Section selection and file type states
  const [selectedSections, setSelectedSections] = useState({
    monthlySupply: true,
    marketSupply: true,
    permits: true,
    fishType: true,
    demand: true,
  });
  const [fileType, setFileType] = useState('pdf');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { auth } = useAuthStore();

  const colors = {
    primary: '#2C3E50',
    secondary: '#3498DB',
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    background: '#ECF0F1',
    price: '#E67E22',
  };

  const getPreviousMonthDates = () => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    const endDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    return {
      startDate,
      endDate,
      monthName: prevMonth.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
    };
  };

  const { monthName } = getPreviousMonthDates();

  const captureChartImage = () => {
    const node = document.getElementById('chart-container');
    if (node) {
      domtoimage.toPng(node)
        .then((dataUrl) => setChartDataUrl(dataUrl))
        .catch((error) => console.error('Error capturing chart:', error));
    }
  };

  const MonthlyReportPDF = ({
    monthName,
    marketData,
    monthlySupplyData,
    permitData,
    fishTypeData,
    demandData,
    selectedSections,
  }) => (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>Monthly Report</Text>
          <Text style={pdfStyles.subtitle}>{monthName}</Text>
        </View>
        <Text style={pdfStyles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
      </Page>
  
      {/* Monthly Supply Page */}
      {selectedSections.includes('monthlySupply') && (
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Monthly Supply Trends</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCellHeader}>Month</Text>
                <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
              </View>
              {monthlySupplyData.map((item, index) => (
                <View key={index} style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>{item.month}</Text>
                  <Text style={pdfStyles.tableCell}>
                    {item.supply.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={pdfStyles.pageNumber}>Page 2</Text>
        </Page>
      )}
  
      {/* Market Supply Page */}
      {selectedSections.includes('marketSupply') && (
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Market Supply by Source</Text>
  
            {chartDataUrl && (
          <Image
            style={pdfStyles.chart} // Define styling for the chart image (width, height, margin, etc.)
            src={chartDataUrl}
          />
        )}
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCellHeader}>Source</Text>
                <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
              </View>
              {marketData.map((item, index) => (
                <View key={index} style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>{item.source}</Text>
                  <Text style={pdfStyles.tableCell}>{item.supply}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={pdfStyles.pageNumber}>Page 3</Text>
        </Page>
      )}
  
      {/* Permits Page */}
      {selectedSections.includes('permits') && (
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Permit Statistics</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCellHeader}>Status</Text>
                <Text style={pdfStyles.tableCellHeader}>Count</Text>
              </View>
              {[
                { status: 'Approved', count: permitData.approved },
                
                { status: 'Pending', count: permitData.pending },
              ].map((item, index) => (
                <View key={index} style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>{item.status}</Text>
                  <Text style={pdfStyles.tableCell}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={pdfStyles.pageNumber}>Page 4</Text>
        </Page>
      )}
  
      {/* Fish Type Page */}
      {selectedSections.includes('fishType') && (
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Supply and Price by Fish Type</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
                <Text style={pdfStyles.tableCellHeader}>Supply (kg)</Text>
                <Text style={pdfStyles.tableCellHeader}>Avg Price (₱)</Text>
              </View>
              {fishTypeData.map((item, index) => (
                <View key={index} style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
                  <Text style={pdfStyles.tableCell}>{item.supply}</Text>
                  <Text style={pdfStyles.tableCell}>{item.avgPrice}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={pdfStyles.pageNumber}>Page 5</Text>
        </Page>
      )}
  
      {/* Demand Data Page */}
      {selectedSections.includes('demand') && (
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Daily Market Demand</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCellHeader}>Municipality</Text>
                <Text style={pdfStyles.tableCellHeader}>Fish Type</Text>
                <Text style={pdfStyles.tableCellHeader}>Daily Demand (kg)</Text>
              </View>
              {demandData.map((item, index) => (
                <View key={index} style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>{item.municipality}</Text>
                  <Text style={pdfStyles.tableCell}>{item.fishType}</Text>
                  <Text style={pdfStyles.tableCell}>{item.dailyDemand}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={pdfStyles.pageNumber}>Page 6</Text>
        </Page>
      )}
    </Document>
  );
  
  MonthlyReportPDF.propTypes = {
    monthName: PropTypes.string.isRequired,
    marketData: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string,
        supply: PropTypes.number,
      })
    ).isRequired,
    monthlySupplyData: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string,
        supply: PropTypes.number,
      })
    ).isRequired,
    permitData: PropTypes.shape({
      approved: PropTypes.number,
      
      pending: PropTypes.number,
    }).isRequired,
    fishTypeData: PropTypes.arrayOf(
      PropTypes.shape({
        fishType: PropTypes.string,
        supply: PropTypes.number,
        avgPrice: PropTypes.number,
        count: PropTypes.number,
      })
    ).isRequired,
    selectedSections: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  useEffect(() => {
    // Call captureChartImage after the chart has rendered
    captureChartImage();
  }, [marketData]);

  // -----------------
  // Excel Export Function
  // -----------------
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    if (selectedSections.monthlySupply) {
      const monthlySupplySheet = XLSX.utils.json_to_sheet(monthlySupplyData);
      XLSX.utils.book_append_sheet(workbook, monthlySupplySheet, 'Monthly Supply');
    }

    if (selectedSections.marketSupply) {
      const marketDataSheet = XLSX.utils.json_to_sheet(marketData);
      XLSX.utils.book_append_sheet(workbook, marketDataSheet, 'Market Supply');
    }

    if (selectedSections.permits) {
      const permitDataSheet = XLSX.utils.json_to_sheet([permitData]);
      XLSX.utils.book_append_sheet(workbook, permitDataSheet, 'Permits');
    }

    if (selectedSections.fishType) {
      const fishTypeSheet = XLSX.utils.json_to_sheet(fishTypeData);
      XLSX.utils.book_append_sheet(workbook, fishTypeSheet, 'Fish Types');
    }

    if (selectedSections.demand) {
      const demandSheet = XLSX.utils.json_to_sheet(
        demandData.map(item => ({
          Municipality: item.municipality,
          'Fish Type': item.fishType,
          'Daily Demand (kg)': item.dailyDemand
        }))
      );
      XLSX.utils.book_append_sheet(workbook, demandSheet, 'Daily Demand');
    }

    XLSX.writeFile(
      workbook,
      `monthly-report-${monthName.toLowerCase().replace(' ', '-')}.xlsx`
    );
  };

  useEffect(() => {
    const fetchDemandData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        };
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/local-demand`,
          { headers }
        );
        const data = await response.json();
        setDemandData(data);
      } catch (err) {
        setError('Failed to fetch demand data');
        console.error('Error fetching demand data:', err);
      }
    };

    fetchDemandData();
  }, []);

  // -----------------
  // Data Fetching
  // -----------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        };
        const [
          marketResponse,
          monthlySupplyResponse,
          permitResponse,
          fishTypeResponse,
        ] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-source`),
          fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/monthly`, { headers }),
          fetch(`${import.meta.env.VITE_BASE_URL}/api/permit-stats`),
          fetch(`${import.meta.env.VITE_BASE_URL}/api/supply/by-fish`),
        ]);

        const [
          marketResult,
          monthlySupplyResult,
          permitStats,
          fishTypeResult,
        ] = await Promise.all([
          marketResponse.json(),
          monthlySupplyResponse.json(),
          permitResponse.json(),
          fishTypeResponse.json(),
        ]);

        setMarketData(marketResult[0]?.data || []);
        setMonthlySupplyData(processMonthlyData(monthlySupplyResult[0]?.data || []));
        setPermitData(permitStats);
        setFishTypeData(fishTypeResult[0]?.data || []);
      } catch (err) {
        setError('Failed to fetch report data');
        console.error('Error fetching report data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processMonthlyData = (data) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months.map((month) => {
      const monthData = data.find((item) => {
        const itemDate = new Date(item.month);
        return months[itemDate.getMonth()] === month;
      });

      return {
        month,
        supply: monthData ? Number(monthData.supply.toFixed(2)) : 0,
      };
    });
  };

  const permitChartData = [
    { status: 'Approved', value: permitData.approved },
   
    { status: 'Pending', value: permitData.pending },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  // -----------------
  // Download Button Component
  // -----------------
  const DownloadButton = () => (
    <Box>
      {fileType === 'pdf' ? (
        <PDFDownloadLink
          document={
            <MonthlyReportPDF
              monthName={monthName}
              marketData={marketData}
              monthlySupplyData={monthlySupplyData}
              permitData={permitData}
              fishTypeData={fishTypeData}
              demandData={demandData}
              selectedSections={Object.keys(selectedSections).filter(
                (key) => selectedSections[key]
              )}
            />
          }
          fileName={`monthly-report-${monthName.toLowerCase().replace(' ', '-')}.pdf`}
          style={{ textDecoration: 'none' }}
        >
          {({ loading: pdfLoading, error: pdfError }) => (
            <Button
              variant="contained"
              disabled={pdfLoading}
              color='success'
              startIcon={pdfLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
              sx={{
                backgroundColor: theme.palette.success.main,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark,
                },
              }}
            >
              {pdfLoading ? 'Generating PDF...' : 'Download Report'}
            </Button>
          )}
        </PDFDownloadLink>
      ) : (
        <Button
          variant="contained"
          onClick={exportToExcel}
          color='success'
          startIcon={<DownloadIcon />}
          sx={{
            backgroundColor: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
            },
          }}
        >
          Download Excel
        </Button>
      )}
    </Box>
  );

  

  return (
    <Box sx={{ p: theme.spacing(3) }}>
      <Card elevation={2} sx={{ p: theme.spacing(3) }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Monthly Report
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="action" />
              <Typography variant="subtitle1" color="textSecondary">
                {monthName}
              </Typography>
            </Box>
          </Box>

          {/* Export Options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl component="fieldset" >
              <FormLabel component="legend" color='#000000' sx={{color: '#000000'}}>Export Format</FormLabel>
              <RadioGroup
                row
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <FormControlLabel value="pdf" control={<Radio sx={{color: 'primary', // Unchecked color
                        '&.Mui-checked': {
                        color: 'green', // Checked color
                        },}} />} label="PDF" />
                <FormControlLabel value="excel" control={<Radio sx={{color: 'primary', // Unchecked color
                        '&.Mui-checked': {
                        color: 'green', // Checked color
                        },}} />} label="Excel" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend" color='#000000' sx={{color: '#000000'}}>Sections to Include</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSections.monthlySupply}
                      onChange={(e) =>
                        setSelectedSections((prev) => ({
                          ...prev,
                          monthlySupply: e.target.checked,
                        }))
                      }
                      sx={{color: 'primary', // Unchecked color
                        '&.Mui-checked': {
                        color: 'green', // Checked color
                        },}}
                    />
                  }
                  label="Monthly Supply"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSections.marketSupply}
                      onChange={(e) =>
                        setSelectedSections((prev) => ({
                          ...prev,
                          marketSupply: e.target.checked,
                        }))
                      }
                      sx={{color: 'primary', // Unchecked color
                        '&.Mui-checked': {
                        color: 'green', // Checked color
                        },}}
                    />
                  }
                  label="Market Supply"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSections.permits}
                      onChange={(e) =>
                        setSelectedSections((prev) => ({
                          ...prev,
                          permits: e.target.checked,
                        }))
                      }
                      sx={{color: 'primary', // Unchecked color
                        '&.Mui-checked': {
                        color: 'green', // Checked color
                        },}}
                    />
                  }
                  label="Permits"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSections.fishType}
                      onChange={(e) =>
                        setSelectedSections((prev) => ({
                          ...prev,
                          fishType: e.target.checked,
                        }))
                      }
                      sx={{color: 'primary', // Unchecked color
                        '&.Mui-checked': {
                        color: 'green', // Checked color
                        },}}
                    />
                  }
                  label="Fish Types"
                />
                <FormControlLabel
          control={
            <Checkbox
              checked={selectedSections.demand}
              onChange={(e) =>
                setSelectedSections((prev) => ({
                  ...prev,
                  demand: e.target.checked,
                }))
              }
              sx={{
                color: 'primary',
                '&.Mui-checked': {
                  color: 'green',
                },
              }}
            />
          }
          label="Daily Demand"
        />
              </FormGroup>
            </FormControl>

            <DownloadButton />
          </Box>
        </Box>

        {/* Report Charts (Rendered only on-screen) */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Monthly Supply Trends"
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              />
              <CardContent>
                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer>
                    <LineChart data={monthlySupplyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="supply"
                        stroke={colors.success}
                        name="Supply (kg)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Fish Supply by Municipality"
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              />
              <CardContent id='chart-container'>
                <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={marketData}
                                  dataKey="supply"
                                  nameKey="source"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={150}
                                  innerRadius={80}
                                  paddingAngle={2}
                                >
                                  {marketData.map((entry, index) => (
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Permit Statistics"
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              />
              <CardContent>
                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer>
                    <PieChart>
                    <Pie
                      data={permitChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="status"
                    >
                      {permitChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                  </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Supply and Price by Fish Type"
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              />
              {/* <CardContent>
                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer>
                    <ComposedChart data={fishTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="fishType"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: 'Supply (kg)',
                          angle: -90,
                          position: 'insideLeft',
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: 'Average Price (₱)',
                          angle: 90,
                          position: 'insideRight',
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="supply"
                        fill={colors.primary}
                        name="Supply (kg)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgPrice"
                        stroke={colors.price}
                        name="Average Price (₱)"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent> */}
              <CardContent>
                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer>
                    <LineChart data={fishTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="fishType"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: 'Supply (kg)',
                          angle: -90,
                          position: 'insideLeft',
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: 'Average Price (₱)',
                          angle: 90,
                          position: 'insideRight',
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="supply"
                        stroke={colors.primary}
                        name="Supply (kg)"
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgPrice"
                        stroke={colors.price}
                        name="Average Price (₱)"
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title="Daily Market Demand"
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Municipality</TableCell>
                        <TableCell>Fish Type</TableCell>
                        <TableCell align="right">Daily Demand (kg)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {demandData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.municipality}</TableCell>
                          <TableCell>{row.fishType}</TableCell>
                          <TableCell align="right">
                            {row.dailyDemand.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Report;