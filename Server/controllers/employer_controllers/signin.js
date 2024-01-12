import mongoose from "mongoose";
import Employer from "../../model/employer.js";
import { StatusCodes } from "http-status-codes";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";

const signinEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse("Email and password required", []));
    }

    const employer = await Employer.findOne({ email });

    if (!employer) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse("Invalid email or password", []));
    }

    const isMatch = employer.comparePassword(password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse("Invalid email or password", []));
    }

    const token = await employer.createJwt();

    res
      .status(StatusCodes.OK)
      .json(successResponse("Login Success", { token, employer }));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  } 
};

export { signinEmployer };
