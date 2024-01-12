import express from "express";
import { signupCandidate } from "../controllers/candidate_controllers/signup.js";
import { signinCandidate } from "../controllers/candidate_controllers/singin.js";
import uploadFile from '../utils/file_upload.js'
import { followEmployer, unFollowEmployer } from "../controllers/candidate_controllers/candidate.js";
import { candidateAuthenticationMiddleware } from "../middleware/authentication.js";

const candidateRouter = express.Router();

candidateRouter.post(
  "/signup",
  uploadFile.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  signupCandidate
);
candidateRouter.get("/signin", signinCandidate);
candidateRouter.patch("/follow/:id",candidateAuthenticationMiddleware ,followEmployer);
candidateRouter.patch("/unfollow/:id",candidateAuthenticationMiddleware, unFollowEmployer);

export default candidateRouter;
