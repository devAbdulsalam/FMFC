import express from 'express';
import Booking from './models/Booking'; // Assuming Booking model exists
import Field from './models/Field';

const router = express.Router();

// Admin dashboard - Monitor bookings and revenue
router.get('/admin/dashboard', async (req, res) => {
	try {
		const totalBookings = await Booking.countDocuments();
		const totalRevenue = await Booking.aggregate([
			{ $group: { _id: null, total: { $sum: '$amount' } } },
		]);

		res.status(200).json({
			totalBookings,
			totalRevenue: totalRevenue[0]?.total || 0,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error fetching dashboard data', error });
	}
});

export default router;
