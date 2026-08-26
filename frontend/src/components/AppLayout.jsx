import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Timer, CheckSquare, Trophy, User, LogOut } from "lucide-react";

const AppLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear()
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo" style={{ fontWeight: 700, fontSize: 24, color: 'gray' }}>FOCUS<span>.</span></div>
                <nav>
                    <Link title="Главная" to="/dashboard"><LayoutDashboard />Dashboard</Link>
                    <Link title="Таймер" to="/timer"><Timer />Timer</Link>
                    <Link title="Задачи" to="/tasks"><CheckSquare />Tasks</Link>
                    <Link title="Лидеры" to="/leaderboard"><Trophy />Leaderboards</Link>
                    <Link title="Профиль" to="/user/profile"><User />Profile</Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><LogOut /></button>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;