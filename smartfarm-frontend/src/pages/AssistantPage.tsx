import React, { useState, useRef, useEffect } from "react";
import API from "../api/client";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const AssistantPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm your SmartFarm AI assistant. How can I help you with your farm today?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<"en" | "am">("en");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const errMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                <div>
                    <h1 className="text-xl font-bold">SmartFarm AI Assistant</h1>
                    <p className="text-emerald-100 text-sm">Advice on crops, weather, and diseases</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === "en" ? "bg-white text-emerald-600" : "bg-emerald-500/50 text-white"
                            }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage("am")}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === "am" ? "bg-white text-emerald-600" : "bg-emerald-500/50 text-white"
                            }`}
                    >
                        አማርኛ
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.sender === "user"
                                    ? "bg-emerald-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 rounded-bl-none"
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-[10px] mt-1 opacity-60 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex gap-4">
                <input
                    type="text"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900"
                    placeholder={language === "en" ? "Ask me anything about your farm..." : "ስለ እርሻዎ ማንኛውንም ነገር ይጠይቁኝ..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default AssistantPage;
