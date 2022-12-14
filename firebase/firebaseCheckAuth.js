/* Check for authenticated user */

const timestamp = require("time-stamp");

// console.log(timestamp.utc("YYYY/MM/DD HH:mm:ss"));
// console.log(timestamp("YYYY/MM/DD HH:mm:ss"));
// console.log(timestamp("YYYY/MM/DD HH:mm:ss:ms"));

// function myFunction(str) {
//   console.log(str);
// }

// myFunction("Hello World!");

function myLogger(str) {
  const filename = "firebaseCheckAuth";
  const timestamp = require("time-stamp");

  console.log(">>>>>>>>>>>>>> " + timestamp("YYYY/MM/DD HH:mm:ss:ms " + filename + " >>> " + str));
}

myLogger("Hello World from myLogger!");

const admin = require("./firebaseService");

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies != null && req.cookies["zToken"] != null) {
    req.authToken = req.cookies["zToken"];
  } else {
    req.authToken = null;
  }
  next();
};

module.exports = checkIfAuthenticated = (req, res, next) => {
  myLogger("checkIfAuthenticated");

  getAuthToken(req, res, async () => {
    myLogger("getAuthToken");
    try {
      const { authToken } = req;
      myLogger("getAuthToken - await auth BEGIN");

      const userInfo = await admin.auth().verifyIdToken(authToken);
      myLogger("getAuthToken - await auth END");
      req.userInfo = userInfo;
      req.authId = userInfo.uid;

      myLogger("getAuthToken - userInfo.uid " + userInfo.uid);

      User.findOne({ firebaseUid: userInfo.uid }, function (err, existingUser) {
        if (err) {
          return next(err);
        }
        if (!existingUser) {
          User.findOne({ email: userInfo.email }, function (err, user) {
            if (err) {
              return next(err);
            }
            let userDetails = { firebaseUid: userInfo.uid };

            if (userInfo.email && !user) userDetails["email"] = userInfo.email;
            if (userInfo.name) userDetails["name"] = userInfo.name;
            if (userInfo.picture)
              userDetails["profileImage"] = userInfo.picture;

            User.create(userDetails, function (err, newUser) {
              if (err) {
                return next(err);
              }
              req.user = newUser;
              return next();
            });
          });
        } else {
          req.user = existingUser;

          //SKills++
          Domains.find({ mentors: req.user._id }, function (err, domains) {
            if (err) {
              return next(err);
            }
            if (domains.length === 0) {
              req.user.isMentor = false;
            } else {
              req.user.isMentor = true;
            }
          });

          return next();
        }
      });
    } catch (e) {
      next(e);
    }
  });
};
