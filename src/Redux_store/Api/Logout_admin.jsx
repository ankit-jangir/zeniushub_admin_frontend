import { createAsyncThunk } from "@reduxjs/toolkit";


const BASE_URL = import.meta.env.VITE_BASE_URL

export const logoutAdmin = createAsyncThunk(
    "admin/logout",
    async (token, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/admin/logout`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Logout error:", error); 
            return rejectWithValue(error.message || "Logout failed");
        }
    }
);
