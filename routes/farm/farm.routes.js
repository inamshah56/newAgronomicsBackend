module.exports = (app) => {
    const router = require("express").Router();
    const { verifyToken } = require("../../middlewares/user/authJwtMiddleware");
    const farmController = require("../../controllers/farm/farm.controller");

    // ================================================================
    // ===================== routes ===================================
    // ================================================================
    router
        .route("/farm")
        .get(verifyToken, farmController.getFarm)
        .post(verifyToken, farmController.createFarm);

    app.use(router);
};
