"use client";

import * as Flags from "country-flag-icons/react/3x2";
import { Calculator, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { fetchCurrentRates } from "@/lib/api";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { formatNumber, parseInputNumber } from "@/lib/formatters";
import type { CurrencyCode, RatesResponse } from "@/types/currency";
import ChartView from "./ChartView";
import CurrencyRow from "./CurrencyRow";
import Keypad from "./Keypad";
import Modal from "./Modal";
import LoaderOne from "./ui/LoaderOne";

export default function CurrencyConverter() {
	const inputId = useId();
	const [amount, setAmount] = useState<string>("0.00");
	const [rates, setRates] = useState<RatesResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);

	const AUFlag = Flags.AU as React.ComponentType<{ className?: string }>;

	const loadRates = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await fetchCurrentRates();
			setRates(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load rates");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadRates();

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, [loadRates]);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value);
	};

	const handleAmountBlur = () => {
		const numericValue = parseInputNumber(amount);
		if (numericValue > 0) {
			setAmount(formatNumber(numericValue, 2));
		} else {
			setAmount("0.00");
		}
	};

	const handleCurrencyClick = (currency: CurrencyCode) => {
		setSelectedCurrency(currency);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCurrency(null);
	};

	const handleCalculatorClick = () => {
		if (isMobile) {
			setIsKeypadOpen(true);
		} else {
			const inputElement = document.getElementById(inputId) as HTMLInputElement;
			if (inputElement) {
				inputElement.focus();
				inputElement.select();
			}
		}
	};

	const handleKeypadChange = (newValue: string) => {
		setAmount(newValue);
	};

	const handleKeypadClose = () => {
		setIsKeypadOpen(false);
		handleAmountBlur();
	};

	const numericAmount = parseInputNumber(amount);

	return (
		<div className="min-h-screen bg-white py-12 px-4">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<h1 className="text-4xl font-normal text-gray-500 text-center mb-12">
					Convert
				</h1>

				{/* Input Section */}
				<div className="mb-8">
					<div className="flex items-center gap-4 px-6 py-4 border-2 border-blue-500 rounded-2xl bg-white">
						<div className="flex items-center gap-3">
							<AUFlag className="w-10 h-7 rounded" />
							<div className="flex items-center gap-1">
								<span className="text-xl font-medium text-gray-700">AUD</span>
								<ChevronDown className="w-5 h-5 text-gray-400" />
							</div>
						</div>
						<input
							id={inputId}
							type="text"
							value={amount}
							onChange={handleAmountChange}
							onBlur={handleAmountBlur}
							placeholder="0.00"
							className="flex-1 text-2xl font-medium text-right outline-none text-gray-900"
							disabled={loading}
						/>
						<button
							type="button"
							onClick={handleCalculatorClick}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							aria-label="Open calculator"
						>
							<Calculator className="w-6 h-6 text-gray-400" />
						</button>
					</div>
				</div>

				{/* Error State */}
				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl">
						<p className="text-red-700 text-sm mb-2">{error}</p>
						<button
							type="button"
							onClick={loadRates}
							className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
						>
							Retry
						</button>
					</div>
				)}

				{loading && <LoaderOne />}

				{/* Results Section */}
				{!loading && rates && (
					<div className="flex flex-col gap-3">
						{SUPPORTED_CURRENCIES.map((currency) => (
							<CurrencyRow
								key={currency}
								currency={currency}
								rate={rates.rates[currency]}
								amount={numericAmount}
								onClick={() => handleCurrencyClick(currency)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Chart Modal */}
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={`${selectedCurrency} Exchange Rate Chart`}
			>
				{selectedCurrency && (
					<ChartView currency={selectedCurrency} onClose={handleCloseModal} />
				)}
			</Modal>

			{/* Keypad Modal */}
			<Keypad
				isOpen={isKeypadOpen}
				onClose={handleKeypadClose}
				value={amount}
				onChange={handleKeypadChange}
			/>
		</div>
	);
}
