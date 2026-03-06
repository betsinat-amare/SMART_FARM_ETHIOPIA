import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const DashboardPage = () => {
    const { user } = useAuth();

    const stats = [
        { name: "Total Farms", value: "3", icon: "🚜", color: "bg-blue-100 text-blue-600" },
        { name: "Active Crops", value: "8", icon: "🌱", color: "bg-green-100 text-green-600" },
        { name: "Avg Humidity", value: "45%", icon: "💧", color: "bg-cyan-100 text-cyan-600" },
        { name: "Temperature", value: "24°C", icon: "🌡️", color: "bg-orange-100 text-orange-600" },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here's what's happening today.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-emerald-100 transition-all active:scale-95">
                    + Add New Farm
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* AI Features Quick Access */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-50 transform hover:scale-[1.02] transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Weather Forecast</h3>
                        <span className="text-3xl">🌦️</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <p className="text-4xl font-black text-emerald-600">23°C</p>
                        <p className="text-gray-500 font-medium">Bishoftu Highlands</p>
                    </div>
                    <p className="text-sm text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <strong>Tip:</strong> Heavy rain expected on Thursday. Delay fertilization.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-50 transform hover:scale-[1.02] transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Cereal Market Prices</h3>
                        <span className="text-3xl">📈</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Maize (White)</span>
                            <span className="font-bold text-gray-900">1,240 ETB/Qt</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Teff (Magna)</span>
                            <span className="font-bold text-gray-900">7,200 ETB/Qt</span>
                        </div>
                        <div className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer">
                            View full forecast →
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { name: "Disease Detection", icon: "🔍", path: "/disease-detection" },
                    { name: "Fertilizer Advisory", icon: "🌱", path: "/fertilizer" },
                    { name: "Market Prices", icon: "📊", path: "/market-prices" },
                    { name: "AI Assistant", icon: "🤖", path: "/assistant" },
                ].map((tool, i) => (
                    <Link
                        key={i}
                        to={tool.path}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center hover:border-emerald-500 transition-all group"
                    >
                        <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                        <span className="text-xs font-bold text-gray-700">{tool.name}</span>
                    </Link>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Crop Health Update</p>
                                    <p className="text-gray-500 text-sm">Bishoftu Farm - Maize crops are showing optimal growth markers.</p>
                                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-4">Farming Tip</h2>
                        <p className="text-emerald-100 leading-relaxed">
                            Rotate your legumes with grain crops to naturally replenish nitrogen levels in the soil. This reduces reliance on synthetic fertilizers.
                        </p>
                        <button className="mt-8 bg-white text-emerald-900 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                            Read More
                        </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-10">🍃</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
