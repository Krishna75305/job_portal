import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: {
      applications: [], // ✅ structure matches backend data
    },
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
  },
});

export const { setAllApplicants } = applicationSlice.actions;

// Optional async thunk (if needed later)
export const fetchApplicants = () => async (dispatch) => {
  try {
    const { data } = await axios.get("http://localhost:8000/api/application/get");
    dispatch(setAllApplicants({ applications: data.applications }));
  } catch (err) {
    console.error("Failed to fetch applicants:", err.message);
  }
};

export default applicationSlice.reducer;
