import React, { useEffect, useState } from "react";
import API, { setAuth } from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    lecturer: "",
    description: "",
    credits: "",
    faculty: ""
  });

  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const isPLorPRL = userRole === "PL" || userRole === "PRL";
  const isPL = userRole === "PL";

  const facultyOptions = ["FICT", "FHCT", "FGDT", "FTCM"];

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }
    setAuth(token);
    fetchCourses();
  }, [token]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, facultyFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isPLorPRL ? "/courses" : "/courses/my";
      const response = await API.get(endpoint);
      setCourses(response.data || []);
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError(err.response?.data?.error || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (facultyFilter) {
      filtered = filtered.filter((course) => course.faculty === facultyFilter);
    }
    setFilteredCourses(filtered);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload for backend
      const payload = {
        code: newCourse.code,
        name: newCourse.name,
        lecturer_name: newCourse.lecturer, // Send lecturer to backend
        faculty: newCourse.faculty,
        credits: newCourse.credits,
        description: newCourse.description
      };
      await API.post("/courses", payload);
      alert("✅ Course added successfully!");
      setNewCourse({
        code: "",
        name: "",
        lecturer: "",
        description: "",
        credits: "",
        faculty: ""
      });
      setShowAddForm(false);
      fetchCourses();
    } catch (err) {
      console.error("Add course error:", err);
      alert(err.response?.data?.error || "Failed to add course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      alert("✅ Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error("Delete course error:", err);
      alert(err.response?.data?.error || "Failed to delete course");
    }
  };

  return (
    <div className="courses-container">
      <div className="page-header">
        <h2>📚 {isPLorPRL ? "Manage Courses" : "My Courses"}</h2>
        {isPL && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? "Cancel" : "➕ Add Course"}
          </button>
        )}
      </div>

      {/* Add Course Inline Form */}
      {showAddForm && isPL && (
        <div className="card mb-4 p-3 border">
          <h5>Add New Course</h5>
          <form onSubmit={handleAddCourse}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Course Code *"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Course Name *"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Lecturer Name"
                  value={newCourse.lecturer}
                  onChange={(e) => setNewCourse({ ...newCourse, lecturer: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={newCourse.faculty}
                  onChange={(e) => setNewCourse({ ...newCourse, faculty: e.target.value })}
                  required
                >
                  <option value="">Faculty *</option>
                  {facultyOptions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Credits"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                />
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  placeholder="Description"
                  rows="2"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">
                  Add Course
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="filters-section mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
        >
          <option value="">All Faculties</option>
          {facultyOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Courses List */}
      {loading ? (
        <p>Loading courses...</p>
      ) : filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card p-3 mb-3 border">
              <div className="d-flex justify-content-between align-items-center">
                <h5>{course.code} - {course.name}</h5>
                {isPL && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    🗑️
                  </button>
                )}
              </div>
              {course.lecturer_name && <p>Lecturer: {course.lecturer_name}</p>}
              <p>Faculty: {course.faculty}</p>
              {course.credits && <p>Credits: {course.credits}</p>}
              {course.description && <p>{course.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
