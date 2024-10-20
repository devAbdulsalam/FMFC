import express from 'express';
import Field from '../models/Field.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { upload } from '../middlewares/multer.js';
import { uploader } from '../utils/cloudinary.js';
import fs from 'fs';
import auth, { verifyPermission } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const fields = await Field.find();
		res.status(201).json(fields);
	} catch (error) {
		res.status(500).json({ message: 'Error creating field', error });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const field = await Field.findById({ _id: id });
		res.status(201).json(field);
	} catch (error) {
		res.status(500).json({ message: 'Error finding field', error });
	}
});
// Create a new field
router.post(
	'/',
	auth,
	// verifyPermission(['ADMIN', 'SUPER_ADMIN']),
	upload.single('image'),
	async (req, res) => {
		const userId = req.user._id;
		const { name, capacity, pricePerHour, address, description } = req.body;
		try {
			if (!req.file) {
				return res.status(400).json({ message: 'Field image is required' });
			}
			const image = await uploader(req.file.path, 'fields');
			const field = new Field({
				userId,
				name,
				capacity,
				pricePerHour,
				address,
				image,
				description,
			});

			await field.save();
			res.status(201).json(field);
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Error creating field', error });
		} finally {
			if (req.file) {
				await fs.promises.unlink(req.file.path);
			}
		}
	}
);
// Add schedule to a field
router.post('/:fieldId/schedule', async (req, res) => {
	const { fieldId } = req.params;
	const { date, timeSlots } = req.body; // timeSlots: [{ startTime, endTime }]
	try {
		const field = await Field.findById(fieldId);
		if (!field) return res.status(404).json({ message: 'Field not found' });

		field.schedule.push({ date, timeSlots });
		await field.save();
		res.status(200).json(field);
	} catch (error) {
		res.status(500).json({ message: 'Error adding schedule', error });
	}
});

// Update field prices
router.put('/:fieldId/price', async (req, res) => {
	const { fieldId } = req.params;
	const { pricePerHour, specialPricing } = req.body;
	// specialPricing can include specific days, time slots, or seasons

	try {
		const field = await Field.findById(fieldId);
		if (!field) return res.status(404).json({ message: 'Field not found' });

		field.pricePerHour = pricePerHour;
		field.specialPricing = specialPricing; // Example: [{ day: 'Saturday', price: 100 }, { timeSlot: '18:00-20:00', price: 120 }]
		await field.save();

		res.status(200).json({ message: 'Prices updated successfully', field });
	} catch (error) {
		res.status(500).json({ message: 'Error updating prices', error });
	}
});

router.post('/:fieldId/book', auth, async (req, res) => {
	const { fieldId } = req.params;
	const userId = req.user._id;
	const { endDate, startDate } = req.body;

	try {
		const field = await Field.findById(fieldId);
		if (!field) return res.status(404).json({ message: 'Field not found' });

		// Check if the field is already booked for overlapping dates
		const overlappingBooking = await Booking.findOne({
			fieldId,
			$or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
		});

		if (overlappingBooking) {
			return res
				.status(400)
				.json({ message: 'Field is already booked for the selected dates' });
		}
		// Parse the startDate and endDate to ensure they're in the correct format (if necessary)
		const start = new Date(startDate);
		const end = new Date(endDate);

		// Calculate the total number of days (ensure time difference is calculated correctly)
		const timeDiff = Math.abs(end.getTime() - start.getTime()); // difference in milliseconds
		const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // convert ms to days

		// Assuming field.pricePerHour refers to hourly rate and there are 24 hours in a day
		const totalPrice = field.pricePerHour * 24 * totalDays;

		// Create new booking
		const newBooking = await Booking.create({
			fieldId,
			userId,
			days: totalDays,
			startDate,
			endDate,
			amount: totalPrice,
		});
		res
			.status(200)
			.json({ message: 'Field successfully booked', booking: newBooking });
	} catch (error) {
		console.error('Error booking field:', error);
		res
			.status(500)
			.json({ message: 'Error booking field', error: error.message });
	}
});

export default router;
