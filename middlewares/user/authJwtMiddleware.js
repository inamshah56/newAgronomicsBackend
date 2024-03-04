const jwt = require("jsonwebtoken");
const config = require("../../config/user/user.config");

// required for remaining middleware functions
// const User = require("../../models/userProfile/user.model");

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

// these middleware functions are not in use currently

// isAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Admin Role!",
//       });
//       return;
//     });
//   });
// };
// isModerator = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Moderator Role!",
//       });
//     });
//   });
// };
// isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Moderator or Admin Role!",
//       });
//     });
//   });
// };
// const authJwt = {
//   verifyToken: verifyToken,
//   // isAdmin: isAdmin,
//   // isModerator: isModerator,
//   // isModeratorOrAdmin: isModeratorOrAdmin,
// };
module.exports = { verifyToken };
