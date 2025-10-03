// frontend/src/pages/ReportsList.jsx
import React, { useEffect, useState } from "react";
import API, { setAuth } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [role, setRole] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setAuth(t);

    const r = localStorage.getItem("role");
    setRole(r);

    API.get("/reports")
      .then((res) => setReports(res.data))
      .catch((err) => {
        console.error("Fetch reports error:", err);
        alert("Failed to fetch reports");
      });
  }, []);

  function handleReview(id) {
    nav(`/reports/${id}/review`);
  }

  return (
    <div className="col-md-10 offset-md-1">
      <h3>📑 Reports</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Date</th>
            <th>Status</th>
            {role === "PRL" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r.id}>
                <td>{r.courseName} ({r.courseCode})</td>
                <td>{r.lecturerName}</td>
                <td>{r.topicTaught}</td>
                <td>{new Date(r.dateOfLecture).toLocaleDateString()}</td>
                <td>
                  {r.prlComments
                    ? "✅ Reviewed"
                    : "⏳ Pending Review"}
                </td>
                {role === "PRL" && (
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleReview(r.id)}
                    >
                      Review
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={role === "PRL" ? 6 : 5} className="text-center">
                No reports available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
