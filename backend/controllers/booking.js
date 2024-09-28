import Booking from '../models/Booking.js';
import asyncHandler from 'express-async-handler';

export const createBooking = async (req, res) => {
	const { tripId, seat } = req.body;

	try {
		const userId = req.user._id;
		const trip = await Trip.findById(tripId).populate('bus');
		if (!trip) {
			return res.status(404).json({ message: 'Trip not found' });
		}

		const bus = trip.bus;
		if (bus.seatsFilled >= bus.seatCapacity) {
			return res
				.status(400)
				.json({ message: 'Bus is fully booked, no more available seat.' });
		}
		const availableSeats = bus.seatCapacity - bus.seatsFilled;

		if (availableSeats < seat) {
			return res.status(400).json({
				message: `Only ${availableSeats} seat(s) available, but ${seat} seat(s) requested.`,
			});
		}
		const totalPrice = Number(trip.price) * Number(seat);
		const booking = new Booking({
			userId,
			tripId: trip._id,
			seat,
			price: totalPrice,
		});
		await booking.save();

		bus.seatsFilled += 1;
		await bus.save();

		res.status(201).json({ message: 'Booking successful', booking });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getbookings = async (req, res) => {
	try {
		const userId = req.user._id;
		let result;
		if (req.user.role === 'ADMIN') {
			result = await Booking.find();
		} else {
			result = await Booking.find({ userId });
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export const getbooking = async (req, res) => {
	try {
		const { id } = req.params;
		const booking = await Booking.findById(id).populate({
			path: 'userId',
			select: 'email name phone rank',
		});

		if (!booking) {
			return res.status(404).json({ message: 'Booking not found' });
		}
		res.status(201).json(booking);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateBooking = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const { seat } = req.body;

		const booking = await Booking.findById(id);
		if (!booking) {
			return res.status(404).json({ message: 'Booking not found' });
		}

		// Check if the booking is already confirmed or completed
		if (['CONFIRMED', 'COMPLETED'].includes(booking.status)) {
			return res.status(400).json({
				message: 'Cannot update an already confirmed or completed booking',
			});
		}

		const trip = await Trip.findById(booking.tripId).populate('bus');
		if (!trip) {
			return res.status(404).json({ message: 'Trip not found' });
		}

		const bus = trip.bus;
		const currentSeatsFilled = bus.seatsFilled;
		const newSeatsFilled = currentSeatsFilled - booking.seat + seat;

		if (newSeatsFilled > bus.seatCapacity) {
			return res.status(400).json({
				message: `Only ${
					bus.seatCapacity - currentSeatsFilled + booking.seat
				} seat(s) available, but ${seat} seat(s) requested.`,
			});
		}

		// Update the booking
		booking.seat = seat;
		booking.price = Number(trip.price) * Number(seat);
		await booking.save();

		// Update bus seats filled
		bus.seatsFilled = newSeatsFilled;
		await bus.save();

		res.status(200).json({
			message: 'Booking updated successfully',
			booking,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export const updateBookingStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const result = await Booking.findByIdAndUpdte(id, { status }).populate(
			'userId'
		);
		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
