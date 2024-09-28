import express from 'express';
import { getDashboard } from '../controllers/reports.js';
const router = express.Router();
router.get('/dashboard', getDashboard);

export default router;
