const axios = require("axios");
const FormData = require("form-data");
const {
    successOk,
    catchError,
    validationError,
    frontError,
    backError,
} = require("../../utils/user/responses");
const pythonUrl = process.env.PYTHON_URL;
const pythonUrl2 = process.env.PYTHON_URL2;

// ================================================================
// ===================== lulcCheck Controller =====================
// ================================================================

exports.lulcCheck = async (req, res) => {
    try {
        const { latlng_list } = req.query;
        if (!latlng_list) {
            return frontError(res, "latlng_list is required");
        }
        console.log("================sdfsdfs======sdf\n ", latlng_list);
        const response = await axios.get(
            `${pythonUrl}/lulc_check/?latlng_list= ${latlng_list}`
        );
        return successOk(res, response.data.res, true);
    } catch (error) {
        console.log("error: ======================== ", error);
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        }
        return catchError(res, error);
    }
};

// ================================================================
// ===================== getProvince Controller ===================
// ================================================================

exports.getProvince = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat) {
            return frontError(res, "lattitude is required");
        }
        if (!lon) {
            return frontError(res, "longitude is required");
        }
        const response = await axios.get(
            `${pythonUrl}/get_province/?lat=${lat}&lon= ${lon}`
        );
        return successOk(res, response.data, true);
    } catch (error) {
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        }
        return catchError(res, error);
    }
};

// ================================================================
// ===================== getCropData Controller ===================
// ================================================================

exports.getCropData = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat) {
            return frontError(res, "lattitude is required");
        }
        if (!lon) {
            return frontError(res, "longitude is required");
        }
        const response = await axios.get(
            `${pythonUrl}/get_crop_data/?lat=${lat}&lon= ${lon}`
        );
        return successOk(res, response.data, true);
    } catch (error) {
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        }
        return catchError(res, error);
    }
};

// ================================================================
// ==================== getPlantAnalysis Controller ===============
// ================================================================

exports.getPlantAnalysis = async (req, res) => {
    try {
        const { uid } = req.query;
        if (!uid) return frontError(res, "uid, this is required");

        const farm_id = 2019;

        const response = await axios.get(
            `${pythonUrl2}/check_disease/?farm_id=${farm_id}`
        );
        return successOk(res, response.data, true);
    } catch (error) {
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        }
        return catchError(res, error);
    }
};

// ================================================================
// ==================== postPlantAnalysis Controller ==============
// ================================================================

exports.postPlantAnalysis = async (req, res) => {
    try {
        const { uid } = req.query;
        const { crop, crop_variety, crop_age, current_stage } = req.body;
        const crop_img = req.file;
        if (!uid) return frontError(res, "uid, this is required");
        if (!crop) return frontError(res, "crop, this is required");
        if (!crop_variety)
            return frontError(res, "crop_variety, this is required");
        if (!crop_age) return frontError(res, "crop_age, this is required");
        if (!current_stage)
            return frontError(res, "current_stage, this is required");

        // formdata to send image and req.body data to the pythonUrl2
        let formData = new FormData();
        formData.append("crop_img", crop_img.buffer, {
            filename: crop_img.originalname,
            contentType: crop_img.mimetype,
        });
        for (const [key, value] of Object.entries(req.body)) {
            formData.append(key, value);
        }

        // hardcoded farm_id to keep the flow
        const farm_id = 2019;
        formData.append("farm_id", farm_id);
        console.log("============ formData ==============", formData);

        await axios.post(`${pythonUrl2}/check_disease`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return successOk(res, "Image uploaded successfully", false);
    } catch (error) {
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        } else {
            return catchError(res, error);
        }
    }
};

// =============================================================
// ===================== test Controller =======================
// =============================================================

// const {
//     Crop,
//     Cropvariety,
//     Cropstage,
// } = require("../../models/farm/crop.model");
// const data = require("../../controllers/test");
// exports.test = async (req, res) => {
//     try {
//         const datta = data;
//         const response = await Crop.bulkCreate(datta, {
//             ignoreDuplicates: true,
//             include: [
//                 {
//                     ignoreDuplicates: true,
//                     association: Crop.Cropvariety,
//                     include: [
//                         {
//                             ignoreDuplicates: true,
//                             association: Cropvariety.Cropstage,
//                         },
//                     ],
//                 },
//             ],
//         });
//         console.log("=================================", response);
//         console.log("+++++++++++++++++++++++++++++++++++");
//         return successOk(res, "Ok", false);
//     } catch (error) {
//         console.log("eeror: ++++++++++++++++\n", error);
//         return catchError(res, error);
//     }
// };

// =============================================================
// ===================== test Controller =======================
// =============================================================

// const {
//     Crop,
//     Cropvariety,
//     Cropstage,
// } = require("../../models/farm/crop.model");
// const data = require("../../controllers/stage_dict");
// exports.test = async (req, res) => {
//     try {
//         const datta = data;
//         const response = await Cropstage.bulkCreate(datta, {
//             ignoreDuplicates: true,
//         });
//         console.log("=================================", response);
//         console.log("+++++++++++++++++++++++++++++++++++");
//         return successOk(res, "Ok", false);
//     } catch (error) {
//         console.log("eeror: ++++++++++++++++\n", error);
//         return catchError(res, error);
//     }
// };
