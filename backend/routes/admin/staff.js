import Staff from './../models/Staff'; // Assuming Staff model exists

// Add staff member
router.post('/staff', async (req, res) => {
	const { name, role, contact } = req.body;
	try {
		const staff = new Staff({ name, role, contact });
		await staff.save();
		res.status(201).json(staff);
	} catch (error) {
		res.status(500).json({ message: 'Error adding staff member', error });
	}
});

// Edit staff member
router.put('/staff/:staffId', async (req, res) => {
	const { staffId } = req.params;
	const { name, role, contact } = req.body;
	try {
		const staff = await Staff.findByIdAndUpdate(
			staffId,
			{ name, role, contact },
			{ new: true }
		);
		if (!staff)
			return res.status(404).json({ message: 'Staff member not found' });
		res.status(200).json(staff);
	} catch (error) {
		res.status(500).json({ message: 'Error updating staff member', error });
	}
});

// Delete staff member
router.delete('/staff/:staffId', async (req, res) => {
	const { staffId } = req.params;
	try {
		const staff = await Staff.findByIdAndDelete(staffId);
		if (!staff)
			return res.status(404).json({ message: 'Staff member not found' });
		res.status(200).json({ message: 'Staff member deleted' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting staff member', error });
	}
});
