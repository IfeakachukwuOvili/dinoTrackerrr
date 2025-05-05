import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Popup = ({ spent, budget, onClose }) => {
  const [message, setMessage] = useState('');
  const [dinoState, setDinoState] = useState('alive');

  useEffect(() => {
    if (spent > budget) {
      setMessage('Oh no! The dinosaur has died 💀');
      setDinoState('dead');
    } else {
      setMessage('Good job! Keep saving! 🦖');
      setDinoState('alive');
    }
  }, [spent, budget]);

  return (
    <div style={styles.overlay}>
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        exit={{ scale: 0 }} 
        style={styles.popup}
      >
        <h2>{message}</h2>
        <div style={styles.dinoContainer}>
          {dinoState === 'alive' ? (
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
              🦖
            </motion.div>
          ) : (
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
              💀
            </motion.div>
          )}
        </div>
        <button onClick={onClose} style={styles.button}>Close</button>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
  },
  dinoContainer: {
    fontSize: '50px',
    margin: '20px 0',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#f28d42',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
  }
};

export default Popup;
