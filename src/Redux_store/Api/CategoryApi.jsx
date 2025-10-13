import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createCategory = createAsyncThunk(
  "Category/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/categoryrouter/addcategorycontroller`, {
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
      return result.data; // Backend ke response ke according adjust karna
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const  getAllCategory = createAsyncThunk(
    "Category/getAllCategory",
    async (_, { rejectWithValue }) => {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${BASE_URL}/api/v1/categoryrouter/getallcategorycontroller`, {
          method: "GET",
         
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData);
        }
  
        const result = await response.json();
        return result.data; // Adjust if backend response is different
      } catch (error) {
        return rejectWithValue(error.message || "Failed to fetch categories");
      }
    }
  );
  


 
//     "Category/updateCategory",
//     async (updatedData, { rejectWithValue }) => {
//       try {
//         const BASE_URL = import.meta.env.VITE_BASE_URL;
//         const response = await fetch(`${BASE_URL}/api/v1/categoryrouter/updatecategorycontroller/2`, {
//           method: "PUT", // or "PATCH" depending on your backend
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedData),
//         });
  
//         if (!response.ok) {
//           const errorData = await response.json();
//           return rejectWithValue(errorData);
//         }
  
//         const result = await response.json();
//         return result.data;
//       } catch (error) {
//         return rejectWithValue(error.message || "Failed to update category");
//       }
//     }
//   );