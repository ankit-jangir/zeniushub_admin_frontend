import { createSlice } from '@reduxjs/toolkit';
import { get_Deparment, create_department, delete_department, view_department_users, fetchAccessDepartments, get_available_Access, assignAccessDepartments, updateAccessDepartment, get_all_available_Access } from '../Api/Department';



const DepartmentSlice = createSlice({
  name: 'Department',
  initialState: {
    Department: [],
    grantedAccess: [],
    availableAccess: [],
    AllAccess: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      //Create
      .addCase(create_department.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create_department.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.Department.push(action.payload.data);
        }
      })

      .addCase(create_department.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch data';
      })

      //Get
      .addCase(get_Deparment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_Deparment.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure only array is stored
        state.Department = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(get_Deparment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch data';
      })


    //Delete
    .addCase(delete_department.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(delete_department.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload
      if (id) {
        state.users = state.users.filter((ele) => ele.id !== id);
      }
    })
    .addCase(delete_department.rejected, (state, action) => {
      state.loading = false;
      state.error = null;
    })
    // view users in departement 
    .addCase(view_department_users.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder
      .addCase(view_department_users.fulfilled, (state, action) => {
      state.Department = action.payload.data.employesdata;
      // employesdata me list hai employees ki
    })

    .addCase(view_department_users.rejected, (state, action) => {
      state.loading = false;
      state.error = null;
    })
    // access grant control get 
    .addCase(fetchAccessDepartments.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAccessDepartments.fulfilled, (state, action) => {
      state.loading = false;
      state.grantedAccess = action.payload;
    })
    .addCase(fetchAccessDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    // access avaialabe
    .addCase(get_available_Access.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(get_available_Access.fulfilled, (state, action) => {
      state.loading = false;
      state.availableAccess = action.payload;
    })
    .addCase(get_available_Access.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })


    // add access
    .addCase(assignAccessDepartments.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(assignAccessDepartments.fulfilled, (state, action) => {
      state.loading = false;
      state.availableAccess = action.payload;
    })
    .addCase(assignAccessDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })


    // update access control 
    .addCase(updateAccessDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateAccessDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.grantedAccess = action.payload;
    })
    .addCase(updateAccessDepartment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })



    //Get_all_access_controll
    .addCase(get_all_available_Access.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(get_all_available_Access.fulfilled, (state, action) => {
      state.loading = false;
      state.AllAccess = action.payload;  // Assuming the data you get from the API is stored in 'payload'

    })
    .addCase(get_all_available_Access.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch data';
    })
},
});

export default DepartmentSlice.reducer;
