import React, { useState, useEffect } from 'react';
import API, { setAuth } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/reportForm.css';  // 👈 import CSS

export default function ReportForm() {
  const [form, setForm] = useState({
    facultyName: '',
    className: '',
    weekOfReporting: '',
    dateOfLecture: '',
    courseName: '',
    courseCode: '',
    lecturerName: '',
    actualStudentsPresent: 0,
    totalRegisteredStudents: 0,
    venue: '',
    scheduledTime: '',
    topicTaught: '',
    learningOutcomes: '',
    recommendations: ''
  });

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setAuth(t);

    const r = localStorage.getItem('role');
    setRole(r);

    // 👇 block students
    if (r === 'STUDENT') {
      alert('Access denied. Students cannot write reports.');
      nav('/'); 
    }
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // lecturer should go through secure route
      if (role === 'LECTURER') {
        await API.post('/reports/secure', form);
        alert('✅ Report submitted successfully to PRL');
      } else {
        await API.post('/reports', form);
        alert('✅ Report submitted successfully');
      }

      nav('/reports');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="col-md-8 offset-md-2">
      <h3>Create Report</h3>
      <form onSubmit={submit}>
        <div className="row">
          {/* all form fields unchanged */}
          <div className="mb-2 col-md-6">
            <label>Faculty Name</label>
            <input className="form-control" value={form.facultyName} onChange={e => setField('facultyName', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-6">
            <label>Class Name</label>
            <input className="form-control" value={form.className} onChange={e => setField('className', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Week</label>
            <input className="form-control" value={form.weekOfReporting} onChange={e => setField('weekOfReporting', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Date</label>
            <input type="date" className="form-control" value={form.dateOfLecture} onChange={e => setField('dateOfLecture', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Course Name</label>
            <input className="form-control" value={form.courseName} onChange={e => setField('courseName', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Course Code</label>
            <input className="form-control" value={form.courseCode} onChange={e => setField('courseCode', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Lecturer Name</label>
            <input className="form-control" value={form.lecturerName} onChange={e => setField('lecturerName', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Actual Present</label>
            <input type="number" className="form-control" value={form.actualStudentsPresent} onChange={e => setField('actualStudentsPresent', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-4">
            <label>Total Registered</label>
            <input type="number" className="form-control" value={form.totalRegisteredStudents} onChange={e => setField('totalRegisteredStudents', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-6">
            <label>Venue</label>
            <input className="form-control" value={form.venue} onChange={e => setField('venue', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-6">
            <label>Scheduled Time</label>
            <input className="form-control" value={form.scheduledTime} onChange={e => setField('scheduledTime', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-12">
            <label>Topic Taught</label>
            <textarea className="form-control" value={form.topicTaught} onChange={e => setField('topicTaught', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-12">
            <label>Learning Outcomes</label>
            <textarea className="form-control" value={form.learningOutcomes} onChange={e => setField('learningOutcomes', e.target.value)} required />
          </div>
          <div className="mb-2 col-md-12">
            <label>Recommendations</label>
            <textarea className="form-control" value={form.recommendations} onChange={e => setField('recommendations', e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading 
            ? (role === 'LECTURER' ? 'Submitting to PRL...' : 'Submitting...') 
            : (role === 'LECTURER' ? 'Submit to PRL' : 'Submit')}
        </button>
      </form>
    </div>
  );
}
