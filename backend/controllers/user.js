import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Report from '../models/Report.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import { createToken, createRefreshToken } from './../utils/tokens.js';

export const registerUser = async (req, res) => {
	const { name, email, phone, password, role = 'USER' } = req.body;
	try {
		const existingEmail = await User.findOne({ email });

		// To handle the 409 status code, typically indicating a conflict, you might want to implement it in scenarios where there's a conflict with the current state of the resource.
		// For example, if you're trying to create a new user with an email or username that already exists, it would result in a conflict.

		if (existingEmail) {
			return res.status(409).json({ error: 'Email address already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			name,
			email,
			phone,
			role,
			password: hashedPassword,
		});
		await user.save();
		res
			.status(201)
			.json({ message: 'User registered successfully, Login to continue' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const newUser = await User.findOne({ email }).select('-password');
		const accessToken = await createToken({ user: newUser });
		const refreshToken = await createRefreshToken({ _id: user._id });
		res.status(200).json({ user: newUser, accessToken, refreshToken });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
export const loginAdmin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		if (user.role !== 'ADMIN') {
			return res.status(401).json({ message: 'Unauthorized request' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const newUser = await User.findOne({ email }).select('-password');
		const accessToken = await createToken({ user: newUser });
		const refreshToken = await createRefreshToken({ _id: user._id });
		res.status(200).json({ user: newUser, accessToken, refreshToken });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
export const refreshToken = async (req, res) => {
	const { refreshToken } = req.body;
	try {
		if (!refreshToken) {
			return res.status(401).json({ message: 'Unauthorized request' });
		}
		const decodedToken = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET
		);
		const user = await User.findById(decodedToken?._id).select('-password');
		if (!user) {
			return res.status(401).json({ message: 'Invalid refresh token' });
		}
		const accessToken = await createToken({ user });
		const newRefreshToken = await createRefreshToken({ _id: user._id });
		res.status(200).json({ accessToken, refreshToken: newRefreshToken });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const data = await User.findById(userId);
		res.json(data);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
export const getUsers = async (req, res) => {
	try {
		const data = await User.find();
		res.json(data);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
export const getUserDashboard = async (req, res) => {
	try {
		const userId = req.user._id;
		const reports = await Report.find({ userId });
		// get current date and get 5 trips closer to the date
		const currentDate = new Date();

		const products = await Product.find();
		let result;
		if (req.user.role === 'ADMIN') {
			result = await Booking.find().limit(10);
		} else {
			result = await Booking.find({ userId });
		}
		const data = { user: req.user, reports, bookings: result, products };
		// Send the response
		res.json(data);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
export const getAdminDashboard = async (req, res) => {
	try {
		const totalreports = await Report.countDocuments();
		const totalusers = await User.countDocuments();
		const totalbookings = await Booking.countDocuments();
		const reports = await Report.find().limit(10);
		const users = await User.find().limit(10);
		const products = await Product.find().limit(10);
		const bookings = await Booking.find().limit(10);

		const data = {
			totalusers,
			users,
			totalreports,
			reports,
			totalbookings,
			bookings,
			products,
		};
		// Send the response
		res.json(data);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
