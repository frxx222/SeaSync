import PermitModel from '../models/Permit.model.js'; // Ensure the path is correct

// // Function to get all permits
// export async function permitData(req, res) {
//     try {
//         const data = await PermitModel.find();
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// // Function to create a new permit
// export async function permit(req, res) {
//     try {
//         const { shipper, address, consignee, destination, products, quantity, date } = req.body;

//         if (!shipper || !address || !consignee || !destination || !products || !quantity || !date) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         const newPermit = new PermitModel(req.body);
//         const savedData = await newPermit.save();
//         res.status(201).json({ message: 'New Permit created successfully', data: savedData });
//     } catch (err) {
//         console.error("Error saving permit:", err);
//         res.status(400).json({ message: err.message });
//     }
// }


// // Function to update a permit by ID
// export const updatePermit = async (req, res) => {
//     const { id } = req.params;
//     const updatedData = req.body;

//     try {
//         const permit = await PermitModel.findByIdAndUpdate(id, updatedData, { new: true });
//         if (!permit) {
//             return res.status(404).json({ message: 'Permit not found' });
//         }
//         res.status(200).json(permit);
//     } catch (error) {
//         console.error('Error updating permit:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// // Function to delete a permit by ID
// export const deletePermit = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const permit = await PermitModel.findByIdAndDelete(id);
//         if (!permit) {
//             return res.status(404).json({ message: 'Permit not found' });
//         }
//         res.status(204).send(); // No content
//     } catch (error) {
//         console.error('Error deleting permit:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// export const statusUpdate = async (req, res) => {
//     try {
//         const { permitId, status } = req.body;

//         // Validate status
//         if (!['approved', 'rejected'].includes(status)) {
//             return res.status(400).json({ message: "Invalid status value" });
//         }

//         const permit = await PermitModel.findByIdAndUpdate(permitId, { 
//             status, 
//             isPermit: status === 'approved' 
//         }, { new: true });

//         if (!permit) {
//             return res.status(404).json({ message: "Permit not found" });
//         }

//         res.status(200).json({ success: true, message: "Permit status updated", data: permit });
//     } catch (error) {
//         console.error('Error updating permit status:', error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// export const getPermitStats = async (req, res) => {
//     try {
//         const pendingCount = await PermitModel.countDocuments({ status: 'pending' });
//         const approvedCount = await PermitModel.countDocuments({ status: 'approved' });
//         const rejectedCount = await PermitModel.countDocuments({ status: 'rejected' });

//         console.log("Pending:", pendingCount);  // Log to verify
//         console.log("Approved:", approvedCount); // Log to verify
//         console.log("Rejected:", rejectedCount); // Log to verify

//         res.json({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
//     } catch (error) {
//         console.error("Error fetching permit stats:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

