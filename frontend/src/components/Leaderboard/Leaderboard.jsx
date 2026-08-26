import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('all-time');
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Эндпоинт можно менять в зависимости от вкладки: /sessions/leaderboard
                const response = await axios.get(`/sessions/leaderboard?timeframe=${timeframe}`);
                setLeaders(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Ошибка при загрузке лидерборда:', err);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [timeframe]);

    if (loading) {
        return (
            <div className={styles.pageLayout}>
                <div className={styles.loader}>Загрузка данных...</div>
            </div>
        );
    }

    const topThree = leaders.slice(0, 3);
    const globalRankings = leaders.slice(3);

    const firstPlace = topThree[0];
    const secondPlace = topThree[1];
    const thirdPlace = topThree[2];

    const displayedRankings = globalRankings.slice(0, visibleCount);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>LEADERBOARD</h2>
                <div className={styles['header-actions']}>
                    <div className={styles['search-bar']}>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Search tasks..." />
                    </div>
                    <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="icon-btn"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.podiumGrid}>
                    {secondPlace && (
                        <div className={styles.podiumColSide}>
                            <div className={`${styles.bentoCard} ${styles.silverGlow} ${styles.cardContent}`}>
                                <div className={styles.avatarWrapper}>
                                    <div className={`${styles.avatarPlaceholder} ${styles.borderSilver}`}>
                                        {secondPlace.username[0].toUpperCase()}
                                    </div>
                                    <div className={`${styles.rankBadge} ${styles.bgSilver}`}>#2</div>
                                </div>
                                <h3 className={styles.userName}>{secondPlace.username}</h3>
                                <p className={styles.userTitle}>{secondPlace.rank || 'FOCUS PRO'}</p>
                                <div className={styles.scoreValue}>{secondPlace.minutes.toLocaleString()}</div>
                                <p className={styles.scoreLabel}>minutes</p>
                            </div>
                        </div>
                    )}

                    {firstPlace && (
                        <div className={styles.podiumColCenter}>
                            <div className={`${styles.bentoCard} ${styles.goldGlow} ${styles.cardContent} ${styles.scaleUp}`}>
                                <div className={styles.crownIcon}>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        workspace_premium
                                    </span>
                                </div>
                                <div className={styles.avatarWrapper}>
                                    <div className={`${styles.avatarPlaceholder} ${styles.borderGold} ${styles.avatarLarge}`}>
                                        {firstPlace.username[0].toUpperCase()}
                                    </div>
                                    <div className={`${styles.rankBadge} ${styles.bgGold}`}>#1</div>
                                </div>
                                <h3 className={styles.userNameLarge}>{firstPlace.username}</h3>
                                <p className={styles.userTitleGold}>{firstPlace.rank || 'Master of Silence'}</p>
                                <div className={styles.scoreValueLarge}>{firstPlace.minutes.toLocaleString()}</div>
                                <p className={styles.scoreLabel}>minutes</p>
                            </div>
                        </div>
                    )}

                    {thirdPlace && (
                        <div className={styles.podiumColSide}>
                            <div className={`${styles.bentoCard} ${styles.bronzeGlow} ${styles.cardContent}`}>
                                <div className={styles.avatarWrapper}>
                                    <div className={`${styles.avatarPlaceholder} ${styles.borderBronze}`}>
                                        {thirdPlace.username[0].toUpperCase()}
                                    </div>
                                    <div className={`${styles.rankBadge} ${styles.bgBronze}`}>#3</div>
                                </div>
                                <h3 className={styles.userName}>{thirdPlace.username}</h3>
                                <p className={styles.userTitle}>{thirdPlace.rank || 'FOCUS PRO'}</p>
                                <div className={styles.scoreValue}>{thirdPlace.minutes.toLocaleString()}</div>
                                <p className={styles.scoreLabel}>minutes</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`${styles.bentoCard} ${styles.tableContainer}`}>
                    <div className={styles.tableHeader}>
                        <h4 className={styles.tableTitle}>Global Rankings</h4>
                        <div className={styles.tableFilters}>
                            <button
                                className={`${styles.filterBtnOutline} ${timeframe === 'weekly' ? styles.filterBtnActive : ''}`}
                                onClick={() => setTimeframe('weekly')}
                            >
                                This Week
                            </button>
                            <button
                                className={`${styles.filterBtnOutline} ${timeframe === 'all-time' ? styles.filterBtnActive : ''}`}
                                onClick={() => setTimeframe('all-time')}
                            >
                                All Time
                            </button>
                        </div>
                    </div>

                    <table className={styles.table}>
                        <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>Rank</th>
                            <th className={styles.th}>Username</th>
                            <th className={styles.th}>Focus Rank</th>
                            <th className={`${styles.th} ${styles.textRight}`}>Total Focus Minutes</th>
                        </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                        {displayedRankings.map((user, index) => {
                            const actualRank = index + 4;
                            return (
                                <tr key={user.username + index} className={styles.tr}>
                                    <td className={styles.td}>
                                        <span className={styles.rankNum}>{actualRank}</span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.userRow}>
                                            <div className={styles.avatarSmall}>
                                                {user.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className={styles.userNameText}>{user.username}</span>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.focusBadge}>{user.rank || 'Pro'}</span>
                                    </td>
                                    <td className={`${styles.td} ${styles.textRight} ${styles.scoreNum}`}>
                                        {user.minutes.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {globalRankings.length > visibleCount && (
                        <div className={styles.tableFooter}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={() => setVisibleCount(prev => prev + 10)}
                            >
                                Load more rankings
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;