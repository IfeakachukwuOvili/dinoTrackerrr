import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('🦖 RAWR! All fields are required to join the Jurassic tribe.');
      return;
    }
    if (password.length < 6) {
      setError('🦴 Your dino password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email /*, password */ }), // Password not saved in backend model yet
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign up');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('username', name);
      navigate('/addplan');
    } catch (err) {
      setError('🦖 ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#98FB98', // Prehistoric jungle green
        padding: '20px',
      }}
    >
      <h2
        style={{
          color: '#8B0000', // Lava red
          fontSize: '24px',
          marginBottom: '20px',
          textAlign: 'center',
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
      >
        🦖 Welcome to the Jurassic Budget Tracker! <br /> Sign Up to Start Your Adventure
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff5e1', // Fossil-like color
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
          width: '320px',
          border: '4px solid #8B4513', // Tree bark frame
        }}
      >
        {error && (
          <p
            style={{
              color: 'red',
              fontSize: '14px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="🦕 Enter your dino name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <input
          type="email"
          placeholder="🦴 Enter your dino email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            marginBottom: '15px',
            border: '2px solid #A0522D',
            borderRadius: '6px',
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#FAF0E6',
          }}
        />
        <input
          type="password"
          placeholder="🦖 Create a strong dino password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            marginBottom: '20px',
            border: '2px solid #A0522D',
            borderRadius: '6px',
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#FAF0E6',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#8B0000', // Lava red
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease, transform 0.1s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#600000')} // Darker lava red on hover
          onMouseOut={(e) => (e.target.style.backgroundColor = '#8B0000')}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          🥚 Hatch My Account
        </button>
      </form>
    </div>
  );
}

export default Signup;
