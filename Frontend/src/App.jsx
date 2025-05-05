import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./LoginPage";
import MainPage from "./MainPage"; 
import SignUp from "./SignUp";
import AddPlan from "./AddPlan";
import PlanList from "./PlanList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/addplan" element={<AddPlan />} />
                <Route path="/planlist" element={<PlanList />} />
            </Routes>
        </Router>
        
    );
}

export default App;
