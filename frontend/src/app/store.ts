import { configureStore } from "@reduxjs/toolkit";
import activitiesReducer from "../features/activities/activitiesSlice";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    auth: authReducer,
    chat: chatReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
