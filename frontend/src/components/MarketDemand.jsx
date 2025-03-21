// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Alert,
// } from '@mui/material';
// import { useAuthStore } from '../store/store';

// const MarketDemandDialog = () => {
//   const { role } = useAuthStore((state) => state.auth);
//   const [formData, setFormData] = useState({
//     source: '',
//     fishType: '',
//     weight: '',
//     demandType: 'daily',
//   });
//   const [demandStatus, setDemandStatus] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [open, setOpen] = useState(false);
//   console.log('Current User Role:', role); // Debug log
//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const checkDemand = async () => {
//     if (!role) {
//       alert('Unauthorized: No user role specified');
//       return;
//     }

//     try {
//         const response = await fetch('http://localhost:4000/api/local-demand/unsatisfied');
//         const demands = await response.json();
        
//         const relevantDemand = demands.find(
//             d => d.municipality === formData.source && d.fishType === formData.fishType
//         );
        
//         if (relevantDemand) {
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);
            
//             const currentSupply = formData.demandType === 'daily'
//                 ? (relevantDemand.supplies || [])
//                     .filter(supply => new Date(supply.date).getTime() >= today.getTime())
//                     .reduce((total, supply) => total + (supply.weight || 0), 0)
//                 : relevantDemand.supplied;
            
//             const proposedWeight = Number(formData.weight);
            
//             if (formData.demandType === 'daily') {
//                 const dailyDemand = relevantDemand.dailyDemand;
//                 const dailyRemaining = Math.max(0, dailyDemand - currentSupply);
                
//                 setDemandStatus({
//                     type: 'daily',
//                     isMet: dailyRemaining === 0,
//                     demandMet: currentSupply >= dailyDemand,
//                     totalDemand: dailyDemand,
//                     currentSupply,
//                     remainingDemand: dailyRemaining,
//                     proposedWeight
//                 });
                
//                 setShowConfirmDialog(true);
//             } else {
//                 const monthlyDemand = relevantDemand.monthlyDemand;
//                 const monthlyRemaining = Math.max(0, monthlyDemand - currentSupply);
                
//                 setDemandStatus({
//                     type: 'monthly',
//                     isMet: monthlyRemaining === 0,
//                     demandMet: currentSupply >= monthlyDemand,
//                     totalDemand: monthlyDemand,
//                     currentSupply,
//                     remainingDemand: monthlyRemaining,
//                     proposedWeight
//                 });
//             }
//         } else {
//             setDemandStatus({
//                 isMet: false,
//                 error: 'No demand data found for this combination',
//             });
//         }
//     } catch (error) {
//         console.error('Error checking demand:', error);
//         setDemandStatus({
//             isMet: false,
//             error: 'Failed to check demand',
//         });
//     }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.source || !formData.fishType || !formData.weight) {
//       alert('Please fill all required fields');
//       return;
//     }
//     await checkDemand();
//   };

//   const handleConfirm = (confirmed) => {
//     if (confirmed) {
//       // Role-based navigation
//       if (role === 'LGU') {
//         window.location.href = '/auxiliary-invoice';
//       } else if (role === 'BFAR') {
//         window.location.href = '/transport-permit';
//       } else {
//         alert('Unauthorized: Invalid user role');
//       }
//     } else {
//       handleClose();
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       source: '',
//       fishType: '',
//       weight: '',
//       demandType: 'daily',
//     });
//     setDemandStatus(null);
//     setShowConfirmDialog(false);
//     setOpen(false);
//   };

//   const renderConfirmDialog = () => {
//     if (!showConfirmDialog || formData.demandType !== 'daily') return null;

//     return (
//       <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
//         {demandStatus?.demandMet ? (
//           <>
//             <DialogTitle>Proceed to {role === 'LGU' ? 'Auxiliary Invoice' : 'Transport Permit'}?</DialogTitle>
//             <DialogContent>
//               Would you like to proceed with the {role === 'LGU' ? 'Auxiliary Invoice' : 'Transport Permit'} application?
//             </DialogContent>
//           </>
//         ) : (
//           <>
//             <DialogTitle>Warning: Daily Demand Not Met</DialogTitle>
//             <DialogContent style={{ maxWidth: '400px' }}>
//               The daily demand is not yet met. Do you still want to proceed with the {role === 'LGU' ? 'Auxiliary Invoice' : 'Transport Permit'} application?
//             </DialogContent>
//           </>
//         )}
//         <DialogActions>
//           <Button onClick={() => handleConfirm(false)} color="error">No</Button>
//           <Button onClick={() => handleConfirm(true)} color="success" variant="contained">
//             Yes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };

