import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';
import { postInvoice, getInvoice, updateInvoiceData, deleteInvoiceData } from '../../states/api.js';
import { useAuthStore } from '../../store/store';
const colors = {
  primary: '#1a237e',
  secondary: '#0277bd',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#ef6c00',
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: colors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.text.secondary,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  '&:hover': {
    backgroundColor: alpha(colors.background.hover, 0.8),
  },
}));

const ActionButtonContainer = styled(Stack)(({ theme }) => ({
  '& .MuiIconButton-root': {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  '& .MuiCardHeader-root': {
    background: colors.headerGradient,
    color: '#ffffff',
  },
}));

const CascadingAddressForm = ({
  type,
  regions,
  provinces,
  municipalities,
  barangays,
  address,
  onAddressChange,
  locationNames
}) => {
  const [loading, setLoading] = useState(false);
  const isNCR = address.region === '130000000';

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" gutterBottom>
        {type} Address Details
      </Typography>
      
      <StyledTextField
        select
        fullWidth
        label="Region"
        value={address.region}
        onChange={(e) => {
          setLoading(true);
          onAddressChange('region', e.target.value);
          setTimeout(() => setLoading(false), 500);
        }}
      >
        {regions.map((region) => (
          <MenuItem key={region.code} value={region.code}>
            {region.name}
          </MenuItem>
        ))}
      </StyledTextField>

      {!isNCR && address.region && (
        <StyledTextField
          select
          fullWidth
          label="Province"
          value={address.province}
          onChange={(e) => onAddressChange('province', e.target.value)}
          disabled={loading}
        >
          {provinces.map((province) => (
            <MenuItem key={province.code} value={province.code}>
              {province.name}
            </MenuItem>
          ))}
        </StyledTextField>
      )}

      {((isNCR && address.region) || (!isNCR && address.province)) && (
        <StyledTextField
          select
          fullWidth
          label={isNCR ? 'City' : 'Municipality'}
          value={address.municipality}
          onChange={(e) => onAddressChange('municipality', e.target.value)}
          disabled={loading}
        >
          {municipalities.map((muni) => (
            <MenuItem key={muni.code} value={muni.code}>
              {muni.name}
            </MenuItem>
          ))}
        </StyledTextField>
      )}

      {address.municipality && (
        <StyledTextField
          select
          fullWidth
          label="Barangay"
          value={address.barangay}
          onChange={(e) => onAddressChange('barangay', e.target.value)}
          disabled={loading}
        >
          {barangays.map((barangay) => (
            <MenuItem key={barangay.code} value={barangay.name}>
              {barangay.name}
            </MenuItem>
          ))}
        </StyledTextField>
      )}
    </Stack>
  );
};

