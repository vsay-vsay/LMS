const Domain = require("../models/Domain");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createDomain = async (req, res) => {
    try {
        const { domainName, adminName, adminEmail, adminPassword, maxAdmins, maxTutors, maxUsers } = req.body;

        if (!domainName || !adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingDomain = await Domain.findOne({ name: domainName });
        if (existingDomain) {
            return res.status(400).json({ message: "Domain already exists" });
        }

        const domain = new Domain({
            name: domainName, // Change from `domainName` to `name`
            maxAdmins,
            maxTutors,
            maxUsers,
            createdBy: req.user.id, // Super admin ID
        });

        await domain.save();

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "Admin",
            domain: domain._id,
        });

        await admin.save();

        res.status(201).json({ message: "Domain and Admin created successfully", domain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkDomain = async (req, res) => {
    try {
        // const { domainName } = req.body;
        const name = req.body.domainName;
        if (!name) {
            return res.status(400).json({ message: "Domain name is required" });
        }

        const domain = await Domain.findOne({ name });

        if (domain) {
            return res.status(200).json({ message: "Domain exists", exists: true, domainName: name });
        } else {
            return res.status(404).json({ message: "Domain not found", exists: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createDomain, checkDomain };
