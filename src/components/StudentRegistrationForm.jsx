import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './StudentRegistrationForm.css';

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    church: '',
    pastor_name: '',
    pastor_phone: '',
    course_type: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const courseOptions = [
    { value: 'G', label: 'G' },
    { value: 'B', label: 'B' },
    { value: 'V', label: 'V' },
    { value: 'A', label: 'A' },
    { value: 'Armonie', label: 'Armonie' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setMessage({ type: 'error', text: 'First name is required' });
      return false;
    }
    if (!formData.last_name.trim()) {
      setMessage({ type: 'error', text: 'Last name is required' });
      return false;
    }
    if (!formData.birth_date) {
      setMessage({ type: 'error', text: 'Birth date is required' });
      return false;
    }
    if (!formData.church.trim()) {
      setMessage({ type: 'error', text: 'Church is required' });
      return false;
    }
    if (!formData.pastor_name.trim()) {
      setMessage({ type: 'error', text: 'Pastor name is required' });
      return false;
    }
    if (!formData.pastor_phone.trim()) {
      setMessage({ type: 'error', text: 'Pastor phone is required' });
      return false;
    }
    if (!formData.course_type) {
      setMessage({ type: 'error', text: 'Course type is required' });
      return false;
    }

    // Validate age (must be at least 13 years old)
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      setMessage({ type: 'error', text: 'Student must be at least 13 years old to register' });
      return false;
    }

    // Validate phone number (minimum 9 digits)
    const phoneDigits = formData.pastor_phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setMessage({ type: 'error', text: 'Phone number must have at least 9 digits' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([formData])
        .select();

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Registration successful! Student has been registered.' 
      });
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        birth_date: '',
        church: '',
        pastor_name: '',
        pastor_phone: '',
        course_type: ''
      });

    } catch (error) {
      console.error('Error inserting registration:', error);
      setMessage({ 
        type: 'error', 
        text: `Registration failed: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Student Registration Form</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="birth_date">Date of Birth *</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleInputChange}
            required
          />
          <small>Student must be at least 13 years old</small>
        </div>

        <div className="form-group">
          <label htmlFor="church">Church *</label>
          <input
            type="text"
            id="church"
            name="church"
            value={formData.church}
            onChange={handleInputChange}
            placeholder="Enter church name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pastor_name">Pastor Name *</label>
            <input
              type="text"
              id="pastor_name"
              name="pastor_name"
              value={formData.pastor_name}
              onChange={handleInputChange}
              placeholder="Enter pastor's full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pastor_phone">Pastor Phone *</label>
            <input
              type="tel"
              id="pastor_phone"
              name="pastor_phone"
              value={formData.pastor_phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              required
            />
            <small>Minimum 9 digits required</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="course_type">Course Type *</label>
          <select
            id="course_type"
            name="course_type"
            value={formData.course_type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a course type</option>
            {courseOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Student'}
        </button>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
