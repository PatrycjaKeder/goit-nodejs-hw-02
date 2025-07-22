const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  updateAvatars,
} = require("../../controllers/users/auth");

const validateUser = require("../../middlewares/validateUser");
const authMiddleware = require("../../middlewares/jwt");
const {
  uploadMiddleware,
  validateAndTransformAvatar,
} = require("../../middlewares/avatarUpload");

router.post("/signup", validateUser, signupUser);
router.post("/login", loginUser);
router.get("/logout", authMiddleware, logoutUser);
router.get("/current", authMiddleware, currentUser);
router.patch("/", authMiddleware, updateSubscription);
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  validateAndTransformAvatar,
  updateAvatars
);

module.exports = router;
