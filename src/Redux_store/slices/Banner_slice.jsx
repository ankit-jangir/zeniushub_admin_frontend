// src/redux/slices/bannerSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { get_banner_api, delete_banner, add_banner } from '../Api/Baner'

const banner_Slice = createSlice({
    name: 'banner',
    initialState: {
        banners: [],
        loading: false,
        error: null,
        searchData: [],
    },
    reducer: {},
    extraReducers: (builder) => {
        builder
            // Get banners
            .addCase(get_banner_api.pending, (state) => {
                state.loading = true
            })
            .addCase(get_banner_api.fulfilled, (state, action) => {
                state.loading = false
                state.banners = action.payload
            })
            .addCase(get_banner_api.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Delete banner
            .addCase(delete_banner.pending, (state) => {
                state.loading = true;
              })
              .addCase(delete_banner.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.banners)) {
                  state.banners = state.banners.filter((b) => b.id !== action.payload);
                } else {
                  state.banners = []; // fallback: if banners somehow became invalid
                }
              })
              .addCase(delete_banner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              
            // add banner 
            .addCase(add_banner.pending, (state) => {
                state.loading = true;
              })
              .addCase(add_banner.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.banners)) {
                  state.banners = [...state.banners, action.payload];
                } else {
                  state.banners = [action.payload];
                }
              })
              .addCase(add_banner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              
    },
})

export default banner_Slice.reducer
