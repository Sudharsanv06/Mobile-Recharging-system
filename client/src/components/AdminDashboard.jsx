import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [operators, setOperators] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingOperator, setEditingOperator] = useState(null);
  const [showOperatorForm, setShowOperatorForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    operator: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, operatorsRes] = await Promise.all([
        api.get('/api/v1/admin/stats'),
        api.get('/api/v1/admin/operators'),
      ]);
      setStats(statsRes.data.data);
      setOperators(operatorsRes.data.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadRecharges = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.operator) params.append('operator', filters.operator);

      const res = await api.get(`/api/v1/admin/recharges?${params.toString()}`);
      setRecharges(res.data.data);
    } catch (error) {
      toast.error('Failed to load recharges');
    }
  };

  useEffect(() => {
    if (activeTab === 'recharges') {
      loadRecharges();
    }
  }, [activeTab, filters]);

  const handleCreateOperator = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const operatorData = {
      name: formData.get('name'),
      logo: formData.get('logo'),
      plans: JSON.parse(formData.get('plans') || '[]'),
    };

    try {
      await api.post('/api/v1/admin/operators', operatorData);
      toast.success('Operator created successfully');
      setShowOperatorForm(false);
      loadData();
    } catch (error) {
      toast.error('Failed to create operator');
    }
  };

  const handleUpdateOperator = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const operatorData = {
      name: formData.get('name'),
      logo: formData.get('logo'),
      plans: JSON.parse(formData.get('plans') || '[]'),
    };

    try {
      await api.put(`/api/v1/admin/operators/${editingOperator._id}`, operatorData);
      toast.success('Operator updated successfully');
      setEditingOperator(null);
      loadData();
    } catch (error) {
      toast.error('Failed to update operator');
    }
  };

  const handleDeleteOperator = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operator?')) return;

    try {
      await api.delete(`/api/v1/admin/operators/${id}`);
      toast.success('Operator deleted successfully');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete operator');
    }
  };

  const handleUpdateRechargeStatus = async (rechargeId, status) => {
    try {
      await api.post(`/api/v1/admin/recharges/${rechargeId}/dispute`, { status });
      toast.success('Recharge status updated');
      loadRecharges();
    } catch (error) {
      toast.error('Failed to update recharge status');
    }
  };

  if (loading) {
    return <div className="admin-dashboard-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'operators' ? 'active' : ''}
          onClick={() => setActiveTab('operators')}
        >
          Operators
        </button>
        <button
          className={activeTab === 'recharges' ? 'active' : ''}
          onClick={() => setActiveTab('recharges')}
        >
          Recharges
        </button>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="admin-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.overview.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Operators</h3>
              <p className="stat-value">{stats.overview.totalOperators}</p>
            </div>
            <div className="stat-card">
              <h3>Total Recharges</h3>
              <p className="stat-value">{stats.overview.totalRecharges}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-value">{stats.overview.completedRecharges}</p>
            </div>
            <div className="stat-card">
              <h3>Failed</h3>
              <p className="stat-value">{stats.overview.failedRecharges}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p className="stat-value">{stats.overview.pendingRecharges}</p>
            </div>
            <div className="stat-card revenue">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.revenue.total.toLocaleString()}</p>
            </div>
            <div className="stat-card revenue">
              <h3>Today's Revenue</h3>
              <p className="stat-value">₹{stats.revenue.today.toLocaleString()}</p>
            </div>
          </div>

          {stats.topOperators && stats.topOperators.length > 0 && (
            <div className="top-operators">
              <h2>Top Operators by Revenue</h2>
              <div className="operators-list">
                {stats.topOperators.map((item, idx) => (
                  <div key={idx} className="operator-item">
                    <span>{item.operator?.name || 'Unknown'}</span>
                    <span>₹{item.revenue.toLocaleString()}</span>
                    <span>{item.count} recharges</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'operators' && (
        <div className="admin-operators">
          <div className="operators-header">
            <h2>Operators Management</h2>
            <button onClick={() => {
              setEditingOperator(null);
              setShowOperatorForm(true);
            }} className="btn-primary">
              Add Operator
            </button>
          </div>

          {showOperatorForm && (
            <div className="operator-form-modal">
              <div className="modal-content">
                <h3>{editingOperator ? 'Edit' : 'Create'} Operator</h3>
                <form onSubmit={editingOperator ? handleUpdateOperator : handleCreateOperator}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Operator Name"
                    defaultValue={editingOperator?.name}
                    required
                  />
                  <input
                    type="url"
                    name="logo"
                    placeholder="Logo URL"
                    defaultValue={editingOperator?.logo}
                    required
                  />
                  <textarea
                    name="plans"
                    placeholder='Plans JSON: [{"amount": 10, "validity": "28 days", "description": "Plan description"}]'
                    defaultValue={JSON.stringify(editingOperator?.plans || [], null, 2)}
                    rows="10"
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Save</button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOperatorForm(false);
                        setEditingOperator(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="operators-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Logo</th>
                  <th>Plans Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op) => (
                  <tr key={op._id}>
                    <td>{op.name}</td>
                    <td>
                      <img src={op.logo} alt={op.name} className="operator-logo-small" />
                    </td>
                    <td>{op.plans?.length || 0}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingOperator(op);
                          setShowOperatorForm(true);
                        }}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOperator(op._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'recharges' && (
        <div className="admin-recharges">
          <h2>Recharges Management</h2>

          <div className="recharge-filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              placeholder="End Date"
            />
            <select
              value={filters.operator}
              onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
            >
              <option value="">All Operators</option>
              {operators.map((op) => (
                <option key={op._id} value={op._id}>
                  {op.name}
                </option>
              ))}
            </select>
          </div>

          <div className="recharges-table">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Operator</th>
                  <th>Mobile</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recharges.map((recharge) => (
                  <tr key={recharge._id}>
                    <td>{recharge.transactionId}</td>
                    <td>{recharge.user?.name || recharge.user?.email}</td>
                    <td>{recharge.operator?.name || 'N/A'}</td>
                    <td>{recharge.mobileNumber}</td>
                    <td>₹{recharge.amount}</td>
                    <td>
                      <span className={`status-badge status-${recharge.status}`}>
                        {recharge.status}
                      </span>
                    </td>
                    <td>{new Date(recharge.createdAt).toLocaleDateString()}</td>
                    <td>
                      {recharge.status !== 'success' && (
                        <button
                          onClick={() => handleUpdateRechargeStatus(recharge._id, 'success')}
                          className="btn-success"
                        >
                          Mark Success
                        </button>
                      )}
                      {recharge.status !== 'failed' && (
                        <button
                          onClick={() => handleUpdateRechargeStatus(recharge._id, 'failed')}
                          className="btn-danger"
                        >
                          Mark Failed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

