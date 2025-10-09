import { useState } from "react";
import Login from "./pages/Login";
import Sales from "./pages/Sales";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="h-[100vh]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
