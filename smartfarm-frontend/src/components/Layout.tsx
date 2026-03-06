import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: "Dashboard", path: "/", icon: "📊" },
        { name: "My Farms", path: "/farms", icon: "🚜" },
        { name: "Crops", path: "/crops", icon: "🌱" },
        { name: "Marketplace", path: "/market", icon: "🏪" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-emerald-900 text-white transition-all duration-300 flex flex-col`}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center text-xl">
                        🌾
                    </div>
                    {isSidebarOpen && <span className="text-xl font-bold">SmartFarm</span>}
                </div>

                <nav className="flex-1 mt-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 transition-colors ${location.pathname === item.path
                                    ? "bg-emerald-800 border-l-4 border-emerald-400"
                                    : "hover:bg-emerald-800"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-emerald-800">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-emerald-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full text-emerald-300 hover:text-white transition-colors"
                    >
                        <span className="text-xl">🚪</span>
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        ☰
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-xl cursor-not-allowed">🔔</span>
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
