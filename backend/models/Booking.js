import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		fieldId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Field',
			required: true,
		},
		days: { type: Date, required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date, required: true },
		amount: { type: Number, required: true },
	},
	{ timestamps: true }
);

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
