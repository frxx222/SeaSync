//   import React, { useState, useEffect } from 'react';
//   import {
//     Paper, Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Box, TablePagination, Button, Dialog,
//     DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem
//   } from '@mui/material';
//   import { useTheme } from '@mui/material/styles';
//   import { postData, getData, deleteData } from '../../states/api.js';
//   import DeleteIcon from '@mui/icons-material/Delete';
//   import CreateIcon from '@mui/icons-material/Create';
// import { green, red } from '@mui/material/colors';

//   const Fish = () => {
//     const theme = useTheme();
//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(20);

//     // Form state
//     const [name, setName] = useState('');
//     const [fishType, setFishType] = useState('');
//     const [source, setSource] = useState('');
//     const [price, setPrice] = useState('');
//     const [weight, setWeight] = useState('');
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//   const [permitId, setPermitId] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const permitData = await getData(); // Fetch the data from the API
//           const sortedData = (permitData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
//           setData(sortedData); // Set the sorted data to state
//         } catch (error) {
//           console.error('Failed to fetch permit data:', error);
//         } finally {
//           setIsLoading(false); // Stop loading indicator
//         }
//       };
      

//       fetchData();
//     }, []);

//     const columns = [
//       { id: 'name', name: 'Fisher Name' },
//       { id: 'fishType', name: 'Fish Name' },
//       { id: 'source', name: 'Municipality' },
//       { id: 'price', name: 'Price' },
//       { id: 'weight', name: 'Weight (kgs)' },
//       { id: 'date', name: 'Date' },
//       { id: 'time', name: 'Time' },
//       { id: 'actions', name: 'ACTIONS' },
//     ];

//     const resetForm = () => {
//       setName('');
//       setFishType('');
//       setSource('');
//       setPrice('');
//       setWeight('');
//       setDate('');
//       setTime('');
//       setPermitId(null);
//     };
//     const handleSubmit = async () => {
//       const permitObj = { name, fishType, source, price, weight, date, time };
    
//       try {
//         if (permitId) {
//           // Update permit
//           await postData(permitObj, permitId);
//         } else {
//           // Create new permit
//           await postData(permitObj);
//         }
    
//         // Fetch updated data after submit
//         const updatedData = await getData(); // Fetch the data again after submit
//         const sortedData = (updatedData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
    
//         // Update the state with the sorted data
//         setData(sortedData);
//         resetForm(); // Reset the form
//       } catch (error) {
//         console.error('Failed to submit permit:', error);
//       }
//     };
    

//     const handleOpenDialog = (permit = null) => {
//       if (permit) {
//         setFishType(permit.fishType);
//         setSource(permit.source);
//         setPrice(permit.price);
//         setWeight(permit.weight);
//         setPermitId(permit._id);
//       } else {
//         resetForm();
//       }
//       setOpenDialog(true);
//     };

//     const handleCloseDialog = () => {
//       setOpenDialog(false);
//       resetForm();
//     };

//     const handleDelete = async (id) => {
//       try {
//         await deleteData(id);
//         const updatedData = await getData();
//         setData(updatedData);
//       } catch (error) {
//         console.error('Failed to delete permit:', error);
//       }
//     };

//     const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//       <Box m="3rem 2rem" width="76vw">
//         {/* Add Permit Button */}
//         <Button
//           variant="contained"
//           sx={{ mb: 3, mt: 3, color: 'white', backgroundColor: "green" }}
//           onClick={() => handleOpenDialog()}
//         >
//           Add Data
//         </Button>

//         {/* Dialog Form */}
//         <Dialog 
//           open={openDialog} 
//           onClose={handleCloseDialog} 
//           fullWidth 
//           maxWidth="xs" // Even smaller width for mobile devices
//           PaperProps={{
//             style: { margin: '16px' }, // Adds margin for better spacing on smaller devices
//           }}
//         >
//           <DialogTitle>{'Add Data'}</DialogTitle>
//           <DialogContent style={{ overflowY: 'auto', maxHeight: '70vh' }}>
//             <TextField
//               label="Fisher Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//             />
//             <TextField
//               label="Fish Name"
//               select
//               value={fishType}
//               onChange={(e) => setFishType(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//             >
//               <MenuItem value="Galunggong">Galunggong</MenuItem>
//               <MenuItem value="Tulingan">Tulingan</MenuItem>
//               <MenuItem value="Gulyasan">Gulyasan</MenuItem>
//               <MenuItem value="Dilis">Dilis</MenuItem>
//               <MenuItem value="Dalagang-Bukid">Dalagang-Bukid</MenuItem>
//               <MenuItem value="Tunsoy">Tunsoy</MenuItem>
//               <MenuItem value="Tambakol">Tambakol</MenuItem>
//               <MenuItem value="Maya-maya">Maya-maya</MenuItem>
//               <MenuItem value="Dried Fish">Dried Fish</MenuItem>
//             </TextField>
//             <TextField
//               label="Source"
//               select
//               value={source}
//               onChange={(e) => setSource(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//             >
//               <MenuItem value="Boac">Boac</MenuItem>
//               <MenuItem value="Mogpog">Mogpog</MenuItem>
//               <MenuItem value="Gasan">Gasan</MenuItem>
//               <MenuItem value="Buenavista">Buenavista</MenuItem>
//               <MenuItem value="Torrijos">Torrijos</MenuItem>
//               <MenuItem value="Sta Cruz">Sta Cruz</MenuItem>
//             </TextField>
//             <TextField
//               label="Price"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//             />
//             <TextField
//               label="Weight (kgs)"
//               type="number"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//             />
//             <TextField
//               label="Date"
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               label="Time"
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               fullWidth
//               margin="dense"
//               variant="outlined"
//               InputLabelProps={{ shrink: true }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} color="secondary">
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: theme.palette.secondary[200], color: 'white' }}>
//               {permitId ? 'Update' : 'Submit'}
//             </Button>
//           </DialogActions>
//         </Dialog>


