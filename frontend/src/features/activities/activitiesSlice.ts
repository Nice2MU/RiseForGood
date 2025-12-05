import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axiosClient";
import { Activity } from "../../types/Activity";

interface ActivitiesState {
  items: Activity[];
  loading: boolean;
  error: string | null;
  selectedActivity?: Activity;
  myActivities: Activity[];
  myLoading: boolean;
  myError: string | null;
  hostedActivities: Activity[];
  hostedLoading: boolean;
  hostedError: string | null;
  enrolling: boolean;
  enrollError: string | null;
}

const initialState: ActivitiesState = {
  items: [],
  loading: false,
  error: null,
  myActivities: [],
  myLoading: false,
  myError: null,
  hostedActivities: [],
  hostedLoading: false,
  hostedError: null,
  enrolling: false,
  enrollError: null
};

export const fetchActivities = createAsyncThunk("activities/fetchAll", async () => {
  const res = await api.get<Activity[]>("/activities");
  return res.data;
});

export const fetchActivityById = createAsyncThunk(
  "activities/fetchById",
  async (id: string) => {
    const res = await api.get<Activity>(`/activities/${id}`);
    return res.data;
  }
);

export const createActivity = createAsyncThunk(
  "activities/create",
  async (data: Partial<Activity>) => {
    const res = await api.post<Activity>("/activities", data);
    return res.data;
  }
);

export const updateActivity = createAsyncThunk(
  "activities/update",
  async ({ id, data }: { id: string; data: Partial<Activity> }) => {
    const res = await api.put<Activity>(`/activities/${id}`, data);
    return res.data;
  }
);

export const deleteActivity = createAsyncThunk("activities/delete", async (id: string) => {
  await api.delete(`/activities/${id}`);
  return id;
});

export const enrollInActivity = createAsyncThunk(
  "activities/enroll",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post<Activity>(`/activities/${id}/enroll`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "สมัครกิจกรรมไม่สำเร็จ");
    }
  }
);

export const cancelEnrollment = createAsyncThunk(
  "activities/cancelEnrollment",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.post(`/activities/${id}/cancel`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "ยกเลิกการสมัครไม่สำเร็จ");
    }
  }
);

export const fetchMyActivities = createAsyncThunk(
  "activities/fetchMyActivities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Activity[]>("/activities/my");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "โหลดกิจกรรมที่สมัครไม่สำเร็จ");
    }
  }
);

export const fetchHostedActivities = createAsyncThunk(
  "activities/fetchHostedActivities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Activity[]>("/activities/mine");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "โหลดกิจกรรมที่จัดไม่สำเร็จ");
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<Activity[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state) => {
        state.loading = false;
        state.error = "โหลดกิจกรรมไม่สำเร็จ";
      })
      .addCase(fetchActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedActivity = undefined;
      })
      .addCase(fetchActivityById.fulfilled, (state, action: PayloadAction<Activity>) => {
        state.loading = false;
        state.selectedActivity = action.payload;
      })
      .addCase(fetchActivityById.rejected, (state) => {
        state.loading = false;
        state.error = "โหลดรายละเอียดกิจกรรมไม่สำเร็จ";
      })
      .addCase(createActivity.fulfilled, (state, action: PayloadAction<Activity>) => {
        state.items.push(action.payload);
        state.hostedActivities.push(action.payload);
      })
      .addCase(updateActivity.fulfilled, (state, action: PayloadAction<Activity>) => {
        state.items = state.items.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
        state.hostedActivities = state.hostedActivities.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      .addCase(deleteActivity.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
        state.myActivities = state.myActivities.filter((a) => a._id !== action.payload);
        state.hostedActivities = state.hostedActivities.filter(
          (a) => a._id !== action.payload
        );
        if (state.selectedActivity && state.selectedActivity._id === action.payload) {
          state.selectedActivity = undefined;
        }
      })
      .addCase(enrollInActivity.pending, (state) => {
        state.enrolling = true;
        state.enrollError = null;
      })
      .addCase(enrollInActivity.fulfilled, (state, action: PayloadAction<Activity>) => {
        state.enrolling = false;
        const updated = action.payload;
        state.items = state.items.map((a) => (a._id === updated._id ? updated : a));
        if (!state.myActivities.find((a) => a._id === updated._id)) {
          state.myActivities.push(updated);
        }
        if (state.selectedActivity && state.selectedActivity._id === updated._id) {
          state.selectedActivity = updated;
        }
      })
      .addCase(enrollInActivity.rejected, (state, action) => {
        state.enrolling = false;
        state.enrollError = (action.payload as string) || "สมัครกิจกรรมไม่สำเร็จ";
      })
      .addCase(cancelEnrollment.fulfilled, (state, action: PayloadAction<string>) => {
        const activityId = action.payload;
        state.myActivities = state.myActivities.filter((a) => a._id !== activityId);
      })
      .addCase(cancelEnrollment.rejected, (state, action) => {
        state.enrollError = (action.payload as string) || "ยกเลิกการสมัครไม่สำเร็จ";
      })
      .addCase(fetchMyActivities.pending, (state) => {
        state.myLoading = true;
        state.myError = null;
      })
      .addCase(
        fetchMyActivities.fulfilled,
        (state, action: PayloadAction<Activity[]>) => {
          state.myLoading = false;
          state.myActivities = action.payload;
        }
      )
      .addCase(fetchMyActivities.rejected, (state, action) => {
        state.myLoading = false;
        state.myError =
          (action.payload as string) || "โหลดกิจกรรมที่สมัครไม่สำเร็จ";
      })
      .addCase(fetchHostedActivities.pending, (state) => {
        state.hostedLoading = true;
        state.hostedError = null;
      })
      .addCase(
        fetchHostedActivities.fulfilled,
        (state, action: PayloadAction<Activity[]>) => {
          state.hostedLoading = false;
          state.hostedActivities = action.payload;
        }
      )
      .addCase(fetchHostedActivities.rejected, (state, action) => {
        state.hostedLoading = false;
        state.hostedError =
          (action.payload as string) || "โหลดกิจกรรมที่จัดไม่สำเร็จ";
      });
  }
});

export default activitiesSlice.reducer;
