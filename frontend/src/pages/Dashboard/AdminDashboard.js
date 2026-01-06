import React from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery(
    'admin-stats',
    () => api.get('/admin/dashboard').then(res => res.data.data)
  );

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.users?.total || 0}</p>
            <p className="stat-detail">Buyers: {stats?.users?.buyers || 0} | Freelancers: {stats?.users?.freelancers || 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Jobs</h3>
            <p className="stat-number">{stats?.jobs?.total || 0}</p>
            <p className="stat-detail">Active: {stats?.jobs?.active || 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Contracts</h3>
            <p className="stat-number">{stats?.contracts?.total || 0}</p>
            <p className="stat-detail">Active: {stats?.contracts?.active || 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats?.revenue?.total?.toFixed(2) || 0}</p>
            <p className="stat-detail">This Month: ${stats?.revenue?.monthly?.toFixed(2) || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

