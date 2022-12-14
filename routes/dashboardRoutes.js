const express = require("express");
const partials = require("express-partials");
const router = express.Router();
const checkIfAuthenticated = require("../firebase/firebaseCheckAuth");
const fetch = require("node-fetch");
const ValidRegNos = require("../models/ValidRegNos");

router.use(partials());

console.log(">>>>>>>>>>>>>> dashboardRoutes ENTERING");

/* GET dashboard page. */
router.get("/home", checkIfAuthenticated, function (req, res, next) {
  console.log(">>>>>>>>>>>>>> dashboardRoutes /home");
  ValidRegNos.countDocuments({}, function (err, count) {
    if (err) {
      return next(err);
    }
    fetch("https://api.github.com/users/coding-to-music/repos?sort=updated_at")
      .then((res) => res.json())
      .then((data) => {
        return res.render("pages/dashboard/index", {
          user: req.user,
          projectsCount: data.length,
          membersCount: count,
          layout: "pages/dashboard/base",
        });
      });
  });
});

/* GET projects page. */
router.get("/projects", checkIfAuthenticated, function (req, res, next) {
  console.log(">>>>>>>>>>>>>> dashboardRoutes /projects");
  fetch("https://api.github.com/users/coding-to-music/repos?sort=updated_at")
    .then((res) => res.json())
    .then((data) => {
      return res.render("pages/dashboard/projects", {
        projects: data,
        user: req.user,
        layout: "pages/dashboard/base",
      });
    });
});

/* GET poster uplaod page. */
router.get(
  "/eventPosterUpload",
  checkIfAuthenticated,
  function (req, res, next) {
    console.log(">>>>>>>>>>>>>> dashboardRoutes /eventPosterUpload");
    res.render("pages/dashboard/eventPosterUpload", {
      user: req.user,
      layout: "pages/base",
    });
  }
);

router.get(
  "/mentorsdashboard",
  checkIfAuthenticated,
  function (req, res, next) {
    console.log(">>>>>>>>>>>>>> dashboardRoutes /mentorsdashboard");
    fetch("https://api.github.com/users/coding-to-music/repos?sort=updated_at")
      .then((res) => res.json())
      .then((data) => {
        return res.render("pages/dashboard/mentorsdashboard", {
          projects: data,
          user: req.user,
          layout: "pages/dashboard/base",
        });
      });
  }
);

module.exports = router;
