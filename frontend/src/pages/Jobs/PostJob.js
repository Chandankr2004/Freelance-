import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Cloud & DevOps Sub-Categories
  const cloudDevOpsSubCategories = {
    'cloud-engineering': [
      'Cloud Engineering',
      'DevOps Engineering',
      'Site Reliability Engineering (SRE)',
      'Cloud Infrastructure',
      'Platform Engineering'
    ],
    'cloud-platforms': [
      'AWS Cloud Engineer',
      'Microsoft Azure Engineer',
      'Google Cloud Platform (GCP) Engineer',
      'Multi-Cloud Engineer'
    ],
    'devops-tools': [
      'Docker & Kubernetes',
      'CI/CD Pipeline Engineer',
      'Terraform / Infrastructure as Code (IaC)',
      'Jenkins / GitHub Actions'
    ],
    'cloud-security': [
      'Cloud Security Engineer',
      'IAM & Compliance',
      'Network & Cloud Security'
    ]
  };

  const createJobMutation = useMutation(
    (data) => api.post('/jobs', data),
    {
      onSuccess: (response) => {
        toast.success('Job posted successfully!');
        queryClient.invalidateQueries('jobs');
        navigate(`/jobs/${response.data.data.id}`);
      },
      onError: (error) => {
        console.error('Job posting error:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to post job. Please check all required fields.';
        toast.error(errorMessage);
        
        // Log full error for debugging
        if (error.response?.data) {
          console.error('Error details:', error.response.data);
        }
      }
    }
  );

  const onSubmit = (data) => {
    // Prepare the data for submission
    const jobData = {
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      budget: parseFloat(data.budget), // Convert to number
      currency: data.currency || 'USD',
      budgetType: data.budgetType,
      // Remove subCategory as it's not part of the Job model
      // You can add it to skills or description if needed
      skills: data.subCategory ? [data.subCategory] : []
    };

    console.log('Submitting job data:', jobData); // Debug log
    createJobMutation.mutate(jobData);
  };

  // Show login/signup message if user is not logged in or not a buyer
  if (!user || user.role !== 'buyer') {
    return (
      <div className="post-job-page">
        <div className="container">
          <div className="recruiter-prompt">
            <h1>Post a Job as a Recruiter</h1>
            <p>To post jobs and hire talented freelancers, please log in or sign up as a recruiter.</p>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up as Recruiter</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-job-page">
      <div className="container">
        <h1>Post a Job</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="post-job-form">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className={errors.title ? 'error' : 'input'}
            />
            {errors.title && <span className="error-text">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className={errors.categoryId ? 'error' : 'input'}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                register('categoryId').onChange(e);
              }}
            >
              <option value="">Select Category</option>
              <option value="cloud-engineering">☁️ Cloud & DevOps - Cloud Engineering</option>
              <option value="cloud-platforms">☁️ Cloud Platforms</option>
              <option value="devops-tools">⚙️ DevOps Tools</option>
              <option value="cloud-security">🔐 Cloud Security</option>
              {/* Add more categories as needed */}
            </select>
            {errors.categoryId && <span className="error-text">{errors.categoryId.message}</span>}
          </div>

          {selectedCategory && cloudDevOpsSubCategories[selectedCategory] && (
            <div className="form-group">
              <label>🔹 Sub-Category (Optional but Recommended)</label>
              <select
                {...register('subCategory')}
                className="input"
              >
                <option value="">Select Sub-Category</option>
                {cloudDevOpsSubCategories[selectedCategory].map((subCat, index) => (
                  <option key={index} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Description *</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="10"
              className={errors.description ? 'error' : 'input'}
            />
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget *</label>
              <input
                type="number"
                step="0.01"
                {...register('budget', { required: 'Budget is required', min: 0 })}
                className={errors.budget ? 'error' : 'input'}
              />
              {errors.budget && <span className="error-text">{errors.budget.message}</span>}
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select {...register('currency')} className="input">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Budget Type *</label>
              <select
                {...register('budgetType', { required: 'Budget type is required' })}
                className={errors.budgetType ? 'error' : 'input'}
              >
                <option value="">Select Type</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly</option>
              </select>
              {errors.budgetType && <span className="error-text">{errors.budgetType.message}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={createJobMutation.isLoading}>
            {createJobMutation.isLoading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

