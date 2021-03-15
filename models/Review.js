const mongoose = require("mongoose");
const validator = require("validator");

const reviewSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.ObjectId,
      ref: "Apartment",
      required: [true, "Review must belong to an apartment"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    landlordReview: {
      type: String,
    },
    enviromentReview: {
      type: String,
      required: [true, "Enviroment Review can not be empty!"],
    },
    amenitiesReview: {
      type: String,
      required: [true, "Amenities Review can not be empty!"],
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    images: [String],
    videos: [String],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ apartment: 1, user: 1 });

reviewSchema.pre(/^find/, function (next) {
  this
    //   .populate({
    //     path: "apartment",
    //     select: "address",
    //   })
    .populate({
      path: "user",
      select: "name",
    });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

module.exports = mongoose.model("Review", reviewSchema);
