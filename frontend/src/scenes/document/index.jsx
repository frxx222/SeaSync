// import React, { useState, useEffect } from 'react';
// import {
//     Paper, Table, TableBody, TableCell,
//     TableContainer, TableHead, TableRow,
//     Box, TablePagination, CircularProgress,
//     Typography, TextField, Dialog, DialogActions,
//     DialogContent, DialogTitle, Button, Stepper, Step, StepLabel
// } from '@mui/material';
// import { useTheme } from '@mui/material';
// import { getPermit, postPermit, updatePermitData } from '../../states/api.js'; // Fetch permit data
// import Logo from '../../images/BFAR logo.png';
// import Img from '../../images/dry seal BFAR.png';
// import "./index.css";

// const PermitStatusView = () => {
//     const theme = useTheme();
//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [formValues, setFormValues] = useState({
//         ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
//         consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
//         placeOfOrigin: '', portOfDestination: '', transportMeans: '',
//         dateOfDeparture: '', transportId: '', commodity: '', description: '',
//         quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: '',
//       });
//     // Pagination states
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(20);

//     // Filter and search states
//     const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
//     const [searchTerm, setSearchTerm] = useState('');

//     // Edit modal states
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null); // Store selected row for editing
//     const [currentStep, setCurrentStep] = useState(0); // Track current step in stepper
//     const [editing, setEditing] = useState(false);
//     const [currentRow, setCurrentRow] = useState(null); // Track the selected row
  

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const permitData = await getPermit(); // Fetch the data from the API
//                 const sortedData = (permitData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
//                 setData(sortedData);
//             } catch (error) {
//                 console.error('Failed to fetch permit data:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const columns = [
//         { id: 'ltpNo', name: 'LTP' },
//         { id: 'shipperName', name: 'Shipper' },
//         { id: 'consigneeName', name: 'Consignee' },
//         { id: 'placeOfOrigin', name: 'Origin' },
//         { id: 'portOfDestination', name: 'Destination' },
//         { id: 'dateOfDeparture', name: 'Departure' },
//         { id: 'commodity', name: 'Commodity' },
//         { id: 'quantity', name: 'Qty' },
//         { id: 'dateIssued', name: 'Issued' },
//         { id: 'status', name: 'Status' },
//     ];

//     const filteredData = data.filter((item) => {
//         const matchesMonth = item.dateIssued?.substring(0, 7) === selectedMonth;
//         const matchesSearch = item.shipperName?.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesMonth && matchesSearch;
//     });

//     const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     const handleRowClick = (row) => {
//         setSelectedRow(row);
//         setCurrentRow(row);  // Set the currently selected row
//         setEditing(true);     // Set editing to true
//         setIsEditModalOpen(true);
//         setCurrentStep(0);    // Reset to the first step
//         setFormValues({
//             ltpNo: row.ltpNo || '',
//             shipperName: row.shipperName || '',
//             consigneeName: row.consigneeName || '',
//             placeOfOrigin: row.placeOfOrigin || '',
//             portOfDestination: row.portOfDestination || '',
//             dateOfDeparture: row.dateOfDeparture || '',
//             transportMeans: row.transportMeans || '',
//             description: row.description || '',
//             quantity: row.quantity || '',
//             marketValue: row.marketValue || '',
//             remarks: row.remarks || '',
//             or: row.or || '',
//             amount: row.amount || '',
//             dateIssued: row.dateIssued || ''
//         });
//         setCurrentStep(0);
//     };
    

//     const handleSubmit = async () => {
//         try {
//             if (editing) {
//                 // Update the existing permit
//                 await updatePermitData(currentRow._id, formValues);
//             } else {
//                 // Create a new permit
//                 await postPermit(formValues);
//             }
    
//             // Fetch the updated data
//             const updatedData = await getPermit(); 
//             setData(updatedData);  // Update the state with new data
    
//             handleClose();  // Close the modal
//         } catch (error) {
//             console.error('Error saving permit data:', error);
//         }
//     };

//     const handleClose = () => {
//         setIsEditModalOpen(false);
//         setEditing(false);
//         setCurrentRow(null);
//         setFormValues({
//             ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
//             consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
//             placeOfOrigin: '', portOfDestination: '', transportMeans: '',
//             dateOfDeparture: '', transportId: '', commodity: '', description: '',
//             quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: ''
//         });
//         setCurrentStep(0);
//     };
    

//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         const date = new Date(dateString);
//         return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
//     };

//     const getStatusColor = (status) => {
//         if (status === 'approved') return 'green';
//         if (status === 'rejected') return 'red';
//         if (status === 'pending') return 'orange';
//         return theme.palette.text.primary;
//     };

//     const renderCellContent = (row, column) => {
//         if (column.id === 'shipperName') {
//             return (
//                 <span
//                     style={{
                        
//                         color: 'dark',
//                         cursor: 'pointer',
//                     }}
//                     onClick={() => handleRowClick(row)}
//                 >
//                     {row[column.id]}
//                 </span>
//             );
//         } else if (['dateOfDeparture', 'dateIssued'].includes(column.id)) {
//             return row[column.id] ? formatDate(row[column.id]) : '-';
//         } else if (column.id === 'status') {
//             return (
//                 <span style={{ color: getStatusColor(row[column.id]), fontWeight: 'bold' }}>
//                     {row[column.id]}
//                 </span>
//             );
//         }
//         return row[column.id] || '-';
//     };

//     const steps = ['Edit Details', 'Preview'];

//     const handlePrint = () => {
//         window.print(); // Trigger the print functionality
//       };

//     return (
//         <Box m="4rem 2rem" width="76vw">
//             <Box sx={{ margin: '1%' }}>
//                 {/* Search and filter options */}
//                 <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2}>
//                     <TextField
//                         label="Filter by Month"
//                         type="month"
//                         value={selectedMonth}
//                         onChange={(e) => setSelectedMonth(e.target.value)}
//                         InputLabelProps={{ shrink: true }}
//                         sx={{ marginBottom: { xs: 2, sm: 0 } }}
//                     />
//                     <TextField
//                         label="Search by Shipper Name"
//                         variant="outlined"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         sx={{ width: '300px' }}
//                     />
//                 </Box>

//                 {isLoading ? (
//                     <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//                         <CircularProgress />
//                     </Box>
//                 ) : filteredData.length === 0 ? (
//                     <Typography variant="h6" align="center" color="textSecondary">
//                         No data available for the selected month and search criteria.
//                     </Typography>
//                 ) : (
//                     <>
//                         <TableContainer component={Paper} style={{ flexGrow: 1, maxHeight: '60vh', overflowY: 'auto' }}>
//                             <Table stickyHeader>
//                                 <TableHead>
//                                     <TableRow>
//                                         {columns.map((column) => (
//                                             <TableCell
//                                                 key={column.id}
//                                                 sx={{
//                                                     backgroundColor: theme.palette.secondary[200],
//                                                     color: 'white',
//                                                     fontSize: '0.875rem',
//                                                     fontWeight: 'bold',
//                                                 }}
//                                             >
//                                                 {column.name}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {paginatedData.map((row) => (
//                                         <TableRow key={row._id}>
//                                             {columns.map((column) => (
//                                                 <TableCell key={column.id} sx={{ fontSize: '0.875rem', padding: '6px' }}>
//                                                     {renderCellContent(row, column)}
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>

//                         <TablePagination
//                             component="div"
//                             count={filteredData.length}
//                             page={page}
//                             onPageChange={(event, newPage) => setPage(newPage)}
//                             rowsPerPage={rowsPerPage}
//                             onRowsPerPageChange={(event) => {
//                                 setRowsPerPage(parseInt(event.target.value, 10));
//                                 setPage(0);
//                             }}
//                             rowsPerPageOptions={[5, 10, 20]}
//                         />
//                     </>
//                 )}
//             </Box>

