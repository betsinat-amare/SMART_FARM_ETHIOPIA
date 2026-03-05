import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

export const App = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-green-500 text-center text-4xl font-bold">
        Hello, SmartFarm!
      </h1>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Make sure your ./App.tsx file contains: export const App = () => { ... }