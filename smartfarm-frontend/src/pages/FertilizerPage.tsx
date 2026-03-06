import React, { useState } from "react";
import API from "../api/client";

const FertilizerPage = () => {
    const [formData, setFormData] = useState({
        soil_type: "",
        crop_name: "",
        moisture_level: 50,
        nitrogen: 50,
        phosphorus: 50,
        potassium: 50,
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: id === "soil_type" || id === "crop_name" ? value : parseFloat(value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await API.post("/ai/fertilizer-recommendation", formData);
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to get recommendation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-8 text-white">
                    <h1 className="text-3xl font-bold">Fertilizer Advisory</h1>
                    <p className="text-emerald-100 mt-2">Get personalized fertilizer recommendations based on your soil health.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="crop_name">Target Crop</label>
                                <input
                                    id="crop_name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900"
                                    placeholder="e.g. Maize, Teff, Wheat"
                                    value={formData.crop_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="soil_type">Soil Type</label>
                                <select
                                    id="soil_type"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900"
                                    value={formData.soil_type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select soil type</option>
                                    <option value="Black">Black Soil</option>
                                    <option value="Red">Red Soil</option>
                                    <option value="Clayey">Clayey Soil</option>
                                    <option value="Sandy">Sandy Soil</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Moisture Level ({formData.moisture_level}%)</label>
                                <input id="moisture_level" type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" value={formData.moisture_level} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nitrogen (N: {formData.nitrogen})</label>
                                <input id="nitrogen" type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={formData.nitrogen} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phosphorus (P: {formData.phosphorus})</label>
                                <input id="phosphorus" type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" value={formData.phosphorus} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Potassium (K: {formData.potassium})</label>
                                <input id="potassium" type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" value={formData.potassium} onChange={handleChange} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 mt-4"
                            >
                                {loading ? "Calculating..." : "Get Recommendation"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm">
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border-t-8 border-emerald-500 animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Top Recommendation</h2>
                            <p className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">{result.recommendation}</p>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="p-4 bg-blue-50 rounded-2xl text-center">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Nitrogen</p>
                                    <p className="text-xl font-bold text-blue-900">{formData.nitrogen}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-2xl text-center">
                                    <p className="text-xs text-red-600 font-bold uppercase">Phosphorus</p>
                                    <p className="text-xl font-bold text-red-900">{formData.phosphorus}</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-2xl text-center">
                                    <p className="text-xs text-orange-600 font-bold uppercase">Potassium</p>
                                    <p className="text-xl font-bold text-orange-900">{formData.potassium}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-emerald-600">💡</span> Application Tips
                            </h3>
                            <ul className="space-y-4">
                                {result.advice.map((tip: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-700 flex gap-3">
                                        <span className="text-emerald-500 font-bold">✓</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FertilizerPage;
