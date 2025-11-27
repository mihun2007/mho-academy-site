import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('registrations');
  const [examGroupFilter, setExamGroupFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch registrations
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regError) throw regError;

      // Fetch exams
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (examError) throw examError;

      setRegistrations(regData || []);
      setExams(examData || []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort data
  const getFilteredData = () => {
    let data = activeTab === 'registrations' ? registrations : exams;
    
    // Apply group filter for exams
    if (activeTab === 'exams' && examGroupFilter !== 'all') {
      data = data.filter(item => item.group_name === examGroupFilter);
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => {
        const searchFields = activeTab === 'registrations' 
          ? [item.first_name, item.last_name, item.church, item.pastor_name]
          : [item.first_name, item.last_name, item.group_name];
        
        return searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      data = [...data].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle date sorting
        if (sortConfig.key === 'created_at' || sortConfig.key === 'birth_date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        // Handle null values
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (url) => {
    // Extract file extension for display
    if (!url) return '-';
    const extension = url.split('.').pop()?.toUpperCase() || 'FILE';
    return extension;
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const getStats = () => {
    const totalRegistrations = registrations.length;
    const totalExams = exams.length;
    const today = new Date().toDateString();
    
    const todayRegistrations = registrations.filter(r => 
      new Date(r.created_at).toDateString() === today
    ).length;
    
    const todayExams = exams.filter(e => 
      new Date(e.created_at).toDateString() === today
    ).length;

    const groupStats = exams.reduce((acc, exam) => {
      acc[exam.group_name] = (acc[exam.group_name] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRegistrations,
      totalExams,
      todayRegistrations,
      todayExams,
      groupStats
    };
  };

  const stats = getStats();
  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </header>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Registrations</h3>
          <p className="stat-number">{stats.totalRegistrations}</p>
          <small>Today: {stats.todayRegistrations}</small>
        </div>
        <div className="stat-card">
          <h3>Total Exams</h3>
          <p className="stat-number">{stats.totalExams}</p>
          <small>Today: {stats.todayExams}</small>
        </div>
        <div className="stat-card">
          <h3>Group Distribution</h3>
          <div className="group-stats">
            {Object.entries(stats.groupStats).map(([group, count]) => (
              <span key={group} className="group-stat">
                {group}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          📝 Registrations ({registrations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          📚 Exams ({exams.length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        {activeTab === 'exams' && (
          <div className="filter-controls">
            <select
              value={examGroupFilter}
              onChange={(e) => setExamGroupFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Groups</option>
              <option value="G">Group G</option>
              <option value="B">Group B</option>
              <option value="V">Group V</option>
              <option value="A">Group A</option>
              <option value="Armonie">Group Armonie</option>
            </select>
          </div>
        )}
      </div>

      {/* Data Tables */}
      <div className="table-container">
        {activeTab === 'registrations' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('created_at')}>
                  Date {getSortIcon('created_at')}
                </th>
                <th onClick={() => handleSort('first_name')}>
                  First Name {getSortIcon('first_name')}
                </th>
                <th onClick={() => handleSort('last_name')}>
                  Last Name {getSortIcon('last_name')}
                </th>
                <th onClick={() => handleSort('birth_date')}>
                  Birth Date {getSortIcon('birth_date')}
                </th>
                <th onClick={() => handleSort('church')}>
                  Church {getSortIcon('church')}
                </th>
                <th onClick={() => handleSort('pastor_name')}>
                  Pastor {getSortIcon('pastor_name')}
                </th>
                <th onClick={() => handleSort('pastor_phone')}>
                  Phone {getSortIcon('pastor_phone')}
                </th>
                <th onClick={() => handleSort('course_type')}>
                  Course {getSortIcon('course_type')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((registration) => (
                <tr key={registration.id}>
                  <td>{formatDate(registration.created_at)}</td>
                  <td>{registration.first_name}</td>
                  <td>{registration.last_name}</td>
                  <td>{formatDate(registration.birth_date)}</td>
                  <td>{registration.church}</td>
                  <td>{registration.pastor_name}</td>
                  <td>{registration.pastor_phone}</td>
                  <td>
                    <span className={`course-badge course-${registration.course_type?.toLowerCase()}`}>
                      {registration.course_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('created_at')}>
                  Date {getSortIcon('created_at')}
                </th>
                <th onClick={() => handleSort('first_name')}>
                  First Name {getSortIcon('first_name')}
                </th>
                <th onClick={() => handleSort('last_name')}>
                  Last Name {getSortIcon('last_name')}
                </th>
                <th onClick={() => handleSort('group_name')}>
                  Group {getSortIcon('group_name')}
                </th>
                <th>Theory Answer</th>
                <th>Exam File</th>
                <th>Performance File</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((exam) => (
                <tr key={exam.id}>
                  <td>{formatDate(exam.created_at)}</td>
                  <td>{exam.first_name}</td>
                  <td>{exam.last_name}</td>
                  <td>
                    <span className={`group-badge group-${exam.group_name?.toLowerCase()}`}>
                      {exam.group_name}
                    </span>
                  </td>
                  <td className="theory-cell">
                    <div className="theory-preview">
                      {exam.theory_answer?.substring(0, 100)}
                      {exam.theory_answer?.length > 100 && '...'}
                    </div>
                  </td>
                  <td>
                    {exam.exam_file_url ? (
                      <button
                        onClick={() => downloadFile(exam.exam_file_url, `exam-${exam.id}`)}
                        className="download-btn"
                        title="Download exam file"
                      >
                        📥 {formatFileSize(exam.exam_file_url)}
                      </button>
                    ) : (
                      <span className="no-file">No file</span>
                    )}
                  </td>
                  <td>
                    {exam.performance_file_url ? (
                      <button
                        onClick={() => downloadFile(exam.performance_file_url, `performance-${exam.id}`)}
                        className="download-btn"
                        title="Download performance file"
                      >
                        📥 {formatFileSize(exam.performance_file_url)}
                      </button>
                    ) : (
                      <span className="no-file">No file</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredData.length} of {activeTab === 'registrations' ? registrations.length : exams.length} {activeTab}
          {searchTerm && ` matching "${searchTerm}"`}
          {activeTab === 'exams' && examGroupFilter !== 'all' && ` in group ${examGroupFilter}`}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;






