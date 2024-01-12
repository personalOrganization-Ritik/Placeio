import express from "express";
import { authenticationMiddleware ,candidateAuthenticationMiddleware,employerAuthenticationMiddleware} from "../middleware/authentication.js";
import uploadFile from '../utils/file_upload.js'
import { applyForJob, createJob, deleteJob, getAllJobs, getAllJobsCreatedByEmployer, getJobById } from "../controllers/job_controller/job.js";

const jobRouter = express.Router();

jobRouter.route("/").post(employerAuthenticationMiddleware,uploadFile.fields([
    { name: "logo", maxCount: 1 },
    { name: "photos", maxCount: 5 },
  ]),createJob);
jobRouter.route('/get-all-jobs-employer').get(employerAuthenticationMiddleware,getAllJobsCreatedByEmployer )
jobRouter.route('/get-all-jobs').get(candidateAuthenticationMiddleware,getAllJobs )
jobRouter.route('/apply/:id').patch(candidateAuthenticationMiddleware,applyForJob)
jobRouter.route('/:id').get(authenticationMiddleware,getJobById).delete(employerAuthenticationMiddleware,deleteJob)

export default jobRouter; 