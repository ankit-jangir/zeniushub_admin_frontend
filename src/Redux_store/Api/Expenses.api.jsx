import { createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Base URL from .env
const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/v1/expenserouter';
// final: https://adminv2-api-dev.intellix360.in/api/v1/expenserouter

// 1️⃣ Create Expense
export const create_Expense = createAsyncThunk(
  'expense/create_Expense',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      // ensure number fields before sending
      const bodyData = {
        ...data,
        categoryId: Number(data.categoryId),
        amount: Number(data.amount),
      };

      const response = await fetch(`${BASE_URL}/createExpanse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // to ken header me
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


// 2️⃣ Get All Expenses
export const get_AllExpenses = createAsyncThunk(
  'expense/get_AllExpenses',
  async (
    { token, name, paymentMethod, startDate, endDate, page, limit } = {}, // 👈 token add
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        name: name || '',
        paymentMethod: paymentMethod || '',
        startDate: startDate || '',
        endDate: endDate || '',
        page: page || 1,
        limit: limit || 10,
      }).toString();

      const finalUrl = `${BASE_URL}/all?${query}`;
      console.log('GET URL:', finalUrl);

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 token header me
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log('API Response:', data);

      return data;
    } catch (error) {
      console.log('API Error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


// 3️⃣ Update
export const update_Expense = createAsyncThunk(
  'expense/update_Expense',
  async ({ id, token, data }, { rejectWithValue }) => {
    
    try {
      const response = await fetch(`${BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 token header me
        },
        body: JSON.stringify(data), // 👈 updated fields
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


// 4️⃣ Delete
export const delete_Expense = createAsyncThunk(
  'expense/delete_Expense',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return id; // deleted id return kar do
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


// 5️⃣ Export Excel (updated to include query parameters)
export const export_ExpensesExcel = createAsyncThunk(
  'expense/export_ExpensesExcel',
  async ({ name, paymentMethod, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        name: name || '',
        paymentMethod: paymentMethod || '',
        startDate: startDate || '',
        endDate: endDate || '',
      }).toString();

      const finalUrl = `${BASE_URL}/export/excel?${query}`;
      console.log('Export URL:', finalUrl);

      const response = await fetch(finalUrl, { method: 'GET' });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.log('Export Error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export default {
  create_Expense,
  get_AllExpenses,
  update_Expense,
  delete_Expense,
  export_ExpensesExcel,
};