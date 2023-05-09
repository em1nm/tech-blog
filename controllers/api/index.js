const router = require("express").Router();
const userRoutes = require("./userRoutes");
const blogRoutes = require("./blogRoutes");
const commentRoutes = require("./commentRoutes.js");

router.use("/users", userRoutes);
router.use("/posts", blogRoutes);
router.use("/comment", commentRoutes);

module.exports = router;