export async function permitData(req, res) {
    try {
        const data = await PermitModel.find(); // Fetch all permits
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export async function permit(req, res) {
    try {
        const {
            ltpNo, shipperName, shipperAddress, contactNo, consigneeName,
            consigneeAddress, consigneeContactNo, placeOfOrigin, portOfDestination,
            transportMeans, dateOfDeparture, transportId, commodity, description,
            quantity, marketValue, remarks, dateIssued, or, amount
        } = req.body;

        console.log(req.body);  // Log the incoming data

        // Validate all required fields including `or` and `amount`
        if (!ltpNo || !shipperName || !shipperAddress || !contactNo || !consigneeName ||
            !consigneeAddress || !consigneeContactNo || !placeOfOrigin || !portOfDestination || !transportMeans ||
            !dateOfDeparture || !transportId || !commodity || !description || !quantity ||
            !marketValue || !remarks || !dateIssued || !or || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newPermit = new PermitModel(req.body);
        const savedData = await newPermit.save();
        res.status(201).json({ message: 'New Permit created successfully', data: savedData });
    } catch (err) {
        console.error("Error saving permit:", err);
        res.status(400).json({ message: err.message });
    }
}


// export const updatePermit = async (req, res) => {
//     const { id } = req.params;
//     const updatedData = req.body;

//     try {
//         const permit = await PermitModel.findByIdAndUpdate(id, updatedData, { new: true });
//         if (!permit) {
//             return res.status(404).json({ message: 'Permit not found' });
//         }
//         res.status(200).json(permit);
//     } catch (error) {
//         console.error('Error updating permit:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

export const updatePermit = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'Missing permit ID' });
        }

        // Validate required fields
        const requiredFields = [
            'ltpNo', 'shipperName', 'shipperAddress', 'contactNo',
            'consigneeName', 'consigneeAddress', 'consigneeContactNo',
            'placeOfOrigin', 'portOfDestination', 'transportMeans',
            'dateOfDeparture', 'transportId', 'commodity', 'description',
            'quantity', 'marketValue', 'remarks', 'or', 'amount', 'dateIssued'
        ];

        const missingFields = requiredFields.filter(field => !updatedData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: 'Missing required fields', 
                fields: missingFields 
            });
        }

        const permit = await PermitModel.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!permit) {
            return res.status(404).json({ message: 'Permit not found' });
        }

        res.status(200).json({
            message: 'Permit updated successfully',
            data: permit
        });
    } catch (error) {
        console.error('Error updating permit:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};

export const deletePermit = async (req, res) => {
    const { id } = req.params;

    try {
        const permit = await PermitModel.findByIdAndDelete(id);
        if (!permit) {
            return res.status(404).json({ message: 'Permit not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting permit:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const statusUpdate = async (req, res) => {
    try {
        const { permitId, status } = req.body;

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const permit = await PermitModel.findByIdAndUpdate(permitId, {
            status,
            isPermit: status === 'approved',
        }, { new: true });

        if (!permit) {
            return res.status(404).json({ message: "Permit not found" });
        }

        res.status(200).json({ success: true, message: "Permit status updated", data: permit });
    } catch (error) {
        console.error('Error updating permit status:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// export const getPermitStats = async (req, res) => {
//     try {
//         const pendingCount = await PermitModel.countDocuments({ status: 'pending' });
//         const approvedCount = await PermitModel.countDocuments({ status: 'approved' });
//         const rejectedCount = await PermitModel.countDocuments({ status: 'rejected' });

//         console.log("Pending:", pendingCount);  // Log to verify
//         console.log("Approved:", approvedCount); // Log to verify
//         console.log("Rejected:", rejectedCount); // Log to verify

//         res.json({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
//     } catch (error) {
//         console.error("Error fetching permit stats:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };


export const getPermitStats = async (req, res) => {
    try {
        // Get current date
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Count documents only for current month
        const pendingCount = await PermitModel.countDocuments({
            status: 'pending',
            dateIssued: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        const approvedCount = await PermitModel.countDocuments({
            status: 'approved',
            dateIssued: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        const rejectedCount = await PermitModel.countDocuments({
            status: 'rejected',
            dateIssued: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        console.log("Current Month Stats:", {
            month: startOfMonth.toLocaleString(),
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount
        });

        res.json({
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount
        });
    } catch (error) {
        console.error("Error fetching permit stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updatePermitStatus = async (req, res) => {
    try {
        const { permitId } = req.params;
        const { status } = req.body;

        if (!permitId) {
            return res.status(400).json({ 
                success: false, 
                message: "Permit ID is required" 
            });
        }

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status value" 
            });
        }

        const permit = await PermitModel.findByIdAndUpdate(
            permitId,
            {
                status,
                isPermit: status === 'approved'
            },
            { new: true }
        );

        if (!permit) {
            return res.status(404).json({ 
                success: false, 
                message: "Permit not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: `Permit ${status} successfully`, 
            data: permit 
        });
    } catch (error) {
        console.error('Error updating permit status:', error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};