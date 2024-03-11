// ================================================================
// ===================== success responses ========================
// ================================================================

const successOk = (res, message, data) => {
    if (data) {
        return res.status(200).send({
            success: true,
            data: message,
        });
    } else {
        return res.status(200).send({
            success: true,
            message: message,
        });
    }
};

// ================================================================
// ===================== error responses ==========================
// ================================================================

// ===================== success responses ========================

const catchError = (res, error) => {
    return res.status(500).send({
        message: error.message || "Internal server error",
    });
};

// ===================== catchError ========================

const validationError = (res, message) => {
    return res.status(400).send({
        success: false,
        error: "user",
        message: message,
    });
};

// ===================== frontError ========================

const frontError = (res, message) => {
    return res.status(400).send({
        success: false,
        error: "front",
        message: message,
    });
};

// ===================== backError ========================

const backError = (res, message) => {
    return res.status(400).send({
        success: false,
        error: "back",
        message: message,
    });
};

module.exports = {
    successOk,
    catchError,
    validationError,
    frontError,
    backError,
};
