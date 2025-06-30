import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';


// const randomJobs=[1,2,3,4,5,6,7,8];
export const LatestJobs = () => {
   useGetAllJobs();
   const {allJobs} = useSelector(store=>store.job);
  
  return (

    <div className='max-w-7xl mx-20 my-20'>
      <h1 className='text-4xl font-bold'> <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings</h1>
      <div className='grid grid-cols-3 gap-4 my-5'>
       {allJobs && allJobs.length > 0 ? (
          allJobs.slice(0, 6).map((job) => (
            <LatestJobCards  key={job._id} job={job} />
          ))
        ) : (
          <span>No Jobs Available</span>
        )}

      </div>
      
    </div>
  )
}
