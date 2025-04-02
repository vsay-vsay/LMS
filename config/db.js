// const mongoose = require("mongoose");
// require("dotenv").config();
// const User = require("../models/User");
// const bcrypt = require("bcrypt");

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);

//         console.log("MongoDB Connected");

//         // Check if Super Admin exists
//         const superAdmin = await User.findOne({ role: "super-admin" });

//         if (!superAdmin) {
//             await User.create({
//                 name: "Super Admin",
//                 email: "admin",
//                 password: await bcrypt.hash("vsay@123", 10),
//                 role: "super-admin",
//             });
//             console.log("Super Admin Created");
//         }
//     } catch (error) {
//         console.error("DB Connection Error:", error.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Check if Super Admin exists
        const superAdmin = await User.findOne({ role: "super-admin" });

        if (!superAdmin) {
            await User.create({
                name: "Super Admin",
                email: process.env.SUPER_ADMIN_EMAIL,
                password: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10),
                role: "super-admin",
            });
            console.log("Super Admin Created");
        }
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
