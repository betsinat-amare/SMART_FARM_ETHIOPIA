import { useState, useEffect } from "react";
import API from "../api/client";

interface Farm {
    id: number;
    name: string;
    region: string;
    district: string;
    soil_type: string;
    size_in_hectares: number;
    created_at: string;
}

const FarmsPage = () => {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        region: "",
        district: "",
        soil_type: "",
        size_in_hectares: 0,
    });

    const fetchFarms = async () => {
        try {
            const res = await API.get("/farms/");
            setFarms(res.data);
        } catch (err: any) {
            setError("Failed to fetch farms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    const handleCreateFarm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/farms/", formData);
            setIsModalOpen(false);
            setFormData({
                name: "",
                region: "",
                district: "",
                soil_type: "",
                size_in_hectares: 0,
            });
            fetchFarms();
        } catch (err: any) {
            setError("Failed to create farm.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Farms</h1>
                    <p className="text-gray-500 mt-1">Manage and monitor all your registered farm lands.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                    + Add New Farm
                </button>
            </div>

            {loading && !farms.length ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">{error}</div>
            ) : farms.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                    <div className="text-6xl mb-4">🚜</div>
                    <h2 className="text-xl font-bold text-gray-900">No Farms Yet</h2>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Click "Add New Farm" to register your first plot of land.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farms.map((farm) => (
                        <div key={farm.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="h-32 bg-emerald-100 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 pointer-events-none text-8xl flex items-center justify-center grayscale">🌾</div>
                                <div className="absolute bottom-3 left-6 flex gap-2">
                                    <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">{farm.region}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{farm.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{farm.district}, Ethiopia</p>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Soil Type</p>
                                        <p className="font-medium text-gray-700">{farm.soil_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Size</p>
                                        <p className="font-medium text-gray-700">{farm.size_in_hectares} ha</p>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 py-2 rounded-xl font-bold text-sm transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for adding farm */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Add New Farm</h2>
                                <p className="text-gray-500 text-sm">Fill in the details for your new farm land.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateFarm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Farm Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                    placeholder="e.g. Bishoftu Highlands"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Region</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                        placeholder="Oromia"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                        placeholder="Bishoftu"
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Soil Type</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                        value={formData.soil_type}
                                        onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                                    >
                                        <option value="">Select type</option>
                                        <option value="Black Soil">Black Soil</option>
                                        <option value="Red Soil">Red Soil</option>
                                        <option value="Sandy Soil">Sandy Soil</option>
                                        <option value="Loam Soil">Loam Soil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Size (Hectares)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-900"
                                        placeholder="2.5"
                                        value={formData.size_in_hectares}
                                        onChange={(e) => setFormData({ ...formData, size_in_hectares: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg mt-4 transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Adding..." : "Register Farm"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmsPage;
