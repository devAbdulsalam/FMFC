import About from '../components/About';
// import Header from '../components/Header';
// import Rooms from '../components/Rooms';
import Listing from '../components/Listings';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import { useQuery } from '@tanstack/react-query';
import { fetchFields } from '../hooks/axiosApis';
import {  useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';

export default function IndexPage() {
	
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const { data, isLoading, error } = useQuery({
		queryKey: ['dashboard'],
		queryFn: async () => fetchFields(),
	});
	useEffect(() => {
		if (user) {
			navigate('/dashboard');
		}
	}, [user, navigate]);
	return (
		<>
			{/* <Header /> */}
			<About />
			{/* <Rooms /> */}
			<Testimonials />
			<Listing listing={ data} />
			<Footer />
		</>
	);
}
