import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: "Loading...",
        title: "...",
        joinedDate: "...",
        totalHours: 0,
        weeklyIncrease: 0,
        sessionsCompleted: 0,
        chartData: [0, 0, 0, 0, 0, 0, 0] // Данные для графика пн-вс
    });
    const [loading, setLoading] = useState(true);

    // Состояния для переключателей
    const [soundsEnabled, setSoundsEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:3000/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке профиля:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleToggleSounds = async () => {
        const newValue = !soundsEnabled;
        setSoundsEnabled(newValue);
        // Здесь можно добавить axios.patch для сохранения настроек
    };

    const handleToggleNotifications = async () => {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);
    };

    return (
        <div className={styles.container}>
            {/* Хедер */}
            <header className={styles.header}>
                <h2>TASKS</h2>
                <div className={styles['header-actions']}>
                    <div className={styles['search-bar']}>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Search tasks..." />
                    </div>
                    <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="icon-btn"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </header>

            {/* Основной контент */}
            <main className={styles.main}>
                <div className={styles.gridContainer}>

                    {/* Шапка профиля */}
                    <div className={`${styles.bentoCard} ${styles.colSpan8} ${styles.profileHeader}`}>
                        <div className={styles.avatarLarge}>
                            {/* Сюда можно вставить img */}
                        </div>
                        <div>
                            <h3 className={styles.userName}>{profileData.name}</h3>
                            <p className={styles.userDetails}>
                                {profileData.title} • Focused since {profileData.joinedDate}
                            </p>
                        </div>
                    </div>

                    {/* Total Hours */}
                    <div className={`${styles.bentoCard} ${styles.colSpan4} ${styles.statCard}`}>
                        <div className={styles.statTop}>
                            <span className={`material-symbols-outlined ${styles.iconPrimary}`}>schedule</span>
                            <span className={styles.statBadge}>+{profileData.weeklyIncrease}% this week</span>
                        </div>
                        <div className={styles.statBottom}>
                            <p className={styles.statLabel}>Total hours</p>
                            <h4 className={styles.statValue}>{profileData.totalHours}h</h4>
                        </div>
                    </div>

                    {/* Sessions Completed */}
                    <div className={`${styles.bentoCard} ${styles.colSpan4} ${styles.statCard}`}>
                        <div className={styles.statTop}>
                            <span className={`material-symbols-outlined ${styles.iconTertiary}`}>task_alt</span>
                        </div>
                        <div className={styles.statBottom}>
                            <p className={styles.statLabel}>sessions completed</p>
                            <h4 className={styles.statValue}>{profileData.sessionsCompleted}</h4>
                        </div>
                    </div>

                    {/* График Weekly Momentum */}
                    <div className={`${styles.bentoCard} ${styles.colSpan8} ${styles.chartCard}`}>
                        <div className={styles.chartHeader}>
                            <h5 className={styles.cardTitle}>Weekly Momentum</h5>
                            <div className={styles.dots}>
                                <div className={styles.dotActive}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                        </div>
                        <div className={styles.chartBars}>
                            {profileData.chartData.map((height, index) => (
                                <div
                                    key={index}
                                    className={`${styles.bar} ${height === Math.max(...profileData.chartData) ? styles.barActive : ''}`}
                                    style={{ height: `${height}%` }}
                                ></div>
                            ))}
                        </div>
                        <div className={styles.chartLabels}>
                            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                        </div>
                    </div>

                    {/* Настройки (Focus Environment) */}
                    <div className={`${styles.bentoCard} ${styles.colSpan6} ${styles.settingsCard}`}>
                        <h5 className={styles.cardTitle}>Focus Environment</h5>
                        <div className={styles.settingsList}>

                            <div className={styles.settingItem} onClick={handleToggleSounds}>
                                <div className={styles.settingInfo}>
                                    <span className={`material-symbols-outlined ${styles.settingIcon}`}>graphic_eq</span>
                                    <div>
                                        <p className={styles.settingName}>Deep Work Sounds</p>
                                        <p className={styles.settingDesc}>Adaptive brown noise and binaural beats</p>
                                    </div>
                                </div>
                                <div className={`${styles.toggle} ${soundsEnabled ? styles.toggleOn : styles.toggleOff}`}>
                                    <div className={styles.toggleThumb}></div>
                                </div>
                            </div>

                            <div className={styles.settingItem} onClick={handleToggleNotifications}>
                                <div className={styles.settingInfo}>
                                    <span className={`material-symbols-outlined ${styles.settingIcon}`}>notifications_active</span>
                                    <div>
                                        <p className={styles.settingName}>Focus Notifications</p>
                                        <p className={styles.settingDesc}>Smart filtering for urgent interruptions</p>
                                    </div>
                                </div>
                                <div className={`${styles.toggle} ${notificationsEnabled ? styles.toggleOn : styles.toggleOff}`}>
                                    <div className={styles.toggleThumb}></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Быстрые действия (Account Preferences) */}
                    <div className={`${styles.bentoCard} ${styles.colSpan6} ${styles.preferencesCard}`}>
                        <h5 className={styles.cardTitle}>Account Preferences</h5>
                        <div className={styles.actionGrid}>
                            <button className={styles.actionBtn}>
                                <span className="material-symbols-outlined">shield</span>
                                <span>Privacy</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <span className="material-symbols-outlined">sync</span>
                                <span>Data Sync</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <span className="material-symbols-outlined">palette</span>
                                <span>Interface</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <span className="material-symbols-outlined">help</span>
                                <span>Support</span>
                            </button>
                        </div>
                    </div>

                    {/* Баннер внизу */}
                    <div className={styles.bannerCard}>
                        <div className={styles.bannerOverlay}>
                            <h4 className={styles.bannerTitle}>Your Mind, Expanded.</h4>
                            <p className={styles.bannerText}>Keep going. You're in the top 5% of focused performers this month. Your cognitive endurance is reaching new peaks.</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Profile;