import OverallStat from "../models/SupplyStat.model.js";

export const getSupply = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();  // Assuming one overall stats document

    res.status(200).json(overallStats[0]);  // Send dailyData array
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
