import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: { type: String, required: true },
		address: { type: String, required: true },
		description: { type: String },
		capacity: { type: Number, required: true, default: 60 },
		pricePerHour: { type: Number, required: true },
		status: {
			type: String,
			enum: ['available', 'unavailable'],
			default: 'available',
		},
		image: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		schedule: [
			{
				date: { type: Date, required: true },
				timeSlots: [
					{
						startTime: { type: String, required: true },
						endTime: { type: String, required: true },
						isBooked: { type: Boolean, default: false },
					},
				],
			},
		],
		specialPricing: [
			{
				name: { type: String },
				day: { type: String },
				timeSlot: { type: String },
				price: { type: Number },
			},
		],
	},
	{ timestamps: true }
);

const Field = mongoose.model('Field', FieldSchema);
export default Field;
