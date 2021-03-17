const express = require("express");
const reviewController = require("../controllers/review");
const authController = require("../controllers/auth");
const middleware = require("../utility/validationMiddleware");
const schemas = require("../utility/validationSchema");
const uploadService = require("../utility/imageUpload");
const router = express.Router();

const uploadFiles = uploadService.fields([
  { name: "videos", maxCount: 3 },
  { name: "images", maxCount: 3 },
]);

router.post(
  "/rate/:id",
  middleware(schemas.ratingSchema),
  reviewController.rateReview
);
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

module.exports = router;
