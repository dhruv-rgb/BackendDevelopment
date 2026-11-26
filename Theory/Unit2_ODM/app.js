const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  cohort: { type: String, enum: ["Batch 1", "Batch 2", "Batch 3", "Batch 4"], required: true },
  createdAt: { type: Date, default: Date.now },
});

learnerSchema.methods.publicProfile = function () {
  return { id: this.id, name: this.name, email: this.email, cohort: this.cohort };
};

const Learner = mongoose.model("Learner", learnerSchema);

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Set MONGO_URI to a MongoDB connection string.");
  await mongoose.connect(uri);
  try {
    const learner = await Learner.create({ name: "Sample Learner", email: "sample@example.com", cohort: "Batch 4" });
    console.log(learner.publicProfile());
    await Learner.deleteOne({ _id: learner._id });
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { Learner };
