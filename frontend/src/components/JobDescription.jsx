import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";

import { setSingleJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { id: jobId } = useParams();

  const [isApplied, setIsApplied] = useState(false);

  const postedDate = singleJob?.company?.createdAt
    ? singleJob.company.createdAt.split("T")[0]
    : "N/A";

  // Fetch job on mount
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const hasApplied =
            Array.isArray(res.data.job.applications) &&
            res.data.job.applications.some(
              (app) => app.applicant === user?._id
            );

          setIsApplied(hasApplied);
        }
      } catch (error) {
        console.error("Fetch job failed:", error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
  try {
    const res = await axios.post(
      `${APPLICATION_API_END_POINT}/apply/${jobId}`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      setIsApplied(true);
    }

    // Try fetching updated job — but don't fail the entire flow if this fails
    try {
      const updatedRes = await axios.get(
        `${JOB_API_END_POINT}/get/${jobId}`,
        { withCredentials: true }
      );
      if (updatedRes.data.success) {
        dispatch(setSingleJob(updatedRes.data.job));
      }
    } catch (refetchErr) {
      console.warn("Could not refetch updated job", refetchErr);
    }

  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";

    if (message === "You have already applied for this job") {
      toast.info(message);
      setIsApplied(true);

      // Still try to refresh
      try {
        const updatedRes = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );
        if (updatedRes.data.success) {
          dispatch(setSingleJob(updatedRes.data.job));
        }
      } catch (refetchErr) {
        console.warn("Could not refetch after duplicate apply", refetchErr);
      }
    } else {
      toast.error(message);
    }

    console.log("Apply job error:", error.response?.data || error.message);
  }
};


  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob?.position} Positions
            </Badge>
            <Badge className="text-red-700 font-bold" variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-purple-700 font-bold" variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>

      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experience}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:
          <span className="pl-4 font-normal text-gray-800">
            {Array.isArray(singleJob?.applications)
              ? singleJob.applications.length
              : 0}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">{postedDate}</span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
