import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';
import './Dashboard.css';

const FreelancerDashboard = () => {
  const { data: contracts } = useQuery(
    'freelancer-contracts',
    () => api.get('/contracts', { params: { role: 'freelancer' } }).then(res => res.data.data)
  );

  const { data: bids } = useQuery(
    'my-bids',
    () => api.get('/bids/my-bids').then(res => res.data.data)
  );

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Freelancer Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Contracts</h3>
            <p className="stat-number">{contracts?.filter(c => c.status === 'active').length || 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Earnings</h3>
            <p className="stat-number">$0</p>
          </div>
          <div className="dashboard-card">
            <h3>Pending Bids</h3>
            <p className="stat-number">{bids?.filter(b => b.status === 'pending').length || 0}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>My Bids</h2>
          <Link to="/my-bids" className="btn btn-outline">View All Bids</Link>
          {bids && bids.length > 0 ? (
            <div className="bids-list">
              {bids.slice(0, 5).map(bid => (
                <div key={bid.id} className="bid-card">
                  <h4>{bid.job?.title}</h4>
                  <p>Amount: {bid.currency} {bid.amount}</p>
                  <p>Status: {bid.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No bids yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;

