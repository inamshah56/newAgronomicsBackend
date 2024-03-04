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
        const response = await axios.get(
            `${pythonUrl}/lulc_check/?latlng_list= ${latlng_list}`
        );
        return successOk(res, response.data.res, true);
    } catch (error) {
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        }
        return catchError(res, error);
    }
};

// ================================================================
// ===================== lulcCheck Controller =====================
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
        console.log("====================== error response: ", error);
        if (error.response.status === 400) {
            return backError(res, error.response.data);
        }
        return catchError(res, error);
    }
};
