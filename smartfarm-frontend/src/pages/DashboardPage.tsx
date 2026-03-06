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

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
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
