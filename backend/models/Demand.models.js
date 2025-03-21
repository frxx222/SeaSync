import mongoose from "mongoose";

const LocalDemandSchema = new mongoose.Schema({
    municipality: {
        type: String,
        required: [true, "Please provide Municipality"],
    },
    fishType: {
        type: String, // Name of the commodity
        required: [true, "Please provide the name of the Commodity (Fish Type)"],
    },
    dailyDemand: {
        type: Number, // Daily demand in kilograms
        required: [true, "Please provide Daily Demand in Kg"],
    },
    monthlyDemand: {
        type: Number, // Monthly demand in kilograms
        required: [true, "Please provide Monthly Demand in Kg"],
    },
    date: {
        type: Date,
        default: Date.now, // Automatically set to the current date
    },
    time: {
        type: String, // Time in HH:MM format
        required: [true, "Please provide Time in HH:MM format"],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    archived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Avoid re-creating the model if it already exists
export default mongoose.models.LocalDemand || mongoose.model("LocalDemand", LocalDemandSchema);


// import mongoose from "mongoose";

// const AutomatedDemandSchema = new mongoose.Schema({
//     municipality: {
//         type: String,
//         required: true,
//     },
//     fishType: {
//         type: String,
//         required: true,
//     },
//     // Historical average daily demand
//     dailyDemand: {
//         type: Number,
//         required: true,
//     },
//     // Forecasted daily demand
//     forecastedDemand: {
//         type: Number,
//         required: true,
//     },
//     // Confidence level of the forecast (0-1)
//     confidenceLevel: {
//         type: Number,
//         required: true,
//     },
//     // Historical monthly demand
//     monthlyDemand: {
//         type: Number,
//         required: true,
//     },
//     // Last update timestamp
//     lastUpdated: {
//         type: Date,
//         default: Date.now,
//     },
//     // Seasonal factors by month (1-12)
//     seasonalFactors: [{
//         month: Number,
//         factor: Number
//     }],
//     status: {
//         type: String,
//         enum: ['Active', 'Inactive'],
//         default: 'Active'
//     },
//     archived: {
//         type: Boolean,
//         default: false
//     }
// }, { timestamps: true });

// // Compound index for quick lookups
// AutomatedDemandSchema.index({ municipality: 1, fishType: 1 });

// export default mongoose.models.AutomatedDemand || mongoose.model("AutomatedDemand", AutomatedDemandSchema);