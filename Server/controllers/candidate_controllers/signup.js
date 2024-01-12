import { StatusCodes } from "http-status-codes";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";
import Candidate from "../../model/candidate.js";
import path from 'path';


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const signupCandidate = async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      mobile,
      dob,
      jobTitle,
      gender,
      experience,
      salary,
      qualificationString,
      description,
      languageString,
      introductionUrl,
      location,
      networkLinkString,
      categoriesString,
    } = req.body;
    

    const qualification = JSON.parse(qualificationString);
    const languages = JSON.parse(languageString);
    const networkLink = JSON.parse(networkLinkString);
    const categories = JSON.parse(categoriesString);
    const resumePath = req.files["resume"][0].path;
    const profileImage = req.files["profileImage"][0].path;

    const candidate = await Candidate.findOne({
      $or: [{ email }, { mobile }],
    });

    if (candidate) {
      return res
        .status(StatusCodes.OK)
        .json(errorResponse("User Already Exist", []));
    }

    const newCandidate = await Candidate.create({
      name,
      password,
      email,
      mobile,
      dob,
      salary,
      jobTitle,
      experience,
      gender,
      qualification,
      categories,
      description,
      languages,
      introductionUrl,
      location,
      networkLink,
      resumePath,
      profileImage
    });

    res.status(StatusCodes.OK).json(successResponse("Signup Success", []));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

export { signupCandidate };
