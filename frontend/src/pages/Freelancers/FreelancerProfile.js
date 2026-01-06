import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';

const FreelancerProfile = () => {
  const { userId } = useParams();
  const { data, isLoading } = useQuery(
    ['freelancer-profile', userId],
    () => api.get(`/profile/${userId}`).then(res => res.data.data)
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
    <div className="container" style={{ padding: '2rem 0' }}>
      {data && (
        <>
          <h1>{data.profile?.displayName}</h1>
          <div className="card">
            <p>Rating: {data.stats?.rating || 'N/A'}</p>
            <p>Completed Jobs: {data.stats?.completedJobs || 0}</p>
            <p>Total Earnings: {data.stats?.totalEarnings || 0}</p>
            <p>Bio: {data.profile?.bio || 'No bio'}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FreelancerProfile;

