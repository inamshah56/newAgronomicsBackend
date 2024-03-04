const Farm = require("../../models/farm/farm.model");
const { returnPolygon } = require("../../utils/user/returnPolygon");
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");
const sequelize = require("../../config/sequelize");

// ================================================================
// ===================== getFarm controller =======================
// ================================================================

exports.getFarm = async (req, res) => {
    try {
        const userUid = req.user.uid;
        const userFarms = await Farm.findAll({
            attributes: {
                exclude: [
                    "geometry",
                    "geom",
                    "createdAt",
                    "updateAt",
                    "userUid",
                ],
            },
            where: { userUid },
        });
        successOk(res, userFarms, true);
    } catch (error) {
        catchError(res, error);
    }
};

// ================================================================
// ===================== postFarm controller ======================
// ================================================================

exports.createFarm = async (req, res) => {
    try {
        const userUid = req.user.uid;
        // const body = req.body;
        const {
            size_acre,
            land_name,
            tehsil,
            district,
            province,
            road_access,
            electricity,
            tubewell,
            well,
            canal,
            location,
            geometry,
        } = req.body;
        if (!size_acre)
            return validationError(res, {
                size_acre: "this field is required.",
            });
        if (!land_name)
            return validationError(res, {
                land_name: "this field is required.",
            });
        if (!tehsil)
            return validationError(res, {
                tehsil: "this field is required.",
            });
        if (!district)
            return validationError(res, {
                district: "this field is required.",
            });
        if (!province)
            return validationError(res, {
                province: "this field is required.",
            });
        if (!location)
            return validationError(res, {
                location: "this field is required.",
            });
        if (!geometry)
            return validationError(res, {
                geometry: "this field is required.",
            });
        req.body["userUid"] = userUid;
        const response = await Farm.create(req.body);
        const farm_id = response.farm_id;
        const geom_text = returnPolygon(geometry);
        await sequelize.query(
            `UPDATE farms SET geom_text = '${geom_text}', geom = ST_GeomFromText('${geom_text}') WHERE farm_id = '${farm_id}'`
        );
        successOk(res, "Farm created successfully", false);
    } catch (error) {
        catchError(res, error);
    }
};
