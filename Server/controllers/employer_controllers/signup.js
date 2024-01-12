import mongoose from "mongoose";
import Employer from "../../model/employer.js";
import { StatusCodes } from "http-status-codes";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";

const signupEmployer = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const employer = await Employer.findOne({
      $or: [{ email }, { mobile }],
    });

    if (employer) {
      return res
        .status(StatusCodes.OK)
        .json(errorResponse("User Already Exist", []));
    }

    const profileImage = req.files["profileImage"][0].path

    await Employer.create({
      name,
      email,
      password,
      mobile,
      profileImage,
    });

    res.status(StatusCodes.OK).json(successResponse("Signup Success", []));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const getData = async (req, res) => {
  res.status(StatusCodes.OK).json(successResponse("Access Success", []));
};

export { signupEmployer, getData };
