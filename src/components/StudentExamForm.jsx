import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './StudentExamForm.css';

const StudentExamForm = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    group_name: '',
    theory_answer: '',
    exam_file: null,
    performance_file: null
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState({ exam: 0, performance: 0 });

  const groupOptions = [
    { value: 'G', label: 'G' },
    { value: 'B', label: 'B' },
    { value: 'V', label: 'V' },
    { value: 'A', label: 'A' },
    { value: 'Armonie', label: 'Armonie' }
  ];

  // Fetch students for the dropdown
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id, first_name, last_name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: 'Failed to load students list' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const validateForm = () => {
    if (!formData.student_id) {
      setMessage({ type: 'error', text: 'Please select a student' });
      return false;
    }
    if (!formData.group_name) {
      setMessage({ type: 'error', text: 'Please select a group' });
      return false;
    }
    if (!formData.theory_answer.trim()) {
      setMessage({ type: 'error', text: 'Theory answer is required' });
      return false;
    }
    if (!formData.exam_file) {
      setMessage({ type: 'error', text: 'Please upload an exam file' });
      return false;
    }
    if (!formData.performance_file) {
      setMessage({ type: 'error', text: 'Please upload a performance file' });
      return false;
    }

    // Validate file types
    const examFile = formData.exam_file;
    const performanceFile = formData.performance_file;

    if (examFile && !['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(examFile.type)) {
      setMessage({ type: 'error', text: 'Exam file must be PDF, JPG, or PNG' });
      return false;
    }

    if (performanceFile && !['video/mp4', 'video/mov', 'audio/mpeg', 'audio/wav', 'audio/mp3'].includes(performanceFile.type)) {
      setMessage({ type: 'error', text: 'Performance file must be MP4, MOV, MP3, or WAV' });
      return false;
    }

    // Validate file sizes (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (examFile && examFile.size > maxSize) {
      setMessage({ type: 'error', text: 'Exam file must be smaller than 50MB' });
      return false;
    }
    if (performanceFile && performanceFile.size > maxSize) {
      setMessage({ type: 'error', text: 'Performance file must be smaller than 50MB' });
      return false;
    }

    return true;
  };

  const uploadFileToStorage = async (file, folder, fileName) => {
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from('exams')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('exams')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setUploadProgress({ exam: 0, performance: 0 });

    try {
      // Upload exam file
      setUploadProgress(prev => ({ ...prev, exam: 25 }));
      const examFileUrl = await uploadFileToStorage(
        formData.exam_file, 
        formData.group_name, 
        formData.exam_file.name
      );
      setUploadProgress(prev => ({ ...prev, exam: 100 }));

      // Upload performance file
      setUploadProgress(prev => ({ ...prev, performance: 25 }));
      const performanceFileUrl = await uploadFileToStorage(
        formData.performance_file, 
        formData.group_name, 
        formData.performance_file.name
      );
      setUploadProgress(prev => ({ ...prev, performance: 100 }));

      // Get student details
      const student = students.find(s => s.id === parseInt(formData.student_id));
      
      // Insert into exams table
      const { data, error } = await supabase
        .from('exams')
        .insert([{
          student_id: parseInt(formData.student_id),
          first_name: student.first_name,
          last_name: student.last_name,
          group_name: formData.group_name,
          theory_answer: formData.theory_answer,
          exam_file_url: examFileUrl,
          performance_file_url: performanceFileUrl
        }])
        .select();

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Exam submitted successfully! Files uploaded and data saved.' 
      });
      
      // Reset form
      setFormData({
        student_id: '',
        group_name: '',
        theory_answer: '',
        exam_file: null,
        performance_file: ''
      });

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');

    } catch (error) {
      console.error('Error submitting exam:', error);
      setMessage({ 
        type: 'error', 
        text: `Exam submission failed: ${error.message}` 
      });
    } finally {
      setLoading(false);
      setUploadProgress({ exam: 0, performance: 0 });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="exam-form-container">
      <h2>Student Exam Submission</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="student_id">Student *</label>
            <select
              id="student_id"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} (ID: {student.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="group_name">Group *</label>
            <select
              id="group_name"
              name="group_name"
              value={formData.group_name}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a group</option>
              {groupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="theory_answer">Theory Answer *</label>
          <textarea
            id="theory_answer"
            name="theory_answer"
            value={formData.theory_answer}
            onChange={handleInputChange}
            placeholder="Write your theory answer here..."
            rows="6"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="exam_file">Exam File *</label>
            <input
              type="file"
              id="exam_file"
              name="exam_file"
              onChange={(e) => handleFileChange(e, 'exam_file')}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            {formData.exam_file && (
              <div className="file-info">
                <p><strong>Selected:</strong> {formData.exam_file.name}</p>
                <p><strong>Size:</strong> {formatFileSize(formData.exam_file.size)}</p>
                <p><strong>Type:</strong> {formData.exam_file.type}</p>
                {uploadProgress.exam > 0 && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress.exam}%` }}
                      ></div>
                    </div>
                    <span>{uploadProgress.exam}%</span>
                  </div>
                )}
              </div>
            )}
            <small>Accepted formats: PDF, JPG, PNG (max 50MB)</small>
          </div>

          <div className="form-group">
            <label htmlFor="performance_file">Performance File *</label>
            <input
              type="file"
              id="performance_file"
              name="performance_file"
              onChange={(e) => handleFileChange(e, 'performance_file')}
              accept=".mp4,.mov,.mp3,.wav"
              required
            />
            {formData.performance_file && (
              <div className="file-info">
                <p><strong>Selected:</strong> {formData.performance_file.name}</p>
                <p><strong>Size:</strong> {formatFileSize(formData.performance_file.size)}</p>
                <p><strong>Type:</strong> {formData.performance_file.type}</p>
                {uploadProgress.performance > 0 && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress.performance}%` }}
                      ></div>
                    </div>
                    <span>{uploadProgress.performance}%</span>
                  </div>
                )}
              </div>
            )}
            <small>Accepted formats: MP4, MOV, MP3, WAV (max 50MB)</small>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Submitting Exam...' : 'Submit Exam'}
        </button>
      </form>
    </div>
  );
};

export default StudentExamForm;






