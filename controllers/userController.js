const User = require("../models/User");
const Domain = require("../models/Domain");
const bcrypt = require("bcryptjs");

// Create User inside the domain
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Only Admins can create users
        const adminDomain = req.user.domain;
        if (!adminDomain) {
            return res.status(403).json({ message: "Admin does not belong to a valid domain" });
        }

        const domain = await Domain.findById(adminDomain);
        if (!domain) {
            return res.status(404).json({ message: "Domain not found" });
        }

        // Check if max limit is reached
        const userCount = await User.countDocuments({ domain: adminDomain, role });
        if (
            (role === "admin" && userCount >= domain.maxAdmins) ||
            (role === "tutor" && userCount >= domain.maxTutors) ||
            (role === "user" && userCount >= domain.maxUsers)
        ) {
            return res.status(400).json({ message: `Max limit reached for ${role}s` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            domain: adminDomain,
        });

        res.status(201).json({ message: `${role} created successfully`, user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Users in the Admin's Domain
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ domain: req.user.domain }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit a User inside the Admin's Domain
const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findOne({ _id: id, domain: req.user.domain });
        if (!user) {
            return res.status(404).json({ message: "User not found in your domain" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a User inside the Admin's Domain
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id, domain: req.user.domain });
        if (!user) {
            return res.status(404).json({ message: "User not found in your domain" });
        }

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, getUsers, editUser, deleteUser };
