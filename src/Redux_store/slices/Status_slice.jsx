// redux/statusSlice.js
import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: "status",
    initialState: {
        show: false,
        type: "success", // or "error"
        message: "",
    },
    reducers: {
        showStatus: (state, action) => {
            state.show = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        hideStatus: (state) => {
            state.show = false;
            state.message = "";
        },
    },
});

export const { showStatus, hideStatus } = statusSlice.actions;
export default statusSlice.reducer;
