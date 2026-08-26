import express from "express";
import * as TaskController from "../controllers/TaskController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/dashboard/stats', auth, TaskController.getDashboardStats)
router.get('/', auth, TaskController.getAll);
router.post('/', auth, TaskController.create);
router.get('/:id', auth, TaskController.getOne);
router.patch('/:id', auth, TaskController.updateStatus);
router.delete('/:id', auth, TaskController.remove);

export default router;