//             {/* Edit Dialog with Steps */}
//             {selectedRow && (
//                 <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth >
//                     <DialogTitle  className='no-print'>{steps[currentStep]}</DialogTitle>
//                     <DialogContent >
//                         {currentStep === 0 ? (
//                             // Edit Details Step
//                             <>
//                                 <TextField
//                                 label="LTP Number"
//                                 value={formValues.ltpNo}
//                                 onChange={(e) => {
//                                     const value = e.target.value;
//                                     // Allow only up to 4 numeric characters
//                                     if (/^\d{0,4}$/.test(value)) {
//                                     setFormValues({ ...formValues, ltpNo: value });
//                                     }
//                                 }}
//                                 fullWidth
//                                 margin="normal"
//                                 inputProps={{
//                                     maxLength: 4, // This prevents more than 4 characters being entered
//                                 }}
//                                 placeholder="Enter 4-digit LTP number"
//                                 />
//                                 <TextField
//                                     label="Commodity"
//                                     value={formValues.commodity}
//                                     onChange={(e) => setFormValues({ ...formValues, commodity: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Description"
//                                     value={formValues.description}
//                                     onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Quantity"
//                                     type='number'
//                                     value={formValues.quantity}
//                                     onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Market Value"
//                                     type='number'
//                                     value={formValues.marketValue}
//                                     onChange={(e) => setFormValues({ ...formValues, marketValue: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Remarks"
//                                     value={formValues.remarks}
//                                     onChange={(e) => setFormValues({ ...formValues, remarks: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="OR Number"
//                                     value={formValues.or}
//                                     type="number"
//                                     onChange={(e) => {
//                                     const value = e.target.value;
//                                     // Allow only positive integers
//                                     if (/^\d*$/.test(value)) {
//                                         setFormValues({ ...formValues, or: value });
//                                     }
//                                     }}
//                                     fullWidth
//                                     margin="normal"
//                                     inputProps={{
//                                     min: 0, // Prevents negative numbers
//                                     maxLength: 10, // Optional: Adjust based on the OR number length
//                                     }}
//                                     placeholder="Enter OR number"
//                                 />
//                                     <TextField
//                                         label="Amount"
//                                         type='number'
//                                         value={formValues.amount}
//                                         onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
//                                         fullWidth
//                                         margin="normal"
//                                     />
//                                     <TextField
//                                         label="Date Issued"
//                                         type="date"
//                                         value={formValues.dateIssued}
//                                         onChange={(e) =>
//                                         setFormValues({ ...formValues, dateIssued: e.target.value })
//                                         }
//                                         fullWidth
//                                         margin="normal"
//                                         InputLabelProps={{
//                                         shrink: true, // Ensures the label doesn't overlap with the date picker
//                                         }}
//                                     />
//                                     <TextField
//                                         label="Date of Departure"
//                                         type="date"
//                                         value={formValues.dateOfDeparture}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
//                                             if (value >= currentDate) {
//                                             setFormValues({ ...formValues, dateOfDeparture: value });
//                                             }
//                                         }}
//                                         fullWidth
//                                         margin="normal"
//                                         InputLabelProps={{
//                                             shrink: true,
//                                         }}
//                                         error={
//                                             !!formValues.dateOfDeparture &&
//                                             formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
//                                         }
//                                         helperText={
//                                             formValues.dateOfDeparture &&
//                                             formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
//                                             ? "Date of departure cannot be in the past."
//                                             : ""
//                                         }
//                                         />
//                             </>
//                         ) : (
//                             <>
//                             <style>
//                                 {`
//                                     @media print {
//                                         .no-print {
//                                             display: none !important;
//                                         }
//                                         .container {
//                                             width: 8in; /* Width of a bond paper */
//                                             height: 11in; /* Height of a bond paper */
//                                             margin: 0;
//                                              /* Add some padding for margins */
                                            
//                                             overflow: hidden; /* Avoid content overflow */
//                                             font-size: 10px; /* Adjust font size to fit the content */
//                                         }
//                                         .content, .main-content {
//                                                 max-width: 90%;
//                                             }

//                                             table {
//                                                 width: 90%;
//                                                 font-size: 8px; /* Reduce table font size if needed */
//                                                 border-collapse: collapse;
//                                             }

//                                             th, td {
//                                                 padding: 3px; /* Adjust padding to fit the content */
//                                             }

//                                             img {
//                                                 max-width: 100px; /* Resize logo image */
//                                                 height: auto;
//                                             }
//                                     }
//                                 `}
//                             </style>
//                             <Box style={{marginLeft: -30, }}>
//                                 <div className="container">
//                                     <img src={Logo} alt="BFAR Logo" />
//                                     <div className="content" >
//                                     <div className="title">
//                                         <h3>Republic of the Philippines</h3>
//                                     </div>
//                                     <div className="title-blue">
//                                         <div className="title">
//                                         <h3>Department of Agriculture</h3>
//                                         </div>
//                                         <div className="title1">
//                                         <h2>BUREAU OF FISHERIES AND AQUATIC RESOURCES - MIMAROPA</h2>
//                                         </div>
//                                     </div>
//                                     <div className="title">
//                                         <h1>FISHERIES INSPECTION AND QUARANTINE SERVICES</h1>
//                                     </div>
//                                     <div className="title">
//                                         <h3>
//                                         Le Grace Building, Roxas Drive, Brgy Guinobatan, Calapan City,
//                                         Oriental Mindoro
//                                         <br />
//                                         Telephone number: (043) 288-2022 / Email address:
//                                         fiqsmimaropa@gmail.com
//                                         </h3>
//                                     </div>
//                                     </div>
                            
//                                     <div className="main-content">
//                                     <div className="ltp-permit">
//                                         <h1>LOCAL TRANSPORT PERMIT</h1>
//                                     </div>
//                                     <div className="date-no">
//                                         <ol className="ltp-date">
//                                         <div>
//                                         <span>Date:</span>
//                                         <l>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</l>
//                                         </div>
//                                         </ol>
//                                         <ol className="ltp-no">
//                                         <p className="ltp-no">
//                                             LTP No.: LTP-41-MADSI-24-
//                                             <l>{formValues.ltpNo}</l>
//                                         </p>
//                                         </ol>
//                                     </div>
                            
//                                     <div >
//                                         <p>
//                                         Pursuant to the provisions of <i>
//                                             <b>Philippine Fisheries Code of 1998</b>
//                                         </i>{" "}
//                                         (RA No. 8550, as amended by RA No. 10654, An Act to prevent, Deter
//                                         and Eliminate IUU Fishing), <i>
//                                             <b>Food Safety Act of 2013</b>
//                                         </i>{" "}
//                                         (RA No. 10611) <i>
//                                             <b>Wildlife Resources Conservation and Protection Act</b>
//                                         </i>{" "}
//                                         (RA No. 9147), its Implementing Rules and Regulations, and Fisheries
//                                         Administrative Order No. 233, Series of 2010, the Aquatic Wildlife /
//                                         Fish and Fishery/ Aquatic Products herein listed are authorized for
//                                         domestic movement:
//                                         </p>
//                                     </div>
                            
