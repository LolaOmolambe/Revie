const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { successResponse } = require("../utility/response");
const AppError = require("../utility/appError");

const signToken = (user) => {
  return jwt.sign(
    { email: user.email, userId: user._id },

    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);
    newUser["password"] = undefined;
    return successResponse(res, 201, "Sign up successful", { token, newUser });

    //Send Token or Email
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .select("+isActive");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    if (user.isActive == false) {
      return next(new AppError("Your Account has been deactivated", 401));
    }

    const token = signToken(user);
    user["password"] = undefined;
    return successResponse(res, 200, "Login successful", { token, user });
  } catch (err) {
    next(err);
  }
};

exports.protectRoutes = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Please log in to get access.", 401));
    }
    //Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    //Check if user still exists
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to perform this action", 403)
      );
    }

    next();
  };
};

exports.updatePassword = async (req, res, next) => {
  try {
    let { currentPassword, password, passwordConfirm } = req.body;

    if (!currentPassword || !password || !passwordConfirm) {
      return next(new AppError("Invalid payload.", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    //Shoild i log the user out
    let token = signToken(user);
    user.password = undefined;
    return successResponse(res, 200, "Sucessfull", { token, user });
  } catch (err) {
    next(err);
  }
};