//         <TableContainer 
//     component={Paper} 
//     style={{ flexGrow: 1, maxHeight: '60vh', overflowX: 'auto' }} // Horizontal scrolling for mobile
//   >
//     <Table stickyHeader>
//       <TableHead>
//         <TableRow>
//           {columns.map((column) => (
//             <TableCell 
//               key={column.id} 
//               align="left" 
//               sx={{
//                 backgroundColor: "#074799",
//                 color: 'white',
//                 fontSize: '0.9rem', // Adjust font size for responsiveness
//                 padding: '8px', // Reduce padding
//               }}
//             >
//               {column.name}
//             </TableCell>
//           ))}
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {!isLoading && paginatedData.length > 0 && paginatedData.map((row) => (
//           <TableRow key={row._id}>
//             {columns.map((column) => (
//               <TableCell 
//                 key={column.id} 
//                 align="left" 
//                 sx={{
//                   fontSize: '0.85rem', // Adjust font size
//                   padding: '8px', // Reduce padding
//                 }}
//               >
//                 {column.id !== 'actions' 
//                   ? column.id === 'date' 
//                     ? new Date(row[column.id]).toLocaleDateString('en-GB') // Date formatting
//                     : column.id === 'time' // Time formatting
//                       ? new Date('1970-01-01T' + row[column.id] + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
//                       : row[column.id]
//                   : (
//                     <Box display="flex">
//                       <IconButton onClick={() => handleDelete(row._id)} size="small" color="error">
//                         <DeleteIcon />
//                       </IconButton>
//                     </Box>
//                   )}
//               </TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>

//         <TablePagination
//           component="div"
//           count={data.length}
//           page={page}
//           onPageChange={(event, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(event) => {
//             setRowsPerPage(parseInt(event.target.value, 10));
//             setPage(0);
//           }}
//           rowsPerPageOptions={[5, 10, 20]}
//         />
//       </Box>
//     );
//   };

//   export default Fish;



import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  MenuItem,
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { postData, getData, deleteData } from '../../states/api.js';
import { useAuthStore } from '../../store/store';

const colors = {
  primary: '#1a237e', // Deep indigo
  secondary: '#0277bd', // Light blue
  success: '#2e7d32', // Green
  error: '#c62828', // Red
  warning: '#ef6c00', // Orange
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
    hover: '#f3f6f9'
  },
  text: {
    primary: '#1a237e',
    secondary: '#455a64'
  },
  headerGradient: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
};

const Fish = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const token = useAuthStore((state) => state.auth.token);
    const isAuthenticated = !!token;

   const [notification, setNotification] = useState({
      open: false,
      message: '',
      severity: 'success'
    });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    fishType: '',
    source: '',
    price: '',
    weight: '',
    date: '',
    time: '',
    permitId: null
  });

  const fishTypes = [
    "Galunggong", "Tulingan", "Gulyasan", "Dilis",
    "Dalagang-Bukid", "Tunsoy", "Tambakol", "Maya-maya", "Dried Fish"
  ];

  const municipalities = [
    "Boac", "Mogpog", "Gasan", "Buenavista", "Torrijos", "StaCruz"
  ];

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

  useEffect(() => {
    console.log('Current token:', token); // Add this to debug
    console.log('Is authenticated:', isAuthenticated);
  }, [token, isAuthenticated]);

  // Add this to your Fish component
