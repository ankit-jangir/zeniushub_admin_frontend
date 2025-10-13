import { createAsyncThunk } from '@reduxjs/toolkit'

const BASE_URL = import.meta.env.VITE_BASE_URL

// get banner 
export const seession_year = createAsyncThunk('year', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/session/get`, {
            method: 'GET',
        })

        if (!response.ok) {
            const errorData = await response.json()
            return rejectWithValue(errorData)
        }

        const result = await response.json()

        return result
    } catch (error) {
        return rejectWithValue(error.message || 'Something went wrong')
    }
}
)
export default seession_year