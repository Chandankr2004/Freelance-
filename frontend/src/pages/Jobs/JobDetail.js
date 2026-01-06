import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    deliveryTime: '',
    deliveryUnit: 'days',
    proposal: ''
  });

  const { data, isLoading } = useQuery(
    ['job', id],
    () => api.get(`/jobs/${id}`).then(res => res.data.data)
  );

  const createBidMutation = useMutation(
    (data) => api.post(`/jobs/${id}/bids`, data),
    {
      onSuccess: () => {
        toast.success('Bid submitted successfully!');
        setShowBidForm(false);
        queryClient.invalidateQueries(['job', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit bid');
      }
    }
  );

  const acceptBidMutation = useMutation(
    (bidId) => api.put(`/bids/${bidId}/accept`),
    {
      onSuccess: () => {
        toast.success('Bid accepted! Contract created.');
        queryClient.invalidateQueries(['job', id]);
      }
    }
  );

  const handleBidSubmit = (e) => {
    e.preventDefault();
    createBidMutation.mutate(bidData);
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

  if (!data) {
    return <div className="container">Job not found</div>;
  }

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="job-detail-layout">
          <div className="job-detail-main">
            <h1>{data.title}</h1>
            <div className="job-meta">
              <span>Budget: {data.currency} {data.budget} ({data.budgetType})</span>
              <span>Category: {data.category?.name}</span>
              <span>Posted: {new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="job-description">
              <h3>Description</h3>
              <p>{data.description}</p>
            </div>
            {data.skills && data.skills.length > 0 && (
              <div className="job-skills">
                <h3>Required Skills</h3>
                <div className="skills-list">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="job-detail-sidebar">
            <div className="sidebar-card">
              <h3>About the Buyer</h3>
              <p>{data.buyer?.profile?.displayName || data.buyer?.email}</p>
              <p>Rating: {data.buyer?.profile?.rating || 'N/A'}</p>
            </div>

            {user?.role === 'freelancer' && data.status === 'posted' && (
              <div className="sidebar-card">
                {!showBidForm ? (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => setShowBidForm(true)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Place a Bid
                  </button>
                ) : (
                  <form onSubmit={handleBidSubmit} className="bid-form">
                    <div className="form-group">
                      <label>Bid Amount</label>
                      <input
                        type="number"
                        value={bidData.amount}
                        onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                        required
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Delivery Time</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="number"
                          value={bidData.deliveryTime}
                          onChange={(e) => setBidData({ ...bidData, deliveryTime: e.target.value })}
                          required
                          className="input"
                        />
                        <select
                          value={bidData.deliveryUnit}
                          onChange={(e) => setBidData({ ...bidData, deliveryUnit: e.target.value })}
                          className="input"
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Proposal</label>
                      <textarea
                        value={bidData.proposal}
                        onChange={(e) => setBidData({ ...bidData, proposal: e.target.value })}
                        required
                        rows="5"
                        className="input"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Submit Bid
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-block"
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}

            {data.bids && data.bids.length > 0 && (
              <div className="sidebar-card">
                <h3>Bids ({data.bids.length})</h3>
                <div className="bids-list">
                  {data.bids.map(bid => (
                    <div key={bid.id} className="bid-item">
                      <div className="bid-header">
                        <span className="bid-amount">{bid.currency} {bid.amount}</span>
                        {user?.role === 'buyer' && data.buyerId === user.id && bid.status === 'pending' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptBidMutation.mutate(bid.id)}
                          >
                            Accept
                          </button>
                        )}
                      </div>
                      <p className="bid-freelancer">
                        {bid.freelancer?.profile?.displayName || bid.freelancer?.email}
                      </p>
                      <p className="bid-proposal">{bid.proposal.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

