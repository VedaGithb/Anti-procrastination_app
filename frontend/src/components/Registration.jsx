import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User } from 'lucide-react';
import '../App.css';

const Registration = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('auth/register', { username, email, password })
            alert('Successfully registered!')
            onSwitch();
        } catch (error) {
            alert(error)
        }
    };

    return (
        <div className="login-card">
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <User className="input-icon" size={20}/>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div>
                <div className="input-group">
                    <Mail className="input-icon" size={20}/>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className="input-group">
                    <Lock className="input-icon" size={20}/>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button className="login-btn" type="submit">Создать аккаунт</button>
            </form>
            <p className="switch-text">Уже есть аккаунт? <span onClick={onSwitch}>Войти</span></p>
        </div>
    )
}

export default Registration;