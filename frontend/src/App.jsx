import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './hooks/ProtectedRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './NotFound';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Book from './pages/Book';
import DashboardLayout from './pages/DashboardLayout';
function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route element={<ProtectedRoutes />}>
					<Route exact path="/" element={<DashboardLayout />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/add-bus" element={<Book />} />
						<Route path="/book" element={<Book />} />
						<Route path="/bookings" element={<Booking />} />
					</Route>
				</Route>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}

export default App;