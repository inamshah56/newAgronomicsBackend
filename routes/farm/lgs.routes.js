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

    router.route("/run-lgs-again").get(verifyToken, lgsController.runLgsAgain);

    router.route("/crop-lgs").get(verifyToken, lgsController.cropLgs);
    router.route("/sowdate").patch(verifyToken, lgsController.sowdateSelected);
    router
        .route("/change-sowdate")
        .patch(verifyToken, lgsController.changeSowdate);
    router.route("/sowed").patch(verifyToken, lgsController.cropSowed);
    router.route("/get-lgs-data").get(verifyToken, lgsController.getLgsData);

    app.use("/lgs", router);
};