//                                     <div>
//                                         <table className='el'>
//                                         <thead>
//                                             <tr>
//                                             <th colSpan="5">A. TRANSPORT DETAILS</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr>
//                                             <td>
//                                                 <ol start={1}>
//                                                 <li start>Shipper's Name</li>
//                                                 </ol>
//                                             </td>
//                                             <td>
//                                                 <l>{formValues.shipperName}</l>
//                                             </td>
//                                             <td >
//                                                 <ol start={3}>
//                                                 <li>Consignee's Name</li>
//                                                 </ol>
//                                             </td>
//                                             <td colSpan="2">
//                                                 <l>{formValues.consigneeName}</l>
//                                             </td>
//                                             </tr>
//                                             <tr>
//                                             <td>
//                                                 <ol>
//                                                 <li>Shipper's Address</li>
//                                                 </ol>
//                                             </td>
//                                             <td>
//                                                 address: <l>{formValues.shipperAddress}</l><br />
//                                                 contact number: <l>{formValues.contactNo}</l>
//                                             </td>
//                                             <td>
//                                                 <ol start="3">
//                                                 <li>Consignee's Address</li>
//                                                 </ol>
//                                             </td>
//                                             <td colSpan="2">
//                                             address: <l>{formValues.consigneeAddress}</l><br />
//                                             contact number: <ol>{formValues.consigneeContactNo}</ol>
//                                             </td>
//                                             </tr>
//                                             <tr>
//                                             <td colSpan="">
//                                                     <ol start="5">
//                                                         <li>Place of Origin</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="">
//                                                     <l>{formValues.placeOfOrigin}</l>
//                                                     </td>
//                                                     <td >
//                                                     <ol start="6">
//                                                         <li>Port of Destination</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="2">
//                                                     <ol>{formValues.portOfDestination}</ol>
//                                                     </td>
//                                                 </tr> 
//                                                 <tr>
//                                                     <td colSpan="">
//                                                     <ol>
//                                                         <li>Transport Means</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="">
//                                                     <ol>{formValues.transportMeans}</ol>
//                                                     </td>
//                                                     <td >
//                                                     <ol start="8">
//                                                         <li>Date of Departure</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="2">
//                                                     Date: <l>{new Date(formValues.dateOfDeparture).toLocaleDateString('en-GB')}</l> 
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td colSpan="">
//                                                     <ol start="9">
//                                                         <li>Transport ID</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="4">
//                                                     Plate No.: <l>{formValues.transportId}</l>
//                                                     <select name="vessel"style={{ marginLeft: 20}}> {/*onChange={handleChange}*/}
//                                                         <option value="Montenegro">Montenegro</option>
//                                                         <option value="Starhorse">Starhorse</option>
//                                                     </select>
//                                                     <select name="vesselName" style={{ marginLeft: 20}}> {/*onChange={handleChange}*/}
//                                                         <option value="1">M/V Maria Diana</option>
//                                                         <option value="2">M/V Reina Divinagracia</option>
//                                                     </select>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                 <th colSpan="5"><b>B. PRODUCT DETAILS <i>(Use Separate sheets if necessary)</i></b></th>
//                                                 </tr>
//                                                 <tr className="tableA">
//                                                     <td>
//                                                     <ol start="10">
//                                                         <li>Commodity <i>(Common name and Scientific name)</i></li>
//                                                         <ol>{formValues.commodity}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td>
//                                                     <ol start="11">
//                                                         <li>Description <i>(Including parts, marks, derrivatives, number, if any)</i></li>
//                                                         <ol>{formValues.description}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td>
//                                                     <ol start="12">
//                                                         <li>Quantity <i>(Kgs./Ton.)</i></li>
//                                                         <ol>{formValues.quantity}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td >
//                                                     <ol start="13">
//                                                         <li>Market Value <i>(Est.)</i></li>
//                                                         <ol>{formValues.marketValue}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td>
//                                                     <ol start="14">
//                                                         <li>Remarks <i>(No. of tubs, boxes, pcs. purpose.etc.)</i></li>
//                                                         <ol>{formValues.remarks}</ol>
//                                                     </ol>
//                                                     </td>
//                                                 </tr>  
//                                                 <tr>
//                                                 <td colSpan="5">.</td>
//                                             </tr> 
//                                             <tr>
//                                                 <th colSpan="5">C. TRACEABILITY <i>(Check the appropriate box indicate the corresponding code)</i></th>
//                                             </tr>
//                                             <tr className="checkbox">
//                                                 <td colSpan="3"><input type="checkbox"/>Aquatic Wildlife Collector's permit (AWCP) <br/>
//                                                     <input type="checkbox"/>Aquatic Wildlife Farm Permit (AWFP) <br/>
//                                                     <input type="checkbox"/>Aquatic Wildlife Special Use Permit (AWSUP) <br/>
//                                                     <input type="checkbox"/>Certificate of Aquatic Wildlife Registration <br/>
//                                                     <input type="checkbox"/>Certificate of Compliance <i>(Processing Establishment)</i> <br/>
//                                                     <input type="checkbox"/> Farm Registration/Inventory
//                                                 </td>
//                                                 <td colSpan="3">
//                                                     <input type="checkbox"/>Health Certificate <br/>
//                                                     <input type="checkbox"/>CFVGL/BoatR  <br/>
//                                                     <input type="checkbox"/>Auxiliary Invoice  <br/>
//                                                     <input type="checkbox"/>SPS Import Clearance <br/>
//                                                     <input type="checkbox"/>Other's <i>(please specify)</i> from LGU - 
//                                                     <select name="LGU" id="LGU-mduque">
//                                                         <option value="#">Gasan, Marinduque</option>
//                                                         <option value="#">Boac, Marinduque</option>
//                                                         <option value="#">Mogpog, Marinduque</option>
//                                                         <option value="#">Torrijos, Marinduque</option>
//                                                         <option value="#">Gasan, Marinduque</option>
//                                                         <option value="#">Boac, Marinduque</option>
//                                                     </select>
//                                                 </td>
//                                             </tr> 
//                                             <tr className='dry-seal'>
//                                                 <ol className="dry-seal">
//                                                     <img src={Img} alt="BFAR Logo" />
//                                                 </ol>
//                                                     <td className='fees'>
//                                                     <i>Fees collected: <ol>{formValues.amount}</ol></i> <br/><br/> 
//                                                     <i>Official Receipt No.: <ol>{formValues.or}</ol></i> <br/><br/>
//                                                     <i>O.R Date: <ol>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</ol></i>
//                                                     </td>
//                                                     <ol className="quar">
//                                                     <i>Issued by:</i><br/><br/><br/><br/>
//                                                     <ol className="quar1">
//                                                         <h3>FERDINAND L. DE GALICIA</h3>
//                                                         <p>FRO-I/Fisheries Inspection & Quarantine Officer <br/>
//                                                         Balanacan Port, Mogpog, Marinduque - - CP#09773375767/ 09087332916</p>
//                                                         <p>Name of Approving Officer</p>
//                                                     </ol>
//                                                     <i>Ispected by:</i><br/><br/><br/><br/>
//                                                     <l className="quar2">
//                                                         <h3>FERDINAND L. DE GALICIA</h3>
//                                                         <p>FRO-I/Fisheries Inspection & Quarantine Officer <br/>
//                                                             Balanacan Port, Mogpog, Marinduque - - CP#09773375767/ 09087332916</p>
//                                                         <p>Name of Fisheries Inspection</p>
//                                                     </l>
//                                                 </ol>
//                                                 </tr>                     
//                                         </tbody>
//                                         </table>
//                                     </div>
//                                     </div>
//                                 </div>
//                                 </Box>
//                         </>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         {currentStep > 0 && (
//                             <Button onClick={() => setCurrentStep(currentStep - 1)}  className='no-print' color="secondary">
//                                 Back
//                             </Button>
//                         )}
//                         {currentStep < steps.length - 1 ? (
//                             <Button onClick={() => setCurrentStep(currentStep + 1)}  className='no-print' color="secondary">
//                                 Next
//                             </Button>
//                         ) : (
//                             <>
//                             <Button onClick={handleSubmit} className='no-print' color="success">Save</Button>
//                             <Button onClick={handlePrint} className='no-print' color='dark'>Print</Button>
//                             </>
//                         )}
//                     </DialogActions>
//                 </Dialog>
//             )}
//         </Box>
//     );
// };

// export default PermitStatusView;




// import React, { useState, useEffect } from 'react';
// import {
//     Paper, Table, TableBody, TableCell,
//     TableContainer, TableHead, TableRow,
//     Box, TablePagination, CircularProgress,
//     Typography, TextField, Dialog, DialogActions,
//     DialogContent, DialogTitle, Button, Stepper, Step, StepLabel,
//     Card, CardContent, Stack, InputAdornment, Fade, Chip,
//     Menu, MenuItem, IconButton, Drawer, FormControl, 
//     FormGroup, FormControlLabel, Checkbox, Select
// } from '@mui/material';
// import {
//     Search as SearchIcon,
//     CalendarMonth,
//     FilterList as FilterIcon,
//     Sort as SortIcon,
//     ArrowUpward as ArrowUpIcon,
//     ArrowDownward as ArrowDownIcon
// } from '@mui/icons-material';
// import { useTheme } from '@mui/material';
// import { getPermit, postPermit, updatePermitData } from '../../states/api.js';
// import Logo from '../../images/BFAR logo.png';
// import Img from '../../images/dry seal BFAR.png';
// import "./index.css";

// const PermitStatusView = () => {
//     // Existing state
//     const [data, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(20);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [currentStep, setCurrentStep] = useState(0);
//     const [currentRow, setCurrentRow] = useState(null);
//     const [editing, setEditing] = useState(false);
//     const [formValues, setFormValues] = useState({
//         ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
//         consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
//         placeOfOrigin: '', portOfDestination: '', transportMeans: '',
//         dateOfDeparture: '', transportId: '', commodity: '', description: '',
//         quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: '',
//       });

//     // New state for sorting and filtering
//     const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
//     const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//     const [filters, setFilters] = useState({
//         status: [],
//         commodity: [],
//         destination: []
//     });
//     const [anchorEl, setAnchorEl] = useState(null);

//     const theme = useTheme();

//     // Custom color palette
//     const colors = {
//         primary: '#2C3E50',
//         secondary: '#34495E',
//         success: '#27AE60',
//         warning: '#F39C12',
//         error: '#E74C3C',
//         background: '#ECF0F1',
//         headerGradient: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
//     };
    
