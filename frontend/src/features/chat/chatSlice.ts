import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axiosClient";
import { ChatMessage } from "../../types/Chat";

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (activityId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ChatMessage[]>(`/activities/${activityId}/chat`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "โหลดข้อความไม่สำเร็จ");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { activityId, text }: { activityId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ChatMessage>(`/activities/${activityId}/chat`, { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "ส่งข้อความไม่สำเร็จ");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChat(state) {
      state.messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "โหลดข้อความไม่สำเร็จ";
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = (action.payload as string) || "ส่งข้อความไม่สำเร็จ";
      });
  }
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
