import { createSlice } from "@reduxjs/toolkit";
import {
  createCategoryExpense,
  deleteCategoryExpense,
  getAllCategoryExpenses,
  getCategoryExpenseById,
  updateCategoryExpense,
} from "../Api/categoryExpenses";

// Utility to handle common state updates for async actions
const handleAsyncState = (state, action, status) => {
  if (status === "pending") {
    state.loading = true;
    state.error = null;
    state.successMessage = null;
  } else if (status === "rejected") {
    state.loading = false;
    state.error = action.error.message || "An error occurred";
  }
};

const CategoryExpensesSlice = createSlice({
  name: "categoryExpenses",
  initialState: {
    categoryExpenses: [],
    selectedCategoryExpense: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Category Expense
      .addCase(createCategoryExpense.pending, (state, action) => {
        handleAsyncState(state, action, "pending");
      })
      .addCase(createCategoryExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryExpenses.push(action.payload);
        state.successMessage = "Category expense created successfully!";
      })
      .addCase(createCategoryExpense.rejected, (state, action) => {
        handleAsyncState(state, action, "rejected");
      })

      // Get All Category Expenses
      .addCase(getAllCategoryExpenses.pending, (state, action) => {
        handleAsyncState(state, action, "pending");
      })
      .addCase(getAllCategoryExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryExpenses = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.successMessage = "Category expenses fetched successfully!";
      })
      .addCase(getAllCategoryExpenses.rejected, (state, action) => {
        handleAsyncState(state, action, "rejected");
      })

      // Get Category Expense By ID
      .addCase(getCategoryExpenseById.pending, (state, action) => {
        handleAsyncState(state, action, "pending");
      })
      .addCase(getCategoryExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategoryExpense = action.payload || null;
        state.successMessage = "Category expense fetched successfully!";
      })
      .addCase(getCategoryExpenseById.rejected, (state, action) => {
        handleAsyncState(state, action, "rejected");
      })

      // Update Category Expense
      .addCase(updateCategoryExpense.pending, (state, action) => {
        handleAsyncState(state, action, "pending");
      })
      .addCase(updateCategoryExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Category expense updated successfully!";
        const updatedExpense = action.payload;
        if (updatedExpense?._id) {
          state.categoryExpenses = state.categoryExpenses.map((cat) =>
            cat._id === updatedExpense._id ? updatedExpense : cat
          );
          if (state.selectedCategoryExpense?._id === updatedExpense._id) {
            state.selectedCategoryExpense = updatedExpense;
          }
        }
      })
      .addCase(updateCategoryExpense.rejected, (state, action) => {
        handleAsyncState(state, action, "rejected");
      })

      // Delete Category Expense
      .addCase(deleteCategoryExpense.pending, (state, action) => {
        handleAsyncState(state, action, "pending");
      })
      .addCase(deleteCategoryExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Category expense deleted successfully!";
        const deletedId = action.payload?._id;
        if (deletedId) {
          state.categoryExpenses = state.categoryExpenses.filter(
            (cat) => cat._id !== deletedId
          );
          if (state.selectedCategoryExpense?._id === deletedId) {
            state.selectedCategoryExpense = null;
          }
        }
      })
      .addCase(deleteCategoryExpense.rejected, (state, action) => {
        handleAsyncState(state, action, "rejected");
      });
  },
});

export const { clearMessages } = CategoryExpensesSlice.actions;
export const CategoryExpensesSliceReducer = CategoryExpensesSlice.reducer;