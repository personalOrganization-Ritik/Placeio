import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";

dotenv.config();

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field required"],
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: function (value) {
          return value.length >= 3;
        },
        message: "Length of name must be of atleast 3 length",
      },
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
    mobile: {
      type: Number,
      unique: true,
      required: [true, "Please provide mobille"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Mobile number must be a positive integer",
      },
    },
    experience: {
      type: String,
      required: [true, "Experience field requieed"],
    },
    jobTitle: {
      type: String,
    },
    salary: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, "Gender field required"],
    },
    languages: [{ type: String }],
    qualification: [{ type: String }],
    dob: {
      type: Date,
      required: [true, "Date of birth required"],
    },
    categories: [
      {
        type: String,
      },
    ],
    introductionUrl: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    location: {
      type: String,
    },
    networkLink: [
      {
        linkType: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    resumePath: {
      type: String,
      default: "",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    profileImage: {
      type: String,
      default: "",
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "employer",
      },
    ],
    appliedJobs: [
      {
        job: {
          type: Schema.Types.ObjectId,
          ref: "jobs",
        },
        status: {
          type: String,
          default: "APPLIED",
        },
        appliedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


candidateSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

candidateSchema.methods.comparePassword = async function (comparablePassword) {
  const isMatch = await bcrypt.compare(comparablePassword, this.password);

  return isMatch;
};

candidateSchema.methods.createJwt = async function () {
  return jwt.sign(
    { userId: this._id, userType: "CANDIDATE" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

const Candidate = mongoose.model("candidates", candidateSchema);

export default Candidate;
