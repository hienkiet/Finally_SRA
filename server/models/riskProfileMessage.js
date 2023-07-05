import mongoose from "mongoose";

const riskProfileSchema = mongoose.Schema({
  title: String,
  name: String,
  selectedFile: String,
});

var RiskProfile = mongoose.model("RiskProfile", riskProfileSchema);

export default RiskProfile;
