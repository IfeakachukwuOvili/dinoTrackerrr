import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConfirmPopup from './ConfirmPopup';
import { API_BASE_URL } from './config';
import axios from 'axios';

const ProfileModal = ({ user, onClose, onSave, theme, onThemeToggle, onLogout }) => {
  const [editUser, setEditUser] = useState(user || {});
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    if (!editUser.name || !editUser.email) {
      setError('Name and Email are required');
      return;
    }
    await onSave(editUser);
    setEditMode(false);
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = (window && window.location) ? (path) => { window.location.href = path; } : () => {};

  if (!user) {
    return (
      <div style={styles.overlay}>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={styles.modal(theme)}>
          <div style={{ textAlign: 'center', padding: 32 }}>Loading profile...</div>
          <button onClick={onClose} style={{ ...styles.closeBtn, marginTop: 24 }}>Close</button>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
            <button
              style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              onClick={() => setShowDeletePopup(true)}
            >
              Delete Account
            </button>
          </div>
          {showDeletePopup && (
            <ConfirmPopup
              message="Are you sure you want to delete your account? This cannot be undone."
              onConfirm={handleDeleteAccount}
              onCancel={() => setShowDeletePopup(false)}
            />
          )}
        </motion.div>
      </div>
    );
  }

  // Delete account handler
  const handleDeleteAccount = async () => {
    setShowDeletePopup(false);
    try {
      if (!user || !user._id) {
        alert('User not loaded or missing ID.');
        return;
      }
      await axios.delete(`${API_BASE_URL}/api/users/${user._id}`);
      localStorage.clear();
      if (onClose) onClose();
      navigate('/');
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  return (
    <div style={styles.overlay}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={styles.modal(theme)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Profile</h2>
          <button onClick={onClose} style={styles.closeBtn}>✖</button>
        </div>
        <div style={{ margin: '18px 0' }}>
          <div style={styles.row}>
            <label>Name:</label>
            {editMode ? (
              <input name="name" value={editUser.name || ''} onChange={handleChange} style={styles.input(theme)} />
            ) : (
              <span>{user.name || ''}</span>
            )}
          </div>
          <div style={styles.row}>
            <label>Email:</label>
            {editMode ? (
              <input name="email" value={editUser.email || ''} onChange={handleChange} style={styles.input(theme)} />
            ) : (
              <span>{user.email || ''}</span>
            )}
          </div>
          <div style={styles.row}>
            <label>Age:</label>
            {editMode ? (
              <input name="age" value={editUser.age || ''} onChange={handleChange} style={styles.input(theme)} />
            ) : (
              <span>{user.age || ''}</span>
            )}
          </div>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
          <div>
            <button onClick={() => setEditMode(!editMode)} style={styles.editBtn(theme)}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
            {editMode && (
              <button onClick={handleSave} style={styles.saveBtn(theme)}>
                Save
              </button>
            )}
          </div>
          <div>
            <span style={{ marginRight: 8 }}>Theme:</span>
            <button onClick={onThemeToggle} style={styles.themeBtn(theme)}>
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
          <button
            style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
            onClick={() => setShowDeletePopup(true)}
          >
            Delete Account
          </button>
        </div>
        {showDeletePopup && (
          <ConfirmPopup
            message="Are you sure you want to delete your account? This cannot be undone."
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeletePopup(false)}
          />
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
    zIndex: 2100,
  },
  modal: (theme) => ({
    background: theme === 'dark' ? '#23272f' : '#fff',
    color: theme === 'dark' ? '#fff' : '#222',
    borderRadius: 12,
    padding: '30px 30px 20px 30px',
    minWidth: 350,
    maxWidth: 400,
    boxShadow: '0 6px 32px rgba(0,0,0,0.18)',
    position: 'relative',
  }),
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#666',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    fontSize: 17,
  },
  input: (theme) => ({
    padding: '7px 10px',
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: 16,
    background: theme === 'dark' ? '#23272f' : '#fff',
    color: theme === 'dark' ? '#fff' : '#222',
  }),
  editBtn: (theme) => ({
    background: theme === 'dark' ? '#1976d2' : '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    padding: '7px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginRight: 8,
  }),
  saveBtn: (theme) => ({
    background: theme === 'dark' ? '#28a745' : '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    padding: '7px 16px',
    fontWeight: 600,
    cursor: 'pointer',
  }),
  themeBtn: (theme) => ({
    background: theme === 'dark' ? '#444' : '#eee',
    color: theme === 'dark' ? '#fff' : '#222',
    border: 'none',
    borderRadius: 5,
    padding: '7px 16px',
    fontWeight: 600,
    cursor: 'pointer',
  }),
};

export default ProfileModal;
