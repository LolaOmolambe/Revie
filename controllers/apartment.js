const Apartment = require("../models/Apartment");
const { successResponse } = require("../utility/response");

exports.getAllApartments = async (req, res, next) => {
  try {
    let apartments = await Apartment.find({});

    return successResponse(res, 200, "Apartments fetched successfully", {
      apartments,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnApartment = async (req, res, next) => {
  try {
    let apartments = await Apartment.findById(req.params.apartmentId).populate("reviews");

    return successResponse(res, 200, "Apartments fetched successfully", {
      apartments,
    });
  } catch (err) {
    next(err);
  }
};
