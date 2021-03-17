const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  limits: {
    //files: 1, // allow only 1 file per request
    fileSize: 1024 * 1024 * 100, // 10 MB (max file size)
  },
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "scabackend",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      let key = "";
      
      if (file.fieldname == "images") {
        key = `revieImages/${Date.now().toString()}-${file.originalname.toLowerCase()}`;
      } else if (file.fieldname == "videos") {
        key = `revieVideos/${Date.now().toString()}-${file.originalname.toLowerCase()}`;
      }

      cb(null, key);
    },
  }),
});

module.exports = upload;
