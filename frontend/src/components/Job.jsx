import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({job}) => {
  const navigate = useNavigate();
  // const jobId="wwfwfwe";
  const daysAgoFunction=(mongodbTime)=>{
    const createdAt = new Date(mongodbTime);
    const currentTime=new Date();
    const timeDifference = currentTime-createdAt;
    return Math.floor(timeDifference/(1000*24*60*60)); 
  }
  return (
    <div className="p-4 border rounded-lg shadow-xl bg-white">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-500">{daysAgoFunction(job?.createdAt)==0? "Today":`${daysAgoFunction(job?.createdAt)} days ago`}</p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button variant="outline" size="icon" className="w-12 h-12 p-0">
          <Avatar className="w-10 h-10">
            <AvatarImage
              className="w-full h-full object-cover"
              src={job?.company?.logo}
              alt="Company Logo"
            />
          </Avatar>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{job?.company?.name}</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>
       <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
       </div>
       <div className='flex item-center gap-2 mt-4'>
               <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
               <Badge className={'text-red-700 font-bold'} variant="ghost">{job?.jobType}</Badge>
               <Badge className={'text-purple-700 font-bold'} variant="ghost">{job?.salary}</Badge>
              </div>
              <div className="flex item-center gap-4 mt-4">
                <Button onClick={()=>navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button className="bg-purple-700">Save For Later</Button>
              </div>
    </div>
  );
};

export default Job;
