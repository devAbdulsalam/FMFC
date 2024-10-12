import { Link } from 'react-router-dom';
// import LogoIcon from '../assets/icons/LogoIcon';
const Footer = () => {
	return (
		<footer id="contact" className="text-white bg-slate-900 p-5">
			<div className="flex flex-col items-start md:flex-row gap-2 justify-between">
				<div className="flex flex-col md:items-end md:flex-row gap-2">
					<Link to="/" className="flex items-center gap-2">
						{/* <LogoIcon></LogoIcon> */}
						<span className="font-bold text-xl text-primary">FMFC</span>
					</Link>
				</div>
			</div>
			<div className="flex justify-around w-full">
				<div className="flex flex-col">
					<Link to="">Home</Link>
					<Link to="">Rooms</Link>
					<Link to="">About Us</Link>
					<Link to="">Contact</Link>
				</div>
				<div className="flex flex-col">
					<Link to="">Home</Link>
					<Link to="">Rooms</Link>
					<Link to="">About Us</Link>
					<Link to="">Contact</Link>
				</div>
			</div>

			<hr />

			<div className="flex md:flex-row flex-col gap-3 items-center justify-around mt-[20px]">
				<p className="flex flex-row items-center gap-1 text-slate-400 text-[12] md:text-[18px]">
					Website built by{' '}
					<a
						className="uppercase font-bold text-slate-500 "
						href="https://devabdulsalam.vercel.com"
					>
						Abdulsalam
					</a>{' '}
				</p>
				<p className="md:text-[20px] text-[15px] text-slate-50">
					&copy; StudioBnB 2023
				</p>
			</div>
		</footer>
	);
};

export default Footer;
