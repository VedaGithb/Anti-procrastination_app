import '../App.css'
import  {useState} from "react";
import { Mail, Lock} from 'lucide-react';
import axios from "axios";

const Login = ({ onSwitch, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/login", { email, password });
            console.log(res.data);

            localStorage.setItem("token", res.data);
            alert("Logged in successfully!");
            onSwitch();
            onSuccess();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="login-card">
            <h2>Вход в FocusUp</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="login-btn">Войти</button>
            </form>
            <p className="switch-text">Нет аккаунта? <span onClick={onSwitch}>Зарегестрироваться</span></p>
            <a href="#" className="forgot-link">Забыли пароль?</a>
        </div>
    )
}

export default Login;