const AppError = require("../utility/appError");
const { successResponse } = require("../utility/response");
const Apartment = require("../models/Apartment");
const Review = require("../models/Review");
const QueryHelper = require("../utility/queryHelper");
const aws = require("aws-sdk");

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

    if (!enviromentReview || !amenitiesReview) {
      return next(
        new AppError("Invalid Payload. Request body is not complete", 400)
      );
    }

    let imageUrls = [];
    let videoUrls = [];

   
    if (Object.keys(req.files).length !== 0) {
      if (req.files.images) {
        let imageFiles = req.files.images;

        imageFiles.map((item) => {
          imageUrls.push(item.location);
        });
      }

      if (req.files.videos) {
        let videoFiles = req.files.videos;
        videoFiles.map((item) => {
          videoUrls.push(item.location);
        });
      }
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
      creator: req.user._id,
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
    let videoUrls = [];

    if (req.files.images) {
      let imageFiles = req.files.images;

      imageFiles.map((item) => {
        imageUrls.push(item.location);
      });
    }

    if (req.files.videos) {
      let videoFiles = req.files.videos;
      videoFiles.map((item) => {
        videoUrls.push(item.location);
      });
    }

    let apartment = await Apartment.findById(req.params.apartmentId);

    if (!apartment) {
      return next(new AppError("Apartment does not exist", 404));
    }

    const newReview = await Review.create({
      apartment: apartment._id,
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

exports.getAllReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.apartmentId) {
      filter = { apartment: req.params.apartmentId };
    }
    if (req.params.userId) {
      filter = { user: req.params.userId };
    }
    if (req.params.apartmentId && req.params.userId) {
      filter = { apartment: req.params.apartmentId, user: req.params.userId };
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
    let rating = req.body.rating;
    let review = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError("Review not found", 401));
    }
    review.ratings.push(rating);
    await review.save();

    return successResponse(res, 200, "Thank you for rating", null);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    let result = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        isDeleted: true,
      }
    );

    if (!result) {
      return next(
        new AppError(
          `No review exists with this ID ${req.params.id} for ${req.user.name}`,
          401
        )
      );
    }

    var s3 = new aws.S3({
      secretAccessKey: process.env.AWS_SECRET_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    if (result.images.length > 0) {
      result.images.forEach((item) => {
        let filenameToRemove = item.split("/").slice(-1)[0];
      

        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET,
            Key: `revieImages/${filenameToRemove}`,
          },
          function (err, data) {
            if (err) {
              console.log("errr", err);
            }
            if (data) {
              console.log(data);
            }
          }
        );
      });
    }

    if (result.videos.length > 0) {
      result.videos.forEach((item) => {
        let filenameToRemove = item.split("/").slice(-1)[0];

        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET,
            Key: `revieVideos/${filenameToRemove}`,
          },
          function (err, data) {
            if (err) {
              console.log("errr", err);
            }
            if (data) {
              console.log(data);
            }
          }
        );
      });
    }

    return successResponse(res, 200, "Review deleted successfully", null);
  } catch (err) {
    next(err);
  }
};
