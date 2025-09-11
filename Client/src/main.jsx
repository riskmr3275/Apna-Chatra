import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit"
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import rootReducers from "../src/reducer/index.jsx"
import "./index.css";
const store = configureStore({
  reducer: rootReducers
})
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);