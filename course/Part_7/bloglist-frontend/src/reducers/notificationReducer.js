import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "", type: "" },
  reducers: {
    setNotification(state, action) {
      state.message = action.payload;
    },
    setNotificationWithType(state, action) {
      state.type = action.payload;
    },
    clearNotification(state) {
      state.message = "";
      state.type = ""; // Clear the type as well
    },
  }
});

export const { setNotification, setNotificationWithType, clearNotification } = notificationSlice.actions;

export const showNotification = (message, time, type) => {
  return async (dispatch) => {
    dispatch(setNotification(message));
    if (type) {
      dispatch(setNotificationWithType(type));
    }
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export default notificationSlice.reducer;