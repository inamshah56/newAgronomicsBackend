module.exports = (app) => {
    const fs = require("fs");
    const multer = require("multer");
    const router = require("express").Router();
    const { verifyToken } = require("../../middlewares/user/authJwtMiddleware");
    const pythonController = require("../../controllers/farm/python.controller");

    // // File type map for allowed image types
    // const FILE_TYPE_MAP = {
    //     "image/png": "png",
    //     "image/jpeg": "jpeg",
    //     "image/jpg": "jpg",
    // };

    // // Multer configuration for single image upload
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         const uploadDir = "./uploads/image_analysis/";
    //         // Check if the directory exists
    //         if (!fs.existsSync(uploadDir)) {
    //             // Create the directory if it doesn't exist
    //             fs.mkdirSync(uploadDir, { recursive: true });
    //         }
    //         cb(null, uploadDir);
    //     },
    //     filename: function (req, file, cb) {
    //         const fileType = FILE_TYPE_MAP[file.mimetype];
    //         if (!fileType) {
    //             return cb(new Error("Invalid file type."));
    //         }
    //         // const fileName = file.originalname + "-" + Date.now();
    //         // cb(null, fileName.replace(/ /g, "-") + "." + fileType);
    //         const originalFileName = file.originalname;
    //         // const timestamp = Date.now();
    //         // const sanitizedFileName = originalFileName.replace(/\s/g, "_"); // Replace spaces with underscores

    //         // Construct the final filename
    //         // const fileName = `${sanitizedFileName}-${timestamp}.${fileType}`;
    //         const fileName = originalFileName;
    //         cb(null, fileName);
    //     },
    // });

    // // Multer upload middleware for single image
    // const upload = multer({ storage: storage });

    // Multer configuration for single image upload

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

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
    router
        .route("/plant-analysis")
        .get(verifyToken, pythonController.getPlantAnalysis)
        .post(
            verifyToken,
            upload.single("crop_img"),
            pythonController.postPlantAnalysis
        );

    // router.route("/test").get(verifyToken, pythonController.test);

    app.use(router);
};
