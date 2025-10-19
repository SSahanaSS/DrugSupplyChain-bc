import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./components/register";
import LoginPage from "./components/login";
import ManufacturerDashboard from "./components/manudb";
import DistributorDashboard from "./components/distridb";
import PharmacyDashboard from "./components/pharmadb";
import CustomerDashboard from "./components/custodb";

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#1e88e5",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "18px"
      }}>
        <div>Drug Supply Chain System</div>
        <div>
          <Link to="/register" style={navLinkStyle}>Register</Link>
          <Link to="/login" style={navLinkStyle}>Login</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/manudb" element={<ManufacturerDashboard />} />
        <Route path="/distridb" element={<DistributorDashboard />} />
        <Route path="/pharmadb" element={<PharmacyDashboard />} />
        <Route path="/custodb" element={<CustomerDashboard />} />
      </Routes>
    </div>
  );
}

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  marginLeft: "20px",
  fontWeight: "bold",
};

export default App;
