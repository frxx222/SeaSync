import mongoose from "mongoose";

export const InvoiceSchema = new mongoose.Schema({
    //add userID
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to your User model
    },
    or: {
        type: Number,
        required: false,  // Make it optional
    },
    shipper: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    consignee: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    products: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,  
        required: false,  // Make it optional
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    isInvoice: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date, 
        required: true,
    },
    createdBy: String,
}, { timestamps: true });


export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
