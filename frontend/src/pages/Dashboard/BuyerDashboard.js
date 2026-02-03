import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './Dashboard.css';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contracts } = useQuery(
    'buyer-contracts',
    () => api.get('/contracts', { params: { role: 'buyer' } }).then(res => res.data.data)
  );

  const { data: jobs } = useQuery(
    'buyer-jobs',
    () => api.get('/jobs').then(res => res.data.data.filter(j => j.buyerId === user?.id))
  );

  const { data: bids, isLoading: bidsLoading } = useQuery(
    'buyer-job-bids',
    () => api.get('/bids/buyer-jobs').then(res => res.data.data),
    { enabled: !!user }
  );

  const acceptBidMutation = useMutation(
    (bidId) => api.put(`/bids/${bidId}/accept`),
    {
      onSuccess: () => {
        toast.success('Bid accepted! Contract created.');
        queryClient.invalidateQueries('buyer-job-bids');
        queryClient.invalidateQueries('buyer-contracts');
        queryClient.invalidateQueries('buyer-jobs');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to accept bid');
      }
    }
  );

  const handleAcceptBid = (bidId) => {
    if (window.confirm('Are you sure you want to accept this bid? This will create a contract.')) {
      acceptBidMutation.mutate(bidId);
    }
  };

  const pendingBids = bids?.filter(bid => bid.status === 'pending') || [];
  const totalBids = bids?.length || 0;

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
          <div className="dashboard-card">
            <h3>Total Bids</h3>
            <p className="stat-number">{totalBids}</p>
            <p className="stat-detail">{pendingBids.length} pending</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Bids on Your Jobs</h2>
          {bidsLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : bids && bids.length > 0 ? (
            <div className="bids-list">
              {bids.slice(0, 10).map(bid => (
                <div key={bid.id} className="bid-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4>{bid.job?.title}</h4>
                      <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        From: {bid.freelancer?.profile?.displayName || bid.freelancer?.email}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)', margin: 0 }}>
                        {bid.currency} {bid.amount}
                      </p>
                      <span className={`status-${bid.status}`} style={{ fontSize: '0.875rem' }}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {bid.proposal?.substring(0, 150)}...
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link to={`/jobs/${bid.jobId}`} className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                      View Job
                    </Link>
                    {bid.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptBid(bid.id)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        disabled={acceptBidMutation.isLoading}
                      >
                        {acceptBidMutation.isLoading ? 'Accepting...' : 'Accept Bid'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No bids on your jobs yet</p>
          )}
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

