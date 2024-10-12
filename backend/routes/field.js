import express from 'express';
import Field from '../models/Field.js';
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
		const field = await Field.find({ _id: id });
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

// Book a field
router.post('/:fieldId/book', async (req, res) => {
	const { fieldId } = req.params;
	const { date, startTime } = req.body;

	try {
		const field = await Field.findById(fieldId);
		if (!field) return res.status(404).json({ message: 'Field not found' });

		// Find the correct date
		const schedule = field.schedule.find(
			(s) => s.date.toISOString().split('T')[0] === date
		);
		if (!schedule)
			return res
				.status(404)
				.json({ message: 'Schedule for this date not found' });

		// Find the correct time slot
		const timeSlot = schedule.timeSlots.find(
			(slot) => slot.startTime === startTime
		);
		if (!timeSlot || timeSlot.isBooked) {
			return res.status(400).json({ message: 'Time slot unavailable' });
		}

		timeSlot.isBooked = true; // Mark the time slot as booked
		await field.save();
		res.status(200).json({ message: 'Field successfully booked', field });
	} catch (error) {
		res.status(500).json({ message: 'Error booking field', error });
	}
});

export default router;
