import { createSlice } from '@reduxjs/toolkit';
import { logoutAdmin } from '../Api/Logout_admin';


const adminSlice = createSlice({
    name: 'logout',
    initialState: {
        token: localStorage.getItem("token"),
        status: 'idle',
        error: null,
    },
    reducers: {
        setToken: (state, action) => {
          state.token = action.payload;
        },
        clearToken: (state) => {
          state.token = null;
        },
      },
    extraReducers: (builder) => {
        builder
            .addCase(logoutAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.status = 'succeeded';
                state.token = null;
                localStorage.removeItem("token");  
                // navigate("/");
            })
            
            .addCase(logoutAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setToken, clearToken } = adminSlice.actions;
export default adminSlice.reducer;
