import { createSlice } from '@reduxjs/toolkit';
import { get_ExEmployee, UpdateEmployee } from '../Api/ExEmployee';

const initialState = {
    ExEmployees: [],
    loading: false,
    error: null,
    //   Searchemployees: [],
};

const ExEmployeeSlice = createSlice({
    name: 'ExEmployee',
    initialState,
    //   reducers: {
    //     searchUser: (state, action) => {
    //       state.Searchemployees = action.payload;
    //     }
    //   },
    extraReducers: (builder) => {
        builder

            //////Get
            .addCase(get_ExEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_ExEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.ExEmployees = action.payload;
            })
            .addCase(get_ExEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch data';
            })


            /////update
            .addCase(UpdateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            
            .addCase(UpdateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.ExEmployees = Array.isArray(action.payload) ? action.payload : [];
            })

            .addCase(UpdateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });

    },
});

export default ExEmployeeSlice.reducer;
