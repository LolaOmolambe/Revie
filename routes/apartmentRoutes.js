const express = require("express");
const router = express.Router();
const apartmentController = require("../controllers/apartment");
const reviewController = require("../controllers/review");
//const reviewRouter = require("../routes/reviewRoutes");
const authController = require("../controllers/auth");
const uploadService = require("../utility/imageUpload");

const uploadFiles = uploadService.fields([
  { name: "videos", maxCount: 3 },
  { name: "images", maxCount: 3 },
]);

//router.use('/:apartmentId/reviews', reviewRouter);

router.get("", apartmentController.getAllApartments);
router.get("/:apartmentId", apartmentController.getAnApartment);

//Come back to this //I used mergeParams
router
  .route("/:apartmentId/reviews")
  .get(reviewController.getAllReviews)
  .post(
    authController.protectRoutes,
    authController.restrictTo("user"),
    uploadFiles,
    reviewController.addToExistingReview
  );

router.get("/:apartmentId/reviews/:userId", reviewController.getAllReviews);

module.exports = router;
