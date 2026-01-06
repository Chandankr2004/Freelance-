import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Jobs.css';

const Jobs = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    budgetType: '',
    status: 'posted'
  });

  const { data, isLoading } = useQuery(
    ['jobs', filters],
    () => api.get('/jobs', { params: filters }).then(res => res.data),
    { keepPreviousData: true }
  );

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

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
    <div className="jobs-page">
      <div className="container">
        <h1>Browse Jobs</h1>

        <div className="jobs-layout">
          <div className="jobs-filters">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search jobs..."
                className="input"
              />
            </div>
            <div className="filter-group">
              <label>Budget Type</label>
              <select
                name="budgetType"
                value={filters.budgetType}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Budget</label>
              <input
                type="number"
                name="minBudget"
                value={filters.minBudget}
                onChange={handleFilterChange}
                placeholder="Min"
                className="input"
              />
            </div>
            <div className="filter-group">
              <label>Max Budget</label>
              <input
                type="number"
                name="maxBudget"
                value={filters.maxBudget}
                onChange={handleFilterChange}
                placeholder="Max"
                className="input"
              />
            </div>
          </div>

          <div className="jobs-list">
            {data?.data?.length > 0 ? (
              data.data.map(job => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-budget">
                      {job.currency} {job.budget} ({job.budgetType})
                    </span>
                  </div>
                  <p className="job-description">{job.description.substring(0, 200)}...</p>
                  <div className="job-footer">
                    <span className="job-category">{job.category?.name}</span>
                    <span className="job-bids">{job.bidsCount} bids</span>
                    <span className="job-date">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p>No jobs found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;

