import React, { useState } from 'react';
import StudentRegistrationForm from './components/StudentRegistrationForm';
import StudentExamForm from './components/StudentExamForm';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [activeForm, setActiveForm] = useState('registration');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music Course Platform</h1>
        <p>Student Registration & Exam System with Supabase</p>
      </header>
      
      <nav className="App-nav">
        <button 
          className={`nav-btn ${activeForm === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveForm('registration')}
        >
          📝 Student Registration
        </button>
        <button 
          className={`nav-btn ${activeForm === 'exam' ? 'active' : ''}`}
          onClick={() => setActiveForm('exam')}
        >
          📚 Exam Submission
        </button>
        <button 
          className={`nav-btn ${activeForm === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveForm('admin')}
        >
          🛠️ Admin Dashboard
        </button>
      </nav>
      
      <main className="App-main">
        {activeForm === 'registration' ? (
          <StudentRegistrationForm />
        ) : activeForm === 'exam' ? (
          <StudentExamForm />
        ) : (
          <AdminDashboard />
        )}
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2025 Music Course Platform. Powered by Supabase.</p>
      </footer>
    </div>
  );
}

export default App;
