import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export interface VolunteerStats {
  userId: string;
  name: string;
  email: string;
  volunteerPoints: number;
  level: number;
  nextLevelPoints: number;
  completedActivities: number;
  following: number;
  follower: number;
}

interface UserState {
  profile: any | null;
  stats: VolunteerStats | null;
  following: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  stats: null,
  following: [],
  loading: false,
  error: null
};

export const fetchProfile = createAsyncThunk("user/fetchProfile", async () => {
  const response = await axiosClient.get("/api/users/profile");
  return response.data;
});

export const fetchVolunteerStats = createAsyncThunk(
  "user/fetchStats",
  async () => {
    const response = await axiosClient.get("/api/users/stats");
    return response.data;
  }
);

export const followUser = createAsyncThunk(
  "user/followUser",
  async (userId: string) => {
    const response = await axiosClient.post(`/api/users/${userId}/follow`);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.following = action.payload.following.map((f: any) => f._id);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
      })
      .addCase(fetchVolunteerStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVolunteerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchVolunteerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stats";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.following = action.payload.following.map((f: any) => f._id);
      });
  }
});

export default userSlice.reducer;
