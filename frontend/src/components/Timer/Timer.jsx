import styles from './Timer.module.css'
import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Timer = () => {
    const { taskId } = useParams();
    const [currentTask, setCurrentTask] = useState(null);
    const [nextTask, setNextTask] = useState(null);
    const [seconds, setSeconds] = useState(() => {
        const saved = localStorage.getItem('timer_seconds');
        return saved ? Number(saved) : 25*60;
    });
    const [isActive, setIsActive] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('timer_mode');
        return saved ? saved : 'focus';
    });
    const [completedSessions, setCompletedSessions] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('timer_seconds', seconds);
        localStorage.setItem('timer_mode', mode);
    }, [seconds, mode]);

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const handleReset = () => {
        setIsActive(false);
        setSeconds(25*60);
    }

    const handleSkip = () => {
        if (mode === 'focus') {
            setMode('break');
            setSeconds(5*60);
        } else {
            setMode('focus');
            setSeconds(25*60);
        }
        setIsActive(false);
    }

    useEffect(() => {
        if (!taskId) return

        const token = localStorage.getItem("token");
        const fetchID = async () => {
            try {
                const response = await axios.get(`/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentTask(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchID();
    }, [taskId]);

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (seconds === 0 && isActive) {
            setIsActive(false);
            const saveSession = async () => {
                try {
                    const token = localStorage.getItem("token");
                    await fetch('/sessions/stop', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            _id: taskId || null,
                            taskName: currentTask?.title || "Focus Session",
                            durationSeconds: 25*60,
                            type: 'work',
                            status: 'completed'
                        })
                    });
                    setCompletedSessions(prev => prev + 1);

                    localStorage.removeItem('timer_seconds');
                    localStorage.removeItem('timer_mode');
                } catch (error) {
                    console.log(error);
                }
            };
            saveSession();
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('/sessions/stats', { headers: { Authorization: `Bearer ${token}` } });
                const data = await  response.data;
                setCompletedSessions(data.todaySessions || 0);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [])

    if (loading) return <div>Загрузка прогресса...</div>


    const circleCircumference = 942.48;
    const strokeDashoffset = circleCircumference - (seconds / (25*60)) * circleCircumference;
    const totalSessionGoal = 6;
    const progressPercentage = Math.min((completedSessions / totalSessionGoal) * 100, 100);
    return (
        <div className={styles['timer-wrapper']}>
            <header className={styles['timer-header']}>
                <div className={styles['header-title']}>
                    <h2>TIMER</h2>
                </div>
                <div className={styles['header-actions']}>
                    <div className={styles['search-bar']}>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Search tasks..." />
                    </div>
                    <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="icon-btn"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </header>

            <main>
                {/* Текущая задача*/}
                <section className={styles['current-task']}>
                    <span>Current Task</span>
                    <h2>{  currentTask?.title || "Focus Session" }</h2>
                </section>

                <div className={styles['bento-grid']}>
                    <div className={styles['timer-card']}>
                        <div className={styles['timer-display']}>
                            {/* SVG контейнер для круга */}
                            <svg className={styles['progress-ring']} width="320" height="320">
                                {/* Фоновый круг (серый) */}
                                <circle
                                    className={styles['progress-ring__background']}
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    strokeWidth="4"
                                    fill="transparent"
                                    r="150"
                                    cx="160"
                                    cy="160"
                                />
                                <circle
                                    className={styles['progress-ring__circle']}
                                    stroke={mode === 'focus' ? '#FF6B4A' : '#4AFFB4'}
                                    strokeWidth="4"
                                    strokeDasharray="942.48"
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="150"
                                    cx="160"
                                    cy="160"
                                />
                            </svg>

                            <div className={styles['timer-text']}>
                                <span className={styles.time}>{formatTime(seconds)}</span>
                                <span className={styles.label}>MINUTES REMAINING</span>
                            </div>
                        </div>

                        {/* Кнопки управления */}
                        <div className={styles['timer-controls']}>
                            <button className={styles['control-btn']} onClick={handleSkip}><span className="material-symbols-outlined">skip_next</span></button>
                            <button className={`${styles['control-btn']} ${styles.play}`} onClick={() => setIsActive(!isActive)}><span className="material-symbols-outlined">{isActive ? 'pause' : 'play_arrow'}</span></button>
                            <button className={styles['control-btn']} onClick={handleReset}><span className="material-symbols-outlined">refresh</span></button>
                        </div>
                    </div>

                    <div className={styles['today-progress']}>
                        <div className={styles['icon-accent']}>
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <h3 className={styles['today-progress-header']}>Today's Progress</h3>
                        {loading ? (
                                <div>Загрузка прогресса...</div>
                            ) : (
                                    <>
                                        <p className={styles['today-progress-text']}>You've completed {completedSessions} focus sessions today. {completedSessions < totalSessionGoal ?  `${totalSessionGoal - completedSessions} more to hit your goal.` : "Goal achieved. You're doing great!"}</p>
                                        <div className={styles['today-progress-container']}>
                                            <div className={styles['progress-bar']} style={{ width: `${progressPercentage}%`, color: "#FF6B4A" }}></div>
                                        </div>
                                    </>
                            )
                        }
                        <div className={styles['progress-labels']}>
                            <span>{Math.round(progressPercentage)}% COMPLETED</span>
                            <span>{completedSessions}/{totalSessionGoal} SESSIONS</span>
                        </div>
                    </div>

                    <div className={styles['deep-focus-mode']}>
                        <div className={styles['mode-header']}>
                            <div className={styles['icon-box']}>
                                <span className="material-symbols-outlined">bolt</span>
                            </div>
                            <div className={styles['mode-title-group']}>
                                <h4>Deep Focus Mode</h4>
                                <span className={styles['status-subtext']}>Level 4 Active</span>
                            </div>
                        </div>
                        <p className={styles['mode-description']}>
                            Notifications are silenced across all paired devices. Ambient silence active.
                        </p>
                    </div>

                    <div className={styles['up-next']}>
                        <div className={styles['up-next-info']}>
                            <div className={styles['up-next-badge']}>UP NEXT</div>
                            <div className={styles['up-next-info-text']}>
                                <h4>Review Design Token</h4>
                                <p>Estimated: 15 mins | Strategy Session</p>
                            </div>
                        </div>
                        {
                            isEditing ?
                                <input type="text" placeholder="Next task..." /> :
                                <button className={styles['edit-schedule-btn']} onClick={() => { setIsEditing(true) }}>Edit Schedule</button>
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Timer;