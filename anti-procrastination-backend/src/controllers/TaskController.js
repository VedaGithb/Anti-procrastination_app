import TaskModel from "../models/Task.js";
import SessionModel from "../models/Session.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Получаем количество задач по статусам
        const tasks = await TaskModel.find({ user: userId });
        const todoCount = tasks.filter(t => t.status === 'todo').length;
        const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
        const completedCount = tasks.filter(t => t.status === 'completed').length;

        // Расчет Focus Score (базовый алгоритм)
        const totalStartedTasks = inProgressCount + completedCount;
        const focusScore = totalStartedTasks > 0
            ? Math.round((completedCount / totalStartedTasks) * 100)
            : 0;

        // 2. Считаем время из сессий таймера для Deep Work Velocity
        const sessions = await SessionModel.find({ user: userId, status: 'completed' });

        // Считаем общее время в часах
        const totalSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
        const totalHours = (totalSeconds / 3600).toFixed(1);

        // Отдаем всё на фронтенд
        res.json({
            focusScore: `${focusScore}%`,
        tasksDone: completedCount,
            velocity: `${totalHours}h` // Выведем общий объем наработанных часов
    });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось получить статистику дашборда" });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new TaskModel({
            title: req.body.title,
            category: req.body.category,
            user: req.userId,
        });

        const task = await doc.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({message: "Something went wrong while creating the task"});
    }
};

export const getAll = async (req, res) => {
    try {
        const tasks = await TaskModel.find({ user: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({message: "Something went wrong while getting all tasks"});
    }
};

export const getOne = async (req, res) => {
    try {
        const task = await TaskModel.findOne({ _id: req.params.id, user: req.userId});
        res.json(task);
    } catch (error) {
        res.status(500).json({message: "Something went wrong while getting task"});
    }
}

export const updateStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        await TaskModel.updateOne(
            { _id: taskId, user: req.userId },
            { status: req.body.status }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({message: "Something went wrong while updating status"});
    }
};

export const remove = async (req, res) => {
    try {
        const taskId = req.params.id;
        const result = await TaskModel.deleteOne({ _id: taskId, user: req.userId });

        if (result.deletedCount === 0) {
            return res.status(44).json({ message: 'Задача не найдена' })
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({message: "Something went wrong while deleting task"});
    }
};