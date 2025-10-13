import { createSlice } from '@reduxjs/toolkit';
import {
  create_Expense,
  get_AllExpenses,
  update_Expense,
  delete_Expense,
  export_ExpensesExcel,
} from '../../Redux_store/Api/Expenses.api'; // jaha tumne thunks rakhe hain us path se import karo

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    // agar kabhi local state reset karni ho to yaha reducers likh sakte ho
  },
  extraReducers: (builder) => {
    builder
      // 🟢 Get All Expenses
      .addCase(get_AllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_AllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(get_AllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch expenses';
      })

      // 🟢 Create Expense
      .addCase(create_Expense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create_Expense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload); // naya expense add kar rahe
      })
      .addCase(create_Expense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create expense';
      })

      // 🟢 Update Expense
      .addCase(update_Expense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_Expense.fulfilled, (state, action) => {
        state.loading = false;
        // payload me updated expense ka full object aayega
        const index = state.payload;
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(update_Expense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update expense';
      })

      // 🟢 Delete Expense
      .addCase(delete_Expense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete_Expense.fulfilled, (state, action) => {
        state.loading = false; 
        state.expenses = state.payload;
      })
      .addCase(delete_Expense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error ;
      })

      // 🟢 Export Expenses Excel
      .addCase(export_ExpensesExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(export_ExpensesExcel.fulfilled, (state) => {
        state.loading = false;
        // excel file already download ho chuki hoti hai thunk me
      })
      .addCase(export_ExpensesExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to export expenses';
      });
  },
});

export default expenseSlice.reducer;
