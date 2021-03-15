const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const reviewRoutes = require("./reviewRoutes");
const apartmentRoutes = require("./apartmentRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
router.use("/review", reviewRoutes);
router.use("/apartment", apartmentRoutes);
router.use("/user", userRoutes);



module.exports = router;