// import React, { useState, useEffect } from 'react';
// import { Box, TextField, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Typography, TablePagination } from '@mui/material';
// import { useTheme } from '@mui/material';
// import { getMarketData } from '../../states/api.js'; // Fetch market data
// import MarketDemand from '../../components/MarketDemand.jsx';
// import Header from '../../components/Header.jsx';
// import { m } from 'framer-motion';

// const Market = () => {
//     const theme = useTheme();
//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // Pagination states
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(20);

//     // Filter states
//     const [selectedSource, setSelectedSource] = useState('');
//     const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // Default to the current month

//     useEffect(() => {
//         // Fetch market data when the component mounts
//         const fetchData = async () => {
//             try {
//               const permitData = await getMarketData(); // Fetch the data from the API
//               const sortedData = (permitData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
//               setData(sortedData); // Set the sorted data to state
//             } catch (error) {
//               console.error('Failed to fetch permit data:', error);
//             } finally {
//               setIsLoading(false); // Stop loading indicator
//             }
//           };
          

//         fetchData();
//     }, []);

//     const columns = [
//         { id: 'name', name: 'Fisher Name' },
//         { id: 'fishType', name: 'Fish Name' },
//         { id: 'source', name: 'Municipality' },
//         { id: 'price', name: 'Price' },
//         { id: 'weight', name: 'Weight (kgs)' },
//         { id: 'date', name: 'Date' },
//         { id: 'time', name: 'Time' },
//       ];

//     // Filtering logic
//     const filterData = (data) => {
//         return data.filter((item) => {
//             const itemDate = new Date(item.date).toISOString().substring(0, 7); // Format to YYYY-MM
//             const matchesSource = selectedSource ? item.source === selectedSource : true;
//             const matchesMonth = itemDate === selectedMonth;
//             return matchesSource && matchesMonth;
//         });
//     };

//     // Paginate filtered data
//     const paginatedData = filterData(data).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     // Date formatting function
//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     return (
//         <Box m="1rem 2.5rem" mt="20px" width="74vw">
//             <Header title="MARKET SUPPLY" subtitle="List of Supply" />

//             {/* Filter Options */}
//             <Box
//                 m={2}
//                 display="flex"
//                 justifyContent="space-around"
//                 alignItems="center"
//                 gap={2}
//                 p={1}
//                 borderRadius="8px"
//                 bgcolor={theme.palette.background.paper}
//             >
//                 {/* Source Filter on the Left */}
//                 <TextField
//                     label="Source"
//                     select
//                     value={selectedSource}
//                     onChange={(e) => setSelectedSource(e.target.value)}
//                     size="small" // Compact design
//                     variant="outlined"
//                     sx={{ minWidth: '200px' }} // Control width
//                 >
//                     <MenuItem value="">All</MenuItem>
//                     <MenuItem value="Boac">Boac</MenuItem>
//                     <MenuItem value="Mogpog">Mogpog</MenuItem>
//                     <MenuItem value="Gasan">Gasan</MenuItem>
//                     <MenuItem value="Buenavista">Buenavista</MenuItem>
//                     <MenuItem value="Torrijos">Torrijos</MenuItem>
//                     <MenuItem value="Sta Cruz">Sta Cruz</MenuItem>
//                 </TextField>

//                 {/* Monthly Filter on the Right */}
//                 <TextField
//                     label="Month"
//                     type="month"
//                     value={selectedMonth}
//                     onChange={(e) => setSelectedMonth(e.target.value)}
//                     size="small" // Compact design
//                     variant="outlined"
//                     sx={{ minWidth: '200px', textAlign: 'right' }} // Control width
//                 />
//                 <MarketDemand />
//             </Box>

