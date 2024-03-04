const validateOtp = (otp) => {
  if (!otp) {
    return "otp is required";
  }

  const otpPattern = /^\d{0,6}$/;

  if (!otpPattern.test(otp)) {
    return "please enter a valid otp";
  }
  if (otp.length !== 6) {
    return "otp must have exactly 6 digits";
  }
};

module.exports = validateOtp;
