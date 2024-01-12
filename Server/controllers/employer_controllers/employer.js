import { StatusCodes } from "http-status-codes";
import Jobs from "../../model/job.js";
import Candidate from "../../model/candidate.js";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";

const updateStatusJob = async (req, res) => {
  try {
    const { status, jobId, candidateId } = req.body;

    if (status != "APPROVED" && status != "REJECTED") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Invalid status", []));
    }

    const lowerCaseStatus = status.toLowerCase();
    const job = await Jobs.findOne({ _id: jobId });
    const candidate = await Candidate.findOne({ _id: candidateId });

    if (!job || job.createdBy != req.user.userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Invalid job id", []));
    }

    if (!candidate) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Invalid candidate id", []));
    }

    const candidateApplied = job.candidateApplied;
    const appliedJobs = candidate.appliedJobs;

    const candidateIndex = candidateApplied.findIndex(
      (obj) => obj.id == candidateId
    );
    const appliedIndex = appliedJobs.findIndex((obj) => obj.job == jobId);

    if (candidateIndex == -1 || appliedIndex == -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(`You cannot ${lowerCaseStatus} applicants`, []));
    }

    candidateApplied[candidateIndex].status = status;
    appliedJobs[appliedIndex].status = status;

    await job.save();
    await candidate.save();

    res.status(StatusCodes.OK).json(successResponse("Success", []));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

export { updateStatusJob };
