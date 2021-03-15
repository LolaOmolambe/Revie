const mongoose = require("mongoose");
const validator = require("validator");

const apartmentSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Please provide apartment address"],
      minlength: [
        5,
        "An apartment address must have more or equal then 5 characters",
      ],
    },
    country: {
      type: String,
      required: [true, "Please provide apartment country"],
    },
    state: {
      type: String,
      required: [true, "Please provide apartment state"],
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },

      coordinates: [Number],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
//   { timestamps: true }
);

apartmentSchema.index({ location: "2dsphere" });

// Virtual populate
apartmentSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "apartment",
  localField: "_id",
});
module.exports = mongoose.model("Apartment", apartmentSchema);
