module.exports = (app) => {
    const router = require("express").Router();
    const { verifyToken } = require("../../middlewares/user/authJwtMiddleware");
    const lgsController = require("../../controllers/farm/lgs.controller");

    // ================================================================
    // ===================== routes ===================================
    // ================================================================
    router
        .route("/sowedcrop-farm")
        .post(verifyToken, lgsController.cropSowedFarm);

    app.use(router);
};
