import { useState, useEffect } from "react";
import API from "../api/client";

const WeatherPage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await API.get("/ai/weather-advisory");
                setData(response.data);
            } catch (err) {
                setError("Failed to load weather data.");
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-emerald-600 p-8 text-white flex justify-between items-center text-gray-900 border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Weather Advisory</h1>
                        <p className="text-emerald-100 mt-2">Personalized farming suggestions based on local weather.</p>
                    </div>
                    <div className="text-right text-white">
                        <p className="text-4xl font-black">{data.current_temp}°C</p>
                        <p className="font-bold">{data.current_condition}</p>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">5-Day Forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                        {data.forecast.map((f: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 hover:border-emerald-200 transition-all">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">{f.day}</p>
                                <span className="text-4xl block mb-2">{f.icon}</span>
                                <p className="text-xl font-black text-gray-900">{f.temp}°C</p>
                                <p className="text-[10px] text-gray-500">{f.condition}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                        <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                            <span>📢</span> Farming Recommendations
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.suggestions.map((s: string, i: number) => (
                                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex gap-4 items-start">
                                    <span className="text-2xl">🌱</span>
                                    <p className="text-emerald-900 font-medium">{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-xl text-gray-900 mb-4">Historical Rain Map</h3>
                <div className="bg-emerald-50 h-32 rounded-2xl flex items-center justify-center border border-dashed border-emerald-200">
                    <p className="text-emerald-600 font-bold">Satellite visualization coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherPage;
