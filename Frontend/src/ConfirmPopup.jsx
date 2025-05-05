import React from 'react';
import { motion } from 'framer-motion';

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={styles.overlay}>
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        exit={{ scale: 0 }} 
        style={styles.popup}
      >
        <h2>{message}</h2>
        <div style={styles.buttonContainer}>
          <button style={{...styles.button, background: '#4caf50'}} onClick={onConfirm}>Yes</button>
          <button style={{...styles.button, background: '#f44336'}} onClick={onCancel}>No</button>
        </div>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    background: '#fff',
    borderRadius: '10px',
    padding: '30px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    textAlign: 'center',
    minWidth: '300px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  button: {
    padding: '10px 25px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default ConfirmPopup;
