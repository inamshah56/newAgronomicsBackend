const multer = require("multer");

// Middleware to handle file upload errors
const multerErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log("<<<<<<<<<<  Multer error : " + err.message + "  >>>>>>>>>>");
    console.log(
      `==============================================================================`
    );
    return res.status(400).send(err.message);
  } else if (err) {
    console.log(
      "<<<<<<<<<<  Other Multer error : " + err.message + "  >>>>>>>>>>"
    );
    console.log(
      `==============================================================================`
    );
    return res.status(500).send(err.message);
  }
  next();
};

module.exports = { multerErrors };
