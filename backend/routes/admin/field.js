import express from 'express';
import Field from './../models/Field';

const router = express.Router();

// Create a new field
router.post('/fields', async (req, res) => {
	const { userId, name, capacity, pricePerHour } = req.body;
	try {
		const field = new Field({
			userId,
			name,
			capacity,
			pricePerHour,
		});
		await field.save();
		res.status(201).json(field);
	} catch (error) {
		res.status(500).json({ message: 'Error creating field', error });
	}
});
// Add schedule to a field
router.post('/fields/:fieldId/schedule', async (req, res) => {
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
router.put('/admin/fields/:fieldId/price', async (req, res) => {
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

export default router;
