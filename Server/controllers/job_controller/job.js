import { StatusCodes } from "http-status-codes";
import Jobs from "../../model/job.js";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";
import * as dotenv from "dotenv";
import moment from "moment-timezone";
import Candidate from "../../model/candidate.js";

const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobType,
      companyName,
      techRequiredString,
      categoriesString,
      experience,
      salaryType,
      videoUrl,
      jobDescription,
      jobResponsibilitiesString,
      requirementsString,
      aboutCompany,
      location,
      networkLinkString,
      minSalary,
      maxSalary,
      qualificationString,
      applicationEnds,
    } = req.body;

    const techRequired = JSON.parse(techRequiredString);
    const categories = JSON.parse(categoriesString);
    const jobResponsibilities = JSON.parse(jobResponsibilitiesString);
    const requirements = JSON.parse(requirementsString);
    const networkLink = JSON.parse(networkLinkString);
    const qualification = JSON.parse(qualificationString);

    const logo = req.files["logo"][0].path || "";
    const photos = req.files["photos"].map((photo) => photo.path);
    const createdBy = req.user.userId;

    const job = await Jobs.create({
      jobTitle,
      jobType,
      companyName,
      logo,
      photos,
      techRequired,
      categories,
      experience,
      salaryType,
      videoUrl,
      jobDescription,
      jobResponsibilities,
      requirements,
      aboutCompany,
      location,
      networkLink,
      minSalary,
      maxSalary,
      qualification,
      applicationEnds,
      createdBy,
    });

    res
      .status(StatusCodes.CREATED)
      .json(successResponse("Job created successfully", job));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Jobs.findOne({ _id: id }).populate("candidateApplied");

    if (!job) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("No Job found", []));
    }

    res.status(StatusCodes.OK).json(successResponse("Success", job));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findOne({ _id: id });

    if (!job) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("No Job found", []));
    }

    await job.deleteOne({ _id: id });

    res.status(StatusCodes.OK).json(successResponse("Success", job));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const getAllJobsCreatedByEmployer = async (req, res) => {
  try {
    const {
      jobTitle,
      categories,
      location,
      jobType,
      salary,
      postedTime,
      qualification,
      experience,
    } = req.query;

    const queryObject = {};

    if (jobTitle) {
      queryObject.jobTitle = { $regex: jobTitle, $options: "i" };
    }

    if (categories) {
      queryObject.categories = { $in: [categories] };
    }

    if (location) {
      queryObject.location = location;
    }

    if (jobType) {
      queryObject.jobType = jobType;
    }

    if (salary) {
      queryObject.maxSalary = { $lte: Number(salary) };
    }

    if (postedTime) {
      const postedDate = new Date(postedTime);
      queryObject.createdAt = { $gte: postedDate };
    }

    if (qualification) {
      queryObject.qualification = qualification;
    }

    if (experience) {
      queryObject.experience = experience;
    }

    const currentTimeStamp = new Date();

    queryObject.applicationEnds = { $gte: currentTimeStamp };
    queryObject.createdBy = req.user.userId;

    let result = Jobs.find(queryObject);
    const totalCount = await Jobs.countDocuments(queryObject);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    result.skip(skip).limit(limit);

    const jobs = await result;

    if (totalCount == 0) {
      return res
        .status(StatusCodes.OK)
        .json(errorResponse("No data found", []));
    }
    const pageInfo = {
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    res
      .status(StatusCodes.OK)
      .json(successResponse("Success", { jobs, pageInfo }));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const getAllJobs = async (req, res) => {
  try {
    const {
      jobTitle,
      categories,
      location,
      jobType,
      salary,
      postedTime,
      qualification,
      experience,
    } = req.query;

    const queryObject = {};

    if (jobTitle) {
      queryObject.jobTitle = { $regex: jobTitle, $options: "i" };
    }

    if (categories) {
      queryObject.categories = { $in: [categories] };
    }

    if (location) {
      queryObject.location = location;
    }

    if (jobType) {
      queryObject.jobType = jobType;
    }

    if (salary) {
      queryObject.minSalary = { $gte: Number(salary) };
    }

    if (postedTime) {
      const postedDate = new Date(postedTime);
      queryObject.createdAt = { $gte: postedDate };
    }

    if (qualification) {
      queryObject.qualification = qualification;
    }

    if (experience) {
      queryObject.experience = experience;
    }

    const currentTimeStamp = new Date();

    queryObject.applicationEnds = { $gte: currentTimeStamp };

    let result = Jobs.find(queryObject);
    const totalCount = await Jobs.countDocuments(queryObject);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    result.skip(skip).limit(limit);

    const jobs = await result;

    if (totalCount == 0) {
      return res
        .status(StatusCodes.OK)
        .json(errorResponse("No data found", []));
    }
    const pageInfo = {
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    res
      .status(StatusCodes.OK)
      .json(successResponse("Success", { jobs, pageInfo }));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findOne({ _id: id });
    const candidate = await Candidate.findOne({ _id: req.user.userId });

    if (!job) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Invalid job id", []));
    }

    const candidateApplied = job.candidateApplied;

    const idx = candidateApplied.findIndex((obj) => obj.id == req.user.userId);

    if (idx != -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Already appplied", []));
    }

    job.candidateApplied.push({ id: req.user.userId });
    candidate.appliedJobs.push({ job: id });

    await candidate.save();
    await job.save();

    res
      .status(StatusCodes.OK)
      .json(successResponse("Successfully Applied", []));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

export {
  createJob,
  getJobById,
  deleteJob,
  getAllJobsCreatedByEmployer,
  getAllJobs,
  applyForJob
};
