import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",     // ✅ FIXED (backend expects experience)
    position: 0,
    companyId: "",      // ✅ FIXED (backend expects companyId)
  });

  const { companies } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: name === "position" ? Number(value) : value,
    });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });  // ✅ FIXED
    }
  };

  const submitHandler = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const payload = {
      ...input,
      requirements: input.requirements
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r !== ""),
      experience: Number(input.experience),
      salary: Number(input.salary),
      created_by: user._id,
    };

    console.log("📦 PAYLOAD SENT:", payload);   // <-- ADD THIS

    const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });


      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Job post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded"
        >
          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col">
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>Requirements (comma separated)</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>Experience</Label>
              <Input
                type="number"
                name="experience"   // FIXED
                value={input.experience}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label>No. of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="my-1"
                required
              />
            </div>

            {companies.length > 0 && (
              <div className="flex flex-col col-span-2">
                <Label>Select Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

          </div>

          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}
        </form>
      </div>
    </div>
    
  );
};

export default PostJob;
