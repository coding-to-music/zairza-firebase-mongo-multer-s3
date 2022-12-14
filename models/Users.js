const mongoose = require("mongoose");
const ValidRegNos = require("./ValidRegNos");

const timestamp = require("time-stamp");

function myLogger(str) {
  const filename = "Users.js";
  const timestamp = require("time-stamp");

  console.log(
    ">>>>>>>>>>>>>> " +
      timestamp("YYYY/MM/DD HH:mm:ss:ms " + filename + " >>> " + str)
  );
}

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
    },
    profileImage: String,
    phoneNo: String,
    skills: [String],
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    registrationNo: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    wing: [
      {
        type: String,
        enum: ["Software", "Robotics", "Design"],
      },
    ],
    branch: {
      type: String,
      enum: [
        "Computer Science & Engineering",
        "Information Technology",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Electronics & Intrumentation Engineering",
        "Biotechnology",
        "Civil Engineering",
        "Textile Engineering",
        "Fashion & Apparel Technology",
        "Architecture",
        "Computer Science & Application",
        "Planning",
        "Mathematics & Humanities",
        "Physics",
        "Chemistry",
      ],
    },
    newsletterSubscription: Boolean,
    role: {
      type: String,
      enum: ["admin", "user", "restricted"],
      required: true,
      default: "restricted",
    },
  },
  {
    strict: true,
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// checking if registration no is valid
UserSchema.methods.checkValidRegistrationNo = async function (registrationNo) {
  myLogger("UserSchema.methods.checkValidRegistrationNo");

  return await ValidRegNos.exists({ registrationNo });
};

module.exports = User = mongoose.model("users", UserSchema);
