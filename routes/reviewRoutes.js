const express = require("express");
const reviewController = require("../controllers/review");
const authController = require("../controllers/auth");
const middleware = require("../utility/validationMiddleware");
const schemas = require("../utility/validationSchema");
const uploadService = require("../utility/imageUpload");
//const router = express.Router({ mergeParams: true });
const router = express.Router();

const uploadFiles = uploadService.fields([
  { name: "videos", maxCount: 3 },
  { name: "images", maxCount: 3 },
]);

//router.route("/", reviewController.addToExistingReview);
// router
//   .route("/")
//   .post(authController.protectRoutes, reviewController.addToExistingReview)
//   .get(reviewController.getAllReviews);

router.post("/rate/:id/:like", reviewController.rateReview);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protectRoutes,
    authController.restrictTo("user"),
    uploadFiles,
    reviewController.addReview
  );

router
  .route("/:id")
  .get(reviewController.getAReview)
  .delete(authController.protectRoutes, reviewController.deleteReview);
//router.get("/apartment/:apartmentId", reviewController.getAllReviews);



module.exports = router;
