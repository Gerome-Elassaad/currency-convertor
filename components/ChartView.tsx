"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { fetchHistoricalRates } from "@/lib/api";
import { calculateStatistics } from "@/lib/calculations";
import { CURRENCY_INFO } from "@/lib/constants";
import {
	formatCurrency,
	formatDateLong,
	formatDateShort,
	formatPercentage,
} from "@/lib/formatters";
import type { CurrencyCode, Statistics } from "@/types/currency";
import LoaderOne from "./ui/LoaderOne";

interface ChartViewProps {
	currency: CurrencyCode;
	onClose?: () => void;
}

interface ChartDataPoint {
	date: string;
	displayDate: string;
	rate: number;
}

export default function ChartView({ currency, onClose }: ChartViewProps) {
	const router = useRouter();
	const gradientId = useId();
	const [data, setData] = useState<ChartDataPoint[]>([]);
	const [statistics, setStatistics] = useState<Statistics | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const currencyInfo = CURRENCY_INFO[currency];

	const loadHistoricalData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetchHistoricalRates(currency);

			const sortedData = response.data.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			);

			const chartData: ChartDataPoint[] = sortedData.map((point) => ({
				date: point.date,
				displayDate: formatDateShort(new Date(point.date)),
				rate: point.rate,
			}));

			setData(chartData);

			const stats = calculateStatistics(sortedData);
			setStatistics(stats);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load chart data",
			);
		} finally {
			setLoading(false);
		}
	}, [currency]);

	useEffect(() => {
		loadHistoricalData();
	}, [loadHistoricalData]);

	const handleBack = () => {
		if (onClose) {
			onClose();
		} else {
			router.push("/");
		}
	};

	if (loading) {
		return (
			<div
				className={`${onClose ? "" : "min-h-screen"} bg-gray-100 flex items-center justify-center ${onClose ? "py-12" : ""}`}
			>
				<LoaderOne />
			</div>
		);
	}

	if (error) {
		return (
			<div className={`${onClose ? "" : "min-h-screen"} bg-gray-100 py-8 px-4`}>
				<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
					<p className="text-red-700 mb-4">{error}</p>
					<div className="flex gap-4 justify-center">
						<button
							type="button"
							onClick={loadHistoricalData}
							className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Try Again
						</button>
						<button
							type="button"
							onClick={handleBack}
							className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
						>
							{onClose ? "Close" : "Back to Converter"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`${onClose ? "" : "min-h-screen"} bg-gray-100 py-8 px-4`}>
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6 mb-6">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{currency} Exchange Rate History
							</h1>
							<p className="text-gray-600 mt-1">
								AUD / {currencyInfo.name} - Last 14 Days
							</p>
						</div>
						{!onClose && (
							<button
								type="button"
								onClick={handleBack}
								className="px-6 py-2 bg-gray-300 border border-gray-400 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
							>
								← Back to Converter
							</button>
						)}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6 mb-6">
					<ResponsiveContainer width="100%" height={400}>
						<AreaChart data={data}>
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
							<XAxis
								dataKey="displayDate"
								stroke="#666"
								style={{ fontSize: "12px" }}
							/>
							<YAxis
								stroke="#666"
								style={{ fontSize: "12px" }}
								label={{
									value: `Exchange Rate (AUD to ${currency})`,
									angle: -90,
									position: "insideLeft",
									style: { textAnchor: "middle" },
								}}
								domain={["auto", "auto"]}
								tickFormatter={(value) =>
									value.toFixed(currencyInfo.decimals === 0 ? 2 : 4)
								}
							/>
							<Tooltip
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										const dataPoint = payload[0].payload as ChartDataPoint;
										return (
											<div className="bg-white border border-gray-300 rounded p-3 shadow-lg">
												<p className="text-sm font-medium text-gray-900">
													{formatDateLong(new Date(dataPoint.date))}
												</p>
												<p className="text-sm text-gray-700 mt-1">
													{formatCurrency(dataPoint.rate, currency)}
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
							<Area
								type="monotone"
								dataKey="rate"
								stroke="#4A90E2"
								strokeWidth={2}
								fill={`url(#${gradientId})`}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{statistics && (
					<div className="bg-gray-50 rounded-lg border border-gray-300 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Statistics
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="bg-white p-4 rounded border border-gray-200">
								<p className="text-sm text-gray-600">Current Rate</p>
								<p className="text-xl font-bold text-gray-900">
									{formatCurrency(statistics.current, currency)}
								</p>
							</div>
							<div className="bg-white p-4 rounded border border-gray-200">
								<p className="text-sm text-gray-600">14-Day Average</p>
								<p className="text-xl font-bold text-gray-900">
									{formatCurrency(statistics.average, currency)}
								</p>
							</div>
							<div className="bg-white p-4 rounded border border-gray-200">
								<p className="text-sm text-gray-600">Highest</p>
								<p className="text-xl font-bold text-gray-900">
									{formatCurrency(statistics.highest.rate, currency)}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									{formatDateLong(new Date(statistics.highest.date))}
								</p>
							</div>
							<div className="bg-white p-4 rounded border border-gray-200">
								<p className="text-sm text-gray-600">Lowest</p>
								<p className="text-xl font-bold text-gray-900">
									{formatCurrency(statistics.lowest.rate, currency)}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									{formatDateLong(new Date(statistics.lowest.date))}
								</p>
							</div>
							<div className="bg-white p-4 rounded border border-gray-200 md:col-span-2">
								<p className="text-sm text-gray-600">14-Day Change</p>
								<p
									className={`text-xl font-bold ${
										statistics.change >= 0 ? "text-green-600" : "text-red-600"
									}`}
								>
									{formatPercentage(statistics.change)}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
