const express = require("express");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const router = express.Router();
const middleware = require("../utility/validationMiddleware");
const schemas = require("../utility/validationSchema");

router.use(authController.protectRoutes);

router
  .route("/me")
  .get(userController.getCurrentUser)
  .put(userController.updateUser)
  .delete(userController.deleteCurrentUser);

router.use(authController.restrictTo("admin"));

router.get("/", userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);
module.exports = router;

module.exports = router;
