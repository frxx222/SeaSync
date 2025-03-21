// import mongoose from "mongoose";

// export const PermitSchema = new mongoose.Schema({
//     or: {
//         type: Number,
//         required: false,  // Make it optional
//     },
//     shipper: {
//         type: String,
//         required: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     consignee: {
//         type: String,
//         required: true,
//     },
//     destination: {
//         type: String,
//         required: true,
//     },
//     products: {
//         type: String,
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//     },
//     amount: {
//         type: Number,  
//         required: false,  // Make it optional
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'rejected'],
//         default: 'pending',
//     },
//     isPermit: {
//         type: Boolean,
//         default: false,
//     },
//     date: {
//         type: Date, 
//         required: true,
//     }
// }, { timestamps: true });


// export default mongoose.models.Permit || mongoose.model('Permit', PermitSchema);


import mongoose from "mongoose";

export const PermitSchema = new mongoose.Schema({
    ltpNo: {
        type: String,
        required: true, // LTP number is mandatory
    },
    shipperName: {
        type: String,
        required: true,
    },
    shipperAddress: {
        type: String,
        required: true,
    },
    contactNo: {
        type: Number,
        required: true,
    },
    consigneeName: {
        type: String,
        required: true,
    },
    consigneeAddress: {
        type: String,
        required: true,
    },
    consigneeContactNo: {
        type: Number,
        required: true,
    },
    placeOfOrigin: {
        type: String,
        required: true,
    },
    portOfDestination: {
        type: String,
        required: true,
    },
    transportMeans: {
        type: String,
        required: true,
    },
    dateOfDeparture: {
        type: Date,
        required: true,
    },
    transportId: {
        type: String,
        required: true,
    },
    commodity: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number, // Quantity in kg/ton
        required: true,
    },
    marketValue: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
        required: false, // Optional field
    },
    or: {
        type: Number,
        required: true, // Optional field for Official Receipt
    },
    amount: {
        type: Number,
        required: true, // Optional field
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    isPermit: {
        type: Boolean,
        default: false,
    },
    dateIssued: {
        type: Date,
        required: true, // Permit issuance date
    },
}, { timestamps: true });

export default mongoose.models.Permit || mongoose.model('Permit', PermitSchema);
