import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`);
      const users = res.data;
      const user = users.find(u => u.email === email);
      if (!user) throw new Error('Dino not found! Check your email or sign up.');
      localStorage.setItem('userEmail', email);
      navigate('/mainpage');
    } catch (err) {
      setError('🦖 ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#7FDBFF', // Light blue like the Jurassic sky
        padding: '20px',
      }}
    >
      <h2
        style={{
          color: '#228B22', // Dino green
          fontSize: '24px',
          marginBottom: '20px',
          textAlign: 'center',
          fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fun and playful
        }}
      >
        🦖 Welcome Back, Dino-Tamer! <br /> Log in to Your Jurassic Budget Tracker
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff8dc', // Fossil-like parchment
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <input
          type="email"
          placeholder="🦕 Enter your dino email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            marginBottom: '15px',
            border: '2px solid #A0522D', // Earthy brown
            borderRadius: '6px',
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#FAF0E6', // Soft beige
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#228B22', // Dino green
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease, transform 0.1s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#006400')} // Darker green on hover
          onMouseOut={(e) => (e.target.style.backgroundColor = '#228B22')}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          🦖 Stomp In
        </button>
      </form>
      <div style={{ marginTop: 18, fontSize: 15, color: '#444', textAlign: 'center' }}>
        New here?{' '}
        <button
          style={{
            background: 'none',
            color: '#228B22',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 15,
          }}
          onClick={() => navigate('/signup')}
        >
          Sign up for a Jurassic adventure!
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
