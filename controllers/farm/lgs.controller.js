const Farm = require("../../models/farm/farm.model");
const Lgs = require("../../models/farm/lgs.model");
const Grid = require("../../models/grid/grid.model");
const Crop = require("../../models/farm/crop.model");
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");
const { Op } = require("sequelize");

// ================================================================
// ===================== AlreadyCropSowed FarmPost ================
// ================================================================

exports.cropSowedFarm = async (req, res) => {
    try {
        console.log(
            "==================== API called sowedcrop ===================="
        );
        const userUid = req.user.uid;
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
            crop,
            variety,
            sowdate,
        } = req.body;
        if (!size_acre) return frontError(res, "size_acre is required");
        if (!land_name)
            return validationError(res, "land_name field is required");
        if (!tehsil) return frontError(res, "tehsil is required");
        if (!district) return frontError(res, "district is required");
        if (!province) return frontError(res, "province is required");
        if (!location) return frontError(res, "location is required");
        if (!geometry) return frontError(res, "geometry is required");
        if (!crop) return frontError(res, "crop is required");
        if (!variety) return frontError(res, "variety is required");
        if (!sowdate) return frontError(res, "sowdate is required");

        req.body["userUid"] = userUid;
        req.body["cultivated"] = true;

        const farmResponse = await Farm.create(req.body);

        // Finding the grid in which the farm fall.
        const lat = location[1];
        const lon = location[0];

        const grid = await Grid.findOne({
            where: {
                bottom: { [Op.gt]: lat }, // bottom > lat
                top: { [Op.lt]: lat }, // top < lat
                left: { [Op.lt]: lon }, // left < lon
                right: { [Op.gt]: lon },
            },
            attributes: ["id"],
        });

        // creating lgs record:
        const gridId = grid.id;
        const farmUid = farmResponse.uid;
        req.body["farmUid"] = farmUid;
        req.body["gridId"] = gridId;
        const lgs = await Lgs.create(req.body);

        // call the api to run the crop simulator.
        return successOk(res, "Farm Created successfully.", false);
    } catch (error) {
        catchError(res, error);
    }
};
