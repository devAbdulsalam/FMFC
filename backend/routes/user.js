import express from 'express';
const router = express.Router();
import {
	registerUser,
	loginUser,
	loginAdmin,
	refreshToken,
	getDashboard,
	getUsers,
	getUser,
	getAdmins,
} from '../controllers/user.js';
import auth, { verifyPermission } from '../middlewares/auth.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login/admin', loginAdmin);
router.post('/refresh-token', refreshToken);
router.get('/user', auth, getUser);
router.get('/dashboard', auth, getDashboard);
router.get('/', auth, getUsers);
router.get('/admins', auth, getAdmins);

export default router;
