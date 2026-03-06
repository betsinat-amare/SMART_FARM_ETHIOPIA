import React, { useState } from "react";
import API from "../api/client";

const DiseaseDetectionPage = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError("");
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", selectedImage);

        try {
            // Placeholder for actual ML endpoint
            const response = await API.post("/ai/disease-detection", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-8 text-white">
                    <h1 className="text-3xl font-bold">Plant Disease Detection</h1>
                    <p className="text-emerald-100 mt-2">Upload a photo of your crop's leaves to detect potential diseases.</p>
                </div>

                <div className="p-8">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-100 rounded-3xl p-12 bg-emerald-50/30 transition-all hover:bg-emerald-50">
                        {previewUrl ? (
                            <div className="relative group w-full max-w-md">
                                <img src={previewUrl} alt="Preview" className="rounded-2xl shadow-lg w-full object-cover aspect-video" />
                                <button
                                    onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center cursor-pointer group">
                                <div className="p-6 bg-white rounded-full shadow-md group-hover:scale-110 transition-all mb-4">
                                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-semibold text-emerald-900">Click to upload photo</span>
                                <span className="text-sm text-emerald-600 mt-1">PNG, JPG up to 10MB</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!selectedImage || loading}
                        className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing Image...
                            </>
                        ) : (
                            "Detect Disease"
                        )}
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-emerald-500 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Detection Result</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Detected Condition</p>
                                <p className="text-3xl font-bold text-emerald-900">{result.disease_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Confidence Score</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${result.confidence * 100}%` }}></div>
                                    </div>
                                    <span className="font-bold text-emerald-600">{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-6">
                            <h3 className="font-bold text-emerald-900 mb-2">Recommended Actions:</h3>
                            <ul className="space-y-2">
                                {result.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="flex gap-2 text-emerald-800">
                                        <span>•</span>
                                        <span>{rec}</span>
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

export default DiseaseDetectionPage;
