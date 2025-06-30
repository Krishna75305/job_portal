import useGetAllJobs from "@/hooks/useGetAllJobs";
import CategoryCarousel from "./CategoryCarousel";

import { HeroSection } from "./HeroSection";
import { LatestJobs } from "./LatestJobs";
import Navbar from "./shared/Navbar";


import React, { useEffect } from 'react'
import Footer from "./shared/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home=()=> {
  useGetAllJobs();
  const {user}=useSelector(store=>store.auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user?.role=='recruiter'){
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs/>
      <Footer/>
    </div>
  )
}

export default Home