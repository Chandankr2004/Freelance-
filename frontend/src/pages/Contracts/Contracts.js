import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import '../Jobs/Jobs.css';

const Contracts = () => {
  const { data: contracts, isLoading } = useQuery(
    'contracts',
    () => api.get('/contracts').then(res => res.data.data)
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
    <div className="jobs-page">
      <div className="container">
        <h1>My Contracts</h1>
        <div className="jobs-list">
          {contracts && contracts.length > 0 ? (
            contracts.map(contract => (
              <Link key={contract.id} to={`/contracts/${contract.id}`} className="job-card">
                <div className="job-header">
                  <h3>{contract.title}</h3>
                  <span className="job-budget">
                    {contract.currency} {contract.totalAmount}
                  </span>
                </div>
                <p className="job-description">{contract.description.substring(0, 200)}...</p>
                <div className="job-footer">
                  <span className={`status-${contract.status}`}>Status: {contract.status}</span>
                  <span className="job-date">
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p>No contracts yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;

