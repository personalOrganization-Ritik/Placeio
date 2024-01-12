import mongoose, { Schema } from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "JobTitle required"],
    },
    jobType: {
      type: String,
      required: [true, "Job type required"],
    },
    companyName: {
      type: String,
      required: [true, "Company name required"],
    },
    logo: {
      type: String,
      required: [true, "Company logo is required"],
    },
    photos: [
      {
        type: String,
      },
    ],
    techRequired: [{ type: String,required: [true, "TechRequired  field is required"] }],
    categories: [{ type: String,required: [true, "Categories  field is required"] }],
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    salaryType: {
      type: String,
      required: [true, "Salary Type is required"],
    },
    videoUrl: {
      type: String,
    },
    jobDescription: {
      type: String,
      required: [true, "Job Description required"],
    },
    jobResponsibilities: [{
      type: String,
      required: [true, "Job Responsibilities required"],
    }],
    requirements: [{
      type: String,
      required: [true, "Skills Required"],
    }],
    aboutCompany: {
      type: String,
      required: [true, "About Company field required"],
    },
    location: {
      type: String,
      required: [true, "Location field required"],
    },
    networkLink: [
      {
        linkType: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    minSalary: {
      type: String,
      required: [true, "Min salary field required"],
    },
    maxSalary: {
      type: String,
      required: [true, "Max salary field required"],
    },
    qualification: [{
      type: String,
      required: [true, "Qualification field required"],
    }],
    applicationEnds: {
      type: Date,
      required: [true, "Application end date required"],
    },
    candidateApplied:[{ 
        id: {
          type: Schema.Types.ObjectId,
          ref: "candidates",
        },
        status: {
          type: String,
          default: "APPLIED",
        },
        appliedDate: {
          type: Date,
          default: Date.now,
        },
    }],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'employer',
      required: [true, 'Please provide employer'],
    },
  },
  {
    timestamps:true,
  }
);


const Jobs = mongoose.model("jobs", jobSchema);

export default Jobs;
