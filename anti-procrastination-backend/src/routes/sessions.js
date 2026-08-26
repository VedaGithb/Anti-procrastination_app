import express from "express";
import * as SessionController from "../controllers/SessionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/stats', auth, SessionController.getStats);
router.post('/start', auth, SessionController.startSession);
router.post('/stop', auth, SessionController.stopSession);
router.get('/leaderboard', SessionController.getLeaderboard);


export default router;