//             {/* Data Display */}
//             {isLoading ? (
//                 <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//                     <CircularProgress />
//                 </Box>
//             ) : paginatedData.length === 0 ? (
//                 <Typography variant="h6" align="center" color="textSecondary">
//                     No data available
//                 </Typography>
//             ) : (
//                 <Box>
//                     <TableContainer component={Paper} style={{ flexGrow: 1, maxHeight: '60vh', overflowY: 'auto' }}>
//                         <Table stickyHeader>
//                             <TableHead>
//                                 <TableRow>
//                                     {columns.map((column) => (
//                                         <TableCell key={column.id} sx={{ backgroundColor: theme.palette.secondary[200], color: 'white' }}>
//                                             {column.name}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {paginatedData.map((row) => (
//                                     <TableRow key={row._id}>
//                                         {columns.map((column) => (
//                                             <TableCell key={column.id}>
//                                                 {column.id === 'date' ? formatDate(row[column.id])  : column.id === 'time' // Time formatting
//                                                 ? new Date('1970-01-01T' + row[column.id] + 'Z').toLocaleTimeString([], 
//                                                 { hour: '2-digit', minute: '2-digit', hour12: true })
//                                                 : row[column.id]}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     <TablePagination
//                         component="div"
//                         count={filterData(data).length}
//                         page={page}
//                         onPageChange={(event, newPage) => setPage(newPage)}
//                         rowsPerPage={rowsPerPage}
//                         onRowsPerPageChange={(event) => {
//                             setRowsPerPage(parseInt(event.target.value, 10));
//                             setPage(0);
//                         }}
//                         rowsPerPageOptions={[5, 10, 20]}
//                     />
//                 </Box>
//             )}
//         </Box>
//     );
// };

// export default Market;


// import React, { useState, useEffect } from 'react';
// import { 
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   IconButton,
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import { ChevronLeft, ChevronRight } from '@mui/icons-material';
// import Header from '../../components/Header';
// import MarketDemand from '../../components/MarketDemand.jsx';
// import { getData } from '../../states/api.js';
// import { useAuthStore } from '../../store/store';
// const Market = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const token = useAuthStore((state) => state.auth.token);
//   const role = useAuthStore((state) => state.auth.role);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedSource, setSelectedSource] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
//   const isAuthenticated = !!token;

// const [notification, setNotification] = useState({
//       open: false,
//       message: '',
//       severity: 'success'
//     });

// useEffect(() => {
//     const fetchData = async () => {
//         try {
//             if (!isAuthenticated) {
//                 window.location.href = '/login';
//                 return;
//             }

//             setIsLoading(true);
//             const permitData = await getData();
//             console.log('Received data:', permitData);
            
//             const sortedData = (permitData || []).sort((a, b) =>
//                 new Date(b.createdAt) - new Date(a.createdAt)
//             );
//             setData(sortedData);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setNotification({
//                 open: true,
//                 message: 'Failed to load data',
//                 severity: 'error'
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     fetchData();
// }, [isAuthenticated]);
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setIsLoading(true);
//   //       const marketData = await getMarketData();
//   //       const sortedData = (marketData || []).sort((a, b) => 
//   //         new Date(b.createdAt) - new Date(a.createdAt)
//   //       );
//   //       setData(sortedData);
        
//   //     } catch (error) {
//   //       console.error('Failed to fetch market data:', error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   if (token && role === 'BFAR') {
//   //     fetchData();
//   //   }
//   // }, [token, role]);

//   const filterData = (data) => {
//     return data.filter((item) => {
//       const itemDate = new Date(item.date).toISOString().substring(0, 7);
//       const matchesSource = selectedSource ? item.source === selectedSource : true;
//       const matchesMonth = itemDate === selectedMonth;
//       return matchesSource && matchesMonth;
//     });
//   };

//   const paginatedData = filterData(data).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
//   const totalPages = Math.ceil(filterData(data).length / rowsPerPage);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString(undefined, {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Determine which columns to show based on screen size
//   const columns = [
//     { id: 'name', name: 'Fisher Name', always: true },
//     { id: 'fishType', name: 'Fish Name', always: true },
//     { id: 'source', name: 'Municipality', always: true },
//     { id: 'price', name: 'Price', always: true },
//     { id: 'weight', name: 'Weight (kgs)', minWidth: 'sm' },
//     { id: 'date', name: 'Date', minWidth: 'md' },
//     { id: 'time', name: 'Time', minWidth: 'md' }
//   ];

