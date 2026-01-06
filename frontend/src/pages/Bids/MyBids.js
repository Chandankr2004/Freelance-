import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import '../Jobs/Jobs.css';

const MyBids = () => {
  const { data: bids, isLoading } = useQuery(
    'my-bids',
    () => api.get('/bids/my-bids').then(res => res.data.data)
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
        <h1>My Bids</h1>
        <div className="jobs-list">
          {bids && bids.length > 0 ? (
            bids.map(bid => (
              <Link key={bid.id} to={`/jobs/${bid.jobId}`} className="job-card">
                <div className="job-header">
                  <h3>{bid.job?.title}</h3>
                  <span className="job-budget">
                    {bid.currency} {bid.amount}
                  </span>
                </div>
                <p className="job-description">{bid.proposal.substring(0, 200)}...</p>
                <div className="job-footer">
                  <span className={`status-${bid.status}`}>Status: {bid.status}</span>
                  <span className="job-date">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p>No bids yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBids;

