const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    maxAdmins: { type: Number, default: 2 },
    maxTutors: { type: Number, default: 10 },
    maxUsers: { type: Number, default: 100 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Super Admin who created it
});

module.exports = mongoose.model("Domain", domainSchema);
