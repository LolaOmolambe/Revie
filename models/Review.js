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
    ratings: { type: [Number], min: 1, max: 5 },
    ratingsAverage: {
      type: Number,
      default: 1.0,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
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
  this.find({ isDeleted: { $ne: true } });

  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (review) {
  const stats = await this.aggregate([
    {
      $match: { _id: review._id },
    },
    {
      $project: {
        averageRating: { $avg: "$ratings" },
      },
    },
  ]);
  
  if (stats[0].averageRating > 0) {
    await this.findByIdAndUpdate(review._id, {
      $inc: { ratingsQuantity: 1 },
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    await this.findByIdAndUpdate(review._id, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", function (doc, next) {
  this.constructor.calcAverageRatings(doc);

  next();
});

module.exports = mongoose.model("Review", reviewSchema);
