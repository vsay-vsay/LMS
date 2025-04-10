const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },
  topicName: { type: String, required: true },
  description: { type: String, required: true },
  files: [{ type: String }], // URLs of uploaded files
}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);
