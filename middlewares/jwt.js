const passport = require("passport");

const authMiddleware = (req, res, next) => {
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    (err, user) => {
      if (!user || err) {
        console.log("w if authorize");
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      console.log("req.user", req.user);
      next();
    }
  )(req, res, next);
};

module.exports = authMiddleware;
