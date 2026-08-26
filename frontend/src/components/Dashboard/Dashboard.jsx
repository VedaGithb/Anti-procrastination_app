import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ todayMinutes: 0, todaySessions: 0, streak: 0 });
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Токен отсутствует в localStorage!");
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                // Логируем, чтобы увидеть, что именно отвечает сервер
                const resStats = await axios.get('/sessions/stats', { headers });
                console.log("Stats Response:", resStats.data);

                const resLeader = await axios.get('/sessions/leaderboard', { headers });
                console.log("Leaderboard Response:", resLeader.data);

                const resChart = await axios.get('/user/profile', { headers });
                console.log("ChartData:", resChart.data);

                if (resChart.data && Array.isArray(resChart.data.chartData)) {
                    setChartData(resChart.data.chartData);
                }

                // Обновляем стейт с проверкой на существование данных
                setStats({
                    todayMinutes: resStats.data.todayMinutes || 0,
                    todaySessions: resStats.data.todaySessions || 0,
                    streak: resStats.data.streak || 0,
                });

                // Проверяем, что пришел массив
                if (Array.isArray(resLeader.data)) {
                    setLeaderboard(resLeader.data.slice(0, 3));
                }

            } catch (err) {
                console.error("Ошибка при запросе к БД:", err.response?.data || err.message);
                // Если сервер не отвечает, можно поставить заглушки для теста:
                // setStats({ todayMinutes: 120, todaySessions: 4 });
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <header className="dash-header">
                <div className="header-title">
                    <h2>DASHBOARD</h2>
                    <p>Productive Silence</p>
                </div>
                <div className="header-actions">
                    <div className="search-bar">
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Search tasks..." />
                    </div>
                    <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="icon-btn"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </header>

            <main className="bento-grid">
                {/* Главная карточка */}
                <section className="bento-item hero-card">
                    <div className="card-content">
                        <div className="status-badge">
                            <span className="dot"></span> LIVE FOCUS SESSION
                        </div>
                        <h1>Deep Work Flow</h1>
                        <p className="card-desc">Вы сфокусированы на {stats.todayMinutes} минут сегодня. Это отличный показатель!</p>

                        <div className="card-footer">
                            <div className="stats-row">
                                <div className="stat-unit">
                                    <span className="label">TIME TODAY</span>
                                    <span className="value">{stats.todayMinutes}m</span>
                                </div>
                                <div className="stat-unit">
                                    <span className="label">SESSIONS</span>
                                    <span className="value">{stats.todaySessions}</span>
                                </div>
                            </div>
                            <button className="primary-btn">Pause Session</button>
                        </div>
                    </div>
                    <div className="glow-effect"></div>
                </section>

                {/* Стрик */}
                <section className="bento-item streak-card">
                    <div className="streak-icon">
                        <span className="material-symbols-outlined fire">local_fire_department</span>
                        <span className="streak-number">{stats.streak}</span>
                    </div>
                    <h3>Days Streak</h3>
                    <p>Вы в топе 5% пользователей месяца!</p>
                </section>

                {/* Лидерборд */}
                <section className="bento-item leaderboard-card">
                    <div className="card-header">
                        <h3>Leaderboard</h3>
                        <p>Top Performers</p>
                    </div>
                    <div className="user-list">
                        {leaderboard.map((user, i) => (
                            <div key={i} className={`user-item ${i === 0 ? 'top-user' : ''}`}>
                                <span className="rank">{i + 1}</span>
                                <span className="name">{user.username}</span>
                                <span className="sub">{user.minutes} min focused</span>
                                {i === 0 && <span className="material-symbols-outlined crown">workspace_premium</span>}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Активность */}
                <section className="bento-item activity-card">
                    <h3>Weekly Activity</h3>
                    <div className="chart-container">
                        {chartData.map((h, i) => (
                            <div key={i} className="chart-bar-wrapper">
                                <div className="bar" style={{ height: `${h}%` }}></div>
                                <span className="day-label">DAY {i+1}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

