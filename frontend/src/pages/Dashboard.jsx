import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Frown, Meh, Plus, MoreHorizontal, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Camera, Upload, Loader, X } from 'lucide-react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [moodHistory, setMoodHistory] = useState([]);
    const [tasks, setTasks] = useState([]);

    // Mood Detection State
    const [moodMode, setMoodMode] = useState(null); // 'camera' or 'upload' or null
    const [capturedImage, setCapturedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);

    // Mock Calendar Data
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const moodIcons = [
        { icon: Frown, color: 'text-red-400', bg: 'bg-red-100', label: 'Angry' },
        { icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-100', label: 'Disgust' },
        { icon: Frown, color: 'text-purple-400', bg: 'bg-purple-100', label: 'Fear' },
        { icon: Smile, color: 'text-green-400', bg: 'bg-green-100', label: 'Happy' },
        { icon: Meh, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Neutral' },
        { icon: Frown, color: 'text-blue-400', bg: 'bg-blue-100', label: 'Sad' },
        { icon: Smile, color: 'text-orange-400', bg: 'bg-orange-100', label: 'Surprise' },
    ];

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        detectMood(imageSrc);
    }, [webcamRef]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
                detectMood(reader.result, file);
            };
            reader.readAsDataURL(file);
        }
    };

    const detectMood = async (imageSrc, fileObj = null) => {
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const formData = new FormData();

            if (fileObj) {
                formData.append('image', fileObj);
            } else {
                // Convert base64 to blob for webcam capture
                const fetchRes = await fetch(imageSrc);
                const blob = await fetchRes.blob();
                formData.append('image', blob, 'capture.jpg');
            }

            // Using direct fetch to ML service usually on port 5000
            // Ensure your Flask app has CORS enabled for localhost:5173
            const response = await axios.post('http://localhost:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPrediction(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to detect mood. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetMoodDetection = () => {
        setCapturedImage(null);
        setPrediction(null);
        setError(null);
    };

    const getEmojiForMood = (mood) => {
        switch (mood?.toLowerCase()) {
            case 'happy': return '😊';
            case 'sad': return '😢';
            case 'angry': return '😠';
            case 'neutral': return '😐';
            case 'surprise': return '😲';
            case 'fear': return '😨';
            case 'disgust': return '🤢';
            default: return '🤔';
        }
    };

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-text-main mb-2">Dashboard</h1>
                    <p className="text-text-muted">Welcome back, {user?.firstName || 'Student'}</p>
                </div>
                {/* <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                    <Plus size={18} />
                    <span>New Entry</span>
                </button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Wellness Score & Activity */}
                <div className="space-y-6">
                    {/* Wellness Score Chart */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-text-main">Wellness Score</h3>
                            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">+2.4%</span>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={moodHistory.length > 0 ? moodHistory : [{ day: 'Mon', score: 0 }, { day: 'Sun', score: 0 }]}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Mood Detection Section */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft">
                        <h3 className="text-lg font-bold text-text-main mb-4">AI Mood Detection</h3>

                        {!moodMode ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setMoodMode('camera')}
                                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors gap-3"
                                >
                                    <Camera size={28} />
                                    <span className="font-semibold text-sm">Live Camera</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setMoodMode('upload');
                                        setTimeout(() => fileInputRef.current?.click(), 100);
                                    }}
                                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors gap-3"
                                >
                                    <Upload size={28} />
                                    <span className="font-semibold text-sm">Upload Photo</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-text-muted">
                                        {moodMode === 'camera' ? 'Live Detection' : 'Image Analysis'}
                                    </h4>
                                    <button onClick={() => { setMoodMode(null); resetMoodDetection(); }} className="text-text-muted hover:text-red-500">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                                    {capturedImage ? (
                                        <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                                    ) : (
                                        moodMode === 'camera' ? (
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-white/50 flex flex-col items-center">
                                                <Upload size={32} className="mb-2" />
                                                <span className="text-sm">Click Upload Photo button again to select</span>
                                            </div>
                                        )
                                    )}

                                    {loading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                            <Loader className="w-8 h-8 text-primary animate-spin" />
                                        </div>
                                    )}
                                </div>

                                {!capturedImage && moodMode === 'camera' && (
                                    <button
                                        onClick={capture}
                                        className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                                    >
                                        Capture Frame
                                    </button>
                                )}

                                {prediction && (
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center animate-fade-in">
                                        <div className="text-4xl mb-2">{getEmojiForMood(prediction.mood)}</div>
                                        <h4 className="text-xl font-bold text-green-800 capitalize">{prediction.mood}</h4>
                                        <p className="text-green-600 text-sm font-medium">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
                                        <button
                                            onClick={resetMoodDetection}
                                            className="mt-3 text-xs text-green-700 underline"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center text-red-600 text-sm">
                                        {error}
                                        <button
                                            onClick={resetMoodDetection}
                                            className="block mx-auto mt-2 underline"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Moody Entry & Tasks */}
                <div className="bg-white p-6 rounded-[1.5rem] shadow-soft h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text-main">Daily Task List</h3>
                        <MoreHorizontal className="text-text-muted cursor-pointer" size={20} />
                    </div>

                    <div className="flex-1 space-y-3">
                        {tasks.length > 0 ? tasks.map(task => (
                            <div key={task.id} className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {task.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-text-main'}`}>{task.title}</p>
                                    <p className="text-xs text-text-muted">{task.time}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-text-muted">
                                <p>No tasks yet.</p>
                                <p className="text-sm">Add one to get productive!</p>
                            </div>
                        )}

                        <div className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer opacity-50">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-text-muted">Add new task...</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2.5 bg-secondary/10 text-secondary font-semibold rounded-xl hover:bg-secondary/20 transition-colors">
                        View All Tasks
                    </button>
                </div>

                {/* Column 3: Calendar & Mood Visuals */}
                <div className="space-y-6">
                    {/* Calendar */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main">Calendar</h3>
                            <div className="flex gap-1">
                                <ChevronLeft size={16} className="text-text-muted cursor-pointer" />
                                <ChevronRight size={16} className="text-text-muted cursor-pointer" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-muted mb-2">
                            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {/* Simple mock calendar grid */}
                            {Array.from({ length: 4 }).map((_, i) => <span key={`empty-${i}`} />)}
                            {daysInMonth.map(day => (
                                <div
                                    key={day}
                                    className={`aspect-square flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100 ${day === currentDay ? 'bg-primary text-white hover:bg-primary' : (day === 18 ? 'bg-blue-100 text-blue-600 font-bold' : 'text-text-main')}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mood Tracker Manual Input */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft">
                        <h3 className="text-lg font-bold text-text-main mb-4">How are you feeling?</h3>
                        <div className="flex justify-between flex-wrap gap-2">
                            {moodIcons.map((m, idx) => (
                                <button key={idx} className={`p-2 rounded-full ${m.bg} hover:scale-110 transition-transform`} title={m.label}>
                                    <m.icon size={20} className={m.color} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
