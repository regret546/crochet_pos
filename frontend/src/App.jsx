import { useState } from "react";
import Login from "./pages/Login";
import Sales from "./pages/Sales";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="h-[100vh] w-[100%] bg-[url('./assets/crochet.jpg')] bg-cover bg-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
