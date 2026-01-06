import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './Profile.css';

const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const { data: profile, isLoading } = useQuery(
    'profile',
    () => api.get('/profile').then(res => res.data.data),
    {
      onSuccess: (data) => {
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          displayName: data.displayName || '',
          bio: data.bio || '',
          location: data.location || '',
          hourlyRate: data.hourlyRate || '',
          currency: data.currency || 'USD'
        });
      }
    }
  );

  const updateProfileMutation = useMutation(
    (data) => {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(data).forEach(key => {
        if (key !== 'avatar' && data[key] !== undefined) {
          formDataToSend.append(key, data[key]);
        }
      });

      // Add avatar file if selected
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      return api.put('/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        queryClient.invalidateQueries('profile');
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      },
      onError: (error) => {
        console.error('Profile update error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
        toast.error(errorMessage);
      }
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only send fields that have values
    const dataToSend = { ...formData };
    // Remove empty strings
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === '') {
        delete dataToSend[key];
      }
    });
    updateProfileMutation.mutate(dataToSend);
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (profile?.avatar) {
      // If avatar is a full URL, return it, otherwise prepend API URL
      if (profile.avatar.startsWith('http')) {
        return profile.avatar;
      }
      return `http://localhost:5000${profile.avatar}`;
    }
    return null;
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
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-card">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-container">
                {getAvatarUrl() ? (
                  <img src={getAvatarUrl()} alt="Profile" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile?.displayName?.charAt(0)?.toUpperCase() || profile?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="avatar-upload">
                  <label htmlFor="avatar-upload" className="btn btn-outline">
                    {avatarFile ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  {avatarFile && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="input"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="City, Country"
                  />
                </div>

                {profile?.user?.role === 'freelancer' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Hourly Rate</label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        className="input"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={updateProfileMutation.isLoading}>
                    {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <h2>{profile?.displayName || 'No name set'}</h2>
                <p className="profile-email">{profile?.user?.email}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-label">Profile Completion</span>
                    <span className="stat-value">{profile?.profileCompletion || 0}%</span>
                  </div>
                  {profile?.user?.role === 'freelancer' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{profile?.rating || 'N/A'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Total Earnings</span>
                        <span className="stat-value">
                          {profile?.currency || 'USD'} {profile?.totalEarnings || 0}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="profile-details">
                  <p><strong>Location:</strong> {profile?.location || 'Not set'}</p>
                  <p><strong>Bio:</strong> {profile?.bio || 'No bio yet'}</p>
                  {profile?.user?.role === 'freelancer' && (
                    <p><strong>Hourly Rate:</strong> {profile?.currency || 'USD'} {profile?.hourlyRate || 'Not set'}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
