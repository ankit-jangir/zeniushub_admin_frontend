import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL
export const generateReceipt = createAsyncThunk(
    'receipt/generate',
    async ({ emiId, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/receipt/generate/${emiId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
