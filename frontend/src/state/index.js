import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  isUserProfile: false,
  reRenderPage: false,
  statusProgress: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setIsUserProfile: (state, action) => {
      console.log("j", action.isUserProfile);
      state.isUserProfile = action.payload.isUserProfile;
    },
    setReRenderPage: (state) => {
      state.reRenderPage = state.reRenderPage ? false : true;
    },
    setStatus: (state) => {
      state.statusProgress = state.statusProgress ? false : true;
    },
  },
});
export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setIsUserProfile,
  setReRenderPage,
  setStatus,
} = authSlice.actions;
export default authSlice.reducer;
