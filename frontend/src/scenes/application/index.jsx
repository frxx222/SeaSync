// import React, { useState, useEffect } from 'react';
// import {
//   Paper, Table, TableBody, TableCell, TableContainer, Typography,
//   TableHead, TableRow, Box, TextField, TablePagination, Button, Dialog,
//   DialogTitle, DialogContent, DialogActions, useTheme, IconButton,
//   Stack, Chip, Tooltip, Alert, Snackbar
// } from '@mui/material';
// import { styled, alpha } from '@mui/material/styles';
// import { getPermit, updatePermitData, deletePermitData, getInvoice } from '../../states/api.js';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CreateIcon from '@mui/icons-material/Create';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import PrintIcon from '@mui/icons-material/Print';
// import Img from '../../images/dry seal BFAR.png';
// import Logo from '../../images/BFAR logo.png';
// import "./style.css";

// const colors = {
//   primary: '#1a237e', // Deep indigo
//   secondary: '#0277bd', // Light blue
//   success: '#2e7d32', // Green
//   error: '#c62828', // Red
//   warning: '#ef6c00', // Orange
//   background: {
//     default: '#f5f5f5',
//     paper: '#ffffff',
//     hover: '#f3f6f9'
//   },
//   text: {
//     primary: '#1a237e',
//     secondary: '#455a64'
//   },
//   headerGradient: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
// };

// // Styled components with updated colors
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   backgroundColor: '#2C3E50',
//   color: colors.background.paper,
//   padding: '16px 16px',
//   fontSize: '.675rem',
//   fontWeight: 400,
//   '&:first-of-type': {
//     borderTopLeftRadius: theme.shape.borderRadius,
//   },
//   '&:last-of-type': {
//     borderTopRightRadius: theme.shape.borderRadius,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: alpha(colors.background.hover, 0.3),
//   },
//   '&:nth-of-type(even)': {
//     backgroundColor: colors.background.paper,
//   },
//   '&:hover': {
//     backgroundColor: alpha(colors.secondary, 0.08),
//   },
//   '& td': {
//     color: colors.text.secondary,
//   },
// }));

// const ActionButton = styled(IconButton)(({ theme }) => ({
//   padding: 8,
//   '&:hover': {
//     backgroundColor: alpha(colors.background.hover, 0.8),
//   },
// }));

// const PageHeader = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   backgroundColor: colors.background.paper,
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
// }));

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   backgroundColor: colors.background.paper,
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//   overflow: 'hidden',
// }));

// const HeaderTypography = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   color: 'primary',
// }));

// const ActionButtonContainer = styled(Stack)(({ theme }) => ({
//   '& .MuiIconButton-root': {
//     transition: 'transform 0.2s',
//     '&:hover': {
//       transform: 'scale(1.1)',
//     },
//   },
// }));

// const ltpPermit = () => {
//   const theme = useTheme();
//   const [data, setData] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [formValues, setFormValues] = useState({
//     ltpNo: '', 
//     shipperName: '', 
//     shipperAddress: '', 
//     contactNo: '',
//     consigneeName: '', 
//     consigneeAddress: '', 
//     consigneeContactNo: '',
//     placeOfOrigin: '', 
//     portOfDestination: '', 
//     transportMeans: '',
//     dateOfDeparture: '', 
//     transportId: '', 
//     commodity: '', 
//     description: '',
//     quantity: '', 
//     marketValue: '', 
//     remarks: '', 
//     or: '', 
//     amount: '', 
//     dateIssued: '',
//   });
//   const [step, setStep] = useState(1);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [notification, setNotification] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Use the imported getInvoice function
//         const invoiceData = await getInvoice();
        
//         // Filter and map approved invoices
//         const approvedInvoices = invoiceData
//           .filter(invoice => invoice.status === 'approved')
//           .map(invoice => ({
//             shipperName: invoice.shipper,
//             shipperAddress: invoice.address,
//             consigneeName: invoice.consignee,
//             portOfDestination: invoice.destination,
//             commodity: invoice.products,
//             quantity: invoice.quantity,
//             dateIssued: invoice.date,
//             status: 'pending',
//             fromInvoice: true,
//             invoiceId: invoice._id,
//             // Adding empty fields that will be editable in LTP
//             ltpNo: '',
//             contactNo: '',
//             consigneeContactNo: '',
//             placeOfOrigin: '',
//             transportMeans: '',
//             dateOfDeparture: '',
//             transportId: '',
//             description: '',
//             marketValue: '',
//             remarks: '',
//             or: '',
//             amount: ''
//           }));

//         // Fetch existing LTP permits
//         const permitData = await getPermit();
        
