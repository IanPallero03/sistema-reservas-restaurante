import React from "react";
import ReactDOM from "react-dom/client";
import AdminPanel from "./AdminPanel";
import "./index.css"; // si usás Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminPanel />
  </React.StrictMode>
);
