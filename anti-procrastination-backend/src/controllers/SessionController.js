import SessionModel from '../models/Session.js';
import mongoose from 'mongoose';
import TaskModel from "../models/Task.js";

// Вспомогательная функция для рангов
const getRank = (minutes) => {
    if (minutes <= 60) return "Новичок";
    if (minutes <= 300) return "Фокусник";
    return "Мастер фокуса";
};

export const startSession = async (req, res) => {
    try {
        // Мы не создаем запись в БД здесь, чтобы не плодить мусор.
        // Просто отвечаем фронтенду, что всё ок.
        res.json({ message: "Сессия отслеживается" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при старте" });
    }
};

export const stopSession = async (req, res) => {
    try {
        const { taskName, durationSeconds, type, status, taskId } = req.body;

        const session = new SessionModel({
            user: req.userId,
            taskName: taskName || "Фокус",
            durationSeconds: durationSeconds || 0,
            type: type || 'work', // 'work', 'short_break', 'long_break'
            status: status || 'completed'
        });

        await session.save();
        res.json({ message: "Сессия успешно сохранена", session });

        if (taskId) {
            await TaskModel.findByIdAndUpdate(taskId, {
                $inc: { totalSecondsSpent: durationSeconds },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Не удалось сохранить сессию" });
    }
};

// 3. Лидерборд — считаем только рабочие сессии (без перерывов)
export const getLeaderboard = async (req, res) => {
    try {
        const data = await SessionModel.aggregate([
            {
                $match: { type: 'work' } // Считаем только полезную работу
            },
            {
                $group: {
                    _id: "$user",
                    totalSeconds: { $sum: "$durationSeconds" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            { $sort: { totalSeconds: -1 } },
            { $limit: 10 }
        ]);

        const result = data.map(item => ({
            username: item.userInfo.username,
            minutes: Math.floor(item.totalSeconds / 60),
            rank: getRank(Math.floor(item.totalSeconds / 60))
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка рейтинга' });
    }
};

// 4. НОВЫЙ МЕТОД: Статистика для Dashboard
export const getStats = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const stats = await SessionModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId),
                    type: 'work',
                    createdAt: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    todaySeconds: { $sum: "$durationSeconds" },
                    todaySessions: { $sum: 1 }
                }
            }
        ]);

        // Собираем ответ: если данных за сегодня нет, возвращаем нули
        const result = {
            todayMinutes: stats[0] ? Math.floor(stats[0].todaySeconds / 60) : 0,
            todaySessions: stats[0] ? stats[0].todaySessions : 0,
            streak: 5 // Тут логику стриков можно дописать позже
        };

        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка получения статистики" });
    }
};
