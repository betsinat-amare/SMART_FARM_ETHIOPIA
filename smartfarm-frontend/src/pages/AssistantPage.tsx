import React, { useState, useRef, useEffect } from "react";
import API from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const AssistantPage = () => {
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem("smartfarm_chat_history");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
        return [
            {
                id: "1",
                text: "Hello! I'm your SmartFarm AI assistant. I can help you with crop health, weather forecasts, or market prices. How can I assist you today?",
                sender: "ai",
                timestamp: new Date(),
            },
        ];
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<"en" | "am">("en");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialLoad = useRef(true);

    const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (initialLoad.current) {
            scrollToBottom("auto");
            initialLoad.current = false;
        } else {
            scrollToBottom("smooth");
        }
        localStorage.setItem("smartfarm_chat_history", JSON.stringify(messages));
    }, [messages]);

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear your chat history?")) {
            const initialMsg: Message = {
                id: "1",
                text: "Hello! History cleared. How can I help you now?",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages([initialMsg]);
            localStorage.removeItem("smartfarm_chat_history");
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await API.post("/ai/chat", {
                message: input,
                language: language,
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.response,
                sender: "ai",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: language === "en"
                    ? "I'm having trouble connecting to my brain. Please check your internet or API key."
                    : "ከአካሌ ጋር መገናኘት አልቻልኩም። እባክዎ ኢንተርኔትዎን ወይም የኤፒአይ ቁልፍዎን ያረጋግጡ።",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden -m-8">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Header */}
            <div className="relative bg-white/70 backdrop-blur-2xl px-10 py-5 flex justify-between items-center border-b border-gray-100/50 shadow-sm z-20">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-100 border border-white/20">
                        🤖
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-900 tracking-tight">SmartFarm AI</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Agricultural Intelligence</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleClearChat}
                        className="p-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-100/50 rounded-xl hover:bg-red-50"
                        title="Clear Chat History"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <div className="flex bg-gray-100/80 backdrop-blur-md rounded-[1.25rem] p-1.5 border border-gray-200/50">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-6 py-2 rounded-[0.9rem] text-xs font-bold transition-all duration-300 ${language === "en" ? "bg-white text-emerald-800 shadow-sm scale-[1.02]" : "text-gray-500 hover:text-emerald-700"}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage("am")}
                            className={`px-6 py-2 rounded-[0.9rem] text-xs font-bold transition-all duration-300 ${language === "am" ? "bg-white text-emerald-800 shadow-sm scale-[1.02]" : "text-gray-500 hover:text-emerald-700"}`}
                        >
                            አማ
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="relative flex-1 overflow-y-auto px-8 py-10 space-y-8 z-10 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`group relative max-w-[80%] rounded-[1.75rem] px-6 py-4 transition-all duration-300 ${msg.sender === "user"
                                    ? "bg-emerald-600 text-white rounded-br-none shadow-xl shadow-emerald-600/10"
                                    : "bg-white text-slate-800 rounded-bl-none shadow-xl shadow-gray-200/50 border border-slate-100"
                                    }`}
                            >
                                <p className="text-[0.98rem] leading-[1.6] font-medium selection:bg-emerald-200/30 whitespace-pre-wrap">{msg.text}</p>
                                <div className={`flex items-center gap-2 mt-3 opacity-30 text-[9px] font-black uppercase tracking-[0.15em] ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span>•</span>
                                    <span>{msg.sender === "user" ? "You" : "Smart Assistant"}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white rounded-[1.75rem] rounded-bl-none px-6 py-5 shadow-xl shadow-gray-200/50 border border-slate-100">
                            <div className="flex items-center gap-1.5">
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Overlay */}
            <div className="relative p-10 pt-4 bg-transparent z-20">
                <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent -z-10" />

                <form onSubmit={handleSend} className="max-w-4xl mx-auto">
                    <div className="relative group bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100/50 p-2 pl-6 flex items-center transition-all duration-300 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-200">
                        <input
                            type="text"
                            className="flex-1 py-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[1.05rem]"
                            placeholder={language === "en" ? "Ask me anything about your farm..." : "ስለ እርሻዎ ማንኛውንም ነገር ይጠይቁኝ..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-[1.05] active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center shrink-0"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-[9px] text-gray-400 mt-5 uppercase tracking-[0.3em] font-black opacity-60">
                        AI Powered Agricultural Excellence
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AssistantPage;