//     // Enhanced styles
//     const styles = {
//         headerCard: {
//             mb: 4,
//             p: 2,
//             background: colors.headerGradient,
//             color: 'white',
//             borderRadius: 3,
//         },
//         filterContainer: {
//             display: 'flex',
//             gap: 2,
//             mb: 3,
//             flexWrap: 'wrap',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             backgroundColor: 'white',
//             p: 2,
//             borderRadius: 2,
//             boxShadow: 1,
//         },
//         searchField: {
//             minWidth: 300,
//             '& .MuiOutlinedInput-root': {
//                 borderRadius: 2,
//                 backgroundColor: 'white',
//             },
//         },
//         tableContainer: {
//             boxShadow: theme.shadows[2],
//             borderRadius: 2,
//             overflow: 'hidden',
//             backgroundColor: 'white',
//         },
//         statusChip: (status) => ({
//             backgroundColor: getStatusColor(status) + '20',
//             color: getStatusColor(status),
//             fontWeight: 'bold',
//             textTransform: 'capitalize',
//         }),
//         sortButton: {
//             color: theme.palette.text.secondary,
//             '&:hover': {
//                 color: colors.primary,
//             },
//         },
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const permitData = await getPermit(); // Fetch the data from the API
//                 const sortedData = (permitData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
//                 setData(sortedData);
//             } catch (error) {
//                 console.error('Failed to fetch permit data:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const columns = [
//         { id: 'ltpNo', name: 'LTP' },
//         { id: 'shipperName', name: 'Shipper' },
//         { id: 'consigneeName', name: 'Consignee' },
//         { id: 'placeOfOrigin', name: 'Origin' },
//         { id: 'portOfDestination', name: 'Destination' },
//         { id: 'dateOfDeparture', name: 'Departure' },
//         { id: 'commodity', name: 'Commodity' },
//         { id: 'quantity', name: 'Qty' },
//         { id: 'dateIssued', name: 'Issued' },
//         { id: 'status', name: 'Status' },
//     ];

//     const filteredData = data.filter((item) => {
//         const matchesMonth = item.dateIssued?.substring(0, 7) === selectedMonth;
//         const matchesSearch = item.shipperName?.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesMonth && matchesSearch;
//     });

   

//     const handleRowClick = (row) => {
//         setSelectedRow(row);
//         setCurrentRow(row);  // Set the currently selected row
//         setEditing(true);     // Set editing to true
//         setIsEditModalOpen(true);
//         setCurrentStep(0);    // Reset to the first step
//         setFormValues({
//             ltpNo: row.ltpNo || '',
//             shipperName: row.shipperName || '',
//             consigneeName: row.consigneeName || '',
//             placeOfOrigin: row.placeOfOrigin || '',
//             portOfDestination: row.portOfDestination || '',
//             dateOfDeparture: row.dateOfDeparture || '',
//             transportMeans: row.transportMeans || '',
//             description: row.description || '',
//             quantity: row.quantity || '',
//             marketValue: row.marketValue || '',
//             remarks: row.remarks || '',
//             or: row.or || '',
//             amount: row.amount || '',
//             dateIssued: row.dateIssued || ''
//         });
//         setCurrentStep(0);
//     };
    

//     const handleSubmit = async () => {
//         try {
//             if (editing) {
//                 // Update the existing permit
//                 await updatePermitData(currentRow._id, formValues);
//             } else {
//                 // Create a new permit
//                 await postPermit(formValues);
//             }
    
//             // Fetch the updated data
//             const updatedData = await getPermit(); 
//             setData(updatedData);  // Update the state with new data
    
//             handleClose();  // Close the modal
//         } catch (error) {
//             console.error('Error saving permit data:', error);
//         }
//     };

//     const handleClose = () => {
//         setIsEditModalOpen(false);
//         setEditing(false);
//         setCurrentRow(null);
//         setFormValues({
//             ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
//             consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
//             placeOfOrigin: '', portOfDestination: '', transportMeans: '',
//             dateOfDeparture: '', transportId: '', commodity: '', description: '',
//             quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: ''
//         });
//         setCurrentStep(0);
//     };

//     const steps = ['Edit Details', 'Preview'];

//     const handlePrint = () => {
//         window.print(); // Trigger the print functionality
//       };

//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         const date = new Date(dateString);
//         return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
//     };

//     // Enhanced status color function
//     const getStatusColor = (status) => {
//         const statusColors = {
//             approved: colors.success,
//             rejected: colors.error,
//             pending: colors.warning,
//         };
//         return statusColors[status] || theme.palette.text.primary;
//     };

//     // Sorting handlers
//     const handleSortClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleSortClose = () => {
//         setAnchorEl(null);
//     };

//     const handleSortSelect = (field) => {
//         setSortConfig(prev => ({
//             field,
//             direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
//         }));
//         handleSortClose();
//     };

//     // Filter handlers
//     const handleFilterChange = (filterType, value) => {
//         setFilters(prev => ({
//             ...prev,
//             [filterType]: value
//         }));
//     };

//     // Apply filters and sorting to data
//     const getFilteredAndSortedData = () => {
//         let filteredData = data.filter(item => {
//             const matchesMonth = item.dateIssued?.substring(0, 7) === selectedMonth;
//             const matchesSearch = item.shipperName?.toLowerCase().includes(searchTerm.toLowerCase());
//             const matchesStatus = filters.status.length === 0 || filters.status.includes(item.status);
//             const matchesCommodity = filters.commodity.length === 0 || filters.commodity.includes(item.commodity);
//             const matchesDestination = filters.destination.length === 0 || filters.destination.includes(item.portOfDestination);
            
//             return matchesMonth && matchesSearch && matchesStatus && matchesCommodity && matchesDestination;
//         });

//         if (sortConfig.field) {
//             filteredData.sort((a, b) => {
//                 if (a[sortConfig.field] < b[sortConfig.field]) return sortConfig.direction === 'asc' ? -1 : 1;
//                 if (a[sortConfig.field] > b[sortConfig.field]) return sortConfig.direction === 'asc' ? 1 : -1;
//                 return 0;
//             });
//         }

//         return filteredData;
//     };

//     // Enhanced cell renderer
//     const renderCellContent = (row, column) => {
//         if (column.id === 'shipperName') {
//             return (
//                 <Button
//                     color="#000000"
//                     onClick={() => handleRowClick(row)}
//                     sx={{ textTransform: 'none' }}
//                 >
//                     {row[column.id]}
//                 </Button>
//             );
//         } else if (['dateOfDeparture', 'dateIssued'].includes(column.id)) {
//             return row[column.id] ? formatDate(row[column.id]) : '-';
//         } else if (column.id === 'status') {
//             return (
//                 <Chip
//                     label={row[column.id]}
//                     sx={styles.statusChip(row[column.id])}
//                     size="small"
//                 />
//             );
//         }
//         return row[column.id] || '-';
//     };

//     // Get unique values for filters
//     const getUniqueValues = (field) => [...new Set(data.map(item => item[field]))].filter(Boolean);

//     const filteredAndSortedData = getFilteredAndSortedData();
//     const paginatedData = filteredAndSortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//         <Box m="4rem 2rem" width="76vw" sx={{ backgroundColor: colors.background, minHeight: '100vh', p: 3 }}>
//             <Fade in timeout={800}>
//                 <Box>
//                     <Card sx={{
//                             ...styles.headerCard, // Spread any existing styles from styles.headerCard
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'space-between',
//                         }}>
//                         <CardContent >
//                             <Typography variant="h5" fontWeight="bold" gutterBottom>
//                                 Permit Management System
//                             </Typography>
//                             <Typography variant="body2">
//                                 Manage and track all permit requests in one place
//                             </Typography>
//                         </CardContent>
//                         <IconButton onClick={() => setFilterDrawerOpen(true)} color='primary'>
//                             <FilterIcon />
//                         </IconButton>
//                     </Card>

//                     <Stack sx={styles.filterContainer}>
//                         <Stack direction="row" spacing={25} alignItems="center" display='flex' justifyContent='space-between'>
//                         <IconButton onClick={handleSortClick}>
//                                 <SortIcon />
//                             </IconButton>
//                             <TextField
//                                 type="month"
//                                 value={selectedMonth}
//                                 onChange={(e) => setSelectedMonth(e.target.value)}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <CalendarMonth />
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <TextField
//                                 placeholder="Search by Shipper Name"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 sx={styles.searchField}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <SearchIcon />
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         </Stack>
//                     </Stack>

//                     {/* Sort Menu */}
//                     <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleSortClose}
//                     >
//                         {columns.map((column) => (
//                             <MenuItem 
//                                 key={column.id}
//                                 onClick={() => handleSortSelect(column.id)}
//                             >
//                                 {column.name}
//                                 {sortConfig.field === column.id && (
//                                     sortConfig.direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />
//                                 )}
//                             </MenuItem>
//                         ))}
//                     </Menu>

//                     {/* Filter Drawer */}
//                     <Drawer
//                         anchor="right"
//                         open={filterDrawerOpen}
//                         onClose={() => setFilterDrawerOpen(false)}
//                     >
//                         <Box sx={{ width: 300, p: 3 }}>
//                             <Typography variant="h6" gutterBottom>Filters</Typography>
                            
