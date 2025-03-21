import React, { useState, useEffect } from 'react';
import { 
    Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, 
    Box, TablePagination, CircularProgress, 
    Typography, TextField, Card, CardContent,
    useMediaQuery, IconButton, Collapse,
    Grid, Chip, useTheme
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getInvoice } from '../../states/api.js';

const PermitStatusView = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 20);

    // Filter states
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const permitData = await getInvoice();
                const sortedData = (permitData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setData(sortedData);
            } catch (error) {
                console.error('Failed to fetch permit data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { id: 'or', name: 'OR #', minWidth: 100 },
        { id: 'shipper', name: 'SHIPPER', minWidth: 150 },
        { id: 'address', name: 'ADDRESS', minWidth: 200, hideOnMobile: true },
        { id: 'consignee', name: 'CONSIGNEE', minWidth: 150 },
        { id: 'destination', name: 'DESTINATION', minWidth: 200, hideOnMobile: true },
        { id: 'products', name: 'PRODUCTS', minWidth: 150 },
        { id: 'quantity', name: 'WEIGHT', minWidth: 100 },
        { id: 'amount', name: 'AMOUNT', minWidth: 120 },
        { id: 'date', name: 'DATE', minWidth: 120 },
        { id: 'status', name: 'STATUS', minWidth: 120 },
    ];

    // Filter data by monthly selection
    const filterByDate = (data) => {
        return data.filter(item => new Date(item.date).toISOString().substring(0, 7) === selectedMonth);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };

    const paginatedData = filterByDate(data).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const getStatusChipColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Mobile card view for each row
    const MobileCard = ({ row }) => (
        <Card sx={{ mb: 2, boxShadow: 2 }}>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">OR #</Typography>
                        <Typography variant="body2">{row.or}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                        <Chip 
                            label={row.status}
                            color={getStatusChipColor(row.status)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Shipper</Typography>
                        <Typography variant="body2">{row.shipper}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Consignee</Typography>
                        <Typography variant="body2">{row.consignee}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Amount</Typography>
                        <Typography variant="body2">{row.amount}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                        <Typography variant="body2">
                            {new Date(row.date).toLocaleDateString('en-GB')}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ 
            padding: { xs: '1rem', sm: '2rem', md: '2rem 1rem' },
            width: { xs: '100%', md: '80vw' },
            maxWidth: '100%'
        }}>
            <Card sx={{ mb: 3,}}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h1">
                            Permit Status
                        </Typography>
                        <IconButton onClick={() => setShowFilters(!showFilters)}>
                            {showFilters ? <ExpandLessIcon /> : <FilterListIcon />}
                        </IconButton>
                    </Box>

                    <Collapse in={showFilters}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Filter by Month"
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Collapse>

                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress />
                        </Box>
                    ) : paginatedData.length === 0 ? (
                        <Typography variant="h6" align="center" color="textSecondary">
                            No data available
                        </Typography>
                    ) : (
                        <>
                            {isMobile ? (
                                // Mobile view
                                <Box>
                                    {paginatedData.map((row) => (
                                        <MobileCard key={row._id} row={row} />
                                    ))}
                                </Box>
                            ) : (
                                // Desktop view
                                <TableContainer sx={{ maxHeight: '65vh' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => !column.hideOnMobile && (
                                                    <TableCell
                                                        key={column.id}
                                                        sx={{
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: '#000000',
                                                            minWidth: column.minWidth,
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
                                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
                                                >
                                                    {columns.map((column) => !column.hideOnMobile && (
                                                        <TableCell key={column.id}>
                                                            {column.id === 'date' ? formatDate(row[column.id]) :
                                                            column.id === 'time' ? new Date('1970-01-01T' + row[column.id] + 'Z')
                                                                .toLocaleTimeString([], { 
                                                                hour: '2-digit', 
                                                                minute: '2-digit', 
                                                                hour12: true 
                                                                }
                                                            ) : column.id === 'amount' ? `₱ ${row[column.id]}` : column.id === 'quantity' ? `${row[column.id]} kg's` :
                                                            column.id === 'status' ? (
                                                                <Chip 
                                                                    label={row[column.id]}
                                                                    color={getStatusChipColor(row[column.id])}
                                                                    size="small"
                                                                />
                                                            ) : (
                                                                row[column.id]
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            <TablePagination
                                component="div"
                                count={filterByDate(data).length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 20]}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PermitStatusView;