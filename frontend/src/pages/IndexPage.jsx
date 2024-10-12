import About from '../components/About';
// import Header from '../components/Header';
// import Rooms from '../components/Rooms';
import Listing from '../components/Listings';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';

export default function IndexPage() {
	return (
		<>
			{/* <Header /> */}
			<About />
			{/* <Rooms /> */}
			<Testimonials />
			<Listing />
			<Footer />
		</>
	);
}
