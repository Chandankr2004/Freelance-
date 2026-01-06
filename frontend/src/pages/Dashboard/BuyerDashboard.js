import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Dashboard.css';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { data: contracts } = useQuery(
    'buyer-contracts',
    () => api.get('/contracts', { params: { role: 'buyer' } }).then(res => res.data.data)
  );

  const { data: jobs } = useQuery(
    'buyer-jobs',
    () => api.get('/jobs').then(res => res.data.data.filter(j => j.buyerId === user?.id))
  );

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Buyer Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Contracts</h3>
            <p className="stat-number">{contracts?.filter(c => c.status === 'active').length || 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>Posted Jobs</h3>
            <p className="stat-number">{jobs?.length || 0}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Contracts</h2>
          {contracts && contracts.length > 0 ? (
            <div className="contracts-list">
              {contracts.slice(0, 5).map(contract => (
                <Link
                  key={contract.id}
                  to={`/contracts/${contract.id}`}
                  className="contract-card"
                >
                  <h4>{contract.title}</h4>
                  <p>Status: {contract.status}</p>
                  <p>Amount: {contract.currency} {contract.totalAmount}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>No contracts yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

