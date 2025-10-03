import React, { useEffect, useState } from "react";
import API, { setAuth } from "../services/api";
import { Link } from "react-router-dom";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [faculty, setFaculty] = useState("");

  useEffect(() => {
    // Set token if available
    const t = localStorage.getItem("token");
    if (t) setAuth(t);

    // Initial fetch
    fetchReports();
  }, []);

  // Trigger search automatically whenever faculty changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReports();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [faculty]);

  // Fetch reports with optional faculty filter
  async function fetchReports() {
    try {
      let url = "/reports";
      if (faculty.trim() !== "") {
        url += `?facultyName=${encodeURIComponent(faculty.trim())}`;
      }

      const res = await API.get(url);
      setReports(res.data);
    } catch (err) {
      console.error("Fetch reports error:", err);
      alert(err.response?.data?.error || err.message);
    }
  }

  // Download reports as Excel
  async function downloadExcel() {
    try {
      let url = "/reports/export/xlsx";
      if (faculty.trim() !== "") {
        url += `?facultyName=${encodeURIComponent(faculty.trim())}`;
      }

      const res = await API.get(url, { responseType: "blob" });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "reports.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error("Download Excel error:", err);
      alert(err.message);
    }
  }

  return (
    <div>
      <h3>Reports</h3>

      {/* Search by faculty (no button) */}
      <div className="mb-3">
        <input
          className="form-control"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          placeholder="Search by faculty..."
        />
      </div>

      <button className="btn btn-success mb-3" onClick={downloadExcel}>
        Download Excel
      </button>

      {/* Reports list */}
      <div className="row">
        {reports.length === 0 ? (
          <div className="col-12 text-center py-4">
            <p className="text-muted">No reports found.</p>
          </div>
        ) : (
          reports.map((r) => (
            <div className="col-md-6" key={r.id}>
              <div className="card mb-2">
                <div className="card-body">
                  <h5 className="card-title">
                    {r.courseName} ({r.courseCode})
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {r.facultyName} - {r.className}
                  </h6>
                  <p>
                    <strong>Lecturer:</strong> {r.lecturerName} |{" "}
                    <strong>Date:</strong> {r.dateOfLecture}
                  </p>
                  <p>
                    <strong>Present:</strong> {r.actualStudentsPresent} /{" "}
                    {r.totalRegisteredStudents}
                  </p>
                  <p>
                    <strong>Topic:</strong> {r.topicTaught}
                  </p>
                  <p>
                    <strong>Feedback:</strong> {r.feedback || "—"}
                  </p>
                  <p>
                    <strong>Status:</strong> {r.status}
                  </p>

                  {/* Role-based actions */}
                  {localStorage.getItem("role") === "PRL" && (
                    <Link
                      to={`/reports/${r.id}/review`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Review
                    </Link>
                  )}
                  {localStorage.getItem("role") === "PL" && r.status === "REVIEWED" && (
                    <Link
                      to={`/reports/${r.id}/finalize`}
                      className="btn btn-sm btn-success"
                    >
                      Finalize
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
