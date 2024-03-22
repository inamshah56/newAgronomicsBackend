module.exports = (app) => {
    const router = require("express").Router();
    const { verifyToken } = require("../../middlewares/user/authJwtMiddleware");
    const simulatorController = require("../../controllers/farm/simulator.controller");

    // ================================================================
    // ===================== routes ===================================
    // ================================================================
    router.route("/data").get(verifyToken, simulatorController.getSimulator);
    router
        .route("/tubewell-exists")
        .get(verifyToken, simulatorController.tubewellExists);
    router
        .route("/tubewell-motorinfo")
        .patch(verifyToken, simulatorController.tubewellMotorInfo);
    router
        .route("/irrigation-schedule")
        .get(verifyToken, simulatorController.irrigationSchedule);
    app.use("/simulator", router);
};
