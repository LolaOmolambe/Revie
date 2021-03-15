const express = require("express");
const multer = require("multer");

const reviewController = require("../controllers/review");
const authController = require("../controllers/auth");
const middleware = require("../utility/validationMiddleware");
const schemas = require("../utility/validationSchema");
const uploadService = require("../utility/imageUpload");
const router = express.Router({ mergeParams: true });

//router.route("/", reviewController.addToExistingReview);
// router
//   .route("/")
//   .post(authController.protectRoutes, reviewController.addToExistingReview)
//   .get(reviewController.getAllReviews);

router.post("/rate/:id/:like", reviewController.rateReview);
router.get("/", reviewController.getAllReviews); 
router.route("/:id").get(reviewController.getAReview);
router.get("/apartment/:apartmentId", reviewController.getAllReviews); 

router.use(authController.protectRoutes);

const uploadFiles = uploadService.fields([
    { name: 'videos', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ]);

router.post(
  "/",
  //middleware(schemas.reviewModel),
  uploadFiles,
  reviewController.addReview
);




module.exports = router;
