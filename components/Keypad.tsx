"use client";

import { Delete, X } from "lucide-react";
import Modal from "./Modal";

interface KeypadProps {
	isOpen: boolean;
	onClose: () => void;
	value: string;
	onChange: (value: string) => void;
}

export default function Keypad({
	isOpen,
	onClose,
	value,
	onChange,
}: KeypadProps) {
	const handleNumberClick = (num: string) => {
		if (value === "0.00" || value === "0") {
			onChange(num);
		} else {
			onChange(`${value}${num}`);
		}
	};

	const handleDecimalClick = () => {
		if (!value.includes(".")) {
			onChange(`${value}.`);
		}
	};

	const handleBackspace = () => {
		if (value.length > 1) {
			onChange(value.slice(0, -1));
		} else {
			onChange("0");
		}
	};

	const handleClear = () => {
		onChange("0.00");
	};

	const buttons = [
		{ label: "1", action: () => handleNumberClick("1") },
		{ label: "2", action: () => handleNumberClick("2") },
		{ label: "3", action: () => handleNumberClick("3") },
		{ label: "4", action: () => handleNumberClick("4") },
		{ label: "5", action: () => handleNumberClick("5") },
		{ label: "6", action: () => handleNumberClick("6") },
		{ label: "7", action: () => handleNumberClick("7") },
		{ label: "8", action: () => handleNumberClick("8") },
		{ label: "9", action: () => handleNumberClick("9") },
		{ label: ".", action: handleDecimalClick },
		{ label: "0", action: () => handleNumberClick("0") },
		{ label: "clear", action: handleBackspace, icon: Delete },
	];

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Enter Amount">
			<div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-medium text-gray-900">Enter Amount</h2>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						aria-label="Close keypad"
					>
						<X className="w-6 h-6 text-gray-500" />
					</button>
				</div>

				<div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
					<div className="text-right text-3xl font-bold text-gray-900">
						AUD {value}
					</div>
				</div>

				<div className="grid grid-cols-3 gap-3 mb-4">
					{buttons.map((button) => {
						const Icon = button.icon;
						return (
							<button
								key={button.label}
								type="button"
								onClick={button.action}
								className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-2xl font-medium text-gray-900 transition-colors flex items-center justify-center"
							>
								{Icon ? <Icon className="w-6 h-6" /> : button.label}
							</button>
						);
					})}
				</div>

				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={handleClear}
						className="h-16 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-xl text-lg font-medium text-red-700 transition-colors"
					>
						Clear
					</button>
					<button
						type="button"
						onClick={onClose}
						className="h-16 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl text-lg font-medium text-white transition-colors"
					>
						Done
					</button>
				</div>
			</div>
		</Modal>
	);
}
