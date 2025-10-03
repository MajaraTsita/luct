// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportsList from './pages/ReportsList';
import ReportForm from './pages/ReportForm';
import RateForm from './pages/RateForm';
import Monitoring from './pages/Monitoring';  
import Classes from './pages/Course';
import Course from './pages/Classes';

import './pages/App.css';

function App() {
  const role = localStorage.getItem("role"); // get user role
  const navigate = useNavigate();
  const [refreshDashboard, setRefreshDashboard] = useState(false); // ✅ Added state for dashboard refresh

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  // ✅ Function to trigger dashboard refresh when course is added
  const handleCourseAdded = () => {
    setRefreshDashboard(prev => !prev); // Toggle to trigger re-render
  };

  return (
    <>
      <nav className="navbar navbar-expand bg-light mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">LUCT REPORTS</Link>
          <div className="navbar-nav">

            {/* STUDENT: Rate + Monitoring */}
            {role === "STUDENT" && (
              <>
                <Link className="nav-link" to="/rate">Rate</Link>
                <Link className="nav-link" to="/monitoring">Monitoring</Link>
              </>
            )}

            {/* LECTURER / PL / PRL: Reports + Create + Rate + Monitoring + Classes + Courses */}
            {(role === "LECTURER" || role === "PL" || role === "PRL") && (
              <>
                <Link className="nav-link" to="/reports">Reports</Link>
                <Link className="nav-link" to="/create">Create</Link>
                <Link className="nav-link" to="/rate">Rate</Link>
                <Link className="nav-link" to="/monitoring">Monitoring</Link>
                <Link className="nav-link" to="/classes">Courses</Link>
                <Link className="nav-link" to="/courses">Classes</Link> {/* Added Courses */}
              </>
            )}

            {/* Auth links if not logged in */}
            {!role && (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
              </>
            )}

            {/* Logout if logged in */}
            {role && (
              <button className="btn btn-link nav-link" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard refreshTrigger={refreshDashboard} />} // ✅ Pass refresh trigger
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports" element={<ReportsList />} />
          <Route path="/create" element={<ReportForm />} />
          <Route path="/rate" element={<RateForm />} />
          <Route path="/monitoring" element={<Monitoring />} />  
          <Route path="/classes" element={<Classes />} />
          <Route 
            path="/courses" 
            element={
              <Course 
                userRole={role} 
                onCourseAdded={handleCourseAdded} // ✅ Pass callback function
              />
            } 
          />
        </Routes>
      </div>

      <section>
        <footer>&copy; Limkokwing Reporting System (a project created by Majara Tsita)</footer>
      </section> 
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}