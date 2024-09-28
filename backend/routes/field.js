import express from 'express';
import Field from './models/Field';

const router = express.Router();

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
