import mongoose from "mongoose";

const MarketStatSchema = new mongoose.Schema(
  {
    marketId: String,
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
  },
  { timestamps: true }
);

export default mongoose.models.MarketStat || mongoose.model('MarketStat', MarketStatSchema);