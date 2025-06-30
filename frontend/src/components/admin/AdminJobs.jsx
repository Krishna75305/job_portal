import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'

import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input , setInput]= useState("");
  const navigate=useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
     dispatch(setSearchJobByText(input));
  } , [input]);
  return (
    <div>
      <Navbar/>
      <div className=' max-w-6xl mx-auto my-10'>
        <div className='flex item-center justify-between my-5'>
          <Input
         className="w-fit"
         placeholder="Fitter by name or role"
         onChange={(e)=>setInput(e.target.value)}
        />
        <Button onClick={()=> navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
         <AdminJobsTable/>
      </div>
    </div>
  )
}

export default AdminJobs