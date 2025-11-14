import {Job} from "../models/job.model.js";

// admin post krega job

export const postJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      requirements, 
      salary, 
      location, 
      jobType, 
      experience, 
      position, 
      companyId 
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements,                     // FIX 1 ✔
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: String(experience),  // FIX 2 ✔
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(200).json({
      message: "New Job created successfully",
      success: true,
      job,                                // send job back
    });

  } catch (error) {
    console.log("❌ postJob error:", error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// student ke lie
export const getAllJobs = async (req, res) =>{
  try {
    const keyword= req.query.keyword || "" ;
      
    const query = {
      $or : [
        { title : { $regex : keyword, $options : "i" } },
        { description : { $regex : keyword, $options : "i" } }
      ]
    };
    const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

// console.log("Found Jobs:", jobs); // <-- Add this line

if (!jobs || jobs.length === 0) {
  return res.status(400).json({
    message: "Jobs not found",
    success: false,
  });
}

      return res.status(200).json({ jobs,
      success: true
      });
  } catch (error) {
    console.log(error);
  }
}
//student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
          select: "_id name email", // optional fields you want
        },
      })
      .populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("getJobById error:", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
// admin kitne job create kia abhi tak
export const getAdminJobs = async (req, res) =>{
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by : adminId}).populate({
      path:'company',
      createdAt:-1
    });
    if(!jobs){
      return res.status(400).json({ message: ' Jobs not found',
      success: false
       })
     }
      return res.status(200).json({ jobs,
      success: true
      });
  } catch (error) {
    console.log(error);
  }
} 
