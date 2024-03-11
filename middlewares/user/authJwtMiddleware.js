const jwt = require("jsonwebtoken");

// middleware function to verify access token before updating user profile
verifyToken = (req, res, next) => {
    let token = req.headers["access_token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = { verifyToken };
