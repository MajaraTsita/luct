// frontend/src/components/Login.jsx
import React, { useState } from "react";
import API, { setAuth } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // Extract token, role, id, and name
      const token = res.data.token;
      const role = res.data.role || res.data.user?.role;
      const lecturerId = res.data.user?.id;       // 👈 make sure backend sends this
      const lecturerName = res.data.user?.name;   // 👈 lecturer’s name

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (lecturerId) localStorage.setItem("lecturerId", lecturerId);
      if (lecturerName) localStorage.setItem("lecturerName", lecturerName);

      setAuth(token);

      // ✅ Redirect to Dashboard
      nav("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to login");
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>

      {/* ✅ Added register link */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <p>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#f4f4f5ff", fontWeight: "bold" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
