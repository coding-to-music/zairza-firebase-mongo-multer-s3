const express = require("express");
const router = express.Router();
const checkIfAuthenticated = require("../firebase/firebaseCheckAuth");
const sendMail = require("../utils/sendMail.js");
const { uploadEventPoster } = require("../utils/multer.js");

router.use(checkIfAuthenticated, function (req, res, next) {
	if (req.user.role === "admin") {
		return next();
	}
	const error = new Error("Admin role required for accessing route");
	error.status = "fail";
	error.statusCode = 403;
	next(error);
});

router.get("/create-newsletter/", function (req, res, next) {
	res.render("pages/newsletterContent");
});

/* GET editor page. */
router.get("/newsletterDashboard", function (req, res, next) {
	Newsletter.find((err, newsletters) => {
		if (err) {
			return next(err);
		}
		res.render("pages/newsletterDashboard", { newsletters: newsletters });
	});
});

/* APIs */

// Send Newsletter API
router.post("/send-newsletter/", function (req, res, next) {
	User.find(
		{ newsletterSubscription: { $ne: true }, role: { $ne: "restricted" } },
		async function (err, users) {
			if (err) {
				return next(err);
			}
			if (users.length === 0) {
				return res.json({ status: "success" });
			}

			let mailErrors = [];

			for (let i = 0; i < users.length; i++) {
				if (users[i].name === undefined) {
					users[i].name = "";
				}
				const err = await sendMail({
					email: users[i].email,
					...req.body,
					templateId: process.env.TEMPLATE_ID,
					dynamic_template_data: {
						name: users[i].name.split(" ")[0],
						unsubscribeLink:
							req.protocol +
							"://" +
							req.get("host") +
							"/unsubscribe#" +
							users[i]._id,
					},
				});

				if (err) {
					console.log(err);
					mailErrors.push({
						email: users[i].email,
						userId: users[i]._id,
						message: err.response.body.errors[0].message,
					});
				}
			}
			if (mailErrors.length === 0) {
				return res.json({
					status: "success",
					sent: users.length,
					notSent: 0,
				});
			} else {
				return res.status(500).json({
					status: "fail",
					message: mailErrors[0].message,
					sent: users.length - mailErrors.length,
					notSent: mailErrors.length,
				});
			}
		}
	);
});

router.post(
	"/api/create-event",
	uploadEventPoster.single("image"),
	function (req, res, next) {
		let imageURL;
		if(process.env.NODE_ENV === "production"){
			imageURL = req.file.location;
		}else{
			imageURL = req.protocol + "://" + req.get('host') + "/" + req.file.path.substring(7);
		}

		console.log(req.file);
		Events.findOneAndUpdate(
			{
				name: req.body.name,
				startTime: req.body.startTime,
				endTime: req.body.endTime,
			},
			{
				imageURL: imageURL,
			},
			{
				upsert: true,
				new: true,
			},
			function (err, newevent) {
				if (err) {
					return next(err);
				}
				res.send({ status: "success", event: newevent });
			}
		);
	}
);

module.exports = router;
