import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    password: "",
    token: ""
  },
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    logoutUserReducer(state, action) {
      return { username: "", password: "" };
    },
    getUsers(state, action) {
      return state;
    }
  },
});

export const { setUser, logoutUserReducer } = userSlice.actions;

export const initializeUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    blogService.setToken(user.token);
    dispatch(setUser(user));
    return user;
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    dispatch(logoutUserReducer());
  };
};

// export const fetchUsers = () => {
//   return async (dispatch) => {
//     const users = await blogService.getAllUsers();
//     dispatch(getUsers(users));
//   };
// };

export default userSlice.reducer;