const Invoice = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.auth.token);
  const isAuthenticated = !!token;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterMode, setFilterMode] = useState('daily');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // Address state
  const [shipperAddress, setShipperAddress] = useState({
    region: "",
    province: "",
    municipality: "",
    barangay: "",
  });
  const [consigneeAddress, setConsigneeAddress] = useState({
    region: "",
    province: "",
    municipality: "",
    barangay: "",
  });

  // Location data states

  const [shipperMunicipalities, setShipperMunicipalities] = useState([]);
  const [shipperBarangays, setShipperBarangays] = useState([]);
  const [shipperProvinces, setShipperProvinces] = useState([]);
  const [consigneeProvinces, setConsigneeProvinces] = useState([]);
  const [consigneeMunicipalities, setConsigneeMunicipalities] = useState([]);
  const [consigneeBarangays, setConsigneeBarangays] = useState([]);
  const [regions, setRegions] = useState([]);
  const [locationNames, setLocationNames] = useState({
    provinces: {},
    municipalities: {},
    regions: {}
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [formValues, setFormValues] = useState({
    or: '',
    shipper: '',
    address: '',
    consignee: '',
    destination: '',
    products: '',
    quantity: '',
    amount: '',
    date: '',
  });

  // useEffect(() => {
  //   fetchData();
  //   fetchRegions();
  // }, [isAuthenticated]);
  useEffect(() => {
    // Only fetch data when the user is authenticated
    if (isAuthenticated) {
      fetchData();
      fetchRegions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const fetchData = async () => {
    try {
      const invoiceData = await getInvoice(); // Fetch all invoices
      const filteredData = filterInvoices(invoiceData); // Filter out 'approved' and 'rejected'
      const sortedData = filteredData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setData(sortedData); // Update the state with sorted and filtered data
      console.log('Fetched invoice data:', sortedData);
    } catch (error) {
      handleShowSnackbar('Failed to fetch invoice data', 'error');
      console.error('Failed to fetch invoice data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    // Update form values when addresses change
    const newShipperAddress = shipperAddress.barangay && shipperAddress.municipality && shipperAddress.province
      ? `${shipperAddress.barangay}, ${shipperAddress.municipality}, ${shipperAddress.province}`
      : '';
    
    const newConsigneeAddress = consigneeAddress.barangay && consigneeAddress.municipality && consigneeAddress.province
      ? `${consigneeAddress.barangay}, ${consigneeAddress.municipality}, ${consigneeAddress.province}`
      : '';

    setFormValues(prev => ({
      ...prev,
      address: newShipperAddress,
      destination: newConsigneeAddress,
    }));
  }, [shipperAddress, consigneeAddress]);

    const filterByDate = (data) => {
        if (filterMode === 'daily') {
        return data.filter((row) => new Date(row.date).toISOString().split("T")[0] === selectedDate);
        } else {
        return data.filter((row) => new Date(row.date).toISOString().substring(0, 7) === selectedMonth);
        }
    };

  const fetchRegions = async () => {
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/regions");
      setRegions(response.data);
      
      const regionMapping = {};
      response.data.forEach(region => {
        regionMapping[region.code] = region.name;
      });
      setLocationNames(prev => ({
        ...prev,
        regions: regionMapping
      }));
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchProvinces = async (regionCode, isShipper = true) => {
    try {
      if (regionCode === '130000000') {
        const response = await axios.get(`https://psgc.gitlab.io/api/regions/${regionCode}/cities`);
        const cities = response.data;
        
        const cityMapping = {};
        cities.forEach(city => {
          cityMapping[city.code] = city.name;
        });
        
        setLocationNames(prev => ({
          ...prev,
          municipalities: { ...prev.municipalities, ...cityMapping }
        }));

        if (isShipper) {
          setShipperMunicipalities(cities);
        } else {
          setConsigneeMunicipalities(cities);
        }
      } else {
        const response = await axios.get(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces`);
        const provinces = response.data;
        
        const provinceMapping = {};
        provinces.forEach(province => {
          provinceMapping[province.code] = province.name;
        });
        
        setLocationNames(prev => ({
          ...prev,
          provinces: { ...prev.provinces, ...provinceMapping }
        }));

        if (isShipper) {
          setShipperProvinces(provinces);
        } else {
          setConsigneeProvinces(provinces);
        }
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      handleShowSnackbar('Failed to fetch provinces', 'error');
    }
  };

  const fetchMunicipalities = async (provinceCode, isShipper = true) => {
    try {
      const [municipalitiesResponse, citiesResponse] = await Promise.all([
        axios.get(`https://psgc.gitlab.io/api/provinces/${provinceCode}/municipalities`),
        axios.get(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities`)
      ]);

      const allMunicipalities = [...municipalitiesResponse.data, ...citiesResponse.data];
      
      const municipalityMapping = {};
      allMunicipalities.forEach(municipality => {
        municipalityMapping[municipality.code] = municipality.name;
      });
      setLocationNames(prev => ({
        ...prev,
        municipalities: { ...prev.municipalities, ...municipalityMapping }
      }));

      if (isShipper) {
        setShipperMunicipalities(allMunicipalities);
      } else {
        setConsigneeMunicipalities(allMunicipalities);
      }
    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };

  const fetchBarangays = async (municipalityCode, isShipper = true) => {
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/municipalities/${municipalityCode}/barangays`
      );
      
      if (isShipper) {
        setShipperBarangays(response.data);
      } else {
        setConsigneeBarangays(response.data);
      }
    } catch (municipalityError) {
      try {
        const cityResponse = await axios.get(
          `https://psgc.gitlab.io/api/cities/${municipalityCode}/barangays`
        );
        if (isShipper) {
          setShipperBarangays(cityResponse.data);
        } else {
          setConsigneeBarangays(cityResponse.data);
        }
      } catch (error) {
        console.error("Error fetching barangays:", error);
      }
    }
  };

  const handleShipperAddressChange = (field, value) => {
    setShipperAddress(prev => {
      const updated = { ...prev, [field]: value };
      const isNCR = updated.region === '130000000';
      
      // Clear dependent fields
      if (field === 'region') {
        updated.province = '';
        updated.municipality = '';
        updated.barangay = '';
        if (value) {
          if (isNCR) {
            fetchProvinces(value, true);
          } else {
            fetchProvinces(value, true);
          }
        }
      } else if (field === 'province' && !isNCR) {
        updated.municipality = '';
        updated.barangay = '';
        if (value) fetchMunicipalities(value, true);
      } else if (field === 'municipality') {
        updated.barangay = '';
        if (value) fetchBarangays(value, true);
      }

      // Build address string
      const addressParts = [];
      if (updated.barangay) addressParts.push(updated.barangay);
      if (isNCR) {
        if (updated.municipality) {
          addressParts.push(locationNames.municipalities[updated.municipality] || updated.municipality);
        }
        if (updated.region) addressParts.push('NCR');
      } else {
        if (updated.municipality) {
          addressParts.push(locationNames.municipalities[updated.municipality] || updated.municipality);
        }
        if (updated.province) {
          addressParts.push(locationNames.provinces[updated.province] || updated.province);
        }
        if (updated.region) {
          addressParts.push(locationNames.regions[updated.region] || updated.region);
        }
      }

      setFormValues(prev => ({
        ...prev,
        address: addressParts.join(', ')
      }));

      return updated;
    });
  };

  const handleConsigneeAddressChange = (field, value) => {
    setConsigneeAddress(prev => {
      const updated = { ...prev, [field]: value };
      const isNCR = updated.region === '130000000';
      
      if (field === 'region') {
        updated.province = '';
        updated.municipality = '';
        updated.barangay = '';
        if (value) {
          if (isNCR) {
            fetchProvinces(value, false);
          } else {
            fetchProvinces(value, false);
          }
        }
      } else if (field === 'province' && !isNCR) {
        updated.municipality = '';
        updated.barangay = '';
        if (value) fetchMunicipalities(value, false);
      } else if (field === 'municipality') {
        updated.barangay = '';
        if (value) fetchBarangays(value, false);
      }

      // Build address string
      const addressParts = [];
      if (updated.barangay) addressParts.push(updated.barangay);
      if (isNCR) {
        if (updated.municipality) {
          addressParts.push(locationNames.municipalities[updated.municipality] || updated.municipality);
        }
        if (updated.region) addressParts.push('NCR');
      } else {
        if (updated.municipality) {
          addressParts.push(locationNames.municipalities[updated.municipality] || updated.municipality);
        }
        if (updated.province) {
          addressParts.push(locationNames.provinces[updated.province] || updated.province);
        }
        if (updated.region) {
          addressParts.push(locationNames.regions[updated.region] || updated.region);
        }
      }

      setFormValues(prev => ({
        ...prev,
        destination: addressParts.join(', ')
      }));

      return updated;
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      const isShipperNCR = shipperAddress.region === '130000000';
      const isConsigneeNCR = consigneeAddress.region === '130000000';
  
      const basicFieldsValid = formValues.or && formValues.shipper && formValues.consignee;
  
      const shipperAddressValid = 
        shipperAddress.region && 
        shipperAddress.barangay && 
        shipperAddress.municipality && 
        (isShipperNCR || shipperAddress.province);
  
      const consigneeAddressValid = 
        consigneeAddress.region && 
        consigneeAddress.barangay && 
        consigneeAddress.municipality && 
        (isConsigneeNCR || consigneeAddress.province);
  
      if (!basicFieldsValid) {
        handleShowSnackbar('Please fill in all required fields', 'warning');
        return;
      }
  
      if (!shipperAddressValid) {
        handleShowSnackbar('Please complete the shipper address details', 'warning');
        return;
      }
  
      if (!consigneeAddressValid) {
        handleShowSnackbar('Please complete the consignee address details', 'warning');
        return;
      }
  
    } else if (step === 2) {
      if (!formValues.products || !formValues.quantity || !formValues.amount || !formValues.date) {
        handleShowSnackbar('Please fill in all required fields', 'warning');
        return;
      }
  
      if (isNaN(formValues.quantity) || formValues.quantity <= 0) {
        handleShowSnackbar('Please enter a valid quantity', 'warning');
        return;
      }
  
      if (isNaN(formValues.amount) || formValues.amount <= 0) {
        handleShowSnackbar('Please enter a valid amount', 'warning');
        return;
      }
    }
    
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };
useEffect(() => {
    console.log('Current token:', token); // Add this to debug
    console.log('Is authenticated:', isAuthenticated);
  }, [token, isAuthenticated]);

  // Add this to your Fish component
useEffect(() => {
  const currentAuth = useAuthStore.getState().auth;
  console.log('Current auth state:', currentAuth);
}, []);

  const handleSubmit = async () => {
    try {
      const submissionData = {
        ...formValues,
        address: shipperAddress.region === '130000000' 
          ? `${shipperAddress.barangay}, ${locationNames.municipalities[shipperAddress.municipality]}, NCR`
          : `${shipperAddress.barangay}, ${locationNames.municipalities[shipperAddress.municipality]}, ${locationNames.provinces[shipperAddress.province]}`,
        destination: consigneeAddress.region === '130000000'
          ? `${consigneeAddress.barangay}, ${locationNames.municipalities[consigneeAddress.municipality]}, NCR`
          : `${consigneeAddress.barangay}, ${locationNames.municipalities[consigneeAddress.municipality]}, ${locationNames.provinces[consigneeAddress.province]}`,
        quantity: Number(formValues.quantity),
        amount: Number(formValues.amount),
        date: new Date(formValues.date).toISOString(),
      };
  
      if (editing) {
        await updateInvoiceData(currentRow._id, submissionData);
        handleShowSnackbar('Invoice updated successfully!');
      } else {
        await postInvoice(submissionData);
        handleShowSnackbar('Invoice created successfully!');
      }
      
      await fetchData();
      handleClose();
    } catch (error) {
      handleShowSnackbar(error.response?.data?.message || 'Failed to submit invoice', 'error');
      console.error('Submission error:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateInvoiceData(id, { status: 'approved' });
      handleShowSnackbar('Invoice approved successfully');
      await refreshData(); // Refresh the filtered data
    } catch (error) {
      handleShowSnackbar('Failed to approve invoice', 'error');
    }
  };
  
  // const handleReject = async (id) => {
  //   try {
  //     await updateInvoiceData(id, { status: 'rejected' });
  //     handleShowSnackbar('Invoice rejected');
  //     await refreshData(); // Refresh the filtered data
  //   } catch (error) {
  //     handleShowSnackbar('Failed to reject invoice', 'error');
  //   }
  // };
  const handleApproveClick = (id) => {
    setSelectedInvoiceId(id);
    setApproveDialogOpen(true);
  };

  const handleApproveWithBFAR = async () => {
    try {
      await updateInvoiceData(selectedInvoiceId, { status: 'approved', bfarSent: true });
      handleShowSnackbar('Invoice approved and sent to BFAR successfully');
      await fetchData(); // Use fetchData instead of refreshData to maintain consistency
    } catch (error) {
      handleShowSnackbar('Failed to approve invoice', 'error');
      console.error(error);
    } finally {
      setApproveDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  const handleApproveWithoutBFAR = async () => {
    setApproveDialogOpen(false);
    setSelectedInvoiceId(null);
    console.log("cancel")
  };

  const refreshData = async () => {
    try {
      const invoiceData = await getInvoice(); // Fetch all invoices
      const filteredData = filterInvoices(invoiceData); // Filter out 'approved' and 'rejected'
      setData(filteredData);
    } catch (error) {
      handleShowSnackbar('Failed to refresh data', 'error');
    }
  };
  
  const filterInvoices = (invoices) => {
    return invoices.filter(item => item.status !== 'approved' && item.status !== 'rejected');
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteInvoiceData(id);
      handleShowSnackbar('Invoice deleted successfully');
      await fetchData();
    } catch (error) {
      handleShowSnackbar('Failed to delete invoice', 'error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
    setCurrentRow(null);
    setFormValues({
      or: '',
      shipper: '',
      address: '',
      consignee: '',
      destination: '',
      products: '',
      quantity: '',
      amount: '',
      date: '',
    });
    setShipperAddress({
      province: "",
      municipality: "",
      barangay: "",
    });
    setConsigneeAddress({
      province: "",
      municipality: "",
      barangay: "",
    });
    setStep(1);
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                <StyledTextField
                    fullWidth
                    label="OR Number"
                    value={formValues.or}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only alphanumeric characters and limit to 8 characters
                      if (/^[a-zA-Z0-9]{0,8}$/.test(value)) {
                        setFormValues({ ...formValues, or: value });
                      }
                    }}
                    inputProps={{ maxLength: 8 }}
                  />  

                  <StyledTextField
                    fullWidth
                    label="Shipper Name"
                    value={formValues.shipper}
                    onChange={(e) => setFormValues({ ...formValues, shipper: e.target.value })}
                  />
                  <CascadingAddressForm
                    type="Shipper"
                    regions={regions}
                    provinces={shipperProvinces}
                    municipalities={shipperMunicipalities}
                    barangays={shipperBarangays}
                    address={shipperAddress}
                    onAddressChange={handleShipperAddressChange}
                    locationNames={locationNames}
                  />
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <StyledTextField
                    fullWidth
                    label="Consignee Name"
                    value={formValues.consignee}
                    onChange={(e) => setFormValues({ ...formValues, consignee: e.target.value })}
                  />
                  <CascadingAddressForm
                    type="Consignee"
                    regions={regions}
                    provinces={consigneeProvinces}
                    municipalities={consigneeMunicipalities}
                    barangays={consigneeBarangays}
                    address={consigneeAddress}
                    onAddressChange={handleConsigneeAddressChange}
                    locationNames={locationNames}
                  />
                </Stack>
                </Grid>
            </Grid>
        </Box>
        );
        case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Commodity"
                value={formValues.products}
                onChange={(e) => setFormValues({ ...formValues, products: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight"
                type="number"
                value={formValues.quantity}
                onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formValues.amount}
                onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Departure"
                type="date"
                value={formValues.date}
                onChange={(e) => {
                  const value = e.target.value;
                  const currentDate = new Date().toISOString().split("T")[0];
                  if (value >= currentDate) {
                    setFormValues({ ...formValues, date: value });
                  }
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
  case 3:
        return (
          <Box>
          <style>
          {`
            @media print {
              body {
                margin: 10; /* Remove default browser margins */
                width: 210mm; /* A4 width */
                height: 297mm; /* A4 height */
              }

              /* Ensure the Box uses full A4 dimensions */
              .print-box {
                width: 100%;
                height: 100%;
                page-break-after: always; /* Avoid content overlap on multiple pages */
              }

              /* Hide elements that should not appear in print */
              .no-print {
                display: none !important;
              }

            }
          `}
            </style>
           
             
                {/* Header */}
                <Box textAlign="center">
                  <Typography variant="body1">
                    Republic of the Philippines
                    <br />
                    DEPARTMENT OF AGRICULTURE
                    <br />
                    REGION IV-B
                    <br />
                    MUNICIPAL AGRICULTURE OFFICE
                    <br />
                    Mogpog, Marinduque
                  </Typography>
                </Box>

                {/* Title */}
                <Box textAlign="center" mb={4}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    AUXILIARY INVOICE
                  </Typography>
                </Box>

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography>Shipper: <Box component="span" sx={{ textDecoration: 'underline' }}>{formValues.shipper}</Box></Typography>
                    <Typography>Address: <Box component="span" sx={{ textDecoration: 'underline' }}>
                      {shipperAddress.region === '130000000' 
                        ? `${shipperAddress.barangay}, ${locationNames.municipalities[shipperAddress.municipality] || ''}`
                        : `${shipperAddress.barangay}, ${locationNames.municipalities[shipperAddress.municipality] || ''}, ${locationNames.provinces[shipperAddress.province] || ''}`
                      }
                    </Box></Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Consignee: <Box component="span" sx={{ textDecoration: 'underline' }}>{formValues.consignee}</Box></Typography>
                    <Typography>Address: <Box component="span" sx={{ textDecoration: 'underline' }}>
                      {consigneeAddress.region === '130000000'
                        ? `${consigneeAddress.barangay}, ${locationNames.municipalities[consigneeAddress.municipality] || ''}`
                        : `${consigneeAddress.barangay}, ${locationNames.municipalities[consigneeAddress.municipality] || ''}, ${locationNames.provinces[consigneeAddress.province] || ''}`
                      }
                    </Box></Typography>
                  </Grid>
                </Grid>

                {/* Products Table */}
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name of products, fish, prawns, etc.</TableCell>
                        <TableCell>Quantity on boxes</TableCell>
                        <TableCell>Weight in</TableCell>
                        <TableCell>Market Value</TableCell>
                        <TableCell>For Required</TableCell>
                        <TableCell>Full of Loading</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{formValues.products}</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>{formValues.quantity}</TableCell>
                        <TableCell>{formValues.amount}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Certification */}
                <Typography paragraph>
                  <strong>I HEREBY CERTIFY</strong> that this invoice contains true and correct statement of the products collected and transferred by men and that the required fees have been paid.
                </Typography>

                <Typography paragraph>
                  I am fully aware that any incorrect entry on items I have done as stated above will be subject me to appropriate action.
                </Typography>

                <Typography paragraph>
                  <strong>IN WITNESS WHEREOF</strong> I have hereunto affixed my signature this {new Date().getDate()} day of {new Date().toLocaleDateString('en-US', { month: 'long' })}, {new Date().getFullYear()} at Mogpog, Marinduque.
                </Typography>

                {/* Verification Section */}
                <Box mt={4}>
                  <Typography variant="h5" textAlign="center" sx={{ textDecoration: 'underline' }} mb={2}>
                    VERIFICATION
                  </Typography>
                  <Typography paragraph>
                    <strong>I, MARNELLI R. Nuñez,</strong> do hereby certify that I have personally conducted actual inspection verification of the above listed items and found the same to be true and correct. Confirmed under OR# {formValues.or} in the amount of {formValues.amount} this {new Date().getDate()} day of {new Date().toLocaleDateString('en-US', { month: 'long' })}, {new Date().getFullYear()} issued by Municipal Agriculture Office.
                  </Typography>
                </Box>

                {/* Signatures */}
                <Grid container spacing={4} mt={4}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography>________________________</Typography>
                      <Typography>Collecting Officer Signature</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography>________________________</Typography>
                      <Typography>Agriculturist 1/OIC-MAO</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography>________________________</Typography>
                      <Typography>PNP Officer</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Shipping Permit */}
                <Box mt={4}>
                  <Typography variant="h5" textAlign="center" mb={2}>
                    SHIPPING PERMIT
                  </Typography>
                  <Grid container spacing={50} mb={4}>
                    <Grid item xs={6}>
                      <Typography>Date: {new Date().toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>Place: Mogpog, Marinduque</Typography>
                    </Grid>
                  </Grid>
                  <Typography paragraph>
                    <strong>TO WHOM IT MAY CONCERN:</strong>
                  </Typography>
                  <Typography>
                    This is to certify that the fishery products listed above have been inspected by the undersigned hence shipping permit to given to the bearer.
                  </Typography>
                </Box>
              
         </Box>
          
          );
          default:
            return null;
        }
      };

  return (
    <Container sx={{ 
      padding: { xs: '1rem', sm: '2rem', md: '2rem 1rem' },
            width: { xs: '100%', md: '80vw' },
            maxWidth: '100%',
      mt: isMobile ? 4 : 0
  }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            fullWidth={isMobile}
            sx={{ 
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' }
            }}
          >
            Add New Invoice
          </Button>
          
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <TextField
              select
              label="Filter Mode"
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              fullWidth={isMobile}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </TextField>
            
            <TextField
              type={filterMode === 'daily' ? 'date' : 'month'}
              value={filterMode === 'daily' ? selectedDate : selectedMonth}
              onChange={(e) => filterMode === 'daily' ? setSelectedDate(e.target.value) : setSelectedMonth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth={isMobile}
            />
          </Stack>
        </Box>

        <Card elevation={1} sx={{ borderRadius: '8px' }}>
          <CardHeader 
            title="List of Invoice" 
            titleTypographyProps={{ 
              variant: "h5", 
              fontWeight: 600,
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '24px'
            }}
          />
          <CardContent>
            <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#505050',
                        borderBottom: '1px solid #e0e0e0',
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      LTP #
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#505050',
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          Shipper
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#505050',
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          Address
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#505050',
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          Consignee
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#505050',
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          Destination
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#505050',
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          Products
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#505050',
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px'
                          }}
                        >
                          Weight
                        </TableCell>
                      </>
                    )}
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#505050',
                        borderBottom: '1px solid #e0e0e0',
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#505050',
                        borderBottom: '1px solid #e0e0e0',
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#505050',
                        borderBottom: '1px solid #e0e0e0',
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading && filterByDate(data).map((row) => (
                    <TableRow 
                      key={row._id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '14px',
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        {row.or}
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell 
                            sx={{ 
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '14px',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            {row.shipper}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '14px',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            {row.address}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '14px',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            {row.consignee}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '14px',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            {row.destination}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '14px',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            {row.products}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '14px',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            {row.quantity}kg's
                          </TableCell>
                        </>
                      )}
                      <TableCell 
                        sx={{ 
                          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '14px',
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        ₱ {row.amount}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '14px',
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        {new Date(row.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        <ActionButtonContainer direction="row" spacing={1}>
                          <Tooltip title="Approve" arrow>
                            <ActionButton
                              onClick={() => handleApproveClick(row._id)}
                              sx={{ 
                                color: colors.success,
                                '&:hover': {
                                  backgroundColor: 'rgba(76, 175, 80, 0.1)'
                                }
                              }}
                            >
                              <CheckCircleIcon />
                            </ActionButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <ActionButton
                              onClick={() => handleDelete(row._id)}
                              sx={{ 
                                color: colors.warning,
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 152, 0, 0.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </ActionButton>
                          </Tooltip>
                        </ActionButtonContainer>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filterByDate(data).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  margin: 0,
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
                },
              }}
            />
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Invoice</DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to send this invoice to BFAR?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveWithoutBFAR} sx={{color:"#E52020"}}>
            No
          </Button>
          <Button onClick={handleApproveWithBFAR} sx={{color:"#4CAF50"}}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
    >
        <DialogTitle className='no-print'>
        {editing ? 'Edit Invoice' : 'Add New Invoice'}
        </DialogTitle>
        <DialogContent>
        <Box sx={{ pt: 2 }}>{renderForm()}</Box>
        </DialogContent>
        <DialogActions>
                {step > 1 && step <= 2 && (
                  <Button onClick={handlePrevStep} className='no-print' color="dark">Previous</Button>
                )}
                {step < 3 && (
                  <Button onClick={handleNextStep} className='no-print' color="secondary">Next</Button>
                )}
                {step === 3 && (
                  <>
                  <Button onClick={handleSubmit} className='no-print' color="success">Submit</Button>
                  <Button startIcon={<PrintIcon />} onClick={() => window.print()} color='success' className='no-print' >Print</Button>
                  </>
                )}
                <Button onClick={handleClose} className='no-print' color="error">Cancel</Button>
                
              </DialogActions>
    </Dialog>
    <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    
  );
};


export default Invoice;