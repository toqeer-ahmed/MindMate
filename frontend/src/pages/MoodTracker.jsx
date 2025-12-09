import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTracker = () => {
    const [moodScore, setMoodScore] = useState(5);
    const [note, setNote] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // AI Mood Detection State
    const [showCamera, setShowCamera] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/mood');
            setHistory(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const startCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setShowCamera(false);
    };

    const captureAndDetect = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 320, 240);

        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;

            setDetecting(true);
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');

            try {
                // Call the Python ML Service
                const response = await fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('ML Service not available or error');
                }

                const data = await response.json();
                console.log("Detected:", data);

                // Map emotion to score (approximate)
                const moodMap = {
                    'Happy': 9,
                    'Neutral': 5,
                    'Surprise': 7,
                    'Sad': 3,
                    'Fear': 2,
                    'Angry': 1,
                    'Disgust': 1
                };

                if (data.mood && moodMap[data.mood]) {
                    setMoodScore(moodMap[data.mood]);
                    setNote(`AI Detected: ${data.mood} (Confidence: ${(data.confidence * 100).toFixed(1)}%)`);
                }

                stopCamera();
            } catch (error) {
                console.error("Detection error:", error);
                alert("Could not detect mood. Is the ML service running?");
            } finally {
                setDetecting(false);
            }
        }, 'image/jpeg');
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setDetecting(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('ML Service error');

            const data = await response.json();
            console.log("Detected:", data);

            const moodMap = {
                'Happy': 9, 'Neutral': 5, 'Surprise': 7, 'Sad': 3,
                'Fear': 2, 'Angry': 1, 'Disgust': 1
            };

            if (data.mood && moodMap[data.mood]) {
                setMoodScore(moodMap[data.mood]);
                setNote(`AI Detected (from image): ${data.mood} (Confidence: ${(data.confidence * 100).toFixed(1)}%)`);
            }
        } catch (error) {
            console.error("Detection error:", error);
            alert("Could not detect mood from image.");
        } finally {
            setDetecting(false);
        }
    };

    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    handleImageUpload(blob);
                    break;
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

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
            fetchHistory();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = history.slice().reverse().map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        score: entry.moodScore
    }));

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Mood Tracker</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">How are you feeling today?</h2>

                    {/* AI Detection Section */}
                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <h3 className="font-semibold text-indigo-900 mb-2">AI Mood Detection</h3>
                        <p className="text-sm text-indigo-700 mb-4">Let AI analyze your facial expression to detect your mood. Use your camera or upload a photo.</p>

                        {!showCamera ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                                >
                                    Open Camera
                                </button>
                                <label className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 text-sm font-medium cursor-pointer flex items-center">
                                    Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleImageUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative w-full max-w-[320px] mx-auto bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-auto"
                                    />
                                    <canvas ref={canvasRef} width="320" height="240" className="hidden" />
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        type="button"
                                        onClick={captureAndDetect}
                                        disabled={detecting}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
                                    >
                                        {detecting ? 'Analyzing...' : 'Capture & Detect'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mood Score: {moodScore}</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={moodScore}
                                onChange={(e) => setMoodScore(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Sad (1)</span>
                                <span>Happy (10)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="What's on your mind?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Log Mood'}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Mood History</h2>
                    <div className="h-64 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {history.map(entry => (
                            <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">{entry.moodLabel} ({entry.moodScore}/10)</span>
                                    <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                                </div>
                                {entry.note && <p className="text-gray-600 text-sm">{entry.note}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MoodTracker;
