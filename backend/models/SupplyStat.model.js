import mongoose from "mongoose";

const OverallStatSchema = new mongoose.Schema(
  {
    totalNumber: Number,
    yearlyTotalSupply: Number,
    yearlyTotalUnits: Number,
    year: Number,
    monthlyData: [
      {
        month: String,
        totalSupply: Number,
        totalUnits: Number,
      },    
    ],
    dailyData: [
      {
        date: String,
        totalSupply: Number,
        totalUnits: Number,
      },
    ],
    supplyByCategory: {
      type: Map,
      of: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.OverallStat || mongoose.model('OverallStat', OverallStatSchema);