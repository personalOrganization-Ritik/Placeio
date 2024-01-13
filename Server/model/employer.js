import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import * as dotenv from "dotenv";

dotenv.config();

const employerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Please Provide Email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      unique: true,
      required: [true, "Please provide mobile"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Mobile number must be a positive integer",
      },
    },
    jobPosted: [{ type: Schema.Types.ObjectId, ref: "jobs" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "candidates" }],
  },
  {
    timestamps: true,
  }
);

employerSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employerSchema.methods.comparePassword = async function (comparablePassword) {
  const isMatch = await bcrypt.compare(comparablePassword, this.password);
  return isMatch;
};

employerSchema.methods.createJwt = function () {
  return jwt.sign(
    { userId: this._id, userType: "EMPLOYER" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

const Employer = mongoose.model("employer", employerSchema);

export default Employer;
