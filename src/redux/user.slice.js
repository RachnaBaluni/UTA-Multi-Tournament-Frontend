import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
  },
  reducers: {
    //actions
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser: setUser } = userSlice.actions;

export default userSlice.reducer;
