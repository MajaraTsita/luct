import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';  // 👈 added Link
import '../styles/register.css';  // 👈 import CSS

export default function Register(){
  const [name,setName]=useState('');
  const [surname,setSurname]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('STUDENT');
  const [studentNumber,setStudentNumber]=useState(''); // 👈 added student number
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      // 👇 if role is student, check student number validity
      if(role === "STUDENT" && !/^\d{9}$/.test(studentNumber)){
        alert("Student number must be exactly 9 digits.");
        return;
      }

      await API.post('/auth/register', { 
        name, 
        surname, 
        email, 
        password, 
        role, 
        studentNumber: role === "STUDENT" ? studentNumber : undefined // 👈 include only if student
      });

      alert('Registered. Please login.');
      nav('/login');
    }catch(err){ 
      alert(err.response?.data?.error || err.message); 
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Name</label>
          <input className="form-control" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Surname</label>
          <input className="form-control" value={surname} onChange={e=>setSurname(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Role</label>
          <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
            <option value="PRL">Principal Lecturer</option>
            <option value="PL">Program Leader</option>
          </select>
        </div>

        {/* 👇 show student number only if role is STUDENT */}
        {role === "STUDENT" && (
          <div className="mb-2">
            <label>Student Number</label>
            <input 
              className="form-control" 
              value={studentNumber} 
              onChange={e=>setStudentNumber(e.target.value)} 
              maxLength={9} 
              pattern="\d{9}" 
              placeholder="Enter 9-digit student number"
            />
          </div>
        )}

        <button className="btn btn-primary">Register</button>
      </form>

      {/* ✅ Added login link */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <p>Already registered? <Link to="/login" style={{ color: "#f0f1f3ff", fontWeight: "bold" }}>Login here</Link></p>
      </div>
    </div>
  );
}
