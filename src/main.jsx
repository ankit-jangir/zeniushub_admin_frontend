import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./component/Admin/Dashboard/ThemeContext";
import { store } from "./Redux_store/Store";
import { Provider } from "react-redux";

// import { Provider } from 'react-redux';

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
