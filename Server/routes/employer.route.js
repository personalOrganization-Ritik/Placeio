import express from "express";
import { signupEmployer,getData } from "../controllers/employer_controllers/signup.js";
import { signinEmployer } from "../controllers/employer_controllers/signin.js";
import { employerAuthenticationMiddleware } from "../middleware/authentication.js";
import { createJob } from "../controllers/job_controller/job.js";
import uploadFile from '../utils/file_upload.js'
import { updateStatusJob } from "../controllers/employer_controllers/employer.js";

const employerRouter = express.Router();

employerRouter.post("/signup",uploadFile.fields([{name:'profileImage',maxCount:1}]),signupEmployer);
employerRouter.get("/signin",signinEmployer);
employerRouter.get("/",employerAuthenticationMiddleware ,getData);
employerRouter.patch("/update-status",employerAuthenticationMiddleware ,updateStatusJob);


export default employerRouter; 
 