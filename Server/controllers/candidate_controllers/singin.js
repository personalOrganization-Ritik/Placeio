import mongoose from "mongoose";
import Candidate from "../../model/candidate.js";
import { StatusCodes } from "http-status-codes";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";

const signinCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse("Email and password required", []));
    }

    const candidate = await Candidate.findOne({ email }).populate('following').populate({
      path: 'appliedJobs.job',
    });

    if (!candidate) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse("Invalid email or password", []));
    }

    const isMatch = candidate.comparePassword(password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse("Invalid email or password", []));
    }
  //  candidate.populate(appliedJobs);
    const user = candidate.toObject();
    delete user.password;

    const token = await candidate.createJwt();

    res
      .status(StatusCodes.OK)
      .json(successResponse("Login Success", { token, user }));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

export { signinCandidate };
