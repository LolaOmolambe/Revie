const AppError = require("../utility/appError");
const { successResponse } = require("../utility/response");
const Apartment = require("../models/Apartment");
const Review = require("../models/Review");
const QueryHelper = require("../utility/queryHelper");

//Work on validation
exports.addReview = async (req, res, next) => {
  try {
    let {
      address,
      country,
      state,
      latitude,
      longitude,
      landlordReview,
      enviromentReview,
      amenitiesReview,
    } = req.body;

    if (!address || !country || !state || !latitude || !longitude) {
      return next(
        new AppError("Invalid Payload. Request body is not complete", 400)
      );
    }

    let imageUrls = [];
    let videoUrls = [];

    if (req.files.images.length > 0) {
      let imageFiles = req.files.images;

      imageFiles.map((item) => {
        imageUrls.push(item.location);
      });
    }

    if (req.files.videos.length > 0) {
      let videoFiles = req.files.videos;
      videoFiles.map((item) => {
        videoUrls.push(item.location);
      });
    }

    let longlat = {
      type: "Point",
      coordinates: [parseFloat(latitude), parseFloat(longitude)],
    };

    const newApartment = await Apartment.create({
      address: address,
      country: country,
      state: state,
      location: longlat,
    });

    const newReview = await Review.create({
      apartment: newApartment._id,
      user: req.user._id,
      landlordReview,
      enviromentReview,
      amenitiesReview,
      images: imageUrls,
      videos: videoUrls,
    });

    return successResponse(res, 201, "Review added successfully", null);
  } catch (err) {
    next(err);
  }
};

exports.addToExistingReview = async (req, res, next) => {
  try {
    let { landlordReview, enviromentReview, amenitiesReview } = req.body;

    let imageUrls = [];

    if (req.files.length > 0) {
      let imageFiles = req.files;

      imageFiles.map((item) => {
        imageUrls.push(item.location);
      });
    }

    console.log(imageUrls);

    let apartment = await Apartment.findById(req.params.apartmentId);

    if (!apartment) {
      next(new AppError("Apartment does not exist", 404));
    }

    const newReview = await Review.create({
      apartment: apartment._id,
      user: req.user._id,
      landlordReview: landlordReview,
      enviromentReview: enviromentReview,
      amenitiesReview: amenitiesReview,
      images: imageUrls,
    });

    return successResponse(res, 201, "Review added successfully", null);
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.apartmentId) {
      filter = { apartment: req.params.apartmentId };
    }

    let reviewsQuery = new QueryHelper(Review.find(filter), req.query)
      .sort()
      .paginate();
    let reviews = await reviewsQuery.query;

    return successResponse(res, 200, "Reviews fetched successfully", {
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError("Review not Found", 404));
    }

    return successResponse(res, 200, "Review fetched successfully", {
      review,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviewsGivenByAUser = async (req, res, next) => {
  try {
    let reviews = await Review.find({ user: req.params.userId });

    return successResponse(res, 200, "Reviews fetched successfully", {
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.rateReview = async (req, res, next) => {
  try {
    let like = req.params.like;

    if (like === "true") {
      let review = await Review.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { upvotes: 1 },
        }
      );
    } else if (like === "false") {
      let review = await Review.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { downvotes: 1 },
        }
      );
    }

    return successResponse(res, 200, "Thank you for rating", null);
  } catch (err) {
    next(err);
  }
};
