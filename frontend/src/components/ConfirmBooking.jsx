/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiXMark } from 'react-icons/hi2';

const LogoutModal = ({ setShow, show, handleBooking, amount }) => {
	return (
		<Transition appear show={show} as={Fragment}>
			<Dialog as="div" className="relative" onClose={() => {}}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/70 bg-opacity-25 z-50" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto flex place-content-center z-50">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all font-josefin">
								<div className="flex justify-between px-5 pt-4">
									<div>
										<p className="font-light text-primary">Confirm Booking</p>
									</div>
									<button
										onClick={() => setShow(false)}
										className="m-1 p-1 py-1 shadow rounded-full bg-red-200 hover:bg-red-300 duration-150 ease-in-out"
									>
										<HiXMark className="fa-solid fa-xmark text-xl text-red-600 hover:text-red-800" />
									</button>
								</div>
								<div className="container mx-auto my-auto flex items-center justify-center">
									<div className="w-[500px] mx-auto my-auto  pt-[20px] pb-[20px] px-[20px]">
										<div className="text-center">
											<h4 className="text-[24px] mb-1">
												Total amount ₦{amount}
											</h4>
											<p className="mt-3 text-lg md:text-xl">
												Are you sure you want book Field?
											</p>
										</div>
										<div className="pt-[10px]">
											<button
												className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-full flex items-center justify-center rounded-md"
												onClick={handleBooking}
											>
												<span className="text-lg">Confirm</span>
											</button>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default LogoutModal;