//   const renderDemandStatus = () => {
//     if (!demandStatus) return null;

//     if (demandStatus.error) {
//       return (
//         <Alert severity="error" style={{ marginTop: '16px' }}>
//           {demandStatus.error}
//         </Alert>
//       );
//     }

//     const severity = demandStatus.demandMet ? 'success' : 'warning';
//     const demandType = demandStatus.type === 'daily' ? 'Daily' : 'Monthly';

//     return (
//       <Alert severity={severity} style={{ marginTop: '16px' }}>
//         {`${demandType} demand status:
//           • Current supply: ${demandStatus.currentSupply}kg
//           • Total ${demandType.toLowerCase()} demand: ${demandStatus.totalDemand}kg
//           • Remaining demand: ${demandStatus.remainingDemand}kg
//           • Your proposed weight: ${demandStatus.proposedWeight}kg`}
//       </Alert>
//     );
//   };

//   return (
//     <div>
//       <Button variant="outlined" color="secondary" onClick={() => setOpen(true)}>
//         Check Market Demand
//       </Button>

//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>Check Market Demand</DialogTitle>
//         <DialogContent>
//           <form id="demandForm" onSubmit={handleSubmit}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Municipality</InputLabel>
//               <Select
//                 value={formData.source}
//                 onChange={(e) => handleInputChange('source', e.target.value)}
//                 required
//               >
//                 {['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta Cruz'].map((mun) => (
//                   <MenuItem key={mun} value={mun}>
//                     {mun}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Other form fields remain the same */}
//             <TextField
//               fullWidth
//               margin="normal"
//               select
//               label="Fish Type"
//               value={formData.fishType}
//               onChange={(e) => handleInputChange('fishType', e.target.value)}
//               required
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
//               fullWidth
//               margin="normal"
//               label="Weight (kgs)"
//               type="number"
//               value={formData.weight}
//               onChange={(e) => handleInputChange('weight', e.target.value)}
//               required
//             />

//             <FormControl margin="normal">
//               <RadioGroup
//                 row
//                 value={formData.demandType}
//                 onChange={(e) => handleInputChange('demandType', e.target.value)}
//               >
//                 <FormControlLabel value="daily" control={<Radio color="success" />} label="Daily" />
//                 <FormControlLabel value="monthly" control={<Radio color="success" />} label="Monthly" />
//               </RadioGroup>
//             </FormControl>
//           </form>
          
//           {renderDemandStatus()}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="dark">Cancel</Button>
//           <Button type="submit" form="demandForm" color="success" variant="contained">
//             Check Demand
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {renderConfirmDialog()}
//     </div>
//   );
// };

// export default MarketDemandDialog;
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../store/store';

