import { createSlice } from "@reduxjs/toolkit";
import seession_year from "../Api/Header_session";

const head_yaer_slice = createSlice({
    name: 'year',
    initialState: {
        years: [],
        loading: false,
        error: null,
        searchdata: []
    },
    extraReducers: ((builder) => {
        builder
            .addCase(seession_year.pending, (state) => {
                state.loading = true
            })
            .addCase(seession_year.fulfilled, (state, action) => {
                state.loading = false,
                    state.years = action.payload
            })
            .addCase(seession_year.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
    })

})
export default head_yaer_slice.reducer