//   const visibleColumns = columns.filter(col => 
//     col.always || 
//     (col.minWidth === 'sm' && !isMobile) || 
//     (col.minWidth === 'md' && !isTablet)
//   );

//   return (
//     <Box sx={{ 
//       p: { xs: 1, sm: 2, md: 3 },
//       maxWidth: '100vw',
//       overflow: 'hidden'
//     }}>
//       <Header title="MARKET SUPPLY" subtitle="List of Supply" />

//       <Card elevation={3} sx={{ mt: 2, mb: 4, width: {
//       xs: '100%', // Full width on mobile
//       sm: '95%',  // Slightly smaller on tablet
//       md: '77vw'  // Your desired width on desktop
//         },
//         mx: 'auto',   // Center the card
//         overflow: 'hidden' }}>
//         <CardContent>
//           {/* Filters */}
//           <Box sx={{
//             display: 'flex',
//             flexDirection: { xs: 'column', sm: 'row' },
//             gap: 2,
//             mb: 3,
//             alignItems: { xs: 'stretch', sm: 'center' },
//             justifyContent: 'space-between'
//           }}>
//             <TextField
//               select
//               label="Municipality"
//               value={selectedSource}
//               onChange={(e) => setSelectedSource(e.target.value)}
//               fullWidth
//               sx={{ maxWidth: { sm: '200px' } }}
//             >
//               <MenuItem value="">All</MenuItem>
//               {['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta Cruz'].map(source => (
//                 <MenuItem key={source} value={source}>{source}</MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               type="month"
//               label="Month"
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//               fullWidth
//               sx={{ maxWidth: { sm: '200px' } }}
//             />

//             <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//               <MarketDemand />
//             </Box>
//           </Box>

