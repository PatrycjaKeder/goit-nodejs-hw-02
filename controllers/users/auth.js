const { fetchUser, setToken, updateUser } = require("./services");
const User = require("../../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

const gravatar = require("gravatar");
// const { uploadMiddleware, validateAndTransformAvatar } = require("../../middlewares/avatarUpload");

const signupUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await fetchUser({ email });

    // 409 if email exist in database
    if (user) {
      console.log("if works, email exist in base");
      return res.status(409).json({
        message: `Email: ${email} in use!`,
      });
    }

    const newUser = new User({ email });
    await newUser.setPassword(password);
    console.log(newUser);
    console.log(newUser.password);
    newUser.avatarURL = gravatar.url(email, { s: 250 });
    console.log(newUser);
    console.log("Before Save");
    await newUser.save();
    console.log("After Save");

    return res.status(201).json({
      message: "Created succesfully!",
      user: {
        email: newUser.email,
        avatarURL: newUser.avatarURL,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.log("error in signupUser");
    next(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await fetchUser({ email: email });
  console.log(user);

  if (!user) {
    return res.status(401).json({ message: "Email is wrong" });
  }

  const isPasswordCorrect = await user.validatePassword(password);

  if (isPasswordCorrect) {
    const payload = {
      id: user._id,
    };
    console.log(payload);
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "12h" });
    // Update user with token
    const updatedUser = await setToken(user._id, { token });
    console.log("updated user:", updatedUser);

    return res.json({
      token: updatedUser.token,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } else {
    return res.status(401).json({
      message: "Password is wrong",
    });
  }
};

const logoutUser = async (req, res) => {
  console.log(req.user); // req.user was definied in jwt.js - when token is set in user, details about user are in req.user, eq. ID
  console.log(req.user._id); // it is used because there is no body in request and no params in query params
  const user = await fetchUser({ _id: req.user._id });
  console.log(user);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const updateUser = await setToken(user._id, { token: null });
  console.log("after removing token", updateUser);

  return res.status(204).json({ message: "No content" });
};

const currentUser = async (req, res) => {
  const { email } = req.body;
  const user = await fetchUser({ email: email });
  console.log(user);

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  return res.status(200).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const updateSubscription = async (req, res, next) => {
  const id = req.body._id;
  console.log(req.params);
  const toUpdate = req.body;
  console.log(req.body);

  try {
    const user = await updateUser({ id, toUpdate });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not found in database" });
    }

    res.json({
      message: "Subscription updated succesfully!",
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateAvatars = async (req, res, next) => {
  const id = req.user._id;

  const { filename } = req.file;

  if (!filename) {
    return res.status(400).json({ message: "Miss avatar url parameter" });
  }

  const avatarURL = path.join("avatars", filename); // 'awatars' must be a key in Postman / "name" in input in HTML

  try {
    const user = await updateUser({ id, toUpdate: { avatarURL } });

    if (!user) {
      return res.status(400).json({ message: "User not found in database" });
    }

    res.json({
      message: "Avatar updated succesfully!",
      user: {
        avatarURL: user.avatarURL,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  updateAvatars,
};
