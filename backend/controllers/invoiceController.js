import InvoiceModel from '../models/Invoice.model.js'; // Ensure the path is correct
import PermitModel from '../models/Permit.model.js'; // Ensure the path is correct

export const createPermitFromInvoice = async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const permitData = req.body;
  
      // Verify invoice exists and is approved
      const invoice = await InvoiceModel.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      if (invoice.status !== 'approved') {
        return res.status(400).json({ message: 'Can only create permits from approved invoices' });
      }
  
      // Check if permit already exists for this invoice
      const existingPermit = await PermitModel.findOne({ invoiceId });
      if (existingPermit) {
        return res.status(400).json({ message: 'Permit already exists for this invoice' });
      }
  
      // Create new permit
      const newPermit = new PermitModel({
        ...permitData,
        invoiceId,
        status: 'pending'
      });
  
      const savedPermit = await newPermit.save();
      res.status(201).json({ message: 'Permit created successfully', data: savedPermit });
    } catch (error) {
      console.error('Error creating permit from invoice:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


// Function to get all permits
// export async function invoiceData(req, res) {
//     try {
//         const data = await InvoiceModel.find();
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
export async function invoiceData(req, res) {
    try {
        const { role, _id } = req.user; // Get role and userId from request (ensure authentication middleware)

        let query = {}; 

        if (role === "LGU") {
            query.userId = _id; // Show only invoices created by this user
        }

        const data = await InvoiceModel.find(query)
                    .populate('userId', 'username role') // Populate user details if needed
                    .lean();
        console.log("Logged in user:", req.user);

        
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Function to create a new permit
export async function invoice(req, res) {
    try {
        const { or, shipper, address, consignee, destination, products, quantity, amount, date } = req.body;

        // Get userId from authenticated user
        const userId = req.user._id;  // This comes from your auth middleware

        if (!shipper || !address || !consignee || !destination || !products || !quantity || !date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newInvoice = new InvoiceModel({ or, shipper, address, consignee, destination, products, quantity, amount, date, userId });
        // const newInvoice = new InvoiceModel(req.body, userId);
        const savedData = await newInvoice.save();
        res.status(201).json({ message: 'New Permit created successfully', data: savedData });
    } catch (err) {
        console.error("Error saving permit:", err);
        res.status(400).json({ message: err.message });
    }
}

// Function to update a permit by ID
export const updateInvoice = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const permit = await InvoiceModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!permit) {
            return res.status(404).json({ message: 'Permit not found' });
        }
        res.status(200).json(permit);
    } catch (error) {
        console.error('Error updating permit:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to delete a permit by ID
export const deleteInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const permit = await InvoiceModel.findByIdAndDelete(id);
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
        const { invoiceId, status } = req.body;

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const permit = await InvoiceModel.findByIdAndUpdate(invoiceId, { 
            status, 
            isInvoice: status === 'approved' 
        }, { new: true });

        if (!invoice) {
            return res.status(404).json({ message: "Permit not found" });
        }

        res.status(200).json({ success: true, message: "Permit status updated", data: permit });
    } catch (error) {
        console.error('Error updating permit status:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getInvoiceStats = async (req, res) => {
    try {
        const pendingCount = await InvoiceModel.countDocuments({ status: 'pending' });
        const approvedCount = await InvoiceModel.countDocuments({ status: 'approved' });
        const rejectedCount = await InvoiceModel.countDocuments({ status: 'rejected' });

        console.log("Pending:", pendingCount);  // Log to verify
        console.log("Approved:", approvedCount); // Log to verify
        console.log("Rejected:", rejectedCount); // Log to verify

        res.json({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
    } catch (error) {
        console.error("Error fetching permit stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};