// protect.js
const jwt = require("jsonwebtoken");
const { constants } = require("../constants");

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
        const error = new Error("Not authorized, no token");
        res.status(constants.UNAUTHORIZED);
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set user info from token in request
        next();
    } catch (error) {
        const jwtError = new Error("Not authorized, token failed");
        res.status(constants.UNAUTHORIZED);
        next(jwtError);
    }
};

module.exports = protect;
