// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Domain = require("../models/Domain");

// const login = async (req, res) => {
//     const { domainName, email, password } = req.body;

//     try {
//         let user;
//         if (email === "admin") {
//             user = await User.findOne({ email, role: "super-admin" });
//         } else {
//             const domain = await Domain.findOne({ name: domainName });
//             if (!domain) return res.status(404).json({ message: "Domain not found" });

//             user = await User.findOne({ email, domain: domain._id });
//         }

//         if (!user) return res.status(401).json({ message: "Invalid email or password" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//             expiresIn: "1d",
//         });

//         res.json({ token, role: user.role });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = { login };


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Domain = require("../models/Domain");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

const login = async (req, res) => {
    const { domainName, email, password } = req.body;

    try {
        let user;
        if (email === process.env.SUPER_ADMIN_EMAIL) {
            user = await User.findOne({ email, role: "super-admin" });
        } else {
            const domain = await Domain.findOne({ name: domainName });
            if (!domain) return res.status(404).json({ message: "Domain not found" });

            user = await User.findOne({ email, domain: domain._id });
        }

        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken, role: user.role, domainName: domainName, email: user.email, name: user.name  });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login };
