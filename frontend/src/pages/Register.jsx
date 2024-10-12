import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import getError from './../hooks/getError';
import { bgImage } from './../data';
import Swal from 'sweetalert2';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [userType, setUserType] = useState('student');
	const [regId, setRegId] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const apiUrl = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await axios.post(`${apiUrl}/users/register`, {
				name,
				email,
				rank: userType,
				regId,
				phone,
				password,
			});
			setLoading(false);
			if (response.data) {
				Swal.fire({
					title: 'Registration successful',
					icon: 'success',
					text: 'Log in to continue',
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
				});

				navigate('/login');
			}
		} catch (error) {
			setLoading(false);

			console.error('Error registering:', error);
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
			<div className="h-full bg-gray-400">
				<div className="mx-auto">
					<div className="flex justify-center px-6 py-12">
						<div className="w-full xl:w-3/4 lg:w-11/12 flex">
							<div
								className="w-full h-auto bg-gray-400  hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
								style={{
									backgroundImage: `url(${bgImage})`,
								}}
								// style="background-image: url('https://source.unsplash.com/Mv9hjnEUHR4/600x800')"
							></div>

							<div className="w-full lg:w-7/12 bg-white  p-5 rounded-lg lg:rounded-l-none">
								<h3 className="py-4 text-2xl text-center text-gray-800 ">
									Create an Account!
								</h3>
								<form
									className="px-8 pt-6 pb-8 mb-4 bg-white  rounded"
									onSubmit={handleRegister}
								>
									<div className="">
										<label
											className="block mb-2 text-sm font-bold text-gray-700 "
											htmlFor="firstName"
										>
											First Name
										</label>
										<input
											className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
											id="firstName"
											type="text"
											placeholder="Full Name"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="mb-4 md:flex md:justify-between">
										<div className="mb-4 md:mr-2 md:mb-0 w-full">
											<label
												className="block mb-2 text-sm font-bold text-gray-700 "
												htmlFor="email"
											>
												Email
											</label>
											<input
												className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
												id="email"
												type="email"
												placeholder="Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</div>
										<div className="md:ml-2 w-full">
											<label
												className="block mb-2 text-sm font-bold text-gray-700 "
												htmlFor="Phone"
											>
												Phone number
											</label>
											<input
												className="w-full px-3 py-2 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
												id="Phone"
												type="text"
												placeholder="09023233"
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
											/>
										</div>
									</div>

									<div className="mb-4 md:flex md:justify-between">
										<div className="mb-4 md:mr-2 md:mb-0 w-full">
											<label
												className="block mb-2 text-sm font-bold text-gray-700 "
												htmlFor="rank"
											>
												Select Rank
											</label>
											<select
												id="rank"
												value={userType}
												onChange={(e) => setUserType(e.target.value)}
												className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
											>
												<option value="student">Student</option>
												<option value="staff">Staff</option>
											</select>
										</div>
										<div className="md:ml-2 w-full">
											<label
												className="block mb-2 text-sm font-bold text-gray-700 "
												htmlFor="regId"
											>
												Student Id/Staff Id
											</label>
											<input
												className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
												id="regId"
												type="text"
												placeholder="UG18/COMS/1000"
												value={regId}
												onChange={(e) => setRegId(e.target.value)}
											/>
										</div>
									</div>
									<div className="mb-4 md:flex md:justify-between">
										<div className="mb-4 md:mr-2 md:mb-0 w-full">
											<label
												className="block mb-2 text-sm font-bold text-gray-700 "
												htmlFor="password"
											>
												Password
											</label>
											<input
												className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border border-red-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
												id="password"
												type="password"
												placeholder="******************"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<p className="text-xs italic text-red-500">
												Please choose a password.
											</p>
										</div>
										<div className="md:ml-2 w-full">
											<label
												className="block mb-2 text-sm font-bold text-gray-700 "
												htmlFor="c_password"
											>
												Confirm Password
											</label>
											<input
												className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
												id="c_password"
												type="password"
												placeholder="******************"
											/>
										</div>
									</div>
									<div className="mb-6 text-center">
										<button
											className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline"
											type="submit"
										>
											Register Account
										</button>
									</div>
									<hr className="mb-6 border-t" />
									<div className="text-center">
										<a
											className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
											href="#"
										>
											Forgot Password?
										</a>
									</div>
									<div className="text-center">
										<Link
											className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
											to="/login"
										>
											Already have an account? Login!
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			{loading && <Loader />}
		</>
	);
};

export default Register;