//                             <FormControl fullWidth sx={{ mb: 3 }}>
//                                 <Typography variant="subtitle2" gutterBottom>Status</Typography>
//                                 <FormGroup>
//                                     {getUniqueValues('status').map((status) => (
//                                         <FormControlLabel
//                                             key={status}
//                                             control={
//                                                 <Checkbox
//                                                     checked={filters.status.includes(status)}
//                                                     sx={{
//                                                         color: 'primary', // Unchecked color
//                                                         '&.Mui-checked': {
//                                                         color: 'green', // Checked color
//                                                         },
//                                                     }}
//                                                     onChange={(e) => {
//                                                         if (e.target.checked) {
//                                                             handleFilterChange('status', [...filters.status, status]);
//                                                         } else {
//                                                             handleFilterChange('status', filters.status.filter(s => s !== status));
//                                                         }
//                                                     }}
//                                                 />
//                                             }
//                                             label={status}
//                                         />
//                                     ))}
//                                 </FormGroup>
//                             </FormControl>

//                             <FormControl fullWidth sx={{ mb: 3 }}>
//                                 <Typography variant="subtitle2" gutterBottom>Commodity</Typography>
//                                 <Select
//                                     multiple
//                                     value={filters.commodity}
//                                     onChange={(e) => handleFilterChange('commodity', e.target.value)}
//                                     renderValue={(selected) => selected.join(', ')}
//                                 >
//                                     {getUniqueValues('commodity').map((commodity) => (
//                                         <MenuItem key={commodity} value={commodity}>
//                                             <Checkbox checked={filters.commodity.includes(commodity)}  sx={{
//                                                 color: 'primary', // Unchecked color
//                                                 '&.Mui-checked': {
//                                                 color: 'green', // Checked color
//                                                 },
//                                             }}/>
//                                             <Typography>{commodity}</Typography>
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>

//                             <Button 
//                                 fullWidth 
//                                 variant="contained" 
//                                 onClick={() => setFilterDrawerOpen(false)}
//                                 sx={{ 
//                                     bgcolor: 'success.main',
//                                     '&:hover': { bgcolor: 'success.dark' },
//                                     mt: 2
//                                   }}
//                             >
//                                 Apply Filters
//                             </Button>
//                         </Box>
//                     </Drawer>

