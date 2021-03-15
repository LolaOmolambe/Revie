const express = require("express");
const router = express.Router();
const apartmentController = require("../controllers/apartment");
const reviewController = require("../controllers/review");
const reviewRouter = require("../routes/reviewRoutes");
const authController = require("../controllers/auth");

router.use('/:apartmentId/reviews', reviewRouter);

router.get("", apartmentController.getAllApartments);
router.get("/:apartmentId", apartmentController.getAnApartment);

router.use(authController.protectRoutes);

//Come back to this //I used mergeParams
//router.post("/:apartmentId/review", reviewController.addToExistingReview);

module.exports = router;
