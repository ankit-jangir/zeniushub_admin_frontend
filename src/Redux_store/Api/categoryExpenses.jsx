import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createCategoryExpense = createAsyncThunk(
  "categoryExpenses/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/categoryexp/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result.data; // Adjust based on your backend response structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create category expense");
    }
  }
);

export const getAllCategoryExpenses = createAsyncThunk(
  "categoryExpenses/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/categoryexp`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      console.log(result);
      console.log(result.data);
      
      return result.data; // Adjust based on your backend response structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch category expenses");
    }
  }
);

export const getCategoryExpenseById = createAsyncThunk(
  "categoryExpenses/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/categoryexp/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result.data; // Adjust based on your backend response structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch category expense");
    }
  }
);

export const updateCategoryExpense = createAsyncThunk(
  "categoryExpenses/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/categoryexp/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result.data; // Adjust based on your backend response structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update category expense");
    }
  }
);

export const deleteCategoryExpense = createAsyncThunk(
  "categoryExpenses/delete",
  async ({id,token}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/categoryexp/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result.data; // Adjust based on your backend response structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete category expense");
    }
  }
);