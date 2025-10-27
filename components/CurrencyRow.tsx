"use client";

import { AU, EU, GB, JP, NZ, US } from "country-flag-icons/react/3x2";
import { CURRENCY_INFO, CURRENCY_TO_COUNTRY } from "@/lib/constants";
import { formatCurrency, formatExchangeRate } from "@/lib/formatters";
import type { CurrencyCode } from "@/types/currency";

interface CurrencyRowProps {
	currency: CurrencyCode;
	rate: number;
	amount: number;
	onClick: () => void;
}

const FLAG_COMPONENTS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	AU,
	US,
	EU,
	GB,
	JP,
	NZ,
};

export default function CurrencyRow({
	currency,
	rate,
	amount,
	onClick,
}: CurrencyRowProps) {
	const currencyInfo = CURRENCY_INFO[currency];
	const convertedAmount = amount * rate;
	const countryCode = CURRENCY_TO_COUNTRY[currency];
	const FlagComponent = FLAG_COMPONENTS[countryCode];

	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
		>
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-3">
					{FlagComponent && <FlagComponent className="w-8 h-6 rounded" />}
					<span className="text-lg font-medium text-gray-700">
						{currencyInfo.code}
					</span>
				</div>
				<div className="text-right">
					<div className="text-2xl font-bold text-gray-900">
						{formatCurrency(convertedAmount, currency)}
					</div>
					<div className="text-sm text-gray-500 mt-1">
						{formatExchangeRate(rate, currency)}
					</div>
				</div>
			</div>
		</button>
	);
}
