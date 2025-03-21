// import React, { useState, useEffect } from 'react';
// import {
//     Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Box, Typography, Chip, IconButton, Grid, Card, CardContent,
//     TextField, InputAdornment, TablePagination, Tooltip, CircularProgress
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';
// import UpdateIcon from '@mui/icons-material/Update';
// import ToggleOnIcon from '@mui/icons-material/ToggleOn';
// import ToggleOffIcon from '@mui/icons-material/ToggleOff';
// import { getAutomatedDemands, updateDemandStatus } from '../../states/api.js';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     backgroundColor: '#2C3E50',
//     color: 'white',
//     fontWeight: 'bold',
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//     marginBottom: theme.spacing(3),
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     borderRadius: '12px',
//     border: '1px solid #2C3E50',
// }));

// const AutomatedDemand = () => {
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [stats, setStats] = useState({
//         totalDemand: 0,
//         averageConfidence: 0,
//         activeMunicipalities: 0
//     });

//     useEffect(() => {
//         fetchData();
//     }, []);

//     useEffect(() => {
//         const filtered = data.filter(item =>
//             Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredData(filtered);
//         calculateStats(filtered);
//     }, [searchTerm, data]);

//     const calculateStats = (dataSet) => {
//         const totalDemand = dataSet.reduce((sum, item) => sum + item.forecastedDemand, 0);
//         const avgConfidence = dataSet.reduce((sum, item) => sum + item.confidenceLevel, 0) / (dataSet.length || 1);
//         const uniqueMunicipalities = new Set(dataSet.map(item => item.municipality)).size;

//         setStats({
//             totalDemand: totalDemand.toFixed(2),
//             averageConfidence: (avgConfidence * 100).toFixed(1),
//             activeMunicipalities: uniqueMunicipalities
//         });
//     };

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const response = await getAutomatedDemands();
//             setData(response);
//             setFilteredData(response);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleToggleStatus = async (id, currentStatus) => {
//         try {
//             const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
//             await updateDemandStatus(id, { status: newStatus });
//             await fetchData();
//         } catch (error) {
//             console.error('Error updating status:', error);
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <Box sx={{ padding: 3 }}>
//             <Grid container spacing={3} sx={{ marginBottom: 3 }}>
//                 <Grid item xs={12} md={4}>
//                     <StyledCard>
//                         <CardContent>
//                             <Typography variant="h6">Total Forecasted Demand</Typography>
//                             <Typography variant="h4">{stats.totalDemand} kg</Typography>
//                         </CardContent>
//                     </StyledCard>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                     <StyledCard>
//                         <CardContent>
//                             <Typography variant="h6">Average Confidence</Typography>
//                             <Typography variant="h4">{stats.averageConfidence}%</Typography>
//                         </CardContent>
//                     </StyledCard>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                     <StyledCard>
//                         <CardContent>
//                             <Typography variant="h6">Active Municipalities</Typography>
//                             <Typography variant="h4">{stats.activeMunicipalities}</Typography>
//                         </CardContent>
//                     </StyledCard>
//                 </Grid>
//             </Grid>

//             <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
//                 <TextField
//                     size="small"
//                     placeholder="Search..."
//                     variant="outlined"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                                 <SearchIcon />
//                             </InputAdornment>
//                         ),
//                     }}
//                 />
//                 <Tooltip title="Refresh Data">
//                     <IconButton onClick={fetchData}>
//                         <UpdateIcon />
//                     </IconButton>
//                 </Tooltip>
//             </Box>

//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <StyledTableCell>Municipality</StyledTableCell>
//                             <StyledTableCell>Fish Type</StyledTableCell>
//                             <StyledTableCell>Forecasted Demand</StyledTableCell>
//                             <StyledTableCell>Confidence</StyledTableCell>
//                             <StyledTableCell>Last Updated</StyledTableCell>
//                             <StyledTableCell>Status</StyledTableCell>
//                             <StyledTableCell>Actions</StyledTableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading ? (
//                             <TableRow>
//                                 <TableCell colSpan={7} align="center">
//                                     <CircularProgress />
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             filteredData
//                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                 .map((row) => (
//                                     <TableRow key={row._id}>
//                                         <TableCell>{row.municipality}</TableCell>
//                                         <TableCell>{row.fishType}</TableCell>
//                                         <TableCell>{row.forecastedDemand.toFixed(2)} kg</TableCell>
//                                         <TableCell>
//                                             <Chip
//                                                 label={`${(row.confidenceLevel * 100).toFixed(1)}%`}
//                                                 color={row.confidenceLevel > 0.7 ? 'success' : 'warning'}
//                                                 size="small"
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             {new Date(row.lastUpdated).toLocaleString()}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Chip
//                                                 label={row.status}
//                                                 color={row.status === 'Active' ? 'success' : 'default'}
//                                                 size="small"
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             <Tooltip title={`Toggle ${row.status === 'Active' ? 'Inactive' : 'Active'}`}>
//                                                 <IconButton
//                                                     onClick={() => handleToggleStatus(row._id, row.status)}
//                                                     color={row.status === 'Active' ? 'primary' : 'default'}
//                                                 >
//                                                     {row.status === 'Active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
//                                                 </IconButton>
//                                             </Tooltip>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                         )}
//                     </TableBody>
//                 </Table>
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={filteredData.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </TableContainer>
//         </Box>
//     );
// };

// export default AutomatedDemand;



import React, { useState, useEffect } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    TablePagination, MenuItem, Typography, Alert, Snackbar, Chip,
    InputAdornment, CircularProgress, Tooltip, Grid, Card, CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button, useTheme, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ArchiveIcon from '@mui/icons-material/Archive';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { postDemand, getDemand, deleteDemand,  updateDemand } from '../../states/api.js';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#2C3E50',
    color: 'white',
    fontWeight: 'bold',
    '&:first-of-type': {
        borderTopLeftRadius: '8px',
    },
    '&:last-of-type': {
        borderTopRightRadius: '8px',
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    border: '1px solid #2C3E50',
}));

const colors = {
    primary: '#1a237e', // Deep indigo
    secondary: '#0277bd', // Light blue
    success: '#2e7d32', // Green
    error: '#c62828', // Red
    warning: '#ef6c00', // Orange
  };

const Permit = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMunicipality, setFilterMunicipality] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    const [notification, setNotification] = useState({
          open: false,
          message: '',
          severity: 'success'
        });

    const [newRecord, setNewRecord] = useState({
        municipality: '',
        fishType: '',
        dailyDemand: '',
        monthlyDemand: '',
        date: '',
        time: '',
        status: 'Active'
    });

    // Summary statistics state
    const [stats, setStats] = useState({
        totalRecords: 0,
        totalDailyDemand: 0,
        averageMonthlyDemand: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item => {
            const matchesSearch = Object.values(item)
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesMunicipality = !filterMunicipality || item.municipality === filterMunicipality;
            const matchesArchiveState = showArchived ? item.archived : !item.archived;
            return matchesSearch && matchesMunicipality && matchesArchiveState;
        });
        setFilteredData(filtered);
        calculateStats(filtered);
    }, [searchTerm, filterMunicipality, data, showArchived]);

    const calculateStats = (dataSet) => {
        const totalDailyDemand = dataSet.reduce((sum, item) => sum + parseFloat(item.dailyDemand || 0), 0);
        const averageMonthlyDemand = dataSet.reduce((sum, item) => sum + parseFloat(item.monthlyDemand || 0), 0) / (dataSet.length || 1);
        
        setStats({
            totalRecords: dataSet.length,
            totalDailyDemand: totalDailyDemand.toFixed(2),
            averageMonthlyDemand: averageMonthlyDemand.toFixed(2)
        });
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getDemand();
            setData(response);
            setFilteredData(response);
            calculateStats(response);
            setNotification({
                open: true,
                message: 'Data Loaded successfully',
                severity: 'success'
              });;
        } catch (error) {
            setNotification({
                open: true,
                message: 'Failed to fetch Data',
                severity: 'error'
              });
        } finally {
            setLoading(false);
        }
    };

    const handleAddData = async () => {
        try {
            setLoading(true);
            await postDemand(newRecord);
            await fetchData();
            setOpenAddDialog(false);
            resetForm();
            setNotification({
                open: true,
                message: 'Submitted successfully',
                severity: 'success'
              });
        } catch (error) {
            setNotification({
                open: true,
                message: 'Failed to submit',
                severity: 'error'
              });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteDemand(id);
                await fetchData();
                setNotification({
                    open: true,
                    message: 'Record deleted successfully',
                    severity: 'success'
                  });
            } catch (error) {
                setNotification({
                    open: true,
                    message: 'Failed to delete record',
                    severity: 'error'
                  });
            }
        }
    };

    const handleToggleStatus = async (row) => {
        try {
            const updatedStatus = row.status === 'Active' ? 'Inactive' : 'Active';
            await updateDemand(row._id, { status: updatedStatus });
            await fetchData();
            setNotification({
                open: true,
                message: `Status updated to ${updatedStatus}`,
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: 'Failed to update status',
                severity: 'error'
            });
        }
    };
    
    const handleArchive = async (id) => {
        try {
            await updateDemand(id, { archived: true });
            // Update local state immediately
            const updatedData = data.map(item => 
                item._id === id ? { ...item, archived: true } : item
            );
            setData(updatedData);
            // Update filtered data based on current view
            const newFilteredData = updatedData.filter(item => {
                const matchesSearch = Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const matchesMunicipality = !filterMunicipality || item.municipality === filterMunicipality;
                const matchesArchiveState = showArchived ? item.archived : !item.archived;
                return matchesSearch && matchesMunicipality && matchesArchiveState;
            });
            setFilteredData(newFilteredData);
            
            setNotification({
                open: true,
                message: 'Record archived successfully',
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: 'Failed to archive record',
                severity: 'error'
            });
        }
    };

    const handleViewArchived = () => {
        setShowArchived(!showArchived);
        setPage(0); // Reset to first page when switching views
    };

    const handleRestore = async (id) => {
        try {
            await updateDemand(id, { archived: false });
            // Update local state immediately
            const updatedData = data.map(item => 
                item._id === id ? { ...item, archived: false } : item
            );
            setData(updatedData);
            // Update filtered data based on current view
            const newFilteredData = updatedData.filter(item => {
                const matchesSearch = Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const matchesMunicipality = !filterMunicipality || item.municipality === filterMunicipality;
                const matchesArchiveState = showArchived ? item.archived : !item.archived;
                return matchesSearch && matchesMunicipality && matchesArchiveState;
            });
            setFilteredData(newFilteredData);
    
            setNotification({
                open: true,
                message: 'Record restored successfully',
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: 'Failed to restore record',
                severity: 'error'
            });
        }
    };

    const resetForm = () => {
        setNewRecord({
            municipality: '',
            fishType: '',
            dailyDemand: '',
            monthlyDemand: '',
            date: '',
            time: '',
            status: 'Active'
        });
    };

    return (
        <Box sx={{ padding: 3, marginTop: '0px' }}>
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent >
                            <Typography variant="h6" color="#000000">Total Records</Typography>
                            <Typography variant="h4">{stats.totalRecords}</Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" color="#000000">Total Daily Demand</Typography>
                            <Typography variant="h4">{stats.totalDailyDemand}</Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" color="#000000">Avg Monthly Demand</Typography>
                            <Typography variant="h4">{stats.averageMonthlyDemand}</Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Action Buttons and Search */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<CreateIcon />}
                    onClick={() => {
                        setViewMode(false);
                        setOpenAddDialog(true);
                    }}
                    sx={{ 
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' }
                    }}
                >
                    New Record
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                    onClick={handleViewArchived}
                    sx={{ 
                        bgcolor: showArchived ? '#ef6c00' : '#ef6c00',
                        color: showArchived ? 'white' : 'white',
                        '&:hover': {
                            bgcolor: showArchived ? '#1a237e' : '#1a237e',
                        }
                    }}
                >
                    {showArchived ? 'View Active' : 'View Archived'}
                </Button>
                <TextField
                    size="small"
                    placeholder="Search..."
                    variant="outlined"
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
                <TextField
                    select
                    size="small"
                    color='#000000'
                    value={filterMunicipality}
                    onChange={(e) => setFilterMunicipality(e.target.value)}
                    variant="outlined"
                    label="Filter Municipality"
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">All Municipalities</MenuItem>
                    <MenuItem value="Boac">Boac</MenuItem>
                    <MenuItem value="Mogpog">Mogpog</MenuItem>
                    <MenuItem value="Gasan">Gasan</MenuItem>
                    <MenuItem value="Buenavista">Buenavista</MenuItem>
                    <MenuItem value="Torrijos">Torrijos</MenuItem>
                    <MenuItem value="Sta Cruz">Sta Cruz</MenuItem>
                </TextField>
            </Box>

            {/* Main Table */}
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                           <StyledTableCell>Municipality</StyledTableCell>
                            <StyledTableCell>Commodity</StyledTableCell>
                            <StyledTableCell>Daily Demand</StyledTableCell>
                            <StyledTableCell>Monthly Demand</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Time</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="subtitle1">No records found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row._id} hover>
                                        <TableCell>{row.municipality}</TableCell>
                                            <TableCell>{row.fishType}</TableCell>
                                            <TableCell>{row.dailyDemand} kg's</TableCell>
                                            <TableCell>{row.monthlyDemand} kg's</TableCell>
                                            <TableCell>
                                                {new Date(row.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{new Date('1970-01-01T' + row.time + 'Z')
                                                .toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit', 
                                                hour12: true 
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status || 'Active'}
                                                    color={row.status === 'Active' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                        {showArchived ? (
                                            <Tooltip title="Restore">
                                                <IconButton
                                                    onClick={() => handleRestore(row._id)}
                                                    size="small"
                                                    color="success"
                                                >
                                                    <RestoreFromTrashIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <>
                                                <Tooltip title={row.status === 'Active' ? 'Set Inactive' : 'Set Active'}>
                                                    <IconButton
                                                        onClick={() => handleToggleStatus(row)}
                                                        size="small"
                                                        color={row.status === 'Active' ? 'success' : 'default'}
                                                    >
                                                        {row.status === 'Active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Archive">
                                                    <IconButton
                                                        onClick={() => handleArchive(row._id)}
                                                        size="small"
                                                    >
                                                        <ArchiveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => handleDelete(row._id)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog 
                open={openAddDialog} 
                onClose={() => {
                    setOpenAddDialog(false);
                    setSelectedRow(null);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {viewMode ? 'View Record' : 'Add New Record'}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Municipality"
                                value={viewMode ? selectedRow?.municipality : newRecord.municipality}
                                onChange={(e) => setNewRecord({ ...newRecord, municipality: e.target.value })}
                                disabled={viewMode}
                            >
                                {['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta Cruz'].map(
                                    (option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Commodity"
                                value={viewMode ? selectedRow?.fishType : newRecord.fishType}
                                onChange={(e) => setNewRecord({ ...newRecord, fishType: e.target.value })}
                                disabled={viewMode}
                            >
                                {['Galunggong', 'Tulingan', 'Gulyasan', 'Dilis', 'Dalagang-Bukid', 'Tunsoy', 'Tambakol', 'Maya-Maya', 'Dried Fish'].map(
                                    (option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            label="Daily Demand"
                            fullWidth
                            margin="normal"
                            value={newRecord.dailyDemand}
                            onChange={(e) => setNewRecord({ ...newRecord, dailyDemand: e.target.value })}
                        />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            label="Monthly Demand"
                            fullWidth
                            margin="normal"
                            value={newRecord.monthlyDemand}
                            onChange={(e) => setNewRecord({ ...newRecord, monthlyDemand: e.target.value })}
                        />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={newRecord.date}
                            onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                        />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            label="Time"
                            type="time"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={newRecord.time}
                            onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                        />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleAddData} color="success">Add</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                          open={notification.open}
                          autoHideDuration={6000}
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

export default Permit;
