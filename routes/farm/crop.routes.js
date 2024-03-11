module.exports = (app) => {
    const router = require("express").Router();
    const { verifyToken } = require("../../middlewares/user/authJwtMiddleware");
    const cropController = require("../../controllers/farm/crop.controller");

    // ================================================================
    // ===================== routes ===================================
    // ================================================================
    router.route("/crop").get(verifyToken, cropController.getCrops);
    // .post(verifyToken, farmController.createFarm);

    app.use(router);
};
