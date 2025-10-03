import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function RateForm() {
  const [lectureName, setLectureName] = useState("");
  const [lecturePerformance, setLecturePerformance] = useState("");
  const [studentBehavior, setStudentBehavior] = useState("");
  const [comments, setComments] = useState("");
  const [ratings, setRatings] = useState([]); // 👈 for monitoring

  useEffect(() => {
    fetchRatings();
  }, []);

  // ✅ Helper: get auth headers with token
  function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // ✅ Fetch ratings (GET /api/ratings/my)
  async function fetchRatings() {
    try {
      const res = await API.get("/ratings/my", getAuthHeaders());
      setRatings(res.data);
    } catch (err) {
      console.error("❌ Fetch ratings error:", err.response?.data || err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
      }
    }
  }

  // ✅ Submit rating (POST /api/ratings)
  async function submit(e) {
    e.preventDefault();
    try {
      await API.post(
        "/ratings",
        {
          lectureName,
          lecturePerformance,
          studentBehavior,
          comments,
        },
        getAuthHeaders()
      );

      alert("✅ Rating submitted successfully!");
      setLectureName("");
      setLecturePerformance("");
      setStudentBehavior("");
      setComments("");
      fetchRatings(); // 👈 refresh monitoring list
    } catch (err) {
      console.error("❌ Submit error:", err.response?.data || err);
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="col-md-6 offset-md-3 mt-4">
      <h3>Class Performance Rating</h3>
      <form onSubmit={submit}>
        {/* Lecture Name */}
        <div className="mb-3">
          <label className="form-label">Lecture Name</label>
          <input
            type="text"
            className="form-control"
            value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            placeholder="Enter lecture name"
            required
          />
        </div>

        {/* Lecture Performance */}
        <div className="mb-3">
          <label className="form-label">Lecture Performance Level</label>
          <select
            className="form-select"
            value={lecturePerformance}
            onChange={(e) => setLecturePerformance(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Poor">Poor</option>
            <option value="Average">Average</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>

        {/* Student Behavior */}
        <div className="mb-3">
          <label className="form-label">Students’ Behavior</label>
          <select
            className="form-select"
            value={studentBehavior}
            onChange={(e) => setStudentBehavior(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Disruptive">Disruptive</option>
            <option value="Neutral">Neutral</option>
            <option value="Attentive">Attentive</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>

        {/* Comments */}
        <div className="mb-3">
          <label className="form-label">Comments</label>
          <textarea
            className="form-control"
            rows="3"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your comments here..."
          ></textarea>
        </div>

        <button className="btn btn-success">Submit Rating</button>
      </form>

      {/* 👇 Monitoring Section */}
      <hr />
      <h4>Your Previous Ratings</h4>
      {ratings.length === 0 ? (
        <p>No ratings submitted yet.</p>
      ) : (
        <ul className="list-group">
          {ratings.map((r, i) => (
            <li key={i} className="list-group-item">
              <strong>Lecture:</strong> {r.lectureName} |{" "}
              <strong>Performance:</strong> {r.lecturePerformance} |{" "}
              <strong>Behavior:</strong> {r.studentBehavior} |{" "}
              <em>{new Date(r.createdAt).toLocaleString()}</em>
              {r.comments && (
                <div>
                  <strong>Comments:</strong> {r.comments}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
