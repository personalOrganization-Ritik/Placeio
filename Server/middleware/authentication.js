import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/response_message.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const authenticateUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse("No token provided", []));
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, userType } = decoded;

    req.user = { userId, userType };
    return;
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse(error.message, []));
  }
};

const employerAuthenticationMiddleware = async (req, res, next) => {

  const error = await authenticateUser(req, res);
 

  if (error) {
    return;
  }

  if (req.user.userType != "EMPLOYER") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse("Unauthorized access", []));
  }
  next();
};

const candidateAuthenticationMiddleware = async (req, res, next) => {
  const error = await authenticateUser(req, res);

  if (error) {
    return;
  }

  if (req.user.userType != "CANDIDATE") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse("Unauthorized access", []));
  }
  next();
};

const authenticationMiddleware = async (req, res, next) => {
  const error = await authenticateUser(req, res);

  if (error) {
    return;
  }

  next();
};

export { employerAuthenticationMiddleware, candidateAuthenticationMiddleware ,authenticationMiddleware};
