import { createSlice } from "@reduxjs/toolkit";
import { createCategory, getAllCategory,  } from "../Api/CategoryApi";

const CategorySlice = createSlice({
  name: "CategorySlice",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false; 
        state.successMessage = "Category created successfully!";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create category";
      })

      // Get All Category
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        // console.log("fdjfcycfkdccxkytxckltoolyxdt",action.payload);
        
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      // .addCase(updatecategory.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.successMessage = null;
      // })
      // .addCase(updatecategory.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.successMessage = "Category updated successfully!";
      //   // Optional: update specific category in state.categories
      //   const updated = action.payload;
      //   state.categories = state.categories.map((cat) =>
      //     cat._id === updated.id ? updated : cat
      //   );
      // })
      // .addCase(updatecategory.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload || "Failed to update category";
      // });
  },
});

export const CategorySliceReducer = CategorySlice.reducer;
