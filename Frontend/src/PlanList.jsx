import React, { useState } from 'react';

const PlanList = ({ savedPlans }) => {
  // Function to handle opening the expenses page for a given plan purpose
  const openExpensesPage = (purpose) => {
    console.log(`Opening expenses page for: ${purpose}`);
    // You can replace the above line with actual page navigation logic if needed
  };

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {savedPlans.length > 0 ? (
        savedPlans.map((plan, index) => (
          <li key={index} style={{ margin: '10px 0' }}>
            <a
              href="#"
              onClick={() => openExpensesPage(plan.purpose)}
              style={{ textDecoration: 'none', fontSize: '18px', color: '#007bff', cursor: 'pointer' }}
            >
              {plan.purpose}
            </a>
          </li>
        ))
      ) : (
        <li style={{ fontSize: '16px', color: '#777' }}>No plans available.</li>
      )}
    </ul>
  );
};

export default PlanList;
