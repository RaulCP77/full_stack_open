import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const fetchUsers = () => {
  return async (dispatch) => {
    const users = await blogService.getAllUsers();
    dispatch(setUsers(users));
  };
};

export default usersSlice.reducer;