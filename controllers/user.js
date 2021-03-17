const User = require("../models/User");
const { successResponse } = require("../utility/response");
const queryHelpers = require("../utility/queryHelper");
const AppError = require("../utility/appError");

exports.getAllUsers = async (req, res, next) => {
  try {
    let userQuery = new queryHelpers(User.find(), req.query)
      .filter()
      .paginate();
    let users = await userQuery.query;
    return successResponse(res, 200, "Users fetched successfully", users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User does not exist", 401));
    }
    return successResponse(res, 200, "User fetched sucessfully", { user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    //Only allow some fields get updated
    let allowedBody = {
      name: req.body.name,
    };

    let user = await User.findByIdAndUpdate(req.user._id, allowedBody, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, "Update successfull", { user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });

    return successResponse(res, 200, "User deleted", null);
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    return successResponse(res, 200, "User fetched sucessfully", { user });
  } catch (err) {
    next(err);
  }
};

exports.deleteCurrentUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeleted: true });

    return successResponse(res, 200, "User deleted", null);
  } catch (err) {
    next(err);
  }
};
