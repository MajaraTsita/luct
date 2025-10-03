import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
      <style>{`
        .dashboard-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-card {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          border-radius: 12px;
          padding: 40px;
          color: white;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .dashboard-title {
          margin: 0 0 20px 0;
          font-size: 2rem;
          font-weight: 600;
        }

        .dashboard-text {
          margin: 15px 0;
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .highlight-text {
          color: #f39c12;
          font-weight: bold;
        }

        .register-link {
          color: #f3f5f6;
          font-weight: bold;
          text-decoration: none;
          transition: color 0.2s;
        }

        .register-link:hover {
          color: #ffd966;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 15px;
          }
          .dashboard-card {
            padding: 25px;
          }
          .dashboard-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-title">LUCT Lecture Reporting System</h2>
          <p className="dashboard-text">
            Submit and review lecture reports easily. Use the Register option to set up accounts for students, lecturers, PRLs, or PLs.
          </p>
          <p className="dashboard-text">
            Default administrator login: <span className="highlight-text">admin@luct.edu</span> / <span className="highlight-text">password</span> (role: PL)
          </p>
          <p className="dashboard-text">
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
