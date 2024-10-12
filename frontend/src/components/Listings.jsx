import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Listing = () => {
	const [listings, setListings] = useState([]);
	useEffect(() => {
		axios.get('/fields').then((response) => {
			console.log('response.data', response.data);
			setListings([...response.data]);
		});
	}, []);
	return (
		<section className="px-4 py-4">
			<div className="flex justify-center mb-4">
				<h1 className="uppercase p-1 text-primary text-center font-bold text-2xl ">
					List Your Field with Us
				</h1>
			</div>
			<div className="flex justify-center w-full md:max-w-xl mx-auto text-center">
				<p>
					List you property and get benefits such as reaching a wider audience,
					easy booking management, and potential for higher income.
				</p>
			</div>
			<div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
				{listings.length > 0 &&
					listings.map((listing, index) => (
						<Link
							to={'/feilds/' + listing._id}
							key={index}
							className="bg-white border rounded-xl"
						>
							<div className="flex">
								<img
									className="rounded-l object-cover aspect-square"
									src={listing?.images?.url}
									alt=""
								/>
							</div>
							<div className="p-3">
								<h3 className="font-bold text-sm capitalize">
									{listing.type} in {listing.city}
								</h3>
								<h2 className="text-sm truncate text-gray-500">
									{listing.name}
								</h2>
								<div className="mt-1">
									<span className="font-bold">
										&#8358;{listing.pricePerHour}
									</span>{' '}
									per hour
								</div>
							</div>
						</Link>
					))}
			</div>
			<div>
				<Link to="register">Get Started</Link>
			</div>
		</section>
	);
};

export default Listing;