//         // Combine both datasets
//         const combinedData = [...permitData, ...approvedInvoices];
//         setData(combinedData);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//         setNotification({
//           open: true,
//           message: 'Failed to fetch data',
//           severity: 'error'
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const refreshData = async () => {
//     setIsLoading(true);
//     try {
//       const [invoiceData, permitData] = await Promise.all([
//         getInvoice(),
//         getPermit()
//       ]);

//       const approvedInvoices = invoiceData
//         .filter(invoice => invoice.status === 'approved')
//         .map(invoice => ({
//           shipperName: invoice.shipper,
//           shipperAddress: invoice.address,
//           consigneeName: invoice.consignee,
//           portOfDestination: invoice.destination,
//           commodity: invoice.products,
//           quantity: invoice.quantity,
//           dateIssued: invoice.date,
//           status: 'pending',
//           fromInvoice: true,
//           invoiceId: invoice._id,
//           ltpNo: '',
//           contactNo: '',
//           consigneeContactNo: '',
//           placeOfOrigin: '',
//           transportMeans: '',
//           dateOfDeparture: '',
//           transportId: '',
//           description: '',
//           marketValue: '',
//           remarks: '',
//           or: '',
//           amount: ''
//         }));

//       setData([...permitData, ...approvedInvoices]);
//     } catch (error) {
//       setNotification({
//         open: true,
//         message: 'Failed to refresh data',
//         severity: 'error'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Modified handleEdit to handle both invoice-based and regular permits
//   const handleEdit = (row) => {
//     setEditing(true);
//     setCurrentRow(row);
//     setFormValues({
//       ...row,
//       // If it's from an invoice, ensure all required fields are included
//       ltpNo: row.ltpNo || '',
//       contactNo: row.contactNo || '',
//       consigneeContactNo: row.consigneeContactNo || '',
//       transportMeans: row.transportMeans || '',
//       dateOfDeparture: row.dateOfDeparture || '',
//       transportId: row.transportId || '',
//       description: row.description || '',
//       marketValue: row.marketValue || '',
//       remarks: row.remarks || '',
//       or: row.or || '',
//       amount: row.amount || ''
//     });
//     setOpen(true);
//   };

//   const columns = [
//     { id: 'ltpNo', name: 'LTP' }, 
//     { id: 'shipperName', name: 'Shipper' },  
//     { id: 'shipperAddress', name: 'Shipper Address' },  
//     { id: 'consigneeName', name: 'Consignee' },  
//     { id: 'consigneeAddress', name: 'Consignee Address' },  
//     { id: 'placeOfOrigin', name: 'Origin' },  
//     { id: 'portOfDestination', name: 'Destination' },  
//     { id: 'transportMeans', name: 'Transport' }, 
//     { id: 'dateOfDeparture', name: 'Departure' },  
//     { id: 'commodity', name: 'Commodity' }, 
//     { id: 'quantity', name: 'Qty' }, 
//     { id: 'marketValue', name: 'Market' },  
//     { id: 'or', name: 'OR' },  
//     { id: 'amount', name: 'Amt' }, 
//     { id: 'dateIssued', name: 'Issued' },  
//     { id: 'actions', name: 'Actions' }, 
// ];


//   const handleNextStep = () => {
//     // Validate fields for the current step before proceeding
//     if (step === 1) {
//       if (
//         !formValues.ltpNo ||
//         !formValues.shipperName ||
//         !formValues.shipperAddress ||
//         !formValues.contactNo ||
//         !formValues.consigneeName ||
//         !formValues.consigneeAddress ||
//         !formValues.consigneeContactNo ||
//         !formValues.placeOfOrigin ||
//         !formValues.portOfDestination ||
//         !formValues.transportMeans ||
//         !formValues.dateOfDeparture ||
//         !formValues.transportId 
//       ) {
//         alert('Please fill in all fields in this step.');
//         return;
//       }
//     } else if (step === 2) {
//       if (
//         !formValues.commodity ||
//         !formValues.description ||
//         !formValues.quantity ||
//         !formValues.marketValue ||
//         !formValues.remarks
//       ) {
//         alert('Please fill in all fields in this step.');
//         return;
//       }
//     }
//     setStep((prev) => prev + 1);
//   };

//   const handlePrevStep = () => {
//     setStep((prev) => prev - 1);
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editing) {
//         await updatePermitData(currentRow._id, formValues);
//         setNotification({
//           open: true,
//           message: 'Permit updated successfully',
//           severity: 'success'
//         });
//       }
//       await refreshData();
//       handleClose();
//     } catch (error) {
//       setNotification({
//         open: true,
//         message: 'Error processing permit',
//         severity: 'error'
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deletePermitData(id);
//       await refreshData();
//       setNotification({
//         open: true,
//         message: 'Permit deleted successfully',
//         severity: 'success'
//       });
//     } catch (error) {
//       setNotification({
//         open: true,
//         message: 'Failed to delete permit',
//         severity: 'error'
//       });
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditing(false);
//     setCurrentRow(null);
//     setFormValues({
//       ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
//       consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
//       placeOfOrigin: '', portOfDestination: '', transportMeans: '',
//       dateOfDeparture: '', transportId: '', commodity: '', description: '',
//       quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: '',
//     });
//     setStep(1);
//   };

//   const handleApprove = async (id) => {
//       try {
//           await updatePermitData(id, { status: 'approved' });
//           const updatedData = await getPermit();
//           setData(updatedData.filter(item => item.status !== 'approved' && item.status !== 'rejected'));
//       } catch (error) {
//           console.error('Failed to approve permit:', error);
//       }
//   };

//   const handleReject = async (id) => {
//       try {
//           await updatePermitData(id, { status: 'rejected' });
//           const updatedData = await getPermit();
//           setData(updatedData.filter(item => item.status !== 'approved' && item.status !== 'rejected'));
//       } catch (error) {
//           console.error('Failed to reject permit:', error);
//       }
//   };


//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

  
//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <DialogTitle className='no-print'>{editing ? 'Transport Details' : 'Transport Details'}
//             <TextField
//                   label="LTP Number"
//                   value={formValues.ltpNo}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     // Allow only up to 4 numeric characters
//                     if (/^\d{0,4}$/.test(value)) {
//                       setFormValues({ ...formValues, ltpNo: value });
//                     }
//                   }}
//                   fullWidth
//                   margin="normal"
//                   inputProps={{
//                     maxLength: 4, // This prevents more than 4 characters being entered
//                   }}
//                   placeholder="Enter 4-digit LTP number"
//                 />
//                 <TextField
//                     label="Shipper Name"
//                     value={formValues.shipperName}
//                     onChange={(e) => setFormValues({ ...formValues, shipperName: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Shipper Address"
//                     value={formValues.shipperAddress}
//                     onChange={(e) => setFormValues({ ...formValues, shipperAddress: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                   label="Shipper Contact"
//                   value={formValues.contactNo}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (/^\d*$/.test(value)) {
//                       setFormValues({ ...formValues, contactNo: value });
//                     }
//                   }}
//                   fullWidth
//                   margin="normal"
//                   inputProps={{
//                     maxLength: 11,
//                   }}
//                   error={!!formValues.contactNo && !/^\d{10,11}$/.test(formValues.contactNo)} // Adjust range as needed
//                   helperText={
//                     formValues.contactNo && !/^\d{10,11}$/.test(formValues.contactNo)
//                       ? "Contact number must be 11 digits."
//                       : ""
//                   }
//                 />
//                 <TextField
//                     label="Consignee Name"
//                     value={formValues.consigneeName}
//                     onChange={(e) => setFormValues({ ...formValues, consigneeName: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Consignee Address"
//                     value={formValues.consigneeAddress}
//                     onChange={(e) => setFormValues({ ...formValues, consigneeAddress: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                   label="Consignee Contact"
//                   value={formValues.consigneeContactNo}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (/^\d*$/.test(value)) {
//                       setFormValues({ ...formValues, consigneeContactNo: value });
//                     }
//                   }}
//                   fullWidth
//                   margin="normal"
//                   inputProps={{
//                     maxLength: 11,
//                   }}
//                   error={!!formValues.contactNo && !/^\d{10,11}$/.test(formValues.contactNo)} // Adjust range as needed
//                   helperText={
//                     formValues.consigneeContactNo && !/^\d{10,11}$/.test(formValues.consigneeContactNo)
//                       ? "Contact number must be 11 digits."
//                       : ""
//                   }
//                 />
//                 <TextField
//                     label="Place Origin"
//                     value={formValues.placeOfOrigin}
//                     onChange={(e) => setFormValues({ ...formValues, placeOfOrigin: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Port Destination"
//                     value={formValues.portOfDestination}
//                     onChange={(e) => setFormValues({ ...formValues, portOfDestination: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Transport Means"
//                     value={formValues.transportMeans}
//                     onChange={(e) => setFormValues({ ...formValues, transportMeans: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                   label="Date of Departure"
//                   type="date"
//                   value={formValues.dateOfDeparture}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
//                     if (value >= currentDate) {
//                       setFormValues({ ...formValues, dateOfDeparture: value });
//                     }
//                   }}
//                   fullWidth
//                   margin="normal"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   error={
//                     !!formValues.dateOfDeparture &&
//                     formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
//                   }
//                   helperText={
//                     formValues.dateOfDeparture &&
//                     formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
//                       ? "Date of departure cannot be in the past."
//                       : ""
//                   }
//                 />
//                 <TextField
//                   label="Plate Number"
//                   type="text"
//                   value={formValues.transportId}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     // Allow alphanumeric characters only
//                     if (/^[a-zA-Z0-9]*$/.test(value)) {
//                       setFormValues({ ...formValues, transportId: value });
//                     }
//                   }}
//                   fullWidth
//                   margin="normal"
//                   inputProps={{
//                     maxLength: 10, // Set a reasonable maximum length
//                   }}
//                   placeholder="Enter Transport Id"
//                 />
//           </DialogTitle>
//         );
//       case 2:
//         return (
//           <DialogTitle className='no-print'>{editing ? 'Product Details' : 'Product Details'}
//             <TextField
//                     label="Commodity"
//                     value={formValues.commodity}
//                     onChange={(e) => setFormValues({ ...formValues, commodity: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Description"
//                     value={formValues.description}
//                     onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Quantity"
//                     type='number'
//                     value={formValues.quantity}
//                     onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Market Value"
//                     type='number'
//                     value={formValues.marketValue}
//                     onChange={(e) => setFormValues({ ...formValues, marketValue: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Remarks"
//                     value={formValues.remarks}
//                     onChange={(e) => setFormValues({ ...formValues, remarks: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//           </DialogTitle>
//         );
//       case 3:
//         return (
//           <DialogTitle className='no-print'>{editing ? 'OR Details' : 'OR Details'}
//             <TextField
//                 label="OR Number"
//                 value={formValues.or}
//                 type="number"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   // Allow only positive integers
//                   if (/^\d*$/.test(value)) {
//                     setFormValues({ ...formValues, or: value });
//                   }
//                 }}
//                 fullWidth
//                 margin="normal"
//                 inputProps={{
//                   min: 0, // Prevents negative numbers
//                   maxLength: 10, // Optional: Adjust based on the OR number length
//                 }}
//                 placeholder="Enter OR number"
//               />
//                 <TextField
//                     label="Amount"
//                     type='number'
//                     value={formValues.amount}
//                     onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <TextField
//                     label="Date Issued"
//                     type="date"
//                     value={formValues.dateIssued}
//                     onChange={(e) =>
//                       setFormValues({ ...formValues, dateIssued: e.target.value })
//                     }
//                     fullWidth
//                     margin="normal"
//                     InputLabelProps={{
//                       shrink: true, // Ensures the label doesn't overlap with the date picker
//                     }}
//                 />
//           </DialogTitle>
//         );
//       case 4:
//         return (
//           <DialogTitle className=''>{editing ? 'Preview Form' : 'Preview Form'}
//             <style>
//                 {`
//                     @media print {
//                         .no-print {
//                             display: none !important;
//                         }
//                     }
//                 `}
//             </style>
//           <Box>
//           <div className="container">
//             <img src={Logo} alt="BFAR Logo" />
//             <div className="content">
//               <div className="title">
//                 <h3>Republic of the Philippines</h3>
//               </div>
//               <div className="title-blue">
//                 <div className="title">
//                   <h3>Department of Agriculture</h3>
//                 </div>
//                 <div className="title1">
//                   <h2>BUREAU OF FISHERIES AND AQUATIC RESOURCES - MIMAROPA</h2>
//                 </div>
//               </div>
//               <div className="title">
//                 <h1>FISHERIES INSPECTION AND QUARANTINE SERVICES</h1>
//               </div>
//               <div className="title">
//                 <h3>
//                   Le Grace Building, Roxas Drive, Brgy Guinobatan, Calapan City,
//                   Oriental Mindoro
//                   <br />
//                   Telephone number: (043) 288-2022 / Email address:
//                   fiqsmimaropa@gmail.com
//                 </h3>
//               </div>
//             </div>
    
//             <div className="main-content">
//               <div className="ltp-permit">
//                 <h1>LOCAL TRANSPORT PERMIT</h1>
//               </div>
//               <div className="date-no">
//                 <ol className="ltp-date">
//                 <div>
//                   <span>Date:</span>
//                   <l>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</l>
//                 </div>
//                 </ol>
//                 <ol className="ltp-no">
//                   <p className="ltp-no">
//                     LTP No.: LTP-41-MADSI-24-
//                     <l>{formValues.ltpNo}</l>
//                   </p>
//                 </ol>
//               </div>
    
//               <div>
//                 <p>
//                   Pursuant to the provisions of <i>
//                     <b>Philippine Fisheries Code of 1998</b>
//                   </i>{" "}
//                   (RA No. 8550, as amended by RA No. 10654, An Act to prevent, Deter
//                   and Eliminate IUU Fishing), <i>
//                     <b>Food Safety Act of 2013</b>
//                   </i>{" "}
//                   (RA No. 10611) <i>
//                     <b>Wildlife Resources Conservation and Protection Act</b>
//                   </i>{" "}
//                   (RA No. 9147), its Implementing Rules and Regulations, and Fisheries
//                   Administrative Order No. 233, Series of 2010, the Aquatic Wildlife /
//                   Fish and Fishery/ Aquatic Products herein listed are authorized for
//                   domestic movement:
//                 </p>
//               </div>
    
//               <div>
//                 <table className='el'>
//                   <thead>
//                     <tr>
//                       <th colSpan="5">A. TRANSPORT DETAILS</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>
//                         <ol start={1}>
//                           <li start>Shipper's Name</li>
//                         </ol>
//                       </td>
//                       <td>
//                         <l>{formValues.shipperName}</l>
//                       </td>
//                       <td >
//                         <ol start={3}>
//                           <li>Consignee's Name</li>
//                         </ol>
//                       </td>
//                       <td colSpan="2">
//                         <l>{formValues.consigneeName}</l>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <ol>
//                           <li>Shipper's Address</li>
//                         </ol>
//                       </td>
//                       <td>
//                         address: <l>{formValues.shipperAddress}</l><br />
//                         contact number: <l>{formValues.contactNo}</l>
//                       </td>
//                       <td>
//                         <ol start="3">
//                           <li>Consignee's Address</li>
//                         </ol>
//                       </td>
//                       <td colSpan="2">
//                       address: <l>{formValues.consigneeAddress}</l><br />
//                       contact number: <ol>{formValues.consigneeContactNo}</ol>
//                       </td>
//                     </tr>
//                     <tr>
//                     <td colSpan="">
//                             <ol start="5">
//                                 <li>Place of Origin</li>
//                             </ol>
//                             </td>
//                             <td colSpan="">
//                             <l>{formValues.placeOfOrigin}</l>
//                             </td>
//                             <td >
//                             <ol start="6">
//                                 <li>Port of Destination</li>
//                             </ol>
//                             </td>
//                             <td colSpan="2">
//                             <ol>{formValues.portOfDestination}</ol>
//                             </td>
//                         </tr> 
//                         <tr>
//                             <td colSpan="">
//                             <ol>
//                                 <li>Transport Means</li>
//                             </ol>
//                             </td>
//                             <td colSpan="">
//                             <ol>{formValues.transportMeans}</ol>
//                             </td>
//                             <td >
//                             <ol start="8">
//                                 <li>Date of Departure</li>
//                             </ol>
//                             </td>
//                             <td colSpan="2">
//                             Date: <l>{new Date(formValues.dateOfDeparture).toLocaleDateString('en-GB')}</l> 
//                             </td>
//                         </tr>
//                         <tr>
//                             <td colSpan="">
//                             <ol start="9">
//                                 <li>Transport ID</li>
//                             </ol>
//                             </td>
//                             <td colSpan="4">
//                             Plate No.: <l>{formValues.transportId}</l>
//                             <select name="vessel"style={{ marginLeft: 20}}> {/*onChange={handleChange}*/}
//                                 <option value="Montenegro">Montenegro</option>
//                                 <option value="Starhorse">Starhorse</option>
//                             </select>
//                             <select name="vesselName" style={{ marginLeft: 20}}> {/*onChange={handleChange}*/}
//                                 <option value="1">M/V Maria Diana</option>
//                                 <option value="2">M/V Reina Divinagracia</option>
//                             </select>
//                             </td>
//                         </tr>
//                         <tr>
//                         <th colSpan="5"><b>B. PRODUCT DETAILS <i>(Use Separate sheets if necessary)</i></b></th>
//                         </tr>
//                         <tr className="tableA">
//                             <td>
//                             <ol start="10">
//                                 <li>Commodity <i>(Common name and Scientific name)</i></li>
//                                 <ol>{formValues.commodity}</ol>
//                             </ol>
//                             </td>
//                             <td>
//                             <ol start="11">
//                                 <li>Description <i>(Including parts, marks, derrivatives, number, if any)</i></li>
//                                 <ol>{formValues.description}</ol>
//                             </ol>
//                             </td>
//                             <td>
//                             <ol start="12">
//                                 <li>Quantity <i>(Kgs./Ton.)</i></li>
//                                 <ol>{formValues.quantity}</ol>
//                             </ol>
//                             </td>
//                             <td >
//                             <ol start="13">
//                                 <li>Market Value <i>(Est.)</i></li>
//                                 <ol>{formValues.marketValue}</ol>
//                             </ol>
//                             </td>
//                             <td>
//                             <ol start="14">
//                                 <li>Remarks <i>(No. of tubs, boxes, pcs. purpose.etc.)</i></li>
//                                 <ol>{formValues.remarks}</ol>
//                             </ol>
//                             </td>
//                         </tr>  
//                         <tr>
//                         <td colSpan="5">.</td>
//                     </tr> 
//                     <tr>
//                         <th colSpan="5">C. TRACEABILITY <i>(Check the appropriate box indicate the corresponding code)</i></th>
//                     </tr>
//                     <tr className="checkbox">
//                         <td colSpan="3"><input type="checkbox"/>Aquatic Wildlife Collector's permit (AWCP) <br/>
//                             <input type="checkbox"/>Aquatic Wildlife Farm Permit (AWFP) <br/>
//                             <input type="checkbox"/>Aquatic Wildlife Special Use Permit (AWSUP) <br/>
//                             <input type="checkbox"/>Certificate of Aquatic Wildlife Registration <br/>
//                             <input type="checkbox"/>Certificate of Compliance <i>(Processing Establishment)</i> <br/>
//                             <input type="checkbox"/> Farm Registration/Inventory
//                         </td>
//                         <td colSpan="3">
//                             <input type="checkbox"/>Health Certificate <br/>
//                             <input type="checkbox"/>CFVGL/BoatR  <br/>
//                             <input type="checkbox"/>Auxiliary Invoice  <br/>
//                             <input type="checkbox"/>SPS Import Clearance <br/>
//                             <input type="checkbox"/>Other's <i>(please specify)</i> from LGU - 
//                             <select name="LGU" id="LGU-mduque">
//                                 <option value="#">Gasan, Marinduque</option>
//                                 <option value="#">Boac, Marinduque</option>
//                                 <option value="#">Mogpog, Marinduque</option>
//                                 <option value="#">Torrijos, Marinduque</option>
//                                 <option value="#">Gasan, Marinduque</option>
//                                 <option value="#">Boac, Marinduque</option>
//                             </select>
//                         </td>
//                     </tr> 
//                     <tr className='dry-seal'>
//                         <ol className="dry-seal">
//                             <img src={Img} alt="BFAR Logo" />
//                         </ol>
//                             <td className='fees'>
//                             <i>Fees collected: <ol>{formValues.amount}</ol></i> <br/><br/> 
//                             <i>Official Receipt No.: <ol>{formValues.or}</ol></i> <br/><br/>
//                             <i>O.R Date: <ol>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</ol></i>
//                             </td>
//                             <ol className="quar">
//                             <i>Issued by:</i><br/><br/><br/><br/>
//                             <ol className="quar1">
//                                 <h3>FERDINAND L. DE GALICIA</h3>
//                                 <p>FRO-I/Fisheries Inspection & Quarantine Officer <br/>
//                                 Balanacan Port, Mogpog, Marinduque - - CP#09773375767/ 09087332916</p>
//                                 <p>Name of Approving Officer</p>
//                             </ol>
//                             <i>Ispected by:</i><br/><br/><br/><br/>
//                             <l className="quar2">
//                                 <h3>FERDINAND L. DE GALICIA</h3>
//                                 <p>FRO-I/Fisheries Inspection & Quarantine Officer <br/>
//                                     Balanacan Port, Mogpog, Marinduque - - CP#09773375767/ 09087332916</p>
//                                 <p>Name of Fisheries Inspection</p>
//                             </l>
//                         </ol>
//                         </tr>                     
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </Box>
//         </DialogTitle>
//         );
//       default:
//         return null;
//     }
//   };
//   const handlePrint = () => {
//     window.print(); // Trigger the print functionality
//   };

//   const paginatedData = data
//   .filter((row) => row.status !== 'rejected' && row.status !== 'approved')
//   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
//   return (
//     <Box sx={{ padding: 3, backgroundColor: colors.background.default, minHeight: '100vh' }}>
//       <PageHeader>
//         <HeaderTypography variant="h4">
//           LTP Management
//         </HeaderTypography>
//       </PageHeader>

//       <StyledPaper>
//         <TableContainer sx={{ maxHeight: 600 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <StyledTableCell key={column.id}>
//                     {column.name}
//                   </StyledTableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {!isLoading && paginatedData.map((row) => (
//                 <StyledTableRow key={row._id || row.invoiceId}>
//                   {columns.map((column) => (
//                     <TableCell key={column.id}>
//                       {column.id === 'actions' ? (
//                         <ActionButtonContainer direction="row" spacing={1}>
//                           <Tooltip title="Approve" arrow>
//                             <ActionButton
//                               onClick={() => handleApprove(row._id)}
//                               sx={{ color: colors.success }}
//                             >
//                               <CheckCircleIcon />
//                             </ActionButton>
//                           </Tooltip>
//                           <Tooltip title="Reject" arrow>
//                             <ActionButton
//                               onClick={() => handleReject(row._id)}
//                               sx={{ color: colors.error }}
//                             >
//                               <CancelIcon />
//                             </ActionButton>
//                           </Tooltip>
//                           <Tooltip title="Edit" arrow>
//                             <ActionButton
//                               onClick={() => handleEdit(row)}
//                               sx={{ color: colors.secondary }}
//                             >
//                               <CreateIcon />
//                             </ActionButton>
//                           </Tooltip>
//                           <Tooltip title="Delete" arrow>
//                             <ActionButton
//                               onClick={() => handleDelete(row._id)}
//                               sx={{ color: colors.warning }}
//                             >
//                               <DeleteIcon />
//                             </ActionButton>
//                           </Tooltip>
//                         </ActionButtonContainer>
//                       ) : column.id === 'dateIssued' || column.id === 'dateOfDeparture' ? (
//                         row[column.id] ? new Date(row[column.id]).toLocaleDateString('en-GB') : ''
//                       ) : (
//                         row[column.id]
//                       )}
//                     </TableCell>
//                   ))}
//                 </StyledTableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
        
//         <TablePagination
//           component="div"
//           count={data.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${alpha(colors.text.secondary, 0.1)}`,
//             color: colors.text.secondary,
//           }}
//         />
//       </StyledPaper>

//       <Dialog 
//         open={open} 
//         onClose={handleClose} 
//         maxWidth="md" 
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             backgroundColor: colors.background.paper,
//           }
//         }}
//       >
//         <DialogContent>
//           {renderStep()}
//         </DialogContent>
//         <DialogActions sx={{ padding: 2, backgroundColor: alpha(colors.background.hover, 0.3) }}>
//           {step > 1 && step <= 3 && (
//             <Button 
//               variant="outlined" 
//               onClick={handlePrevStep}
//               sx={{ color: colors.text.primary, borderColor: colors.text.primary }}
//             >
//               Previous
//             </Button>
//           )}
//           {step < 4 && (
//             <Button 
//               variant="contained" 
//               onClick={handleNextStep}
//               sx={{ 
//                 backgroundColor: colors.primary,
//                 '&:hover': {
//                   backgroundColor: alpha(colors.primary, 0.9),
//                 },
//                 color: colors.background.paper,
//               }}
//             >
//               Next
//             </Button>
//           )}
//           {step === 4 && (
//             <>
//               <Button 
//                 variant="contained" 
//                 onClick={handleSubmit}
//                 sx={{ 
//                   backgroundColor: colors.success,
//                   '&:hover': {
//                     backgroundColor: alpha(colors.success, 0.9),
//                   },
//                   color: colors.background.paper,
//                 }}
//               >
//                 Submit
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 onClick={handlePrint} 
//                 startIcon={<PrintIcon />}
//                 sx={{ color: colors.text.primary, borderColor: colors.text.primary }}
//               >
//                 Print
//               </Button>
//             </>
//           )}
//           <Button 
//             variant="outlined" 
//             onClick={handleClose} 
//             sx={{ color: colors.error, borderColor: colors.error }}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={() => setNotification({ ...notification, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={notification.severity}
//           variant="filled"
//           sx={{
//             backgroundColor: notification.severity === 'success' ? colors.success : colors.error,
//           }}
//         >
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ltpPermit;


import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, Typography,
  TableHead, TableRow, Box, TextField, TablePagination, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, useTheme, IconButton,
  Stack, Chip, Tooltip, Alert, Snackbar, InputAdornment, Card, CardHeader, CardContent,   Grid, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { getPermit, updatePermitData, deletePermitData, getInvoice, createPermitFromInvoice, updatePermitStatus } from '../../states/api.js';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import Img from '../../images/dry seal BFAR.png';
import Logo from '../../images/BFAR logo.png';
import "./style.css";

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

// Styled components with updated colors
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#2C3E50',
  color: colors.background.paper,
  padding: '16px 16px',
  fontSize: '.675rem',
  fontWeight: 400,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(colors.background.hover, 0.3),
  },
  '&:nth-of-type(even)': {
    backgroundColor: colors.background.paper,
  },
  '&:hover': {
    backgroundColor: alpha(colors.secondary, 0.08),
  },
  '& td': {
    color: colors.text.secondary,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  '&:hover': {
    backgroundColor: alpha(colors.background.hover, 0.8),
  },
}));

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: colors.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: colors.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  overflow: 'hidden',
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: 'primary',
}));