useEffect(() => {
  const currentAuth = useAuthStore.getState().auth;
  console.log('Current auth state:', currentAuth);
}, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const permitData = await getData();
  //       const sortedData = (permitData || []).sort((a, b) => 
  //         new Date(b.createdAt) - new Date(a.createdAt)
  //       );
  //       setData(sortedData);
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error);
  //       setNotification({
  //         open: true,
  //         message: 'Failed to load data',
  //         severity: 'error'
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fishType: '',
      source: '',
      price: '',
      weight: '',
      date: '',
      time: '',
      permitId: null
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmit = async () => {
    try {
        if (!token) {
            setNotification({
                open: true,
                message: 'Please login first',
                severity: 'error'
            });
            window.location.href = '/login';
            return;
        }

        if (formData.permitId) {
            await postData(formData, formData.permitId);
        } else {
            await postData(formData);
        }

        const updatedData = await getData();
        const sortedData = (updatedData || []).sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedData);
        setOpenDialog(false);
        resetForm();
        
        setNotification({
            open: true,
            message: 'Submitted successfully',
            severity: 'success'
        });
    } catch (error) {
        console.error('Failed to submit:', error);
        setNotification({
            open: true,
            message: error.response?.data?.message || 'Failed to submit',
            severity: 'error'
        });
    }
};

const handleDelete = async (id) => {
  try {
      // Add confirmation before delete
      if (window.confirm('Are you sure you want to delete this record?')) {
          await deleteData(id);
          const updatedData = await getData();
          const sortedData = (updatedData || []).sort((a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          );
          setData(sortedData);
          setNotification({
              open: true,
              message: 'Record deleted successfully',
              severity: 'success'
          });
      }
  } catch (error) {
      console.error('Failed to delete:', error);
      setNotification({
          open: true,
          message: 'Failed to delete record',
          severity: 'error'
      });
  }
};


  const filteredData = data.filter(item =>
  (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
  (item.fishType?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
  (item.source?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
);


  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    { id: 'name', label: 'Fisher Name', minWidth: 120 },
    { id: 'fishType', label: 'Fish Type', minWidth: 120 },
    { id: 'source', label: 'Municipality', minWidth: 120, hide: isMobile },
    { id: 'price', label: 'Price', minWidth: 100, format: (value) => `₱${value}` },
    { id: 'weight', label: 'Weight (kg)', minWidth: 100, hide: isMobile },
    { id: 'time', label: 'Time', minWidth: 100, hide: isMobile },
    { id: 'date', label: 'Date', minWidth: 120, hide: isMobile,
      format: (value) => new Date(value).toLocaleDateString() },
    { id: 'actions', label: 'Actions', minWidth: 100 }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%', my: 5 }}>
      {/* Header Section */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          placeholder="Search records..."
          variant="outlined"
          size="small"
          fullWidth={isMobile}
          sx={{ maxWidth: { sm: '300px' } }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          fullWidth={isMobile}
          sx={{ 
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' }
          }}
        >
          Add New Record
        </Button>
      </Stack>

      {/* Table Section */}
      <Paper sx={{ mt: 2, mb: 4, width: {
      xs: '100%', // Full width on mobile
      sm: '95%',  // Slightly smaller on tablet
      md: '77vw'  // Your desired width on desktop
        },
        mx: 'auto',   // Center the card
        overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  !column.hide && (
                    <TableCell
                      key={column.id}
                      align="left"
                      sx={{
                        minWidth: column.minWidth,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  )
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && paginatedData.map((row) => (
                <TableRow hover key={row._id}>
                  {columns.map((column) => {
                    if (column.hide) return null;
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id}>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      );
                    }
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id}>
                        {/* {column.format ? column.format(value) : value} */}
                        {column.id === 'date' ? formatDate(row[column.id]) :
                           column.id === 'time' ? new Date('1970-01-01T' + row[column.id] + 'Z')
                             .toLocaleTimeString([], { 
                               hour: '2-digit', 
                               minute: '2-digit', 
                               hour12: true 
                             }) :
                           column.id === 'price' ? `₱${row[column.id]}` : column.id === 'weight' ? `${row[column.id]} kg's` :
                           row[column.id]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {formData.permitId ? 'Edit Record' : 'Add New Record'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Fisher Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              select
              fullWidth
              label="Fish Type"
              name="fishType"
              value={formData.fishType}
              onChange={handleInputChange}
            >
              {fishTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Municipality"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
            >
              {municipalities.map(municipality => (
                <MenuItem key={municipality} value={municipality}>{municipality}</MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color='error'>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="success"
          >
            {formData.permitId ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
              open={notification.open}
              autoHideDuration={2000}
              onClose={() => setNotification({ ...notification, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert 
                severity={notification.severity} 
                variant="filled"
                sx={{
                  backgroundColor: notification.severity === 'success' ? colors.success : colors.error,
                }}
              >
                {notification.message}
              </Alert>
            </Snackbar>
    </Box>
  );
};

export default Fish;