module.exports = (app) => {
  const router = require("express").Router();
  const otpController = require("../../controllers/user/otp.controller");
  const {
    otpLimiter,
    wrongOtpLimiter,
  } = require("../../middlewares/otp/otpLimit");

  router.post("/generate-otp", otpLimiter, otpController.generateOtp);
  router.post("/verify-otp", wrongOtpLimiter, otpController.verifyOtp);

  app.use(router);
};
