import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from './config';
import axios from 'axios';

const PlanModal = ({
  userEmail,
  currentPlanId,
  onClose,
  onPlanSwitch,
  onPlanCreated,
}) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlan, setNewPlan] = useState({ purpose: '', amount: '', budget: '', deadline: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userEmail) return;
    axios.get(`${API_BASE_URL}/api/plans?userEmail=${encodeURIComponent(userEmail)}`)
      .then(res => {
        const data = res.data;
        setPlans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userEmail, showCreate]);

  const handleSwitch = (plan) => {
    onPlanSwitch(plan);
    onClose();
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Delete this plan?')) return;
    await axios.delete(`${API_BASE_URL}/api/plans/${planId}`);
    setPlans(plans.filter(p => p._id !== planId));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPlan.purpose || !newPlan.amount || !newPlan.budget || !newPlan.deadline) {
      setError('All fields required');
      return;
    }
    const res = await axios.post(`${API_BASE_URL}/api/plans`, { ...newPlan, userEmail });
    if (res.status !== 201) {
      const errorText = await res.text();
      console.error('Failed to create plan:', res.status, errorText);
      setError('Failed to create plan');
      return;
    }
    const plan = await res.json();
    setPlans([...plans, plan]);
    setShowCreate(false);
    setNewPlan({ purpose: '', amount: '', budget: '', deadline: '' });
    onPlanCreated(plan);
  };

  return (
    <div style={styles.overlay}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={styles.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Plans</h2>
          <button onClick={onClose} style={styles.closeBtn}>✖</button>
        </div>
        {loading ? <div>Loading...</div> : (
          <>
            <ul style={styles.planList}>
              {plans.map(plan => (
                <li key={plan._id} style={{ ...styles.planItem, background: plan._id === currentPlanId ? '#d1e7dd' : '#f8f9fa' }}>
                  <div>
                    <strong>{plan.purpose}</strong> <span style={{ fontSize: 15, color: '#555' }}>Budget: ${plan.budget} | Deadline: {plan.deadline}</span>
                  </div>
                  <div>
                    {plan._id !== currentPlanId && <button style={{ ...styles.switchBtn, fontSize: 18, padding: '2px 6px', marginRight: 6 }} title="Switch" onClick={() => handleSwitch(plan)}>
  <span role="img" aria-label="switch">🔄</span>
</button>}
                    <button style={{ ...styles.deleteBtn, fontSize: 18, padding: '2px 6px', marginLeft: 6 }} title="Delete" onClick={() => handleDelete(plan._id)}>
  <span role="img" aria-label="delete">🗑️</span>
</button>
                  </div>
                </li>
              ))}
            </ul>
            <button style={styles.createBtn} onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? 'Cancel' : 'Create New Plan'}
            </button>
            {showCreate && (
              <form onSubmit={handleCreate} style={styles.form}>
                <input
                  placeholder="Purpose"
                  value={newPlan.purpose}
                  onChange={e => setNewPlan({ ...newPlan, purpose: e.target.value })}
                  style={styles.input}
                />
                <input
                  placeholder="Amount"
                  type="number"
                  value={newPlan.amount}
                  onChange={e => setNewPlan({ ...newPlan, amount: e.target.value })}
                  style={styles.input}
                />
                <input
                  placeholder="Budget"
                  type="number"
                  value={newPlan.budget}
                  onChange={e => setNewPlan({ ...newPlan, budget: e.target.value })}
                  style={styles.input}
                />
                <input
                  placeholder="Deadline"
                  type="date"
                  value={newPlan.deadline}
                  onChange={e => setNewPlan({ ...newPlan, deadline: e.target.value })}
                  style={styles.input}
                />
                <button type="submit" style={styles.saveBtn}>Save</button>
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
              </form>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    padding: '30px 30px 20px 30px',
    minWidth: 400,
    maxWidth: 500,
    boxShadow: '0 6px 32px rgba(0,0,0,0.18)',
    position: 'relative',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#666',
  },
  planList: {
    listStyle: 'none',
    padding: 0,
    margin: '18px 0',
    maxHeight: 200,
    overflowY: 'auto',
  },
  planItem: {
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #eee',
  },
  switchBtn: {
    background: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    padding: '5px 12px',
    marginRight: 8,
    cursor: 'pointer',
    fontWeight: 500,
  },
  deleteBtn: {
    background: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    padding: '5px 12px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  createBtn: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    padding: '8px 22px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 10,
  },
  form: {
    marginTop: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    padding: '8px 10px',
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  saveBtn: {
    background: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    padding: '8px 18px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
};

export default PlanModal;