const MarketDemandDialog = () => {
  const { role } = useAuthStore((state) => state.auth);
  const [formData, setFormData] = useState({
    source: '',
    fishType: '',
    weight: '',
    demandType: 'daily',
  });
  const [demandStatus, setDemandStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [open, setOpen] = useState(false);
  console.log('Current User Role:', role); // Debug log
  
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkDemand = async () => {
    if (!role) {
      alert('Unauthorized: No user role specified');
      return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/local-demand/unsatisfied');
        const demands = await response.json();
        
        const relevantDemand = demands.find(
            d => d.municipality === formData.source && d.fishType === formData.fishType
        );
        
        if (relevantDemand) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const currentSupply = formData.demandType === 'daily'
                ? (relevantDemand.supplies || [])
                    .filter(supply => new Date(supply.date).getTime() >= today.getTime())
                    .reduce((total, supply) => total + (supply.weight || 0), 0)
                : relevantDemand.supplied;
            
            const proposedWeight = Number(formData.weight);
            
            if (formData.demandType === 'daily') {
                const dailyDemand = relevantDemand.dailyDemand;
                const dailyRemaining = Math.max(0, dailyDemand - currentSupply);
                
                const demandData = {
                    type: 'daily',
                    isMet: dailyRemaining === 0,
                    demandMet: currentSupply >= dailyDemand,
                    totalDemand: dailyDemand,
                    currentSupply,
                    remainingDemand: dailyRemaining,
                    proposedWeight
                };
                
                setDemandStatus(demandData);
                
                // Only show confirm dialog if demand is met
                if (demandData.demandMet) {
                    setShowConfirmDialog(true);
                }
            } else {
                const monthlyDemand = relevantDemand.monthlyDemand;
                const monthlyRemaining = Math.max(0, monthlyDemand - currentSupply);
                
                setDemandStatus({
                    type: 'monthly',
                    isMet: monthlyRemaining === 0,
                    demandMet: currentSupply >= monthlyDemand,
                    totalDemand: monthlyDemand,
                    currentSupply,
                    remainingDemand: monthlyRemaining,
                    proposedWeight
                });
            }
        } else {
            setDemandStatus({
                isMet: false,
                error: 'No demand data found for this combination',
            });
        }
    } catch (error) {
        console.error('Error checking demand:', error);
        setDemandStatus({
            isMet: false,
            error: 'Failed to check demand',
        });
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.source || !formData.fishType || !formData.weight) {
      alert('Please fill all required fields');
      return;
    }
    await checkDemand();
  };

  const handleConfirm = (confirmed) => {
    if (confirmed) {
      // Role-based navigation
      if (role === 'LGU') {
        window.location.href = '/auxiliary-invoice';
      } else if (role === 'BFAR') {
        window.location.href = '/transport-permit';
      } else {
        alert('Unauthorized: Invalid user role');
      }
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      source: '',
      fishType: '',
      weight: '',
      demandType: 'daily',
    });
    setDemandStatus(null);
    setShowConfirmDialog(false);
    setOpen(false);
  };

  const renderConfirmDialog = () => {
    if (!showConfirmDialog || formData.demandType !== 'daily') return null;

    return (
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Proceed to {role === 'LGU' ? 'Auxiliary Invoice' : 'Transport Permit'}?</DialogTitle>
        <DialogContent>
          Would you like to proceed with the {role === 'LGU' ? 'Auxiliary Invoice' : 'Transport Permit'} application?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirm(false)} color="error">No</Button>
          <Button onClick={() => handleConfirm(true)} color="success" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderDemandStatus = () => {
    if (!demandStatus) return null;

    if (demandStatus.error) {
      return (
        <Alert severity="error" style={{ marginTop: '16px' }}>
          {demandStatus.error}
        </Alert>
      );
    }

    const severity = demandStatus.demandMet ? 'success' : 'warning';
    const demandType = demandStatus.type === 'daily' ? 'Daily' : 'Monthly';

    return (
      <Alert severity={severity} style={{ marginTop: '16px' }}>
        {`${demandType} demand status:
          • Current supply: ${demandStatus.currentSupply}kg
          • Total ${demandType.toLowerCase()} demand: ${demandStatus.totalDemand}kg
          • Remaining demand: ${demandStatus.remainingDemand}kg
          • Your proposed weight: ${demandStatus.proposedWeight}kg`}
      </Alert>
    );
  };

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)}>
        Check Market Demand
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Check Market Demand</DialogTitle>
        <DialogContent>
          <form id="demandForm" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Municipality</InputLabel>
              <Select
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                required
              >
                {['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta Cruz'].map((mun) => (
                  <MenuItem key={mun} value={mun}>
                    {mun}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              select
              label="Fish Type"
              value={formData.fishType}
              onChange={(e) => handleInputChange('fishType', e.target.value)}
              required
            >
              <MenuItem value="Galunggong">Galunggong</MenuItem>
              <MenuItem value="Tulingan">Tulingan</MenuItem>
              <MenuItem value="Gulyasan">Gulyasan</MenuItem>
              <MenuItem value="Dilis">Dilis</MenuItem>
              <MenuItem value="Dalagang-Bukid">Dalagang-Bukid</MenuItem>
              <MenuItem value="Tunsoy">Tunsoy</MenuItem>
              <MenuItem value="Tambakol">Tambakol</MenuItem>
              <MenuItem value="Maya-maya">Maya-maya</MenuItem>
              <MenuItem value="Dried Fish">Dried Fish</MenuItem>
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Weight (kgs)"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              required
            />

            <FormControl margin="normal">
              <RadioGroup
                row
                value={formData.demandType}
                onChange={(e) => handleInputChange('demandType', e.target.value)}
              >
                <FormControlLabel value="daily" control={<Radio color="success" />} label="Daily" />
                <FormControlLabel value="monthly" control={<Radio color="success" />} label="Monthly" />
              </RadioGroup>
            </FormControl>
          </form>
          
          {renderDemandStatus()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="dark">Cancel</Button>
          <Button type="submit" form="demandForm" color="success" variant="contained">
            Check Demand
          </Button>
        </DialogActions>
      </Dialog>

      {renderConfirmDialog()}
    </div>
  );
};

export default MarketDemandDialog;