import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';
import '../Jobs/JobDetail.css';

const ContractDetail = () => {
  const { id } = useParams();
  const { data: contract, isLoading } = useQuery(
    ['contract', id],
    () => api.get(`/contracts/${id}`).then(res => res.data.data)
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

  if (!contract) {
    return <div className="container">Contract not found</div>;
  }

  return (
    <div className="job-detail-page">
      <div className="container">
        <h1>{contract.title}</h1>
        <div className="job-meta">
          <span>Amount: {contract.currency} {contract.totalAmount}</span>
          <span>Status: {contract.status}</span>
          <span>Payment Status: {contract.paymentStatus}</span>
        </div>
        <div className="job-description">
          <h3>Description</h3>
          <p>{contract.description}</p>
        </div>
        {contract.milestones && contract.milestones.length > 0 && (
          <div className="job-skills">
            <h3>Milestones</h3>
            <div className="milestones-list">
              {contract.milestones.map(milestone => (
                <div key={milestone.id} className="milestone-item">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                  <p>Amount: {milestone.currency} {milestone.amount}</p>
                  <p>Status: {milestone.status}</p>
                  <p>Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;

