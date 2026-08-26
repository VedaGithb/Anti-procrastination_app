import mongoose from 'mongoose';
import Session from '../models/Session.js';
import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Логика расчета начала недели
        const now = new Date();
        const currentDay = now.getDay();
        const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - distanceToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        // Агрегация данных из модели Session
        const aggregationResult = await Session.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), status: 'completed' } },
            {
                $facet: {
                    totalStats: [
                        {
                            $group: {
                                _id: null,
                                totalSeconds: { $sum: '$durationSeconds' },
                                sessionsCount: { $sum: 1 }
                            }
                        }
                    ],
                    weeklyStats: [
                        { $match: { startTime: { $gte: startOfWeek } } },
                        {
                            $group: {
                                _id: { $isoDayOfWeek: '$startTime' },
                                dailySeconds: { $sum: '$durationSeconds' }
                            }
                        }
                    ]
                }
            }
        ]);

        const totalStats = aggregationResult[0].totalStats[0] || { totalSeconds: 0, sessionsCount: 0 };
        const weeklyStatsRaw = aggregationResult[0].weeklyStats;

        const totalHours = Math.round(totalStats.totalSeconds / 3600);
        const chartData = [0, 0, 0, 0, 0, 0, 0];

        weeklyStatsRaw.forEach(item => {
            const dayIndex = item._id - 1;
            chartData[dayIndex] = Math.round(item.dailySeconds / 60);
        });

        res.json({
            name: user.username,
            title: "Focus Performer",
            joinedDate: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : "Oct 2023",
            totalHours: totalHours,
            weeklyIncrease: 12,
            sessionsCompleted: totalStats.sessionsCount,
            chartData: chartData
        });

    } catch (error) {
        console.error("Ошибка в контроллере профиля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};