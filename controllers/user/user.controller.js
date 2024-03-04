const User = require("../../models/user/user.model");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const config = require("../../config/user/user.config");
const {
  successOk,
  catchError,
  validationError,
  frontError,
} = require("../../utils/user/responses");

// =====================  me  ===================================

exports.me = async (req, res) => {
  try {
    // here true means data and false means message
    successOk(res, req.user, true);
  } catch (error) {
    catchError(res, error);
  }
};

// =====================  udpateUser  ===================================

exports.updateUser = async (req, res) => {
  const phone = req.user.phone;
  const { full_name, cnic } = req.body;
  try {
    let updatedFields = {};
    if (full_name) {
      updatedFields.full_name = full_name;
    }
    if (cnic) {
      updatedFields.cnic = cnic;
    }
    if (
      req.files &&
      req.files["profile_pic"] &&
      req.files["profile_pic"].length > 0
    ) {
      const profilePicPath = req.files["profile_pic"][0].path;
      updatedFields.profile_pic = profilePicPath;
    }
    if (
      req.files &&
      req.files["cnic_front"] &&
      req.files["cnic_front"].length > 0
    ) {
      const cnicFrontPath = req.files["cnic_front"][0].path;
      updatedFields.cnic_front = cnicFrontPath;
    }
    if (
      req.files &&
      req.files["cnic_back"] &&
      req.files["cnic_back"].length > 0
    ) {
      const cnicBackPath = req.files["cnic_back"][0].path;
      updatedFields.cnic_back = cnicBackPath;
    }

    await User.update(updatedFields, {
      where: {
        phone: phone,
      },
    });
    console.log("<<<<<<<<<<  User data updated successfully  >>>>>>>>>>");
    console.log(
      `==============================================================================`
    );
    successOk(res, "User data updated successfully", false);
  } catch (error) {
    catchError(res, error);
  }
};
