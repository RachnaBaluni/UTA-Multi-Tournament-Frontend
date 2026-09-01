import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: savedUser ? JSON.parse(savedUser) : {},
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;

      // Save user data to localStorage after login
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
