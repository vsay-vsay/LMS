const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ["super-admin", "Admin", "Tutor", "User"], required: true },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
});

module.exports = mongoose.model("User", userSchema);
