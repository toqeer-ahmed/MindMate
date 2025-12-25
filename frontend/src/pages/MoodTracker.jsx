import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, Upload, RefreshCw, Save, Smile, Frown, Meh, AlertCircle, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import axios from 'axios';

const MoodTracker = () => {
    const [moodScore, setMoodScore] = useState(5);
    const [note, setNote] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // AI Mode: 'camera' | 'upload' | null
    const [aiMode, setAiMode] = useState(null);
    const [detecting, setDetecting] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [detectedResult, setDetectedResult] = useState(null);
    const [error, setError] = useState(null);

    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/mood');
            setHistory(res.data);
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    // --- Detection Logic ---

    const handleCapture = React.useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            runDetection(imageSrc);
        }
    }, [webcamRef]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
                runDetection(reader.result, file);
            };
            reader.readAsDataURL(file);
        }
    };

    const runDetection = async (imageSrc, fileObj = null) => {
        setDetecting(true);
        setError(null);
        setDetectedResult(null);

        const formData = new FormData();
        if (fileObj) {
            formData.append('image', fileObj);
        } else {
            const fetchRes = await fetch(imageSrc);
            const blob = await fetchRes.blob();
            formData.append('image', blob, 'capture.jpg');
        }

        try {
            // Call Python Service
            const res = await axios.post('http://localhost:5000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setDetectedResult(res.data);

            // Auto-fill form
            const moodMap = {
                'Happy': 9, 'Neutral': 5, 'Surprise': 7,
                'Sad': 3, 'Fear': 2, 'Angry': 2, 'Disgust': 1
            };
            const detectedMood = res.data.mood;
            const score = moodMap[detectedMood] || 5;

            setMoodScore(score);
            setNote(`AI Detected: ${detectedMood} (Confidence: ${(res.data.confidence * 100).toFixed(1)}%)`);

        } catch (err) {
            console.error(err);
            setError("Failed to verify mood with AI service. Is it running?");
        } finally {
            setDetecting(false);
        }
    };

    const resetDetection = () => {
        setCapturedImage(null);
        setDetectedResult(null);
        setError(null);
        setAiMode(null);
    };

    // --- Saving Logic ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let label = 'Neutral';
            if (moodScore >= 8) label = 'Happy';
            else if (moodScore >= 6) label = 'Good';
            else if (moodScore <= 3) label = 'Sad';
            else if (moodScore <= 5) label = 'Okay';

            await api.post('/mood', {
                moodScore,
                moodLabel: label,
                note
            });

            setNote('');
            setCapturedImage(null);
            setDetectedResult(null);
            fetchHistory();
            alert("Mood logged successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save mood.");
        } finally {
            setLoading(false);
        }
    };

    const chartData = history.slice().reverse().map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: entry.moodScore
    }));

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mood Tracker</h1>
                        <p className="text-gray-500 mt-2 text-lg">Track your emotional wellness journey using AI.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Input */}
                    <div className="space-y-6">
                        {/* AI Section */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Smile className="text-indigo-500" /> AI Detection
                            </h2>

                            {!aiMode ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setAiMode('camera')}
                                        className="py-8 px-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                                    >
                                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                                            <Camera size={24} />
                                        </div>
                                        <span className="font-semibold text-gray-700">Live Camera</span>
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="py-8 px-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                                    >
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                                            <Upload size={24} />
                                        </div>
                                        <span className="font-semibold text-gray-700">Upload Photo</span>
                                        <input
                                            type="file" ref={fileInputRef} className="hidden"
                                            accept="image/*" onChange={handleFileUpload}
                                        />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                        <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
                                            {aiMode === 'camera' ? 'Camera Mode' : 'Image Preview'}
                                        </span>
                                        <button onClick={resetDetection} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                            <RefreshCw size={16} className="text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center group">
                                        {capturedImage ? (
                                            <img src={capturedImage} className="w-full h-full object-contain" alt="Captured" />
                                        ) : (
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full h-full object-cover"
                                                videoConstraints={{ facingMode: "user" }}
                                            />
                                        )}

                                        {/* Overlay Loader */}
                                        {detecting && (
                                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                                                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span className="text-sm font-medium">Analyzing Expressions...</span>
                                            </div>
                                        )}

                                        {/* Camera Capture Button */}
                                        {!capturedImage && aiMode === 'camera' && (
                                            <button
                                                onClick={handleCapture}
                                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                                            >
                                                Capture
                                            </button>
                                        )}
                                    </div>

                                    {detectedResult && (
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-4 animate-bounce-in">
                                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                                <CheckCircle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-green-900 text-lg">{detectedResult.mood}</h4>
                                                <p className="text-green-700 text-sm">Confidence: {(detectedResult.confidence * 100).toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3 text-red-700 text-sm">
                                            <AlertCircle size={20} /> {error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Manual Form */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Log Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                                        <span>Mood Level</span>
                                        <span className="text-primary">{moodScore} / 10</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="10"
                                        value={moodScore}
                                        onChange={(e) => setMoodScore(parseInt(e.target.value))}
                                        className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 font-medium mt-2 px-1">
                                        <span>Stressed</span>
                                        <span>Balanced</span>
                                        <span>Excellent</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Note</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all h-32 resize-none"
                                        placeholder="How are you feeling right now?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? 'Saving...' : <><Save size={20} /> Save Entry</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: History */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Mood Trends</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> This Week
                                </div>
                            </div>

                            <div className="h-64 w-full mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                        <YAxis hide domain={[0, 10]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#6366F1"
                                            strokeWidth={4}
                                            dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, fill: '#4F46E5' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[500px] custom-scrollbar">
                                {history.map(entry => (
                                    <div key={entry.id} className="p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all group hover:shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${entry.moodScore >= 7 ? 'bg-green-400' : entry.moodScore >= 4 ? 'bg-yellow-400' : 'bg-red-400'}`}>
                                                    {entry.moodScore}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{entry.moodLabel}</p>
                                                    <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {entry.note && (
                                            <p className="text-gray-600 text-sm bg-white p-3 rounded-xl border border-gray-100 italic">
                                                "{entry.note}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <div className="text-center text-gray-400 py-10">
                                        <p>No mood logs yet. Start tracking today!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MoodTracker;
