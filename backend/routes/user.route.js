import express from "express";
import { login , register , logout,updateProfile} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
// import { postJob, getAllJobs, getJobById, getAdminJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);

router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/logout").get(logout);
export default router;