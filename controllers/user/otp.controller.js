const catchError = require("../../utils/user/responses");
const User = require("../../models/user/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { wrongOtpLimiter } = require("../../middlewares/otp/otpLimit");
const validatePhone = require("../../utils/user/validatePhone");
const validateEmail = require("../../utils/user/validateEmail");
const validateOtp = require("../../utils/user/validateOtp");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/user/tokenGenerator");

// const { SMS_KEY, EMAIL_KEY } = require("../utils/variables");

const { EMAIL_KEY, SMS_KEY } = process.env;

// Create a Nodemailer transporter using SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // Set to true if you're using SSL/TLS
  auth: {
    user: "apikey",
    pass: EMAIL_KEY,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "bilalhassan393@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(
        `<<<<<<<<<<  transporter.sendMail error : ${error}  >>>>>>>>>>`
      );
      console.log(
        `==============================================================================`
      );
      return error;
    } else {
      console.log(`<<<<<<<<<<  email sent : ${info.response}  >>>>>>>>>>`);
      console.log(
        `==============================================================================`
      );
      return info.response;
    }
  });
};

// ################################## GENERATE OTP ##################################

exports.generateOtp = async (req, res) => {
  const { phone, email } = req.body;

  if (!(email || phone)) {
    return res.status(400).send({
      success: false,
      message: "Please provide either email or phone number",
    });
  }

  const invalid = phone ? validatePhone(phone) : validateEmail(email);

  if (invalid) {
    return res.status(400).send({
      success: false,
      message: invalid,
    });
  }

  const otp = crypto.randomInt(100000, 999999);
  const message = `Your OTP for Agronomics is ${otp}. For any issue contact us 03217336243.`;
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // change expiry here, currently set to 10 mints

  const identifierKey = phone ? "phone" : "email";
  const identifierValue = phone ? phone : email;

  const otpData = {
    [identifierKey]: identifierValue,
    otp,
    expiry,
  };

  try {
    let sendSuccess = false;

    if (phone) {
      const url = `https://secure.h3techs.com/sms/api/send?email=greenageservices@gmail.com&key=${SMS_KEY}&mask=81478&to=${phone}&message=${message}`;
      const { status, data } = await axios.post(url);
      if (status === 200 && data) {
        sendSuccess = true;
      }
    } else if (email) {
      // Assuming sendEmail function sends the email synchronously
      sendEmail(email, "OTP - Agronomics", message);
      sendSuccess = true;
    }

    if (sendSuccess) {
      let newUser = false;
      // Save OTP in the database only if sent successfully
      const existingOtpRecord = await User.findOne({
        where: { [identifierKey]: identifierValue },
      });

      if (existingOtpRecord) {
        // Update existing record
        await User.update(otpData, {
          where: { [identifierKey]: identifierValue },
        });
      } else {
        // Create new record
        await User.create(otpData);
        newUser = true;
      }

      console.log("<<<<<<<<<<  otp generated successfuly >>>>>>>>>>");
      console.log(
        `==============================================================================`
      );
      return res.status(200).send({
        success: true,
        message: `OTP sent successfully to ${identifierValue}`,
        newUser: newUser,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

// ################################## VERIFY OTP ##################################

exports.verifyOtp = async (req, res) => {
  const { phone, email, otp } = req.body;

  let invalid;

  if (!(email || phone)) {
    return res.status(400).send({
      success: false,
      message: "Please provide either email or phone number",
    });
  }

  invalid = phone ? validatePhone(phone) : validateEmail(email);

  if (!invalid) {
    invalid = validateOtp(otp);
  }

  if (invalid) {
    return res.status(400).send({
      success: false,
      message: invalid,
    });
  }

  try {
    const identifierKey = phone ? "phone" : "email";
    const identifierValue = phone || email;

    // Retrieve the OTP record from the database based on phone number or email
    const user = await User.findOne({
      where: {
        [identifierKey]: identifierValue,
      },
    });

    if (user) {
      const isOtpValid = user.otp === otp;
      const isNotExpired = new Date() < new Date(user.expiry);

      if (isOtpValid && isNotExpired) {
        wrongOtpLimiter.resetKey(req);
        // we have commented this code because we don't have to reset the expiry time when the otp is verified successfully.
        // Update expiry time to 10 minutes from the current time
        const newExpiry = new Date();
        // newExpiry.setMinutes(newExpiry.getMinutes() + 10);
        await User.update(
          { expiry: newExpiry },
          {
            where: {
              [identifierKey]: identifierValue,
            },
          }
        );
        console.log("<<<<<<<<<< otp verified successfuly >>>>>>>>>>");
        console.log(
          `==============================================================================`
        );

        // generating token

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).send({
          success: true,
          message: "OTP verified successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        console.log("<<<<<<<<<< invalid otp or otp expired >>>>>>>>>>");
        console.log(
          `==============================================================================`
        );
        res.status(400).send({
          success: false,
          message: "Invalid OTP or OTP expired",
        });
      }
    } else {
      console.log("<<<<<<<<<< otp record not found >>>>>>>>>>");
      console.log(
        `==============================================================================`
      );
      res.status(404).send({
        success: false,
        message: "OTP record not found",
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};
