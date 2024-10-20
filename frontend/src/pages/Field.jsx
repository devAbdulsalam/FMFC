import { useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { fetchField } from '../hooks/axiosApis';
import AuthContext from '../context/authContext';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import getError from './../hooks/getError';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { CiLocationOn } from 'react-icons/ci';

const Field = () => {
	const { user } = useContext(AuthContext);
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const props = { token: user.accessToken || user.token, id };
	const { data, isLoading, error } = useQuery({
		queryKey: ['fields', id],
		queryFn: async () => fetchField(props),
	});

	const navigate = useNavigate();
	useEffect(() => {
		if (error) {
			console.log(error);
		}
		if (data) {
			console.log(data);
		}
	}, [data]);
	console.log(user);

	const apiUrl = import.meta.env.VITE_API_URL;
	const handleClick = async () => {
		try {
			setLoading(true);
			const { data } = await axios.patch(
				`${apiUrl}/reports/${id}`,
				{ status: 'COMPLETED' },
				{
					headers: {
						Authorization: `Bearer ${user?.token || user?.accessToken}`,
					},
				}
			);
			if (data) {
				console.log(data);
				toast.success('Trip confirmed successfully');
				navigate(`/bookings`);
			}
			setLoading(false);
		} catch (error) {
			// const message = error?.data || 'Something went wrong!';
			setLoading(false);
			console.log('Error booking trip', error);
			const message = getError(error);
			return Swal.fire({
				title: 'Error!',
				icon: 'error',
				text: message,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
			});
		}
	};
	const handleBookField = async () => {
		try {
			if (!fromDate || !toDate) {
				return toast.error('Please select both start and end dates.');
			}

			const today = new Date();
			const fromDateObj = new Date(fromDate);
			const toDateObj = new Date(toDate);

			// Ensure fromDate is in the future
			if (fromDateObj < today) {
				return toast.error('Please select a start date in the future.');
			}
			// Ensure toDate is after fromDate
			if (toDateObj <= fromDateObj) {
				return toast.error('The end date must be after the start date.');
			}
			setLoading(true);
			const { data } = await axios.post(
				`${apiUrl}/fields/${id}/book`,
				{ status: 'COMPLETED', startDate: fromDate, endDate: toDate },
				{
					headers: {
						Authorization: `Bearer ${user?.token || user?.accessToken}`,
					},
				}
			);
			if (data) {
				console.log(data);
				toast.success('Field booked successfully');
				navigate(`/bookings`);
			}
			setLoading(false);
		} catch (error) {
			// const message = error?.data || 'Something went wrong!';
			setLoading(false);
			console.log('Error booking Field', error);
			const message = getError(error);
			return Swal.fire({
				title: 'Error!',
				icon: 'error',
				text: message,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
			});
		}
	};
	return (
		<>
			{isLoading || loading ? (
				<Loader />
			) : (
				<main className="body-content px-8 py-8 bg-slate-100">
					<div className="page-title mb-7">
						<h3 className="mb-0  text-xl md:text-3xl font-semibold">
							{data?.name}
						</h3>
					</div>
					<div className="bg-white shadow rounded-lg my-2 px-6 py-5 text-lg">
						<div>
							<div className="max-h-[300px] max-w-[300px] border mb-2">
								<img
									className="w-full object-cover"
									src={data?.image?.url}
									alt={data.name}
								/>
							</div>
							<div className="flex items-center my-2">
								<CiLocationOn className="font-bold text-3xl" />
								<p className="text-black">Address: {data?.address}</p>
							</div>
							<div>
								<h2>About this place</h2>
								<p> {data?.description}</p>
							</div>
							<p>
								Report Status:{' '}
								<span
									className={`${
										data?.status === 'available'
											? 'text-green-500'
											: 'text-yellow-700'
									} capitalize`}
								>
									{data?.status}
								</span>
							</p>
							<p>Field Capacity: {data?.capacity}</p>
						</div>
						{user?.user?.role === 'ADMIN' && data?.userId ? (
							<div>
								<div>
									<h4 className=" text-2xl">User Info</h4>
									<div>
										<p>Name: {data?.userId?.name}</p>
										<p>Rank {data?.userId?.rank}</p>
										<p>Phone {data?.userId?.phone}</p>
										<p>Email {data?.userId?.email}</p>
									</div>
								</div>
								<div>
									<h4 className=" text-2xl">Booked for</h4>
									{data?.schedule > 0 &&
										data?.schedule.map((item) => (
											<div key={item._id}>
												<p>Name: {data?.userId?.name}</p>
												<p>Rank {data?.userId?.rank}</p>
											</div>
										))}
								</div>
							</div>
						) : (
							''
						)}
					</div>

					<div className="flex justify-center my-10">
						{user?.user?.role === 'ADMIN' && data?.status !== 'COMPLETED' ? (
							<button
								className="w-full max-w-[300px] mx-auto px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
								onClick={handleClick}
							>
								Confirm Report
							</button>
						) : (
							<div className="bg-white border p-2 mt-10 rounded-md shadow-lg w-full md:max-w-md">
								<div>
									<span className="font-semibold text-lg">
										&#8358;{data.pricePerHour}
									</span>{' '}
									per Hour
								</div>
								<div className="md:border rounded-md mt-2 text-xs md:text-sm">
									<div className="md:flex">
										<div className="py-3 md:px-4">
											<label htmlFor="from">From</label>
											<input
												id="from"
												name="from"
												type="date"
												className="w-full"
												value={fromDate}
												onChange={(e) => setFromDate(e.target.value)}
											/>
										</div>
										<div className="py-3 md:px-4 md:border-l">
											<label htmlFor="to">To</label>
											<input
												type="date"
												id="to"
												name="to"
												className="w-full"
												value={toDate}
												onChange={(e) => setToDate(e.target.value)}
											/>
										</div>
									</div>
								</div>
								<div className="mt-4 w-full flex justify-center">
									<button
										className="w-full max-w-[300px] mx-auto px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
										onClick={handleBookField}
									>
										Reserve Field
									</button>
								</div>
							</div>
						)}
					</div>
				</main>
			)}
		</>
	);
};

export default Field;
