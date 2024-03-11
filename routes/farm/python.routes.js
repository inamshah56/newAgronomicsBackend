module.exports = (app) => {
    const router = require("express").Router();
    const { verifyToken } = require("../../middlewares/user/authJwtMiddleware");
    const pythonController = require("../../controllers/farm/python.controller");

    // ================================================================
    // ===================== routes ===================================
    // ================================================================
    router.route("/lulc-check").get(verifyToken, pythonController.lulcCheck);
    router
        .route("/get-province")
        .get(verifyToken, pythonController.getProvince);

    router
        .route("/get-crop-data")
        .get(verifyToken, pythonController.getCropData);

    router.route("/test").get(verifyToken, pythonController.test);

    app.use(router);
};
