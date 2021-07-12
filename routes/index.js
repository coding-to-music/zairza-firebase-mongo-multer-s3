const express = require("express");
const router = express.Router();
const admin = require("../firebase/firebaseService");
const checkIfAuthenticated = require("../firebase/firebaseCheckAuth");
const Events = require("../models/Events");

/* GET home page. */
router.get("/", function (req, res, next) {
  const today = new Date();
  Events.findOne(
    { startTime: { $lte: today }, endTime: { $gte: today } },
    {},
    { sort: { created_at: -1 } },
    function (err, event) {
      if (err) {
        return next(err);
      }
      res.render("pages/index", { event: event });
    }
  );
});

/* GET auth page. */
router.get("/auth", function (req, res, next) {
  if (req.cookies["zToken"] != null) {
    admin
      .auth()
      .verifyIdToken(req.cookies["zToken"])
      .then((decodedToken) => {
        res.redirect("/home");
      })
      .catch((err) => {
        res.render("pages/auth");
      });
  } else {
    res.render("pages/auth");
  }
});

/* GET events page. */
router.get("/events", checkIfAuthenticated, function (req, res, next) {
  res.render("pages/dashboard/events");
});

/* GET forgot password page. */
router.get("/forgot", function (req, res, next) {
  res.render("pages/forgot_password");
});

/* GET profile page. */
router.get("/profile", checkIfAuthenticated, function (req, res, next) {
  if (!req.user) {
    return res.redirect("/");
  }
  let google = false,
    github = false;

  if ("google.com" in req.userInfo.firebase.identities) {
    google = true;
  }
  if ("github.com" in req.userInfo.firebase.identities) {
    github = true;
  }
  res.render("pages/profile", { user: req.user, google, github });
});

/* GET newPassword page. */
router.get("/forgot_password", function (req, res, next) {
  res.render("pages/newPassword");
});

router.get("/tmp", function (req, res, next) {
  res.render("pages/dashboard/template");
});
/* GET unsubscribe page. */
router.get("/unsubscribe", function (req, res, next) {
  res.render("pages/unsubscribe");
});

module.exports = router;
