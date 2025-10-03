import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    class_name: '',
    course_name: '',
    lecturer_name: '',
    semester: 'Fall2024',
    schedule_day: 'Monday',
    schedule_time: '09:00',
    room: '',
    max_students: 30
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await API.get('/classes');
      setClasses(response.data);
    } catch (err) {
      console.error('Fetch classes error:', err);
      setError('Failed to load classes');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submissionData = {
        ...formData,
        max_students: parseInt(formData.max_students)
      };

      const response = await API.post('/classes', submissionData);

      setFormData({
        class_name: '',
        course_name: '',
        lecturer_name: '',
        semester: 'Fall2024',
        schedule_day: 'Monday',
        schedule_time: '09:00',
        room: '',
        max_students: 30
      });

      setShowForm(false);
      fetchClasses();

    } catch (err) {
      console.error('Create class error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Classes Management</h1>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Add New Class'}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Add Class Form */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Add New Class</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label htmlFor="class_name" className="form-label">Class Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="class_name"
                        name="class_name"
                        value={formData.class_name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., CS101 Section A"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="course_name" className="form-label">Course Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="course_name"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter course name"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="lecturer_name" className="form-label">Lecturer Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lecturer_name"
                        name="lecturer_name"
                        value={formData.lecturer_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter lecturer name"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="semester" className="form-label">Semester *</label>
                      <select
                        className="form-select"
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Semester1 beforebreak">Semester1 beforebreak</option>
                        <option value="Semester1 afterbreak">Semester1 afterbreak</option>
                        <option value="Semester2 beforebreak">Semester2 beforebreak</option>
                        <option value="Semester2 afterbreak">Semester2 afterbreak</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="schedule_day" className="form-label">Day</label>
                      <select
                        className="form-select"
                        id="schedule_day"
                        name="schedule_day"
                        value={formData.schedule_day}
                        onChange={handleInputChange}
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="schedule_time" className="form-label">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        id="schedule_time"
                        name="schedule_time"
                        value={formData.schedule_time}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="room" className="form-label">Room</label>
                      <input
                        type="text"
                        className="form-control"
                        id="room"
                        name="room"
                        value={formData.room}
                        onChange={handleInputChange}
                        placeholder="e.g., Room 101"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="max_students" className="form-label">Max Students</label>
                      <input
                        type="number"
                        className="form-control"
                        id="max_students"
                        name="max_students"
                        value={formData.max_students}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                      />
                    </div>

                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Class'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Classes List */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">All Classes</h5>
            </div>
            <div className="card-body">
              {classes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No classes found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Class Name</th>
                        <th>Course</th>
                        <th>Lecturer</th>
                        <th>Semester</th>
                        <th>Schedule</th>
                        <th>Room</th>
                        <th>Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map(cls => (
                        <tr key={cls.id}>
                          <td>{cls.class_name}</td>
                          <td>{cls.course_name || cls.course_name}</td>
                          <td>{cls.lecturer_name || cls.lecturer_name}</td>
                          <td>{cls.semester}</td>
                          <td>{cls.schedule_day} {cls.schedule_time}</td>
                          <td>{cls.room || '-'}</td>
                          <td>{cls.current_students}/{cls.max_students}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Classes;
