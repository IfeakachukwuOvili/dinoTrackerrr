import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPlan = () => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isGreeting, setIsGreeting] = useState(true);
  const [answers, setAnswers] = useState({
    purpose: '',
    amount: '',
    budget: '',
    deadline: '',
  });

  const username = localStorage.getItem('username') || '';

  const questions = [
    `Hey ${username}! What’s your savings goal? (e.g., a vacation, a new laptop, emergency fund)`,
    `Awesome, ${username}! How much do you want to save for this goal?`,
    `Got it, ${username}. How much can you set aside regularly to stay on track?`,
    `Last question, ${username} — when would you like to reach this savings goal?`,
  ];
  

  // Fetch plan from backend on mount
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetch(`http://localhost:5000/api/plans?userEmail=${encodeURIComponent(userEmail)}`)
        .then(res => res.ok ? res.json() : null)
        .then(plans => {
          if (Array.isArray(plans) && plans.length > 0) {
            const plan = plans[0];
            setAnswers({
              purpose: plan.purpose || '',
              amount: plan.amount || '',
              budget: plan.budget || '',
              deadline: plan.deadline || '',
            });
            setQuestionIndex(4); // Skip to end if plan exists
          } else {
            setAnswers({
              purpose: '',
              amount: '',
              budget: '',
              deadline: '',
            });
            setQuestionIndex(0);
          }
        })
        .catch(err => console.error('Failed to fetch plan:', err));
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (questionIndex < 4) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        // On last question, submit plan to backend
        handleSubmitPlan();
      }
    }
  };

  const handleSubmitPlan = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('User not logged in!');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save plan');
      // Optionally show success message or navigate
      navigate('/mainpage');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [answers.purpose, questionIndex]);

  const handleFinish = () => {
    const savedPlans = JSON.parse(localStorage.getItem('plans')) || [];
    savedPlans.push({ purpose: answers.purpose });
    localStorage.setItem('plans', JSON.stringify(savedPlans));
    navigate('/mainpage');
  };

  return (
    <div 
      role="main" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#228B22', // forest green color
        fontFamily: 'Press Start 2P, sans-serif',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
      }}
    >

      {/* Dino & Progress Bar */}
      <div 
        role="progressbar" 
        aria-valuenow={(questionIndex / 4) * 100} 
        aria-valuemin="0" 
        aria-valuemax="100"
        style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img 
          src="https://i.imgur.com/YhMoOES.png" 
          alt="Pixelated dinosaur running" 
          style={{
            width: '50px',
            height: '50px',
            transition: 'transform 0.3s ease-in-out',
            transform: `translateY(${questionIndex > 0 ? '-20px' : '0px'})`
          }} 
        />
        <div 
          style={{
            width: '50%',
            height: '8px',
            background: '#666',
            borderRadius: '5px',
            marginLeft: '10px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div 
            style={{
              height: '100%',
              background: '#00ff00',
              width: `${(questionIndex / 4) * 100}%`,
              transition: 'width 0.5s',
            }}
          ></div>
        </div>
      </div>

      {/* Question Box */}
      <div 
        role="dialog" 
        aria-labelledby="question-box"
        style={{
          background: '#444',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '5px 5px 0px #000',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          animation: 'fadeIn 0.5s ease-in-out',
          color: '#fff',
        }}
      >
        {isGreeting && questionIndex === 0 && (
          <div>
            <h2 style={{ fontSize: '14px' }}>Hey, {username}! Ready to save? 🦖</h2>
            <p style={{ fontSize: '10px' }}>Press ENTER to start</p>
          </div>
        )}

        {/* For questions 1-3, keep Enter-to-advance */}
        {questionIndex > 0 && questionIndex < questions.length && (
          <form onSubmit={e => e.preventDefault()} aria-label="User Answer Input">
            <h2 id="question-box" style={{ fontSize: '14px' }}>{questions[questionIndex - 1]}</h2>
            <input
              type={questionIndex === 3 ? "number" : "text"}
              value={answers[Object.keys(answers)[questionIndex - 1]]}
              onChange={e => setAnswers({ ...answers, [Object.keys(answers)[questionIndex - 1]]: e.target.value })}
              required
              aria-label="Enter your answer"
              style={{
                width: '90%',
                padding: '10px',
                marginTop: '10px',
                borderRadius: '5px',
                border: '2px solid #000',
                fontSize: '12px',
                fontFamily: 'Press Start 2P, sans-serif',
                textAlign: 'center',
                background: '#222',
                color: '#fff',
              }}
            />
            <p style={{ fontSize: '10px', marginTop: '5px' }}>Press ENTER to continue</p>
          </form>
        )}
        {/* For the last question, show a Finish button */}
        {questionIndex === questions.length && (
          <form onSubmit={e => { e.preventDefault(); handleSubmitPlan(); }} aria-label="User Answer Input">
            <h2 id="question-box" style={{ fontSize: '14px' }}>{questions[questionIndex - 1]}</h2>
            <input
              type="date"
              value={answers.deadline}
              onChange={e => setAnswers({ ...answers, deadline: e.target.value })}
              required
              aria-label="Enter your answer"
              style={{
                width: '90%',
                padding: '10px',
                marginTop: '10px',
                borderRadius: '5px',
                border: '2px solid #000',
                fontSize: '12px',
                fontFamily: 'Press Start 2P, sans-serif',
                textAlign: 'center',
                background: '#222',
                color: '#fff',
              }}
            />
            <button type="submit" style={{ marginTop: '10px', padding: '8px 18px', background: '#00ff00', color: '#222', border: 'none', borderRadius: '5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Press Start 2P, sans-serif' }}>Finish</button>
          </form>
        )}

        {questionIndex > questions.length && (
          <div>
            <h2 style={{ fontSize: '14px' }}>🎉 Done, {username}! Your plan is set!</h2>
            <button 
              onClick={() => navigate('/mainpage')}
              aria-label="Finish setup"
              style={{
                padding: '10px',
                backgroundColor: '#00ff00',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                fontFamily: 'Press Start 2P, sans-serif',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              Finish 🦖
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPlan;
