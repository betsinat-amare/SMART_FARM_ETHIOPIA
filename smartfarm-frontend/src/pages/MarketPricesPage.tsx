import { useState, useEffect } from "react";

import API from "../api/client";

const MarketPricesPage = () => {
    const [crop, setCrop] = useState("Maize");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/ai/market-prices?crop_name=${crop}`);
            setData(response.data);
        } catch (err) {
            setError("Failed to load market data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, [crop]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-gray-900 border border-gray-100">
                <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Market Price Forecast</h1>
                        <p className="text-emerald-100 mt-2">Real-time local market trends and future forecasts.</p>
                    </div>
                    <select
                        className="bg-emerald-700 text-white border border-emerald-500 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                    >
                        <option value="Maize">Maize</option>
                        <option value="Teff">Teff</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Barley">Barley</option>
                    </select>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : (
                        <div className="space-y-10">
                            {/* Summary Cards */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Price</p>
                                    <p className="text-3xl font-black text-gray-900">{data.current_price} ETB/Qt</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">90-Day Trend</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-3xl font-black ${data.trend === 'Increasing' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                            {data.trend}
                                        </span>
                                        <span className="text-2xl">{data.trend === 'Increasing' ? '📈' : '➡️'}</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Market Sentiment</p>
                                    <p className="text-3xl font-black text-emerald-900">Bullish</p>
                                </div>
                            </div>

                            {/* Chart Placeholder / Visual */}
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 relative">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Price Trajectory (ETB per Quintal)</h3>
                                <div className="h-64 flex items-end justify-between gap-2 overflow-hidden px-4">
                                    {data.history.map((item: any, i: number) => (
                                        <div key={i} className="flex-1 flex flex-col items-center group relative">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer ${item.type === 'Forecast' ? 'bg-emerald-300' : 'bg-emerald-600'}`}
                                                style={{ height: `${(item.price / 5000) * 100}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {item.price} ETB
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 rotate-45 transform origin-left whitespace-nowrap">{item.date.split('-')[1]}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 flex justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                                        <span className="text-xs text-gray-500">Historical</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                                        <span className="text-xs text-gray-500">Forecast</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-xl text-gray-900 mb-4">Market Insights</h3>
                    <p className="text-gray-600 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-2">
                        "The recent rainfall in the western regions is expected to stabilize maize prices in the coming month. Traders are advised to hold stock until the mid-quarter peak."
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-xl text-gray-900 mb-4">Nearby Markets</h3>
                    <div className="space-y-3">
                        {["Addis Ababa (Merkato)", "Adama Market", "Bishoftu Regional"].map((m, i) => (
                            <div key={i} className="flex justify-between items-center p-3 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer">
                                <span className="text-gray-700 font-medium">{m}</span>
                                <span className="text-emerald-600 font-bold">In-Stock</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketPricesPage;
