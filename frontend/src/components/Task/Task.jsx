import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Task.module.css"


const Task = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ focusScore: "0%", tasksDone: 0, velocity: "0h" });
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTasks(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('/tasks/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchTasks();
        fetchDashboardStats();
    }, []);

    const handleDeleteTask = async (e, taskId) => {
        e.preventDefault()
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this task?")) return

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTasks(prev => prev.filter(t => t._id !== taskId));

            if (typeof fetchDashboardStats === "function") {
                fetchDashboardStats();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const token = localStorage.getItem("token");
            await axios.post(`/tasks`, {
                title: newTaskTitle,
                category: 'Planning'
            },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
            setNewTaskTitle("");
            fetchTasks()
            fetchDashboardStats()
        } catch (error) {
            console.error("Error creating task", error);
        }
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("text/plain", taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("text/plain");

        const draggedTask = tasks.find((task) => task._id === taskId);
        if (!draggedTask || draggedTask.status === targetStatus) return;

        try {
            const token = localStorage.getItem("token");
            await axios.patch(`/tasks/${taskId}`, {
                status: targetStatus,
            }, { headers: { Authorization: `Bearer ${token}` } });

            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: targetStatus } : t));
            fetchDashboardStats();
        } catch (error) {
            console.error(error);
            fetchTasks();
        }
    };

    const handleCardClick = (taskId) => {
        navigate(`/timer/${taskId}`);
    }

    const renderColumn = (status, label) => {
        const filteredTasks = tasks.filter(t => t.status === status);

        return (
            <div className={styles.column} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
                <div className={styles.columnHeader}>
                    <span>{label}</span>
                    <span className={styles.count}>{filteredTasks.length.toString().padStart(2, '0')}</span>
                </div>
                <div className={styles.taskList}>{filteredTasks.map(task => (
                    <div className={styles.taskCardLink} onClick={() => handleCardClick(task._id)}>
                        <div key={task._id} className={styles.taskCard} draggable onDragStart={(e) => handleDragStart(e, task._id)}>
                            <div className={styles.taskCheckbox}>
                                {task.status === 'completed' && (
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--accent)' }}>check</span>
                                )}
                            </div>
                            <div className={styles.taskContent}>
                                <h4>{task.title}</h4>
                                <span className={styles.categoryBadge}>{task.category}</span>
                            </div>

                            <button className={styles.deleteBtn} onClick={(e) => handleDeleteTask(e, task._id)} title="Delete task">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}</div>
            </div>
        );
    };

    const completedCount = tasks.filter(t => t.status === 'completed').length;

    return (
        <div className={styles.container}>
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

            <form className={styles.createTaskBar} onSubmit={handleCreateTask}>
                <div className={styles.inputWrapper}>
                    <span className="material-symbols-outlined">add</span>
                    <input type="text" placeholder="Add task..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
                </div>
                <button type="submit" className={styles.createBtn}>Create</button>
            </form>

            <div className={styles.kanbanBoard}>
                {renderColumn('todo', 'TO DO')}
                {renderColumn('in-progress', 'IN PROGRESS')}
                {renderColumn('completed', 'COMPLETED')}
            </div>

            <div className={styles.footerStats}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div className={styles.statInfo}>
                        <span>FOCUS SCORE</span>
                        <h4>{stats.focusScore}</h4>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <div className={styles.statInfo}>
                        <span>TASKS DONE</span>
                        <h3>{stats.tasksDone}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div className={styles.statInfo}>
                        <span>TOTAL FOCUS TIME</span>
                        <h3>{stats.velocity}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;