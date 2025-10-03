import React, { useEffect, useState } from "react";
import API from "../services/api";

function Monitoring() {
  const [monitoringData, setMonitoringData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [newRow, setNewRow] = useState({
    courseName: "",
    lecturerName: "",
    totalRegisteredStudents: "",
    actualStudentsPresent: "",
  });
  const [form, setForm] = useState({
    name: "",
    surname: "",
    studentNumber: "",
    phone: "",
    signIn: "",
    signOut: "",
  });

  // Fetch monitoring data
  const fetchMonitoringData = () => {
    API.get("/monitoring")
      .then((res) => setMonitoringData(res.data))
      .catch((err) => console.error("Monitoring fetch error:", err));
  };

  // Fetch attendance data
  const fetchAttendanceData = () => {
    API.get("/attendance")
      .then((res) => setAttendanceData(res.data))
      .catch((err) => console.error("Attendance fetch error:", err));
  };

  useEffect(() => {
    fetchMonitoringData();
    fetchAttendanceData();
  }, []);

  // Handle monitoring row input
  const handleRowChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  };

  // Submit monitoring row
  const handleRowSubmit = (e) => {
    e.preventDefault();
    API.post("/monitoring", newRow)
      .then(() => {
        setNewRow({
          courseName: "",
          lecturerName: "",
          totalRegisteredStudents: "",
          actualStudentsPresent: "",
        });
        fetchMonitoringData();
      })
      .catch((err) => console.error("Add row error:", err));
  };

  // Handle attendance form input
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit attendance form
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const attendanceWithTime = {
      ...form,
      submittedAt: new Date().toLocaleString(),
    };

    API.post("/attendance", attendanceWithTime)
      .then(() => {
        alert("Attendance submitted ✅");
        setForm({
          name: "",
          surname: "",
          studentNumber: "",
          phone: "",
          signIn: "",
          signOut: "",
        });
        fetchAttendanceData();
      })
      .catch((err) => console.error("Attendance submit error:", err));
  };

  return (
    <div className="card">
      {/* Monitoring Table */}
      <h2 style={{ padding: "10px 0" }}>📊 Monitoring Data</h2>
      <form onSubmit={handleRowSubmit}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <thead
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
          >
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }}>Course</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Lecturer</th>
              <th style={{ padding: "10px", textAlign: "left" }}>
                Total Students
              </th>
              <th style={{ padding: "10px", textAlign: "left" }}>Present</th>
            </tr>
          </thead>
          <tbody>
            {/* Input row */}
            <tr>
              <td>
                <input
                  type="text"
                  name="courseName"
                  value={newRow.courseName}
                  onChange={handleRowChange}
                  placeholder="Enter course"
                  style={{ width: "95%", padding: "6px" }}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="lecturerName"
                  value={newRow.lecturerName}
                  onChange={handleRowChange}
                  placeholder="Enter lecturer"
                  style={{ width: "95%", padding: "6px" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalRegisteredStudents"
                  value={newRow.totalRegisteredStudents}
                  onChange={handleRowChange}
                  placeholder="Total"
                  style={{ width: "95%", padding: "6px" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="actualStudentsPresent"
                  value={newRow.actualStudentsPresent}
                  onChange={handleRowChange}
                  placeholder="Present"
                  style={{ width: "95%", padding: "6px" }}
                />
              </td>
            </tr>

            {/* Existing rows */}
            {monitoringData.length > 0 ? (
              monitoringData.map((item, idx) => (
                <tr key={idx} style={{ color: "blue" }}>
                  <td style={{ padding: "8px" }}>{item.courseName}</td>
                  <td style={{ padding: "8px" }}>{item.lecturerName}</td>
                  <td style={{ padding: "8px" }}>{item.totalRegisteredStudents}</td>
                  <td style={{ padding: "8px" }}>{item.actualStudentsPresent}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: "10px", textAlign: "center", color: "gray" }}>
                  No monitoring data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Monitoring Data
        </button>
      </form>

      {/* Attendance Table */}
      <h2 style={{ padding: "10px 0" }}>📝 Attendance</h2>
      <form onSubmit={handleFormSubmit}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead
            style={{
              background: "linear-gradient(to right, #ff512f, #dd2476)",
              color: "white",
            }}
          >
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Surname</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Student No.</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Sign In</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Sign Out</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {/* Input row */}
            <tr>
              <td>
                <input type="text" name="name" value={form.name} onChange={handleFormChange} placeholder="Enter name" style={{ width: "95%", padding: "6px" }} />
              </td>
              <td>
                <input type="text" name="surname" value={form.surname} onChange={handleFormChange} placeholder="Enter surname" style={{ width: "95%", padding: "6px" }} />
              </td>
              <td>
                <input type="text" name="studentNumber" value={form.studentNumber} onChange={handleFormChange} placeholder="Student No." style={{ width: "95%", padding: "6px" }} />
              </td>
              <td>
                <input type="text" name="phone" value={form.phone} onChange={handleFormChange} placeholder="Phone" style={{ width: "95%", padding: "6px" }} />
              </td>
              <td>
                <input type="text" name="signIn" value={form.signIn} onChange={handleFormChange} placeholder="Sign In" style={{ width: "95%", padding: "6px" }} />
              </td>
              <td>
                <input type="text" name="signOut" value={form.signOut} onChange={handleFormChange} placeholder="Sign Out" style={{ width: "95%", padding: "6px" }} />
              </td>
              <td style={{ color: "gray", fontStyle: "italic" }}>Auto</td>
            </tr>

            {/* Existing rows */}
            {attendanceData.length > 0 ? (
              attendanceData.map((item, idx) => (
                <tr key={idx} style={{ color: "blue" }}>
                  <td style={{ padding: "8px" }}>{item.name}</td>
                  <td style={{ padding: "8px" }}>{item.surname}</td>
                  <td style={{ padding: "8px" }}>{item.studentNumber}</td>
                  <td style={{ padding: "8px" }}>{item.phone}</td>
                  <td style={{ padding: "8px" }}>{item.signIn}</td>
                  <td style={{ padding: "8px" }}>{item.signOut}</td>
                  <td style={{ padding: "8px" }}>{item.submittedAt || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: "10px", textAlign: "center", color: "gray" }}>
                  No attendance records available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "linear-gradient(to right, #ff512f, #dd2476)",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
}

export default Monitoring;
