import { useState, useEffect } from "react";
import API from "../api/client";

interface Crop {
    id: number;
    name: string;
    variety: string;
    planting_date: string;
    expected_yield: number | null;
    farm_id: number;
}

interface Farm {
    id: number;
    name: string;
}

interface Prediction {
    id: number;
    predicted_yield: number;
    confidence_score: number;
    created_at: string;
}

const CropsPage = () => {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFarmId, setSelectedFarmId] = useState<number | "">("");
    const [predictionData, setPredictionData] = useState<Prediction | null>(null);
    const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
    const [predLoading, setPredLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        variety: "",
        planting_date: "",
        expected_yield: 0,
    });

    const fetchData = async () => {
        try {
            const farmsRes = await API.get("/farms/");
            setFarms(farmsRes.data);

            // If farms exist, try to fetch all crops for all farms or just the first one
            // For simplicity, let's fetch crops for the first farm if none selected
            if (farmsRes.data.length > 0) {
                const farmId = selectedFarmId || farmsRes.data[0].id;
                setSelectedFarmId(farmId);
                const cropsRes = await API.get(`/crops/${farmId}`);
                setCrops(cropsRes.data);
            }
        } catch (err: any) {
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFarmChange = async (farmId: number) => {
        setSelectedFarmId(farmId);
        setLoading(true);
        try {
            const res = await API.get(`/crops/${farmId}`);
            setCrops(res.data);
        } catch (err) {
            setError("Failed to fetch crops for this farm.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetPrediction = async (cropId: number) => {
        setPredLoading(true);
        setIsPredictionModalOpen(true);
        try {
            const res = await API.post(`/predictions/${cropId}`);
            setPredictionData(res.data);
        } catch (err) {
            setError("Failed to generate prediction.");
        } finally {
            setPredLoading(false);
        }
    };

    const handleCreateCrop = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFarmId) return;

        setLoading(true);
        try {
            await API.post(`/crops/${selectedFarmId}`, formData);
            setIsModalOpen(false);
            setFormData({
                name: "",
                variety: "",
                planting_date: "",
                expected_yield: 0,
            });
            handleFarmChange(selectedFarmId as number);
        } catch (err: any) {
            setError("Failed to create crop.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
                    <p className="text-gray-500 mt-1">Track growth cycles and yield expectations for your crops.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedFarmId}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                >
                    + Add New Crop
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 animate-fadeIn">
                    {error}
                </div>
            )}

            {/* Farm Selector */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select Farm:</span>
                <div className="flex gap-2">
                    {farms.map((farm) => (
                        <button
                            key={farm.id}
                            onClick={() => handleFarmChange(farm.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedFarmId === farm.id
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-gray-50 text-gray-600 hover:bg-emerald-50"
                                }`}
                        >
                            {farm.name}
                        </button>
                    ))}
                    {farms.length === 0 && <p className="text-sm text-gray-400">Please add a farm first.</p>}
                </div>
            </div>

            {loading && !crops.length ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : crops.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                    <div className="text-6xl mb-4">🌱</div>
                    <h2 className="text-xl font-bold text-gray-900">No Crops in this Farm</h2>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Start by adding your first crop to track its progress.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Variety</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Planting Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Est. Yield</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {crops.map((crop) => (
                                <tr key={crop.id} className="hover:bg-emerald-50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-900">{crop.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{crop.variety}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(crop.planting_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">
                                            {crop.expected_yield || "0"} quintals
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleGetPrediction(crop.id)}
                                            className="text-emerald-600 font-bold text-sm hover:underline"
                                        >
                                            Get Prediction 🔮
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for adding crop */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Add New Crop</h2>
                                <p className="text-gray-500 text-sm">Register a new crop for the current farm.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateCrop} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                    placeholder="e.g. Maize"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Variety</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                    placeholder="e.g. Hybrid QPM"
                                    value={formData.variety}
                                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Planting Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                        value={formData.planting_date}
                                        onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Est. Yield (Quintals)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                        placeholder="15.0"
                                        value={formData.expected_yield}
                                        onChange={(e) => setFormData({ ...formData, expected_yield: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg mt-4 transition-all transform active:scale-95"
                            >
                                Add Crop
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Predictions */}
            {isPredictionModalOpen && (
                <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Yield Prediction</h2>
                            <button onClick={() => { setIsPredictionModalOpen(false); setPredictionData(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        {predLoading ? (
                            <div className="text-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                <p className="text-gray-500 font-medium">Analyzing soil, weather, and variety patterns...</p>
                            </div>
                        ) : predictionData ? (
                            <div className="space-y-6">
                                <div className="bg-emerald-50 p-6 rounded-3xl text-center border border-emerald-100">
                                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Predicted Yield</p>
                                    <p className="text-5xl font-black text-emerald-900">{predictionData.predicted_yield.toFixed(1)} <span className="text-xl">q/ha</span></p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-500">Confidence Score</span>
                                        <span className="text-emerald-600">{(predictionData.confidence_score * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${predictionData.confidence_score * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
                                    <span className="text-blue-500 text-xl">ℹ️</span>
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                        This prediction is based on current soil data and historical weather patterns for the selected region. Accuracy may vary based on unforeseen climate changes.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsPredictionModalOpen(false)}
                                    className="w-full bg-emerald-900 text-white font-bold py-3 rounded-xl hover:bg-emerald-950 transition-colors"
                                >
                                    Close Report
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropsPage;