const ActionButtonContainer = styled(Stack)(({ theme }) => ({
  '& .MuiIconButton-root': {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
}));

const ltpPermit = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [formValues, setFormValues] = useState({
    ltpNo: '', 
    shipperName: '', 
    shipperAddress: '', 
    contactNo: '',
    consigneeName: '', 
    consigneeAddress: '', 
    consigneeContactNo: '',
    placeOfOrigin: '', 
    portOfDestination: '', 
    transportMeans: '',
    dateOfDeparture: '', 
    transportId: '', 
    commodity: '', 
    description: '',
    quantity: '', 
    marketValue: '', 
    remarks: '', 
    or: '', 
    amount: '', 
    dateIssued: '',
  });
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Use the imported getInvoice function
  //       const invoiceData = await getInvoice();
        
  //       // Filter and map approved invoices
  //       const approvedInvoices = invoiceData
  //         .filter(invoice => invoice.status === 'approved')
  //         .map(invoice => ({
  //           shipperName: invoice.shipper,
  //           shipperAddress: invoice.address,
  //           consigneeName: invoice.consignee,
  //           consigneeAddress: invoice.destination,
  //           commodity: invoice.products,
  //           quantity: invoice.quantity,
  //           dateIssued: invoice.date,
  //           or: invoice.or,
  //           amount: invoice.amount,
  //           status: 'pending',
  //           fromInvoice: true,
  //           invoiceId: invoice._id,
  //           // Adding empty fields that will be editable in LTP
  //           ltpNo: '',
  //           contactNo: '',
  //           consigneeContactNo: '',
  //           placeOfOrigin: '',
  //           transportMeans: '',
  //           portOfDestination:'',
  //           dateOfDeparture: '',
  //           transportId: '',
  //           description: '',
  //           marketValue: '',
  //           remarks: '',
  //         }));

  //       // Fetch existing LTP permits
  //       const permitData = await getPermit();
        
  //       // Combine both datasets
  //       const combinedData = [...permitData, ...approvedInvoices];
  //       setData(combinedData);
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error);
  //       setNotification({
  //         open: true,
  //         message: 'Failed to fetch data',
  //         severity: 'error'
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the imported getInvoice function
        const invoiceData = await getInvoice();
        
        // Filter and map approved invoices
        const approvedInvoices = invoiceData
          .filter(invoice => invoice.status === 'approved')
          .map(invoice => ({
            shipperName: invoice.shipper,
            shipperAddress: invoice.address,
            consigneeName: invoice.consignee,
            consigneeAddress: invoice.destination,
            commodity: invoice.products,
            quantity: invoice.quantity,
            dateIssued: invoice.date,
            or: invoice.or,
            amount: invoice.amount,
            status: 'pending',
            fromInvoice: true,
            invoiceId: invoice._id,
            // Adding empty fields that will be editable in LTP
            ltpNo: '',
            contactNo: '',
            consigneeContactNo: '',
            placeOfOrigin: '',
            transportMeans: '',
            portOfDestination:'',
            dateOfDeparture: '',
            transportId: '',
            description: '',
            marketValue: '',
            remarks: '',
          }));

        // Fetch existing LTP permits
        const permitData = await getPermit();
        
        // Combine both datasets
        const combinedData = [...permitData, ...approvedInvoices];

        // Sort the combined data by dateIssued in descending order (most recent first)
        const sortedData = combinedData.sort((a, b) => {
          const dateA = new Date(a.dateIssued);
          const dateB = new Date(b.dateIssued);
          return dateB - dateA; // For descending order (most recent first)
        });

        setData(sortedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setNotification({
          open: true,
          message: 'Failed to fetch data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to validate permit ID
const validatePermitId = (row) => {
  return row && (row._id || row.invoiceId);
};

const currentYear = new Date().getFullYear().toString().slice(-2);

const handleSubmit = async () => {
  try {
    if (!currentRow) {
      throw new Error('No row selected');
    }
    const fullLtpNumber = getFullLtpNumber(formValues.ltpNo);
      
      // Use the fullLtpNumber when sending to the server
      const dataToSubmit = {
        ...formValues,
        ltpNo: fullLtpNumber,
      };

    // Check for either permit ID or invoice ID
    const permitId = currentRow._id || currentRow.invoiceId;
    if (!permitId) {
      throw new Error('Invalid permit ID');
    }

    // Validate required fields
    const requiredFields = [
      'ltpNo', 'shipperName', 'shipperAddress', 'contactNo',
      'consigneeName', 'consigneeAddress', 'consigneeContactNo',
      'placeOfOrigin', 'portOfDestination', 'transportMeans',
      'dateOfDeparture', 'transportId', 'commodity', 'description',
      'quantity', 'marketValue', 'remarks', 'or', 'amount', 'dateIssued'
    ];

    const missingFields = requiredFields.filter(field => !formValues[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Handle different data sources
    const response = currentRow.fromInvoice
      ? await createPermitFromInvoice(currentRow.invoiceId, formValues)
      : await updatePermitData(permitId, formValues);

    if (!response || !response.data) {
      throw new Error('Failed to update permit');
    }

    setNotification({
      open: true,
      message: currentRow.fromInvoice ? 'Permit created successfully' : 'Permit updated successfully',
      severity: 'success'
    });

    await refreshData();
    handleClose();
  } catch (error) {
    console.error('Error updating permit:', error);
    setNotification({
      open: true,
      message: error.message || 'Error updating permit',
      severity: 'error'
    });
  }
};

// Updated refreshData function
const refreshData = async () => {
  setIsLoading(true);
  try {
    const [invoiceData, permitData] = await Promise.all([
      getInvoice(),
      getPermit()
    ]);

    // Only map approved invoices that don't already have a permit
    const existingPermitInvoiceIds = new Set(
      permitData
        .filter(permit => permit.invoiceId)
        .map(permit => permit.invoiceId)
    );

    const approvedInvoices = invoiceData
      .filter(invoice => 
        invoice.status === 'approved' && 
        !existingPermitInvoiceIds.has(invoice._id)
      )
      .map(invoice => ({
        shipperName: invoice.shipper,
        shipperAddress: invoice.address,
        consigneeName: invoice.consignee,
        consigneeAddress: invoice.destination,
        commodity: invoice.products,
        quantity: invoice.quantity,
        dateIssued: invoice.date,
        or: invoice.or,
        amount: invoice.amount,
        status: 'pending',
        fromInvoice: true,
        invoiceId: invoice._id,
        ltpNo: '',
        contactNo: '',
        consigneeContactNo: '',
        portOfDestination: '',
        placeOfOrigin: '',
        transportMeans: '',
        dateOfDeparture: '',
        transportId: '',
        description: '',
        marketValue: '',
        remarks: '',
      }));

    setData([...permitData, ...approvedInvoices]);
  } catch (error) {
    setNotification({
      open: true,
      message: 'Failed to refresh data',
      severity: 'error'
    });
  } finally {
    setIsLoading(false);
  }
};

  const columns = [
    { id: 'ltpNo', name: 'LTP' }, 
    { id: 'shipperName', name: 'Shipper' },  
    { id: 'shipperAddress', name: 'Shipper Address' },  
    { id: 'consigneeName', name: 'Consignee' },  
    { id: 'consigneeAddress', name: 'Consignee Address' },  
    { id: 'placeOfOrigin', name: 'Origin' },  
    { id: 'portOfDestination', name: 'Port' },  
    { id: 'transportMeans', name: 'Transport' }, 
    { id: 'dateOfDeparture', name: 'Departure' },  
    { id: 'commodity', name: 'Commodity' }, 
    { id: 'quantity', name: 'Qty' }, 
    { id: 'marketValue', name: 'Market' },  
    { id: 'or', name: 'OR' },  
    { id: 'amount', name: 'Amt' }, 
    { id: 'dateIssued', name: 'Issued' },  
    { id: 'actions', name: 'Actions' }, 
];

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return !!(
          formValues.ltpNo &&
          formValues.shipperName &&
          formValues.shipperAddress &&
          formValues.contactNo &&
          formValues.consigneeName &&
          formValues.consigneeAddress &&
          formValues.consigneeContactNo &&
          formValues.placeOfOrigin &&
          formValues.portOfDestination &&
          formValues.transportMeans &&
          formValues.dateOfDeparture &&
          formValues.transportId
        );
      case 2:
        return !!(
          formValues.commodity &&
          formValues.description &&
          formValues.quantity &&
          formValues.marketValue &&
          formValues.remarks
        );
      case 3:
        return !!(
          formValues.or &&
          formValues.amount &&
          formValues.dateIssued
        );
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      }
    } else {
      setNotification({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleEdit = (row) => {
    setEditing(true);
    setCurrentRow(row);
    setFormValues(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
    setCurrentRow(null);
    setFormValues({
      ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
      consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
      placeOfOrigin: '', portOfDestination: '', transportMeans: '',
      dateOfDeparture: '', transportId: '', commodity: '', description: '',
      quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: '',
    });
    setStep(1);
  };

  

  const handleDelete = async (id) => {
    if (!id) {
      setNotification({
        open: true,
        message: 'Invalid permit ID',
        severity: 'error'
      });
      return;
    }

    try {
      await deletePermitData(id);
      await refreshData();
      setNotification({
        open: true,
        message: 'Permit deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting permit:', error);
      setNotification({
        open: true,
        message: 'Failed to delete permit',
        severity: 'error'
      });
    }
  };

  // Update your handleApprove and handleReject functions in your component
const handleApprove = async (id) => {
  if (!id) {
    setNotification({
      open: true,
      message: 'Invalid permit ID',
      severity: 'error'
    });
    return;
  }

  try {
    const response = await updatePermitStatus(id, 'approved');
    if (response.data.success) {
      await refreshData();
      setNotification({
        open: true,
        message: 'Permit approved successfully',
        severity: 'success'
      });
    } else {
      throw new Error(response.data.message || 'Failed to approve permit');
    }
  } catch (error) {
    console.error('Failed to approve permit:', error);
    setNotification({
      open: true,
      message: error.message || 'Failed to approve permit',
      severity: 'error'
    });
  }
};

// const handleReject = async (id) => {
//   if (!id) {
//     setNotification({
//       open: true,
//       message: 'Invalid permit ID',
//       severity: 'error'
//     });
//     return;
//   }

//   try {
//     const response = await updatePermitStatus(id, 'rejected');
//     if (response.data.success) {
//       await refreshData();
//       setNotification({
//         open: true,
//         message: 'Permit rejected successfully',
//         severity: 'success'
//       });
//     } else {
//       throw new Error(response.data.message || 'Failed to reject permit');
//     }
//   } catch (error) {
//     console.error('Failed to reject permit:', error);
//     setNotification({
//       open: true,
//       message: error.message || 'Failed to reject permit',
//       severity: 'error'
//     });
//   }
// };

const getFullLtpNumber = (lastFourDigits) => {
  return `LTP-41-MADSI-${currentYear}-${lastFourDigits}`;
};

const isValidPhilippineNumber = (number) => {
  // Check if number starts with '09' and has 11 digits
  // or starts with '639' and has 12 digits
  return /^(09\d{9}|639\d{9})$/.test(number);
};

// Helper function to format phone number as user types
const formatPhoneNumber = (value) => {
  // Remove any non-digit characters
  const cleanedValue = value.replace(/\D/g, '');
  
  // If starts with '639', convert to '09' format
  if (cleanedValue.startsWith('639')) {
    return '09' + cleanedValue.slice(3);
  }
  
  // If doesn't start with '09', force it to start with '09'
  if (!cleanedValue.startsWith('09') && cleanedValue.length > 0) {
    return '09' + cleanedValue;
  }
  
  return cleanedValue;
};

const handleChangePage = (event, newPage) => setPage(newPage);
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};
const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <DialogTitle className='no-print'>{editing ? 'Transport Details' : 'Transport Details'}
          {/* <TextField
                label="LTP Number"
                value={formValues.ltpNo}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only up to 4 numeric characters
                  if (/^\d{0,4}$/.test(value)) {
                    setFormValues({ ...formValues, ltpNo: value });
                  }
                }}
                fullWidth
                margin="normal"
                inputProps={{
                  maxLength: 4, // This prevents more than 4 characters being entered
                }}
                placeholder="Enter 4-digit LTP number"
              /> */}
              <TextField
                label="LTP Number"
                value={formValues.ltpNo}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only up to 4 numeric characters
                  if (/^\d{0,4}$/.test(value)) {
                    setFormValues({ ...formValues, ltpNo: value });
                  }
                }}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      LTP-41-MADSI-{currentYear}-
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  maxLength: 4,
                }}
                placeholder="0000"
                // helperText="Enter last 4 digits"
              />
              <TextField
                  label="Shipper Name"
                  value={formValues.shipperName}
                  onChange={(e) => setFormValues({ ...formValues, shipperName: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Shipper Address"
                  value={formValues.shipperAddress}
                  onChange={(e) => setFormValues({ ...formValues, shipperAddress: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
              label="Shipper Contact"
              value={formValues.contactNo}
              onChange={(e) => {
                const value = e.target.value;
                const formattedValue = formatPhoneNumber(value);
                if (formattedValue.length <= 11) {
                  setFormValues({ ...formValues, contactNo: formattedValue });
                }
              }}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: formValues.contactNo.length === 0 ? (
                  <InputAdornment position="start">09</InputAdornment>
                ) : null,
              }}
              inputProps={{
                maxLength: 11,
              }}
              error={!!formValues.contactNo && !isValidPhilippineNumber(formValues.contactNo)}
              helperText={
                formValues.contactNo && !isValidPhilippineNumber(formValues.contactNo)
                  ? "Please enter a valid Philippine mobile number (09xxxxxxxxx)"
                  : "Format: 09xxxxxxxxx"
              }
              placeholder="9xxxxxxxxx"
            />
              <TextField
                  label="Consignee Name"
                  value={formValues.consigneeName}
                  onChange={(e) => setFormValues({ ...formValues, consigneeName: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Consignee Address"
                  value={formValues.consigneeAddress}
                  onChange={(e) => setFormValues({ ...formValues, consigneeAddress: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
              label="Consignee Contact"
              value={formValues.consigneeContactNo}
              onChange={(e) => {
                const value = e.target.value;
                const formattedValue = formatPhoneNumber(value);
                if (formattedValue.length <= 11) {
                  setFormValues({ ...formValues, consigneeContactNo: formattedValue });
                }
              }}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: formValues.consigneeContactNo.length === 0 ? (
                  <InputAdornment position="start">09</InputAdornment>
                ) : null,
              }}
              inputProps={{
                maxLength: 11,
              }}
              error={!!formValues.consigneeContactNo && !isValidPhilippineNumber(formValues.consigneeContactNo)}
              helperText={
                formValues.consigneeContactNo && !isValidPhilippineNumber(formValues.consigneeContactNo)
                  ? "Please enter a valid Philippine mobile number (09xxxxxxxxx)"
                  : "Format: 09xxxxxxxxx"
              }
              placeholder="9xxxxxxxxx"
            />
              <TextField
                  label="Place Origin"
                  value={formValues.placeOfOrigin}
                  onChange={(e) => setFormValues({ ...formValues, placeOfOrigin: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Port Destination"
                  value={formValues.portOfDestination}
                  onChange={(e) => setFormValues({ ...formValues, portOfDestination: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Transport Means"
                  value={formValues.transportMeans}
                  onChange={(e) => setFormValues({ ...formValues, transportMeans: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                label="Date of Departure"
                type="date"
                value={formValues.dateOfDeparture}
                onChange={(e) => {
                  const value = e.target.value;
                  const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
                  if (value >= currentDate) {
                    setFormValues({ ...formValues, dateOfDeparture: value });
                  }
                }}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  !!formValues.dateOfDeparture &&
                  formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
                }
                helperText={
                  formValues.dateOfDeparture &&
                  formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
                    ? "Date of departure cannot be in the past."
                    : ""
                }
              />
              <TextField
                label="Plate Number"
                type="text"
                value={formValues.transportId}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow alphanumeric characters only
                  if (/^[a-zA-Z0-9]*$/.test(value)) {
                    setFormValues({ ...formValues, transportId: value });
                  }
                }}
                fullWidth
                margin="normal"
                inputProps={{
                  maxLength: 10, // Set a reasonable maximum length
                }}
                placeholder="Enter Transport Id"
              />
        </DialogTitle>
      );
    case 2:
      return (
        <DialogTitle className='no-print'>{editing ? 'Product Details' : 'Product Details'}
          <TextField
                  label="Commodity"
                  value={formValues.commodity}
                  onChange={(e) => setFormValues({ ...formValues, commodity: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Description"
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Quantity"
                  type='number'
                  value={formValues.quantity}
                  onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Market Value"
                  type='number'
                  value={formValues.marketValue}
                  onChange={(e) => setFormValues({ ...formValues, marketValue: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Remarks"
                  value={formValues.remarks}
                  onChange={(e) => setFormValues({ ...formValues, remarks: e.target.value })}
                  fullWidth
                  margin="normal"
              />
        </DialogTitle>
      );
    case 3:
      return (
        <DialogTitle className='no-print'>{editing ? 'OR Details' : 'OR Details'}
          <TextField
              label="OR Number"
              value={formValues.or}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                // Allow only positive integers
                if (/^\d*$/.test(value)) {
                  setFormValues({ ...formValues, or: value });
                }
              }}
              fullWidth
              margin="normal"
              inputProps={{
                min: 0, // Prevents negative numbers
                maxLength: 10, // Optional: Adjust based on the OR number length
              }}
              placeholder="Enter OR number"
            />
              <TextField
                  label="Amount"
                  type='number'
                  value={formValues.amount}
                  onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
                  fullWidth
                  margin="normal"
              />
              <TextField
                  label="Date Issued"
                  type="date"
                  value={formValues.dateIssued}
                  onChange={(e) =>
                    setFormValues({ ...formValues, dateIssued: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true, // Ensures the label doesn't overlap with the date picker
                  }}
              />
        </DialogTitle>
      );
    case 4:
      return (
        <DialogTitle className=''>{editing ? 'Preview Form' : 'Preview Form'}
          <style>
              {`
                  @media print {
                        @page {
                          size: A4;
                          margin: 10mm;
                        }

                        body {
                          width: 210mm;
                          height: 297mm;
                          margin: 0 auto;
                          padding: 0;
                        }
                          body, p, td, th, div {
                          font-size: 10pt !important;
                          line-height: 1.2 !important;
                        }

                        table, .MuiGrid-container {
                          page-break-inside: avoid;
                        }

                        /* Tighten up spacing */
                        .MuiCardContent-root {
                          padding: 8px !important;
                        }

                        /* Ensure elements don't overflow */
                        * {
                          max-width: 100% !important;
                          overflow: visible !important;
                        }
                        
                        .no-print {
                          display: none !important;
                        }
                      }
              `}
          </style>
          
      {/* Header */}
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box component="img" src={Logo} alt="BFAR Logo" mr={2} />
            <div className="content">
          <div className="title">
            <Typography variant="h6">Republic of the Philippines</Typography>
          </div>
          <div className="title-blue">
            <div className="title">
              <Typography variant="h6">Department of Agriculture</Typography>
            </div>
            <div className="title1">
              <Typography variant="h5">BUREAU OF FISHERIES AND AQUATIC RESOURCES - MIMAROPA</Typography>
            </div>
          </div>
          <div className="title">
            <Typography variant="h4">FISHERIES INSPECTION AND QUARANTINE SERVICES</Typography>
          </div>
          <div className="title">
            <Typography variant="h6">
              Le Grace Building, Roxas Drive, Brgy Guinobatan, Calapan City, Oriental Mindoro<br />
              Telephone number: (043) 288-2022 / Email address: fiqsmimaropa@gmail.com
            </Typography>
          </div>
        </div>
            
          </Box>
        }
      />
      <CardContent>
      <Typography textAlign="center" fontWeight="bold" variant="h4" mb={2}>LOCAL TRANSPORT PERMIT</Typography>

      <Grid container justifyContent="flex-end" mb={2}>
        <Grid item>
          <Typography sx={{ marginBottom: 1 }}>
            Date: {new Date(formValues.dateIssued).toLocaleDateString('en-GB')}
          </Typography>
          <Typography>
            LTP No.: LTP-41-MADSI-24-{formValues.ltpNo}
          </Typography>
        </Grid>
      </Grid>

        <div>
          <p>
            Pursuant to the provisions of <i>
              <b>Philippine Fisheries Code of 1998</b>
            </i> (RA No. 8550, as amended by RA No. 10654, An Act to prevent, Deter and Eliminate IUU Fishing), <i>
              <b>Food Safety Act of 2013</b>
            </i> (RA No. 10611) <i>
              <b>Wildlife Resources Conservation and Protection Act</b>
            </i> (RA No. 9147), its Implementing Rules and Regulations, and Fisheries Administrative Order No. 233, Series of 2010, the Aquatic Wildlife / Fish and Fishery/ Aquatic Products herein listed are authorized for domestic movement:
          </p>
        </div>

        {/* Transport Details */}
        <Box border={1}  p={2}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>A. TRANSPORT DETAILS</Typography>
          <Grid container>
  {/* Left Side */}
  <Grid item xs={12} sm={6}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word", width: "30%" }}>
            <Typography>Shipper's Name:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>{formValues.shipperName}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Shipper's Address:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>
              {formValues.shipperAddress}<br />
              Contact Number: {formValues.contactNo}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Place of Origin:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>{formValues.placeOfOrigin}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Transport Means:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>{formValues.transportMeans}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Grid>

  {/* Right Side */}
  <Grid item xs={12} sm={6}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Consignee's Name:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>{formValues.consigneeName}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Consignee's Address:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>
              {formValues.consigneeAddress}<br />
              Contact Number: {formValues.consigneeContactNo}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Port of Destination:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>{formValues.portOfDestination}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>Date of Departure:</Typography>
          </TableCell>
          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>
              {new Date(formValues.dateOfDeparture).toLocaleDateString('en-GB')}
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Grid>

  {/* Transport ID spanning both columns */}
  <Grid item xs={12}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell colSpan={2} sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            <Typography>
              Transport ID: Plate No. {formValues.transportId}
              {/* <TextField select name="vessel" variant="standard" sx={{ ml: 2 }}>
                <MenuItem value="Montenegro">Montenegro</MenuItem>
                <MenuItem value="Starhorse">Starhorse</MenuItem>
              </TextField>
              <TextField select name="vesselName" variant="standard" sx={{ ml: 2 }}>
                <MenuItem value="1">M/V Maria Diana</MenuItem>
                <MenuItem value="2">M/V Reina Divinagracia</MenuItem>
              </TextField> */}
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Grid>
</Grid>

        </Box>

        {/* Product Details */}
        <Box border={1} p={2}>
          <Typography variant="h6" fontWeight="bold" mb={1} textAlign="center">B. PRODUCT DETAILS</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Commodity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Market Value</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{formValues.commodity}</TableCell>
                <TableCell>{formValues.description}</TableCell>
                <TableCell>{formValues.quantity}</TableCell>
                <TableCell>{formValues.marketValue}</TableCell>
                <TableCell>{formValues.remarks}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Traceability Checkboxes */}
        <Box border={1} p={2}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={1}>C. TRACEABILITY</Typography>
          <Grid container >
            <Grid item xs={6}>
              <FormControlLabel control={<Checkbox />} label="Aquatic Wildlife Collector's permit (AWCP)" />
              <FormControlLabel control={<Checkbox />} label="Aquatic Wildlife Farm Permit (AWFP)" />
              <FormControlLabel control={<Checkbox />} label="Aquatic Wildlife Special Use Permit (AWSUP)" />
              <FormControlLabel control={<Checkbox />} label="Certificate of Aquatic Wildlife Registration" />
              <FormControlLabel control={<Checkbox />} label="Certificate of Compliance (Processing Establishment)" />
              <FormControlLabel control={<Checkbox />} label="Farm Registration/Inventory" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Checkbox />} label="Health Certificate" />
              <FormControlLabel control={<Checkbox />} label="CFVGL/BoatR" />
              <FormControlLabel control={<Checkbox />} label="Auxiliary Invoice" />
              <FormControlLabel control={<Checkbox />} label="SPS Import Clearance" />
              <FormControlLabel control={<Checkbox />} label="Other's (please specify) from LGU">
                <TextField select name="LGU" variant="standard">
                  <MenuItem value="Gasan, Marinduque">Gasan, Marinduque</MenuItem>
                  <MenuItem value="Boac, Marinduque">Boac, Marinduque</MenuItem>
                  <MenuItem value="Mogpog, Marinduque">Mogpog, Marinduque</MenuItem>
                  <MenuItem value="Torrijos, Marinduque">Torrijos, Marinduque</MenuItem>
                </TextField>
              </FormControlLabel>
            </Grid>
          </Grid>
        </Box>

        {/* Signatures */}
        <Box border={1} p={2}>
          <Grid container spacing={4} justifyContent="center">
            {/* Issued By */}
            <Grid item xs={6}>
            
            
              <TableBody>
                <TableRow>
                <ol className="dry-seal">
                  <img src={Img} alt="BFAR Logo" />
                </ol>
                  <TableCell className="fees">
                    <i>Fees collected: <ol>{formValues.amount}</ol></i><br /><br />
                    <i>Official Receipt No.: <ol>{formValues.or}</ol></i><br /><br />
                    <i>O.R Date: <ol>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</ol></i>
                  </TableCell>
                </TableRow>
              </TableBody>
           
              
            </Grid>

            {/* Inspected By */}
            <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom>Issued by:</Typography>
              <Typography variant="h6">FERDINAND L. DE GALICIA</Typography>
              <Typography variant="body2">
                FRO-I/Fisheries Inspection & Quarantine Officer<br />
                Balanacan Port, Mogpog, Marinduque<br />
                CP#09773375767/ 09087332916
              </Typography>
              <Typography variant="subtitle1" gutterBottom>Inspected by:</Typography>
              <Typography variant="h6">FERDINAND L. DE GALICIA</Typography>
              <Typography variant="body2">
                FRO-I/Fisheries Inspection & Quarantine Officer<br />
                Balanacan Port, Mogpog, Marinduque<br />
                CP#09773375767/ 09087332916
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      </DialogTitle>
      );
    default:
      return null;
  }
};
const handlePrint = () => {
  window.print(); // Trigger the print functionality
};

const paginatedData = data
.filter((row) => row.status !== 'rejected' && row.status !== 'approved')
.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

return (
  <Box sx={{ padding: 3, backgroundColor: colors.background.default, minHeight: '100vh' }}>
    <PageHeader>
      <HeaderTypography variant="h4">
        LTP Management
      </HeaderTypography>
    </PageHeader>

    <StyledPaper>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id}>
                  {column.name}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && paginatedData.map((row) => (
              <StyledTableRow key={row._id || row.invoiceId}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === 'actions' ? (
                      <ActionButtonContainer direction="row" spacing={1}>
                        {row.fromInvoice ? (
                          // Only show Edit button for data from invoice
                          <Tooltip title="Edit" arrow>
                            <ActionButton
                              onClick={() => handleEdit(row)}
                              sx={{ color: colors.secondary }}
                            >
                              <CreateIcon />
                            </ActionButton>
                          </Tooltip>
                        ) : (
                          // Show all buttons for regular permits
                          <>
                            <Tooltip title="Approve" arrow>
                              <ActionButton
                                onClick={() => handleApprove(row._id)}
                                sx={{ color: colors.success }}
                              >
                                <CheckCircleIcon />
                              </ActionButton>
                            </Tooltip>
                            {/* <Tooltip title="Reject" arrow>
                              <ActionButton
                                onClick={() => handleReject(row._id)}
                                sx={{ color: colors.error }}
                              >
                                <CancelIcon />
                              </ActionButton>
                            </Tooltip> */}
                            <Tooltip title="Edit" arrow>
                              <ActionButton
                                onClick={() => handleEdit(row)}
                                sx={{ color: colors.secondary }}
                              >
                                <CreateIcon />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <ActionButton
                                onClick={() => handleDelete(row._id)}
                                sx={{ color: colors.warning }}
                              >
                                <DeleteIcon />
                              </ActionButton>
                            </Tooltip>
                          </>
                        )}
                      </ActionButtonContainer>
                    ) : column.id === 'dateIssued' || column.id === 'dateOfDeparture' ? (
                      row[column.id] ? new Date(row[column.id]).toLocaleDateString('en-GB') : ''
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: `1px solid ${alpha(colors.text.secondary, 0.1)}`,
          color: colors.text.secondary,
        }}
      />
    </StyledPaper>

    <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: colors.background.paper,
          }
        }}
      >
        <DialogContent>
          {renderStep()}
        </DialogContent>
        <DialogActions sx={{ padding: 2, backgroundColor: alpha(colors.background.hover, 0.3) }}>
          {step > 1 && step <= 3 && (
            <Button 
              variant="outlined" 
              onClick={handlePrevStep}
              sx={{ color: colors.text.primary, borderColor: colors.text.primary }}
            >
              Previous
            </Button>
          )}
          {step < 4 && (
            <Button 
              variant="contained" 
              onClick={handleNextStep}
              sx={{ 
                backgroundColor: colors.primary,
                '&:hover': {
                  backgroundColor: alpha(colors.primary, 0.9),
                },
                color: colors.background.paper,
              }}
            >
              Next
            </Button>
          )}
          {step === 4 && (
            <>
              <Button 
                variant="contained" 
                className='no-print'
                onClick={handleSubmit}
                sx={{ 
                  backgroundColor: colors.success,
                  '&:hover': {
                    backgroundColor: alpha(colors.success, 0.9),
                  },
                  color: colors.background.paper,
                }}
              >
                Submit
              </Button>
              <Button 
                variant="outlined" 
                className='no-print'
                onClick={handlePrint} 
                startIcon={<PrintIcon />}
                sx={{ color: colors.text.primary, borderColor: colors.text.primary }}
              >
                Print
              </Button>
            </>
          )}
          <Button 
            variant="outlined" 
            className='no-print'
            onClick={handleClose} 
            sx={{ color: colors.error, borderColor: colors.error }}
          >
            Cancel
          </Button>
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

export default ltpPermit;