import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { LogOutIcon, User2 } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../ui/popover"; // fixed alias
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { setUser } from "../../redux/authSlice"; // fixed alias

const USER_API_END_POINT = "https://job-portal-57fw.onrender.com/api/v1/user"; // moved directly here for clarity

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message || "Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <h1 className="text-2xl font-bold">
          Job<span className="text-[#F83002]">Portal</span>
        </h1>

        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" aria-label="User menu">
                  <Avatar className="w-10 h-10 cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "/default-avatar.png"}
                      alt="Profile"
                    />
                  </Avatar>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "/default-avatar.png"}
                      alt="Profile"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col my-2 text-gray-600">
                  {user.role === "student" && (
                    <div className="flex items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link" className="p-0 h-auto">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 cursor-pointer">
                    <LogOutIcon />
                    <Button
                      onClick={logoutHandler}
                      className="p-0 h-auto text-red-600"
                      variant="link"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
