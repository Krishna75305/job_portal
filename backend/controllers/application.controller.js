import { populate } from "dotenv";
import {Application} from "../models/application.model.js";
import { Job } from "../models/job.model.js";
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    // console.log("userId:", userId);
    // console.log("jobId:", jobId);

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    // console.log("existingApplication:", existingApplication);

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    // console.log("job:", job);

    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job Applied Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAppliedJobs = async(req, res)=> {
  try {
    const userId=req.id;
    const application= await Application.find({applicant:userId}).sort({createdAt:-1}).populate({path:'job',
      options:{sort:{createdAt:-1}},populate:{
        path:'company',
      options:{
        sort:{createdAt:-1}
      }
    }
    });
    if(!application){
      return res.status(400).json({
        message:"Application not found",
        success:false
      })
    };
    return res.status(200).json({
      application,
      success:true
    })
    
  } catch (error) {
     console.log(error);    
  }
}

//admin dekhega kitne users ne apply kia hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: 'applications', // ✅ Correct plural field
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'applicant',
        select: 'fullname email phoneNumber profile.resume resumeOrignalName', // ✅ Optional but clean
        options: { sort: { createdAt: -1 } },
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      applications: job.applications, // ✅ use populated applications
      success: true,
    });
  } catch (error) {
    console.error("Error in getApplicants:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updateStatus = async(req, res)=> {
  try {
    const {status}= req.body;
    const applicationId=req.params.id;
    if(!applicationId){
      return res.status(400).json({
        message:"Application id is required",
        success:false
      })
    };
    //find application by applicant id
    const application = await Application.findOne({_id:applicationId});
    if(!application){
      return res.status(404).json({
        message:"Application not found",
        success:false
      })
    };

    // update application status
    application.status=status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message:"Application status updated successfully",
      success:true
    });
  }
  catch (error) {
     console.log(error);    
  }
  };