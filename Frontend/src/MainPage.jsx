import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmPopup from './ConfirmPopup';
import Popup from './Popup';
import PlanModal from './PlanModal';
import ProfileModal from './ProfileModal';
import { API_BASE_URL } from './config';
import axios from 'axios';

function MainPage() {
  const navigate = useNavigate();
  // Popup state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showDinoPopup, setShowDinoPopup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Logout functionality
  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
    setShowLogoutPopup(false);
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  // Delete expense confirmation
  const askDeleteExpense = (id) => {
    setExpenseToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/expenses/${expenseToDelete}`);
      if (res.status !== 200) throw new Error('Failed to delete');
      setExpenses(expenses.filter(exp => exp._id !== expenseToDelete));
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setShowDeletePopup(false);
    setExpenseToDelete(null);
  };

  const cancelDeleteExpense = () => {
    setShowDeletePopup(false);
    setExpenseToDelete(null);
  };
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [theme]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    if (email) {
      // Fetch user info
      axios.get(`${API_BASE_URL}/api/users`)
        .then(res => {
          const users = res.data;
          const userObj = users.find(u => u.email === email);
          if (userObj) {
            setUsername(userObj.name);
            setUser(userObj);
          }
        });
      // Fetch all plans
      axios.get(`${API_BASE_URL}/api/plans?userEmail=${encodeURIComponent(email)}`)
        .then(res => {
          const plansData = res.data;
          setPlans(plansData);
          // Try to restore last selected plan
          const lastPlanId = localStorage.getItem('currentPlanId');
          let plan = plansData[0] || null;
          if (lastPlanId) {
            const found = plansData.find(p => p._id === lastPlanId);
            if (found) plan = found;
          }
          setCurrentPlan(plan);
          setTotalBudget(plan ? Number(plan.budget) : 0);
        });
      // Fetch expenses
      axios.get(`${API_BASE_URL}/api/expenses?userEmail=${encodeURIComponent(email)}`)
        .then(res => {
          const data = res.data;
          setExpenses(data);
        })
        .catch(err => console.error('Failed to fetch expenses:', err));
    }
  }, []);

  useEffect(() => {
    const totalSpent = expenses.reduce((acc, expense) => acc + (parseFloat(expense.amount) || 0), 0);
    setSpent(totalSpent);
    setRemaining(totalBudget - totalSpent);
    // Show dino popup if spent > budget or if spent changes (encouragement)
    if (expenses.length > 0) {
      setShowDinoPopup(true);
    }
  }, [expenses, totalBudget]);

  // When currentPlan changes, update totalBudget and persist selection
  useEffect(() => {
    if (currentPlan) {
      setTotalBudget(Number(currentPlan.budget));
      localStorage.setItem('currentPlanId', currentPlan._id);
    }
  }, [currentPlan]);

  // Add or edit expense
  const handleAddOrEditExpense = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('User not logged in!');
      return;
    }
    if (editIndex !== null) {
      // Edit existing
      const expenseToEdit = filteredExpenses[editIndex];
      try {
        const res = await axios.put(`${API_BASE_URL}/api/expenses/${expenseToEdit._id}`, {
          name: expenseName,
          amount: expenseAmount,
          date: expenseDate
        });
        const updated = res.data;
        if (!res.ok) throw new Error(updated.error || 'Failed to update');
        const newExpenses = expenses.map((exp) => exp._id === updated._id ? updated : exp);
        setExpenses(newExpenses);
        setEditIndex(null);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    } else {
      // Add new
      const newExpense = { userEmail, name: expenseName, amount: expenseAmount, date: expenseDate };
      try {
        const res = await axios.post(`${API_BASE_URL}/api/expenses`, newExpense);
        const data = res.data;
        if (res.status !== 201) throw new Error(data.error || 'Failed to add expense');
        setExpenses([...expenses, data]);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
    setExpenseName('');
    setExpenseAmount('');
    setExpenseDate('');
  };

  // (Delete logic now handled by confirmDeleteExpense and askDeleteExpense)


  // Start editing
  const startEdit = (idx) => {
    setEditIndex(idx);
    setExpenseName(filteredExpenses[idx].name);
    setExpenseAmount(filteredExpenses[idx].amount);
    setExpenseDate(filteredExpenses[idx].date);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditIndex(null);
    setExpenseName('');
    setExpenseAmount('');
    setExpenseDate('');
  };

  // Filtering
  const filteredExpenses = expenses.filter(exp =>
    (!filterText || exp.name.toLowerCase().includes(filterText.toLowerCase())) &&
    (!filterDate || exp.date === filterDate)
  );

  const history = useNavigate();

  return (
    <div>
      {/* Logout Button */}
      <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100 }}>
        <button
          onClick={handleLogout}
          style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', padding: '12px 28px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 18 }}
        >
          Logout
        </button>
      </div>
      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <ConfirmPopup
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: theme === 'dark' ? '#23272f' : '#ff6f61',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        color: '#fff',
        fontSize: '36px',
        fontWeight: 'bold'
      }}>
        <div>BudgetFriendly 🦖</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {currentPlan && (
            <span style={{ fontSize: 18, background: '#fff', color: '#ff6f61', borderRadius: 8, padding: '6px 18px', fontWeight: 600 }}>
              Plan: {currentPlan.purpose}
            </span>
          )}
          <button onClick={() => setShowPlanModal(true)} style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 18 }}>
            Manage Plans
          </button>
          <button onClick={() => setShowProfileModal(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: 42, height: 42, cursor: 'pointer', marginLeft: 8, fontSize: 26, color: theme === 'dark' ? '#fff' : '#ff6f61', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <span role="img" aria-label="profile">👤</span>
          </button>
        </div>
      </header>
      {showPlanModal && (
        <PlanModal
          userEmail={userEmail}
          currentPlanId={currentPlan ? currentPlan._id : ''}
          onClose={() => setShowPlanModal(false)}
          onPlanSwitch={plan => setCurrentPlan(plan)}
          onPlanCreated={plan => { setPlans(plans => [...plans, plan]); setCurrentPlan(plan); }}
        />
      )}
      {showProfileModal && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onSave={async (editUser) => {
            const res = await axios.put(`${API_BASE_URL}/api/users/${editUser._id}`, editUser);
            if (res.status === 200) {
              setUser(editUser);
              setUsername(editUser.name);
            }
          }}
          theme={theme}
          onThemeToggle={() => {
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
          }}
        />
      )}

      {/* Welcome Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        color: '#3b5d5c',
        fontSize: '20px',
        fontWeight: '500',
      }}>
        <div>Welcome back, {username}!</div>
      </div>

      {/* Budget Overview Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div>Total Budget</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalBudget.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>Spent</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6f61' }}>${spent.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>Remaining</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>${remaining.toFixed(2)}</div>
        </div>
      </div>

      {/* Expense Input Form */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <form onSubmit={handleAddOrEditExpense} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Expense Name" 
            value={expenseName} 
            onChange={(e) => setExpenseName(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '5px', fontSize: '16px' }}
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={expenseAmount} 
            onChange={(e) => setExpenseAmount(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '5px', fontSize: '16px' }}
          />
          <input 
            type="date" 
            value={expenseDate} 
            onChange={(e) => setExpenseDate(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '5px', fontSize: '16px' }}
          />
          <button type="submit" 
          style={{ padding: '10px', margin: '5px', borderRadius: '5px', cursor: 'pointer' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}>
            Submit ✅
          </button>
        </form>
      </div>

      {/* Expense List Table */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <table 
          border="1" 
          style={{
            background: '#444', 
            color: '#fff', 
            padding: '10px', 
            width: '80%', 
            textAlign: 'left',
            borderRadius: '8px',
            marginBottom: '30px',
          }}
        >
          <caption style={{ fontSize: '16px', marginBottom: '10px' }}>Expense List</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.name}</td>
                <td>${expense.amount}</td>
                <td>{expense.date ? expense.date.slice(0, 10) : ''}</td>
                <td>
                  <button onClick={() => startEdit(index)} style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 12px', marginRight: '8px', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                  <button onClick={() => askDeleteExpense(expense._id)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontWeight: 500 }}>Delete</button> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <ConfirmPopup
          message="Are you sure you want to delete this expense?"
          onConfirm={confirmDeleteExpense}
          onCancel={cancelDeleteExpense}
        />
      )}
      {/* Dino Popup for spent/budget */}
      {showDinoPopup && (
        <Popup
          spent={spent}
          budget={totalBudget}
          onClose={() => setShowDinoPopup(false)}
        />
      )}
    </div>
  );
}

export default MainPage;
