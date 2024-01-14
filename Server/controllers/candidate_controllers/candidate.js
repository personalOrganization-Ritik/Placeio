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

const getAllCandidate=async(req,res)=>{
  try{
    const {categories,location,experience,languages,minAge,maxAge,qualification}=req.query;

    const queryObject={}

    if(categories){
      queryObject.categories={$in:[categories]}
    }

    if (location) {
      queryObject.location = location;
    }

    if (experience) {
      queryObject.experience = experience;
    }
    if(languages){
      queryObject.languages={$in:[languages]}
    }

    if(minAge && maxAge){
      queryObject.age={$gte:minAge,$lte:maxAge}
    }

    if (qualification) {
      queryObject.qualification = qualification;
    }

    console.log(queryObject);
    
    let result = Candidate.find(queryObject);
    const totalCount = await Candidate.countDocuments(queryObject);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    result.skip(skip).limit(limit);

    const candidates = await result;

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
      .json(successResponse("Success", { candidates, pageInfo }));

  }catch(error){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.message,[]));
  }
}

export { followEmployer, unFollowEmployer,getAllCandidate };
