// receiptSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { generateReceipt } from '../Api/recipt_download';


const initialState = {
    blob: null,
    loading: false,
    error: null,
};

const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.blob = action.payload;
            })
            .addCase(generateReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default receiptSlice.reducer;
