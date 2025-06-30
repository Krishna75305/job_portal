import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchedQuery } from '@/redux/jobSlice';

const Browse = () => {
  useGetAllJobs();
  const dispatch = useDispatch();

  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  const filteredJobs = allJobs?.filter((job) =>
    job.title.toLowerCase().includes(searchedQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-lg my-5 mx-2'>
          Search Result ({filteredJobs ? filteredJobs.length : 0})
        </h1>

        <div className='grid grid-cols-3 gap-4 '>
          {
            filteredJobs && filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Job key={job._id} job={job} />
              ))
            ) : (
              <p className='col-span-3 text-center'>No jobs found.</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Browse;