//                     {/* Table Section */}
//                     {isLoading ? (
//                         <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//                             <CircularProgress />
//                         </Box>
//                     ) : filteredAndSortedData.length === 0 ? (
//                         <Card sx={{ p: 4, textAlign: 'center' }}>
//                             <Typography variant="h6" color="textSecondary">
//                                 No data available for the selected criteria
//                             </Typography>
//                         </Card>
//                     ) : (
//                         <Paper sx={styles.tableContainer}>
//                             <TableContainer sx={{ maxHeight: '60vh' }}>
//                                 <Table stickyHeader>
//                                     <TableHead>
//                                         <TableRow>
//                                             {columns.map((column) => (
//                                                 <TableCell
//                                                     key={column.id}
//                                                     sx={{
//                                                         backgroundColor: colors.primary,
//                                                         color: 'white',
//                                                         fontWeight: 'bold',
//                                                     }}
//                                                 >
//                                                     {column.name}
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {paginatedData.map((row) => (
//                                             <TableRow
//                                                 key={row._id}
//                                                 hover
//                                                 sx={{
//                                                     '&:nth-of-type(odd)': {
//                                                         backgroundColor: colors.background,
//                                                     },
//                                                 }}
//                                             >
//                                                 {columns.map((column) => (
//                                                     <TableCell key={column.id}>
//                                                         {renderCellContent(row, column)}
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <TablePagination
//                                 component="div"
//                                 count={filteredAndSortedData.length}
//                                 page={page}
//                                 onPageChange={(event, newPage) => setPage(newPage)}
//                                 rowsPerPage={rowsPerPage}
//                                 onRowsPerPageChange={(event) => {
//                                     setRowsPerPage(parseInt(event.target.value, 10));
//                                     setPage(0);
//                                 }}
//                                 rowsPerPageOptions={[5, 10, 20]}
//                             />
//                         </Paper>
//                     )}

//                     {/* Keep existing Dialog component unchanged */}
//                     {selectedRow && (
//                         <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth>
//                             <DialogTitle  className='no-print'>{steps[currentStep]}</DialogTitle>
//                     <DialogContent >
//                         {currentStep === 0 ? (
//                             // Edit Details Step
//                             <>
//                                 <TextField
//                                 label="LTP Number"
//                                 value={formValues.ltpNo}
//                                 onChange={(e) => {
//                                     const value = e.target.value;
//                                     // Allow only up to 4 numeric characters
//                                     if (/^\d{0,4}$/.test(value)) {
//                                     setFormValues({ ...formValues, ltpNo: value });
//                                     }
//                                 }}
//                                 fullWidth
//                                 margin="normal"
//                                 inputProps={{
//                                     maxLength: 4, // This prevents more than 4 characters being entered
//                                 }}
//                                 placeholder="Enter 4-digit LTP number"
//                                 />
//                                 <TextField
//                                     label="Commodity"
//                                     value={formValues.commodity}
//                                     onChange={(e) => setFormValues({ ...formValues, commodity: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Description"
//                                     value={formValues.description}
//                                     onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Quantity"
//                                     type='number'
//                                     value={formValues.quantity}
//                                     onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Market Value"
//                                     type='number'
//                                     value={formValues.marketValue}
//                                     onChange={(e) => setFormValues({ ...formValues, marketValue: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Remarks"
//                                     value={formValues.remarks}
//                                     onChange={(e) => setFormValues({ ...formValues, remarks: e.target.value })}
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="OR Number"
//                                     value={formValues.or}
//                                     type="number"
//                                     onChange={(e) => {
//                                     const value = e.target.value;
//                                     // Allow only positive integers
//                                     if (/^\d*$/.test(value)) {
//                                         setFormValues({ ...formValues, or: value });
//                                     }
//                                     }}
//                                     fullWidth
//                                     margin="normal"
//                                     inputProps={{
//                                     min: 0, // Prevents negative numbers
//                                     maxLength: 10, // Optional: Adjust based on the OR number length
//                                     }}
//                                     placeholder="Enter OR number"
//                                 />
//                                     <TextField
//                                         label="Amount"
//                                         type='number'
//                                         value={formValues.amount}
//                                         onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
//                                         fullWidth
//                                         margin="normal"
//                                     />
//                                     <TextField
//                                         label="Date Issued"
//                                         type="date"
//                                         value={formValues.dateIssued}
//                                         onChange={(e) =>
//                                         setFormValues({ ...formValues, dateIssued: e.target.value })
//                                         }
//                                         fullWidth
//                                         margin="normal"
//                                         InputLabelProps={{
//                                         shrink: true, // Ensures the label doesn't overlap with the date picker
//                                         }}
//                                     />
//                                     <TextField
//                                         label="Date of Departure"
//                                         type="date"
//                                         value={formValues.dateOfDeparture}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
//                                             if (value >= currentDate) {
//                                             setFormValues({ ...formValues, dateOfDeparture: value });
//                                             }
//                                         }}
//                                         fullWidth
//                                         margin="normal"
//                                         InputLabelProps={{
//                                             shrink: true,
//                                         }}
//                                         error={
//                                             !!formValues.dateOfDeparture &&
//                                             formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
//                                         }
//                                         helperText={
//                                             formValues.dateOfDeparture &&
//                                             formValues.dateOfDeparture < new Date().toISOString().split("T")[0]
//                                             ? "Date of departure cannot be in the past."
//                                             : ""
//                                         }
//                                         />
//                             </>
//                         ) : (
//                             <>
//                             <style>
//                                 {`
//                                     @media print {
//                                         .no-print {
//                                             display: none !important;
//                                         }
//                                         .container {
//                                             width: 8in; /* Width of a bond paper */
//                                             height: 11in; /* Height of a bond paper */
//                                             margin: 0;
//                                              /* Add some padding for margins */
                                            
//                                             overflow: hidden; /* Avoid content overflow */
//                                             font-size: 10px; /* Adjust font size to fit the content */
//                                         }
//                                         .content, .main-content {
//                                                 max-width: 90%;
//                                             }

//                                             table {
//                                                 width: 90%;
//                                                 font-size: 8px; /* Reduce table font size if needed */
//                                                 border-collapse: collapse;
//                                             }

//                                             th, td {
//                                                 padding: 3px; /* Adjust padding to fit the content */
//                                             }

//                                             img {
//                                                 max-width: 100px; /* Resize logo image */
//                                                 height: auto;
//                                             }
//                                     }
//                                 `}
//                             </style>
//                             <Box style={{marginLeft: -30, }}>
//                                 <div className="container">
//                                     <img src={Logo} alt="BFAR Logo" />
//                                     <div className="content" >
//                                     <div className="title">
//                                         <h3>Republic of the Philippines</h3>
//                                     </div>
//                                     <div className="title-blue">
//                                         <div className="title">
//                                         <h3>Department of Agriculture</h3>
//                                         </div>
//                                         <div className="title1">
//                                         <h2>BUREAU OF FISHERIES AND AQUATIC RESOURCES - MIMAROPA</h2>
//                                         </div>
//                                     </div>
//                                     <div className="title">
//                                         <h1>FISHERIES INSPECTION AND QUARANTINE SERVICES</h1>
//                                     </div>
//                                     <div className="title">
//                                         <h3>
//                                         Le Grace Building, Roxas Drive, Brgy Guinobatan, Calapan City,
//                                         Oriental Mindoro
//                                         <br />
//                                         Telephone number: (043) 288-2022 / Email address:
//                                         fiqsmimaropa@gmail.com
//                                         </h3>
//                                     </div>
//                                     </div>
                            
//                                     <div className="main-content">
//                                     <div className="ltp-permit">
//                                         <h1>LOCAL TRANSPORT PERMIT</h1>
//                                     </div>
//                                     <div className="date-no">
//                                         <ol className="ltp-date">
//                                         <div>
//                                         <span>Date:</span>
//                                         <l>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</l>
//                                         </div>
//                                         </ol>
//                                         <ol className="ltp-no">
//                                         <p className="ltp-no">
//                                             LTP No.: LTP-41-MADSI-24-
//                                             <l>{formValues.ltpNo}</l>
//                                         </p>
//                                         </ol>
//                                     </div>
                            
//                                     <div >
//                                         <p>
//                                         Pursuant to the provisions of <i>
//                                             <b>Philippine Fisheries Code of 1998</b>
//                                         </i>{" "}
//                                         (RA No. 8550, as amended by RA No. 10654, An Act to prevent, Deter
//                                         and Eliminate IUU Fishing), <i>
//                                             <b>Food Safety Act of 2013</b>
//                                         </i>{" "}
//                                         (RA No. 10611) <i>
//                                             <b>Wildlife Resources Conservation and Protection Act</b>
//                                         </i>{" "}
//                                         (RA No. 9147), its Implementing Rules and Regulations, and Fisheries
//                                         Administrative Order No. 233, Series of 2010, the Aquatic Wildlife /
//                                         Fish and Fishery/ Aquatic Products herein listed are authorized for
//                                         domestic movement:
//                                         </p>
//                                     </div>
                            
//                                     <div>
//                                         <table className='el'>
//                                         <thead>
//                                             <tr>
//                                             <th colSpan="5">A. TRANSPORT DETAILS</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr>
//                                             <td>
//                                                 <ol start={1}>
//                                                 <li start>Shipper's Name</li>
//                                                 </ol>
//                                             </td>
//                                             <td>
//                                                 <l>{formValues.shipperName}</l>
//                                             </td>
//                                             <td >
//                                                 <ol start={3}>
//                                                 <li>Consignee's Name</li>
//                                                 </ol>
//                                             </td>
//                                             <td colSpan="2">
//                                                 <l>{formValues.consigneeName}</l>
//                                             </td>
//                                             </tr>
//                                             <tr>
//                                             <td>
//                                                 <ol>
//                                                 <li>Shipper's Address</li>
//                                                 </ol>
//                                             </td>
//                                             <td>
//                                                 address: <l>{formValues.shipperAddress}</l><br />
//                                                 contact number: <l>{formValues.contactNo}</l>
//                                             </td>
//                                             <td>
//                                                 <ol start="3">
//                                                 <li>Consignee's Address</li>
//                                                 </ol>
//                                             </td>
//                                             <td colSpan="2">
//                                             address: <l>{formValues.consigneeAddress}</l><br />
//                                             contact number: <ol>{formValues.consigneeContactNo}</ol>
//                                             </td>
//                                             </tr>
//                                             <tr>
//                                             <td colSpan="">
//                                                     <ol start="5">
//                                                         <li>Place of Origin</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="">
//                                                     <l>{formValues.placeOfOrigin}</l>
//                                                     </td>
//                                                     <td >
//                                                     <ol start="6">
//                                                         <li>Port of Destination</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="2">
//                                                     <ol>{formValues.portOfDestination}</ol>
//                                                     </td>
//                                                 </tr> 
//                                                 <tr>
//                                                     <td colSpan="">
//                                                     <ol>
//                                                         <li>Transport Means</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="">
//                                                     <ol>{formValues.transportMeans}</ol>
//                                                     </td>
//                                                     <td >
//                                                     <ol start="8">
//                                                         <li>Date of Departure</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="2">
//                                                     Date: <l>{new Date(formValues.dateOfDeparture).toLocaleDateString('en-GB')}</l> 
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td colSpan="">
//                                                     <ol start="9">
//                                                         <li>Transport ID</li>
//                                                     </ol>
//                                                     </td>
//                                                     <td colSpan="4">
//                                                     Plate No.: <l>{formValues.transportId}</l>
//                                                     <select name="vessel"style={{ marginLeft: 20}}> {/*onChange={handleChange}*/}
//                                                         <option value="Montenegro">Montenegro</option>
//                                                         <option value="Starhorse">Starhorse</option>
//                                                     </select>
//                                                     <select name="vesselName" style={{ marginLeft: 20}}> {/*onChange={handleChange}*/}
//                                                         <option value="1">M/V Maria Diana</option>
//                                                         <option value="2">M/V Reina Divinagracia</option>
//                                                     </select>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                 <th colSpan="5"><b>B. PRODUCT DETAILS <i>(Use Separate sheets if necessary)</i></b></th>
//                                                 </tr>
//                                                 <tr className="tableA">
//                                                     <td>
//                                                     <ol start="10">
//                                                         <li>Commodity <i>(Common name and Scientific name)</i></li>
//                                                         <ol>{formValues.commodity}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td>
//                                                     <ol start="11">
//                                                         <li>Description <i>(Including parts, marks, derrivatives, number, if any)</i></li>
//                                                         <ol>{formValues.description}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td>
//                                                     <ol start="12">
//                                                         <li>Quantity <i>(Kgs./Ton.)</i></li>
//                                                         <ol>{formValues.quantity}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td >
//                                                     <ol start="13">
//                                                         <li>Market Value <i>(Est.)</i></li>
//                                                         <ol>{formValues.marketValue}</ol>
//                                                     </ol>
//                                                     </td>
//                                                     <td>
//                                                     <ol start="14">
//                                                         <li>Remarks <i>(No. of tubs, boxes, pcs. purpose.etc.)</i></li>
//                                                         <ol>{formValues.remarks}</ol>
//                                                     </ol>
//                                                     </td>
//                                                 </tr>  
//                                                 <tr>
//                                                 <td colSpan="5">.</td>
//                                             </tr> 
//                                             <tr>
//                                                 <th colSpan="5">C. TRACEABILITY <i>(Check the appropriate box indicate the corresponding code)</i></th>
//                                             </tr>
//                                             <tr className="checkbox">
//                                                 <td colSpan="3"><input type="checkbox"/>Aquatic Wildlife Collector's permit (AWCP) <br/>
//                                                     <input type="checkbox"/>Aquatic Wildlife Farm Permit (AWFP) <br/>
//                                                     <input type="checkbox"/>Aquatic Wildlife Special Use Permit (AWSUP) <br/>
//                                                     <input type="checkbox"/>Certificate of Aquatic Wildlife Registration <br/>
//                                                     <input type="checkbox"/>Certificate of Compliance <i>(Processing Establishment)</i> <br/>
//                                                     <input type="checkbox"/> Farm Registration/Inventory
//                                                 </td>
//                                                 <td colSpan="3">
//                                                     <input type="checkbox"/>Health Certificate <br/>
//                                                     <input type="checkbox"/>CFVGL/BoatR  <br/>
//                                                     <input type="checkbox"/>Auxiliary Invoice  <br/>
//                                                     <input type="checkbox"/>SPS Import Clearance <br/>
//                                                     <input type="checkbox"/>Other's <i>(please specify)</i> from LGU - 
//                                                     <select name="LGU" id="LGU-mduque">
//                                                         <option value="#">Gasan, Marinduque</option>
//                                                         <option value="#">Boac, Marinduque</option>
//                                                         <option value="#">Mogpog, Marinduque</option>
//                                                         <option value="#">Torrijos, Marinduque</option>
//                                                         <option value="#">Gasan, Marinduque</option>
//                                                         <option value="#">Boac, Marinduque</option>
//                                                     </select>
//                                                 </td>
//                                             </tr> 
//                                             <tr className='dry-seal'>
//                                                 <ol className="dry-seal">
//                                                     <img src={Img} alt="BFAR Logo" />
//                                                 </ol>
//                                                     <td className='fees'>
//                                                     <i>Fees collected: <ol>{formValues.amount}</ol></i> <br/><br/> 
//                                                     <i>Official Receipt No.: <ol>{formValues.or}</ol></i> <br/><br/>
//                                                     <i>O.R Date: <ol>{new Date(formValues.dateIssued).toLocaleDateString('en-GB')}</ol></i>
//                                                     </td>
//                                                     <ol className="quar">
//                                                     <i>Issued by:</i><br/><br/><br/><br/>
//                                                     <ol className="quar1">
//                                                         <h3>FERDINAND L. DE GALICIA</h3>
//                                                         <p>FRO-I/Fisheries Inspection & Quarantine Officer <br/>
//                                                         Balanacan Port, Mogpog, Marinduque - - CP#09773375767/ 09087332916</p>
//                                                         <p>Name of Approving Officer</p>
//                                                     </ol>
//                                                     <i>Ispected by:</i><br/><br/><br/><br/>
//                                                     <l className="quar2">
//                                                         <h3>FERDINAND L. DE GALICIA</h3>
//                                                         <p>FRO-I/Fisheries Inspection & Quarantine Officer <br/>
//                                                             Balanacan Port, Mogpog, Marinduque - - CP#09773375767/ 09087332916</p>
//                                                         <p>Name of Fisheries Inspection</p>
//                                                     </l>
//                                                 </ol>
//                                                 </tr>                     
//                                         </tbody>
//                                         </table>
//                                     </div>
//                                     </div>
//                                 </div>
//                                 </Box>
//                         </>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         {currentStep > 0 && (
//                             <Button onClick={() => setCurrentStep(currentStep - 1)}  className='no-print' color="secondary">
//                                 Back
//                             </Button>
//                         )}
//                         {currentStep < steps.length - 1 ? (
//                             <Button onClick={() => setCurrentStep(currentStep + 1)}  className='no-print' color="secondary">
//                                 Next
//                             </Button>
//                         ) : (
//                             <>
//                             <Button onClick={handleSubmit} className='no-print' color="success">Save</Button>
//                             <Button onClick={handlePrint} className='no-print' color='dark'>Print</Button>
//                             </>
//                         )}
//                     </DialogActions>
//                         </Dialog>
//                     )}
//                 </Box>
//             </Fade>
//         </Box>
//     );
// };

// export default PermitStatusView;


import React, { useState, useEffect } from 'react';
import {
    Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Box, TablePagination, CircularProgress,
    Typography, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, Button, Stepper, Step, StepLabel,
    Card, CardContent, Stack, InputAdornment, Fade, Chip,
    Menu, MenuItem, IconButton, Drawer, FormControl, 
    FormGroup, FormControlLabel, Checkbox, Select,
    useTheme, useMediaQuery, Grid, CardHeader,
} from '@mui/material';
import {
    Search as SearchIcon,
    CalendarMonth,
    FilterList as FilterIcon,
    Sort as SortIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { getPermit, postPermit, updatePermitData } from '../../states/api.js';
import Logo from '../../images/BFAR logo.png';
import Img from '../../images/dry seal BFAR.png';
import "./index.css";

const PermitStatusView = () => {
    // Existing state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentRow, setCurrentRow] = useState(null);
    const [editing, setEditing] = useState(false);
    // const [formValues, setFormValues] = useState({
    //     ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
    //     consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
    //     placeOfOrigin: '', portOfDestination: '', transportMeans: '',
    //     dateOfDeparture: '', transportId: '', commodity: '', description: '',
    //     quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: '',
    //   });
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
      dateIssued: ''
  });

    // New state for sorting and filtering
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: [],
        commodity: [],
        destination: []
    });
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    

    // Custom color palette
    const colors = {
        primary: '#2C3E50',
        secondary: '#34495E',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        background: '#ECF0F1',
        headerGradient: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
    };
    
    // Enhanced styles
    const styles = {
        headerCard: {
            mb: 4,
            p: 2,
            background: colors.headerGradient,
            color: 'white',
            borderRadius: 3,
        },
        filterContainer: {
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            p: isMobile ? 1 : 2,
            borderRadius: 2,
            boxShadow: 1,
        },
        searchField: {
            width: isMobile ? '100%' : 300,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
            },
        },
        tableContainer: {
            boxShadow: theme.shadows[2],
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'white',
            '& .MuiTableCell-root': {
                padding: isMobile ? '8px' : '16px',
            },
        },
        statusChip: (status) => ({
            backgroundColor: getStatusColor(status) + '20',
            color: getStatusColor(status),
            fontWeight: 'bold',
            textTransform: 'capitalize',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
        }),
        sortButton: {
            color: theme.palette.text.secondary,
            '&:hover': {
                color: colors.primary,
            },
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const permitData = await getPermit(); // Fetch the data from the API
                const sortedData = (permitData || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
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
        { id: 'ltpNo', name: 'LTP' },
        { id: 'shipperName', name: 'Shipper' },
        { id: 'consigneeName', name: 'Consignee' },
        { id: 'placeOfOrigin', name: 'Origin' },
        { id: 'portOfDestination', name: 'Destination' },
        { id: 'dateOfDeparture', name: 'Departure' },
        { id: 'commodity', name: 'Commodity' },
        { id: 'quantity', name: 'Qty' },
        { id: 'dateIssued', name: 'Issued' },
        { id: 'status', name: 'Status' },
    ];

    const filteredData = data.filter((item) => {
        const matchesMonth = item.dateIssued?.substring(0, 7) === selectedMonth;
        const matchesSearch = item.shipperName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMonth && matchesSearch;
    });

   

    // const handleRowClick = (row) => {
    //     setSelectedRow(row);
    //     setCurrentRow(row);  // Set the currently selected row
    //     setEditing(true);     // Set editing to true
    //     setIsEditModalOpen(true);
    //     setCurrentStep(0);    // Reset to the first step
    //     setFormValues({
    //         ltpNo: row.ltpNo || '',
    //         shipperName: row.shipperName || '',
    //         consigneeName: row.consigneeName || '',
    //         placeOfOrigin: row.placeOfOrigin || '',
    //         portOfDestination: row.portOfDestination || '',
    //         dateOfDeparture: row.dateOfDeparture || '',
    //         transportMeans: row.transportMeans || '',
    //         description: row.description || '',
    //         quantity: row.quantity || '',
    //         marketValue: row.marketValue || '',
    //         remarks: row.remarks || '',
    //         or: row.or || '',
    //         amount: row.amount || '',
    //         dateIssued: row.dateIssued || ''
    //     });
    //     setCurrentStep(0);
    // };
    const handleRowClick = (row) => {
      setSelectedRow(row);
      setCurrentRow(row);
      setEditing(true);
      setIsEditModalOpen(true);
      setCurrentStep(0);
      
      // Populate all required fields
      setFormValues({
          ltpNo: row.ltpNo || '',
          shipperName: row.shipperName || '',
          shipperAddress: row.shipperAddress || '',
          contactNo: row.contactNo || '',
          consigneeName: row.consigneeName || '',
          consigneeAddress: row.consigneeAddress || '',
          consigneeContactNo: row.consigneeContactNo || '',
          placeOfOrigin: row.placeOfOrigin || '',
          portOfDestination: row.portOfDestination || '',
          transportMeans: row.transportMeans || '',
          dateOfDeparture: row.dateOfDeparture || '',
          transportId: row.transportId || '',
          commodity: row.commodity || '',
          description: row.description || '',
          quantity: row.quantity || '',
          marketValue: row.marketValue || '',
          remarks: row.remarks || '',
          or: row.or || '',
          amount: row.amount || '',
          dateIssued: row.dateIssued || ''
      });
  };
    

    // const handleSubmit = async () => {
    //     try {
    //         if (editing) {
    //             // Update the existing permit
    //             await updatePermitData(currentRow._id, formValues);
    //         } else {
    //             // Create a new permit
    //             await postPermit(formValues);
    //         }
    
    //         // Fetch the updated data
    //         const updatedData = await getPermit(); 
    //         setData(updatedData);  // Update the state with new data
    
    //         handleClose();  // Close the modal
    //     } catch (error) {
    //         console.error('Error saving permit data:', error);
    //     }
    // };
    const handleSubmit = async () => {
      try {
          if (editing && currentRow?._id) {
              // Update existing permit
              const response = await updatePermitData(currentRow._id, formValues);
              
              // Don't throw error on success
              if (response.data) {
                  // Refresh the data
                  const updatedData = await getPermit();
                  setData(updatedData);
                  handleClose();
                  // You could add a success notification here
                  console.log('Permit updated successfully');
              } else {
                  console.error('Failed to update permit:', response.message);
              }
          } else {
              // Create new permit
              const response = await postPermit(formValues);
              
              if (response.data) {
                  const updatedData = await getPermit();
                  setData(updatedData);
                  handleClose();
                  console.log('Permit created successfully');
              } else {
                  console.error('Failed to create permit:', response.message);
              }
          }
      } catch (error) {
          // This catch block should only handle actual errors
          console.error('Error saving permit data:', error);
          // Add error notification here if needed
      }
  };

    const handleClose = () => {
        setIsEditModalOpen(false);
        setEditing(false);
        setCurrentRow(null);
        setFormValues({
            ltpNo: '', shipperName: '', shipperAddress: '', contactNo: '',
            consigneeName: '', consigneeAddress: '', consigneeContactNo: '',
            placeOfOrigin: '', portOfDestination: '', transportMeans: '',
            dateOfDeparture: '', transportId: '', commodity: '', description: '',
            quantity: '', marketValue: '', remarks: '', or: '', amount: '', dateIssued: ''
        });
        setCurrentStep(0);
    };

    const steps = ['Edit Details', 'Preview'];

    const handlePrint = () => {
        window.print(); // Trigger the print functionality
      };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Enhanced status color function
    const getStatusColor = (status) => {
        const statusColors = {
            approved: colors.success,
            rejected: colors.error,
            pending: colors.warning,
        };
        return statusColors[status] || theme.palette.text.primary;
    };

    // Sorting handlers
    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setAnchorEl(null);
    };

    const handleSortSelect = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        handleSortClose();
    };

    // Filter handlers
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Apply filters and sorting to data
    const getFilteredAndSortedData = () => {
        let filteredData = data.filter(item => {
            const matchesMonth = item.dateIssued?.substring(0, 7) === selectedMonth;
            const matchesSearch = item.shipperName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filters.status.length === 0 || filters.status.includes(item.status);
            const matchesCommodity = filters.commodity.length === 0 || filters.commodity.includes(item.commodity);
            const matchesDestination = filters.destination.length === 0 || filters.destination.includes(item.portOfDestination);
            
            return matchesMonth && matchesSearch && matchesStatus && matchesCommodity && matchesDestination;
        });

        if (sortConfig.field) {
            filteredData.sort((a, b) => {
                if (a[sortConfig.field] < b[sortConfig.field]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.field] > b[sortConfig.field]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filteredData;
    };

    // Enhanced cell renderer
    const renderCellContent = (row, column) => {
        if (column.id === 'shipperName') {
            return (
                <Button
                    color="#000000"
                    onClick={() => handleRowClick(row)}
                    sx={{ textTransform: 'none' }}
                >
                    {row[column.id]}
                </Button>
            );
        } else if (['dateOfDeparture', 'dateIssued'].includes(column.id)) {
            return row[column.id] ? formatDate(row[column.id]) : '-';
        } else if (column.id === 'status') {
            return (
                <Chip
                    label={row[column.id]}
                    sx={styles.statusChip(row[column.id])}
                    size="small"
                />
            );
        }
        return row[column.id] || '-';
    };

    // Get unique values for filters
    const getUniqueValues = (field) => [...new Set(data.map(item => item[field]))].filter(Boolean);

    const filteredAndSortedData = getFilteredAndSortedData();
    const paginatedData = filteredAndSortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ 
            p: isMobile ? 1 : 4,
            width: '100%',
            maxWidth: '100vw',
            overflowX: 'hidden'
        }}>
            <Fade in timeout={800}>
                <Box>
                <Card sx={styles.headerCard}>
                        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item xs={12} sm={8}>
                                    <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
                                        Permit Management System
                                    </Typography>
                                    <Typography variant="body2">
                                        Manage and track all permit requests in one place
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton 
                                        onClick={() => setFilterDrawerOpen(true)} 
                                        sx={{ color: 'white' }}
                                    >
                                        <FilterIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Filter Section */}
                    <Stack sx={styles.filterContainer}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md="auto">
                                <IconButton onClick={handleSortClick}>
                                    <SortIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} sm={6} md="auto">
                                <TextField
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    fullWidth={isMobile}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarMonth />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md>
                                <TextField
                                    placeholder="Search by Shipper Name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    fullWidth
                                    sx={styles.searchField}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleSortClose}
                    >
                        {columns.map((column) => (
                            <MenuItem 
                                key={column.id}
                                onClick={() => handleSortSelect(column.id)}
                            >
                                {column.name}
                                {sortConfig.field === column.id && (
                                    sortConfig.direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />
                                )}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Table Section */}
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress />
                        </Box>
                    ) : filteredAndSortedData.length === 0 ? (
                        <Card sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                No data available for the selected criteria
                            </Typography>
                        </Card>
                    ) : (
                        <Paper sx={styles.tableContainer}>
                            <TableContainer sx={{ maxHeight: '60vh' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    sx={{
                                                        backgroundColor: colors.primary,
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        whiteSpace: 'nowrap',
                                                        display: isMobile && column.hiddenOnMobile ? 'none' : 'table-cell',
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
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: colors.background,
                                                    },
                                                }}
                                            >
                                                {columns.map((column) => (
                                                    <TableCell 
                                                        key={column.id}
                                                        sx={{
                                                            display: isMobile && column.hiddenOnMobile ? 'none' : 'table-cell',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {renderCellContent(row, column)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredAndSortedData.length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 20]}
                            />
                        </Paper>
                    )}

                    {/* Responsive Filter Drawer */}
                    <Drawer
                        anchor={isMobile ? 'bottom' : 'right'}
                        open={filterDrawerOpen}
                        onClose={() => setFilterDrawerOpen(false)}
                    >
                        <Box sx={{ 
                            width: isMobile ? 'auto' : 300, 
                            p: 3,
                            height: isMobile ? '70vh' : '100%',
                        }}>
                            <Typography variant="h6" gutterBottom>Filters</Typography>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>Status</Typography>
                                <FormGroup>
                                    {getUniqueValues('status').map((status) => (
                                        <FormControlLabel
                                            key={status}
                                            control={
                                                <Checkbox
                                                    checked={filters.status.includes(status)}
                                                    sx={{
                                                        color: 'primary', // Unchecked color
                                                        '&.Mui-checked': {
                                                        color: 'green', // Checked color
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleFilterChange('status', [...filters.status, status]);
                                                        } else {
                                                            handleFilterChange('status', filters.status.filter(s => s !== status));
                                                        }
                                                    }}
                                                />
                                            }
                                            label={status}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>Commodity</Typography>
                                <Select
                                    multiple
                                    value={filters.commodity}
                                    onChange={(e) => handleFilterChange('commodity', e.target.value)}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {getUniqueValues('commodity').map((commodity) => (
                                        <MenuItem key={commodity} value={commodity}>
                                            <Checkbox checked={filters.commodity.includes(commodity)}  sx={{
                                                color: 'primary', // Unchecked color
                                                '&.Mui-checked': {
                                                color: 'green', // Checked color
                                                },
                                            }}/>
                                            <Typography>{commodity}</Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={() => setFilterDrawerOpen(false)}
                                sx={{ 
                                    bgcolor: 'success.main',
                                    '&:hover': { bgcolor: 'success.dark' },
                                    mt: 2
                                }}
                            >
                                Apply Filters
                            </Button>
                        </Box>
                    </Drawer>

                    {/* Keep existing Dialog component unchanged */}
                    {selectedRow && (
                        <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth>
                            <DialogTitle  className='no-print'>{steps[currentStep]}</DialogTitle>
                    <DialogContent >
                        {currentStep === 0 ? (
                            // Edit Details Step
                            <>
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
                                inputProps={{
                                    maxLength: 4, // This prevents more than 4 characters being entered
                                }}
                                placeholder="Enter 4-digit LTP number"
                                />
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
                            </>
                        ) : (
                            <>
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
              <TextField select name="vessel" variant="standard" sx={{ ml: 2 }}>
                <MenuItem value="Montenegro">Montenegro</MenuItem>
                <MenuItem value="Starhorse">Starhorse</MenuItem>
              </TextField>
              <TextField select name="vesselName" variant="standard" sx={{ ml: 2 }}>
                <MenuItem value="1">M/V Maria Diana</MenuItem>
                <MenuItem value="2">M/V Reina Divinagracia</MenuItem>
              </TextField>
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
                        </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {currentStep > 0 && (
                            <Button onClick={() => setCurrentStep(currentStep - 1)}  className='no-print' color="secondary">
                                Back
                            </Button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <Button onClick={() => setCurrentStep(currentStep + 1)}  className='no-print' color="secondary">
                                Next
                            </Button>
                        ) : (
                            <>
                            <Button onClick={handleSubmit} className='no-print' color="success">Save</Button>
                            <Button onClick={handlePrint} className='no-print' color='dark'>Print</Button>
                            </>
                        )}
                    </DialogActions>
                        </Dialog>
                    )}
                </Box>
            </Fade>
        </Box>
    );
};

export default PermitStatusView;