//           {/* Table */}
//           <TableContainer component={Paper} sx={{ 
//             maxHeight: '60vh',
//             overflow: 'auto',
//             backgroundColor: theme.palette.background.default
//           }}>
//             {isLoading ? (
//               <Box display="flex" justifyContent="center" alignItems="center" p={4}>
//                 <CircularProgress />
//               </Box>
//             ) : paginatedData.length === 0 ? (
//               <Box p={4}>
//                 <Typography variant="h6" align="center" color="textSecondary">
//                   No data available
//                 </Typography>
//               </Box>
//             ) : (
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     {visibleColumns.map((column) => (
//                       <TableCell
//                         key={column.id}
//                         sx={{
//                           backgroundColor: '#2C3E50',
//                           color: 'white',
//                           whiteSpace: 'nowrap'
//                         }}
//                       >
//                         {column.name}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paginatedData.map((row) => (
//                     <TableRow 
//                       key={row._id}
//                       hover
//                       sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                     >
//                       {visibleColumns.map((column) => (
//                         <TableCell key={column.id}>
//                           {column.id === 'date' ? formatDate(row[column.id]) :
//                            column.id === 'time' ? new Date('1970-01-01T' + row[column.id] + 'Z')
//                              .toLocaleTimeString([], { 
//                                hour: '2-digit', 
//                                minute: '2-digit', 
//                                hour12: true 
//                              }) :
//                            column.id === 'price' ? `₱${row[column.id]}` : column.id === 'weight' ? `${row[column.id]} kg's` :
//                            row[column.id]}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </TableContainer>

//           {/* Pagination */}
//           <Box sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mt: 2,
//             flexWrap: 'wrap',
//             gap: 1
//           }}>
//             <Typography variant="body2" color="text.secondary">
//               Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filterData(data).length)} of {filterData(data).length} entries
//             </Typography>
            
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <IconButton 
//                 onClick={() => setPage(p => Math.max(0, p - 1))}
//                 disabled={page === 0}
//                 size="small"
//               >
//                 <ChevronLeft />
//               </IconButton>
//               <IconButton
//                 onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
//                 disabled={page >= totalPages - 1}
//                 size="small"
//               >
//                 <ChevronRight />
//               </IconButton>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Market;

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Header from '../../components/Header';
import MarketDemand from '../../components/MarketDemand.jsx';
import { getData } from '../../states/api.js';
import { useAuthStore } from '../../store/store';

const Market = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const token = useAuthStore((state) => state.auth.token);
  const role = useAuthStore((state) => state.auth.role);
  // Assume that for LGU users, the username represents their municipality.
  const username = useAuthStore((state) => state.auth.username);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  // For non-LGU users, this state lets you select a municipality from a dropdown.
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7)
  );
  const isAuthenticated = !!token;

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated) {
          window.location.href = '/login';
          return;
        }

        setIsLoading(true);
        const permitData = await getData();
        console.log('Received data:', permitData);
        
        const sortedData = (permitData || []).sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({
          open: true,
          message: 'Failed to load data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Filter the data based on month and municipality.
  // For LGU users, automatically filter by the username.
  const filterData = (data) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date).toISOString().substring(0, 7);
      const matchesMonth = itemDate === selectedMonth;
      const matchesSource =
        role === 'LGU'
          ? item.source === username
          : selectedSource
          ? item.source === selectedSource
          : true;
      return matchesMonth && matchesSource;
    });
  };

  const paginatedData = filterData(data).slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const totalPages = Math.ceil(filterData(data).length / rowsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine which columns to show based on screen size
  const columns = [
    { id: 'name', name: 'Fisher Name', always: true },
    { id: 'fishType', name: 'Fish Name', always: true },
    { id: 'source', name: 'Municipality', always: true },
    { id: 'price', name: 'Price', always: true },
    { id: 'weight', name: 'Weight (kgs)', minWidth: 'sm' },
    { id: 'date', name: 'Date', minWidth: 'md' },
    { id: 'time', name: 'Time', minWidth: 'md' }
  ];

  const visibleColumns = columns.filter(col =>
    col.always ||
    (col.minWidth === 'sm' && !isMobile) ||
    (col.minWidth === 'md' && !isTablet)
  );

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <Header title="MARKET SUPPLY" subtitle="List of Supply" />

      <Card
        elevation={3}
        sx={{
          mt: 2,
          mb: 4,
          width: {
            xs: '100%', // Full width on mobile
            sm: '95%',  // Slightly smaller on tablet
            md: '77vw'  // Your desired width on desktop
          },
          mx: 'auto',   // Center the card
          overflow: 'hidden'
        }}
      >
        <CardContent>
          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between'
            }}
          >
            {role === 'LGU' ? (
              // For LGU, show a disabled field with the municipality (username)
              <TextField
                label="Municipality"
                value={username}
                fullWidth
                disabled
                sx={{ maxWidth: { sm: '200px' } }}
              />
            ) : (
              // For non-LGU, show the municipality dropdown filter.
              <TextField
                select
                label="Municipality"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                fullWidth
                sx={{ maxWidth: { sm: '200px' } }}
              >
                <MenuItem value="">All</MenuItem>
                {['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta Cruz'].map(
                  (source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  )
                )}
              </TextField>
            )}

            <TextField
              type="month"
              label="Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              fullWidth
              sx={{ maxWidth: { sm: '200px' } }}
            />

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <MarketDemand />
            </Box>
          </Box>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: '60vh',
              overflow: 'auto',
              backgroundColor: theme.palette.background.default
            }}
          >
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
              </Box>
            ) : paginatedData.length === 0 ? (
              <Box p={4}>
                <Typography variant="h6" align="center" color="textSecondary">
                  No data available
                </Typography>
              </Box>
            ) : (
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          backgroundColor: '#2C3E50',
                          color: 'white',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {column.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === 'date'
                            ? formatDate(row[column.id])
                            : column.id === 'time'
                            ? new Date('1970-01-01T' + row[column.id] + 'Z').toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })
                            : column.id === 'price'
                            ? `₱${row[column.id]}`
                            : column.id === 'weight'
                            ? `${row[column.id]} kg's`
                            : row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1} to{' '}
              {Math.min((page + 1) * rowsPerPage, filterData(data).length)} of{' '}
              {filterData(data).length} entries
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                size="small"
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                size="small"
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Market;
