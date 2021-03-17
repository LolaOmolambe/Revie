const Apartment = require("../models/Apartment");
const { successResponse } = require("../utility/response");
const QueryHelper = require("../utility/queryHelper");

exports.getAllApartments = async (req, res, next) => {
  try {
    let apartmentsQuery = new QueryHelper(Apartment.find(), req.query)
      .sort()
      .paginate();
    let apartments = await apartmentsQuery.query;

    return successResponse(res, 200, "Apartments fetched successfully", {
      apartments,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnApartment = async (req, res, next) => {
  try {
    let apartments = await Apartment.findById(req.params.apartmentId).populate(
      "reviews"
    );

    return successResponse(res, 200, "Apartments fetched successfully", {
      apartments,
    });
  } catch (err) {
    next(err);
  }
};
