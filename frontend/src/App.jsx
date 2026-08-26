import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import './App.css'
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";
import Timer from "./components/Timer/Timer.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Task from "./components/Task/Task.jsx";
import Leaderboard from "./components/Leaderboard/Leaderboard.jsx";
import Profile from "./components/Profile/Profile.jsx";

const AppContent = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={!isAuthenticated ? <Login onSwitch={() => navigate('/register')} onSuccess={handleAuthSuccess} /> : <Navigate to='/tasks' /> } />
                <Route path="/register" element={<Registration onSwitch={() => navigate('/')} />} />
                <Route element={<AppLayout />}>
                    <Route path="/timer/:taskId?" element={isAuthenticated ? <Timer /> : <Navigate to='/' /> } />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Task />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/user/profile" element={<Profile />} />
                </Route>
            </Routes>
        </div>
    );
}

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;