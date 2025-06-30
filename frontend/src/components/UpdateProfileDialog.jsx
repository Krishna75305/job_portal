
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'

const UpdateProfileDialog = ({open , setOpen}) => {
  const [loading , setLoading]=useState(false); 
  const {user}= useSelector(store=>store.auth);
       const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
    file: null
  });

  // ✅ Populate fields once user is available
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(', ') || '',
        file: user.profile?.resume || null
      });
    }
  }, [user]);
      const dispatch=useDispatch();

      const changeEventHandler=(e)=>{
        setInput({...input , [e.target.name]:e.target.value});
      }
      const fileChangeHandler=(e)=>{
        const file=e.target.files?.[0];
        setInput({...input , file})
      }
      const submitHandler=async(e)=>{
        e.preventDefault();
        setLoading(true);
         setOpen(true);
        const formData =new  FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if(input.file){
          formData.append("file",input.file)
        }
        try {
          const res=await axios.post(`${USER_API_END_POINT}/profile/update`,formData , {
            headers:{
              'Content-Type':'multipart/formData'
            },
            withCredentials:true
          });
         if(res.data.success){
  console.log("API response success:", res.data);  // <-- Add this
  dispatch(setUser(res.data.user));
  toast.success(res.data.message || "Profile updated successfully" );
}

        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message);
        }
 setOpen(false);
 setLoading(false);
        // console.log(input);
      };
      if(!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">Name</Label>
              <Input
                id="fullname"
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">Number</Label>
              <Input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Input
                id="bio"
                type="text"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">Skills</Label>
              <Input
                id="skills"
                type="text"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">Resume</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="col-span-3"
              />
            </div>

          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
