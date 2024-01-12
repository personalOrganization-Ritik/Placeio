import { StatusCodes } from "http-status-codes";
import {
  errorResponse,
  successResponse,
} from "../../utils/response_message.js";
import Employer from "../../model/employer.js";
import Candidate from "../../model/candidate.js";

const followEmployer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Please provide id", []));
    }

    const employer = await Employer.findOne({ _id: id });
    const candidate = await Candidate.findOne({ _id: req.user.userId });

    if (!employer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("No employer found", []));
    }

    employer.followers.push(req.user.userId);
    candidate.following.push(id);
    await employer.save();
    await candidate.save();

    res
      .status(StatusCodes.OK)
      .json(successResponse("Successfully followed", []));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

const unFollowEmployer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("Please provide id", []));
    }

    const employer = await Employer.findOne({ _id: id });
    const candidate = await Candidate.findOne({ _id: req.user.userId });

    if (!employer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse("No employer found", []));
    }

    const followerList = employer.followers;

    const newFollowerList = followerList.filter(
      (followeeId) => followeeId != req.user.userId
    );

    employer.followers = newFollowerList;

    await employer.save();

    const followingList = candidate.following;

    const newFollowingList = followingList.filter(
      (followingId) => followingId != id
    );

    candidate.following = newFollowingList;

    await candidate.save();

    res
      .status(StatusCodes.OK)
      .json(successResponse("Successfully unfollowed", []));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message, []));
  }
};

export { followEmployer, unFollowEmployer };
