const axios = require("axios");
const {
    successOk,
    catchError,
    validationError,
    frontError,
    backError,
} = require("../../utils/user/responses");
const pythonUrl = process.env.PYTHON_URL;

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

// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// ================================================================
// ===================== test Controller ===================
// ================================================================
const {
    Crop,
    Cropvariety,
    Cropstage,
} = require("../../models/farm/crop.model");
const data = require("../../controllers/test");
exports.test = async (req, res) => {
    try {
        const datta = data;
        const response = await Crop.bulkCreate(datta, {
            ignoreDuplicates: true,
            include: [
                {
                    ignoreDuplicates: true,
                    association: Crop.Cropvariety,
                    include: [
                        {
                            ignoreDuplicates: true,
                            association: Cropvariety.Cropstage,
                        },
                    ],
                },
            ],
        });
        console.log("=================================", response);
        console.log("+++++++++++++++++++++++++++++++++++");
        return successOk(res, "Ok", false);
    } catch (error) {
        console.log("eeror: ++++++++++++++++\n", error);
        return catchError(res, error);
    }
};
