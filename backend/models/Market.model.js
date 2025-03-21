import mongoose from "mongoose";

const MarketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to your User model
    },
    name: {
        type: String,
        required: [true, "Please provide Fisher Name"],
    },
    fishType: {
        type: String,
        required: [true, "Please provide Fish Type"],
    },
    source: {
        type: String,
        required: [true, "Please provide Source"],
    },
    price: {
        type: Number,
        required: [true, "Please provide Price"]
    },
    weight: {
        type: Number,
        required: [true, "Please provide Kg"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        required: [true, "Please provide Time in HH:MM format"],
    },
    createdBy: String,
}, { timestamps: true });



// Use a conditional to avoid re-creating the model if it already exists
export default mongoose.models.Market || mongoose.model('Market', MarketSchema);



// MarketSchema.js
// import mongoose from "mongoose";

// const MarketSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Please provide Fisher Name"],
//     },
//     fishType: {
//         type: String,
//         required: [true, "Please provide Fish Type"],
//     },
//     source: {
//         type: String,
//         required: [true, "Please provide Source"],
//     },
//     price: {
//         type: Number,
//         required: [true, "Please provide Price"]
//     },
//     weight: {
//         type: Number,
//         required: [true, "Please provide Kg"]
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     time: {
//         type: String,
//         required: [true, "Please provide Time in HH:MM format"],
//     },
//     createdBy: {
//         type: String,
//         required: true
//     },
//     userRole: {
//         type: String,
//         required: true,
//         enum: ['LGU', 'BFAR']  // Only allow these values
//     }
// }, { timestamps: true });

// export default mongoose.models.Market || mongoose.model('Market', MarketSchema);