import React from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const Transactions = () => {
  const { data: transactions, isLoading } = useQuery(
    'transactions',
    () => api.get('/payments/transactions').then(res => res.data.data)
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
      <h1>Transactions</h1>
      <div className="card">
        {transactions && transactions.length > 0 ? (
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id}>
                  <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td>{txn.type}</td>
                  <td>{txn.currency} {txn.amount}</td>
                  <td>{txn.description}</td>
                  <td>{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;

