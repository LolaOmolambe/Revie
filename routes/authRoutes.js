const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const middleware = require("../utility/validationMiddleware");
const schemas = require("../utility/validationSchema");

router.post("/signup", middleware(schemas.signUpModel), authController.signUp);
router.post("/login", middleware(schemas.loginModel), authController.login);

router.use(authController.protectRoutes);

router.post("/changepassword", authController.updatePassword);

module.exports = router;
