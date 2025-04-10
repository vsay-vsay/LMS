const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        token = token.split(" ")[1]; // Extract the actual token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use secret from .env

        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const tutorOnly = (req, res, next) => {
    if (req.user.role !== "Tutor") {
        return res.status(403).json({ message: "Access denied: Tutors only" });
    }
    next();
};

module.exports = {protect, tutorOnly};
