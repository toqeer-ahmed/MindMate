import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Frown, Meh, Plus, MoreHorizontal, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Camera, Upload, Loader, X, CheckCircle, Circle, BookOpen, Activity } from 'lucide-react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [moodHistory, setMoodHistory] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);

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
        { icon: Frown, color: 'text-red-400', bg: 'bg-red-100', label: 'Angry', score: 2 },
        { icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-100', label: 'Disgust', score: 1 },
        { icon: Frown, color: 'text-purple-400', bg: 'bg-purple-100', label: 'Fear', score: 2 },
        { icon: Smile, color: 'text-green-400', bg: 'bg-green-100', label: 'Happy', score: 9 },
        { icon: Meh, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Neutral', score: 5 },
        { icon: Frown, color: 'text-blue-400', bg: 'bg-blue-100', label: 'Sad', score: 3 },
        { icon: Smile, color: 'text-orange-400', bg: 'bg-orange-100', label: 'Surprise', score: 7 },
    ];

    // Calendar & Summary State
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailySummary, setDailySummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const handleDayClick = async (dateStr) => {
        setSelectedDate(dateStr);
        setLoadingSummary(true);
        setDailySummary(null);
        try {
            const res = await api.get(`/calendar/summary?date=${dateStr}`);
            setDailySummary(res.data);
        } catch (error) {
            console.error("Failed to fetch daily summary", error);
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            await Promise.all([fetchTasks(), fetchMoodHistory()]);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            // Ensure we handle the response correctly based on DTO
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const fetchMoodHistory = async () => {
        try {
            const res = await api.get('/mood');
            // Transform backend DTO to chart format
            // Assuming DTO has timestamp and moodScore
            const transformedData = res.data.map(entry => ({
                day: new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
                score: entry.moodScore * 10 // Scale 1-10 to 10-100 for chart if needed
            })).slice(-7); // Last 7 entries

            // If empty, keep local fallback or empty
            if (transformedData.length > 0) {
                setMoodHistory(transformedData);
            }
        } catch (err) {
            console.error("Failed to fetch mood history", err);
        }
    };

    const handleCreateTask = async (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            try {
                await api.post('/tasks', {
                    title: newTaskTitle,
                    status: 'TODO',
                    priority: 'MEDIUM', // Default
                    dueDate: new Date().toISOString().split('T')[0] // Today
                });
                setNewTaskTitle('');
                setIsAddingTask(false);
                fetchTasks();
            } catch (err) {
                console.error("Failed to create task", err);
            }
        }
    };

    const toggleTaskStatus = async (task) => {
        try {
            const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
            await api.put(`/tasks/${task.id}`, {
                ...task,
                status: newStatus
            });
            fetchTasks();
        } catch (err) {
            console.error("Failed to update task", err);
            alert("Could not update task. Check console.");
        }
    };

    const handleManualMood = async (moodItem) => {
        try {
            await api.post('/mood', {
                moodLabel: moodItem.label,
                moodScore: moodItem.score,
                note: 'Manual entry from Dashboard'
            });
            fetchMoodHistory();
            alert(`Log saved: Feeling ${moodItem.label}`);
        } catch (err) {
            console.error("Failed to save mood", err);
            alert("Could not save mood.");
        }
    };

    // --- Mood Detection Logic ---

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

            // Call Python ML Service
            const response = await axios.post('http://localhost:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;
            setPrediction(result);

            // AUTO-SAVE to Backend
            // Map the detected mood to a score (simple mapping)
            const moodScoreMap = {
                'Happy': 9, 'Sad': 3, 'Angry': 2, 'Neutral': 5,
                'Fear': 2, 'Disgust': 1, 'Surprise': 7
            };
            const score = moodScoreMap[result.mood] || 5;

            // We use the 'api' instance here to talk to Spring Boot
            await api.post('/mood', {
                moodLabel: result.mood,
                moodScore: score,
                note: `AI Detected (Confidence: ${(result.confidence * 100).toFixed(1)}%)`
            });

            // Refresh chart
            fetchMoodHistory();

        } catch (err) {
            console.error(err);
            setError('Failed to detect mood. Ensure ML service is running on port 5000.');
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Wellness Score & Activity */}
                <div className="space-y-6">
                    {/* Wellness Score Chart */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-text-main">Wellness Score</h3>
                            {moodHistory.length > 0 && (
                                <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">Live</span>
                            )}
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={moodHistory.length > 0 ? moodHistory : [{ day: 'Start', score: 50 }, { day: 'Now', score: 50 }]}>
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
                                        <p className="text-xs text-green-600 mt-1">Logged to your wellness score!</p>
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

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                        {tasks.length > 0 ? tasks.map(task => (
                            <div key={task.id} className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => toggleTaskStatus(task)}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'DONE' ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {task.status === 'DONE' && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium text-sm ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-text-main'}`}>{task.title}</p>
                                    <p className="text-xs text-text-muted">{task.dueDate}</p>
                                </div>
                            </div>
                        )) : (
                            !isAddingTask && (
                                <div className="text-center py-10 text-text-muted">
                                    <p>No tasks yet.</p>
                                    <p className="text-sm">Add one to get productive!</p>
                                </div>
                            )
                        )}

                        {isAddingTask ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                <input
                                    autoFocus
                                    type="text"
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                                    placeholder="Type task and press Enter..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={handleCreateTask}
                                    onBlur={() => !newTaskTitle && setIsAddingTask(false)}
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => setIsAddingTask(true)}
                                className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer opacity-70 hover:opacity-100"
                            >
                                <Plus size={20} className="text-primary" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-primary">Add new task...</p>
                                </div>
                            </div>
                        )}
                    </div>
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
                            {/* Simple mock calendar grid offset */}
                            {Array.from({ length: 4 }).map((_, i) => <span key={`empty-${i}`} />)}
                            {daysInMonth.map(day => {
                                // Construct date string YYYY-MM-DD
                                const dateStr = `2025-12-${String(day).padStart(2, '0')}`;
                                return (
                                    <div
                                        key={day}
                                        onClick={() => handleDayClick(dateStr)}
                                        className={`aspect-square flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100 transition-all ${day === currentDay ? 'bg-primary text-white hover:bg-primary shadow-md' : 'text-text-main'}`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Academic Tracker Quick Link */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[1.5rem] shadow-lg text-white relative overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/academic'}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen size={100} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Academic Tracker</h3>
                        <p className="text-indigo-100 text-sm mb-4">Manage courses & grades</p>
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-colors">
                            View Grades
                        </button>
                    </div>

                    {/* Mood Tracker Manual Input */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft">
                        <h3 className="text-lg font-bold text-text-main mb-4">How are you feeling?</h3>
                        <div className="flex justify-between flex-wrap gap-2">
                            {moodIcons.map((m, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleManualMood(m)}
                                    className={`p-2 rounded-full ${m.bg} hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                                    title={m.label}
                                >
                                    <m.icon size={20} className={m.color} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Summary Modal */}
            {selectedDate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                        <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                                <p className="text-primary font-medium">Daily Wellness Summary</p>
                            </div>
                            <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>

                        {loadingSummary ? (
                            <div className="p-10 flex flex-col items-center justify-center text-gray-400">
                                <Loader size={40} className="animate-spin mb-4 text-primary" />
                                <p>Loading history...</p>
                            </div>
                        ) : dailySummary ? (
                            <div className="p-6 space-y-6">
                                {/* Score Card */}
                                <div className="flex items-center justify-between bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                                    <div>
                                        <p className="text-indigo-100 font-medium mb-1">Wellness Score</p>
                                        <p className="text-4xl font-extrabold">{dailySummary.wellnessScore?.toFixed(0) || 0}</p>
                                    </div>
                                    <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <Activity size={32} />
                                    </div>
                                </div>

                                {/* Moods */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Smile size={18} /> Mood Logs</h4>
                                    {dailySummary.moodEntries?.length > 0 ? (
                                        <div className="space-y-2">
                                            {dailySummary.moodEntries.map(mood => (
                                                <div key={mood.id} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                                                    <span className="font-medium text-gray-700">{mood.moodLabel}</span>
                                                    <span className="text-xs text-gray-400">{new Date(mood.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No mood logs for this day.</p>
                                    )}
                                </div>

                                {/* Tasks */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><CheckCircle size={18} /> Tasks Completed</h4>
                                    {dailySummary.completedTasks?.length > 0 ? (
                                        <div className="space-y-2">
                                            {dailySummary.completedTasks.map(task => (
                                                <div key={task.id} className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-600" />
                                                    <span className="text-green-900 font-medium text-sm">{task.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No tasks completed on this day.</p>
                                    )}
                                </div>

                                {/* Journals */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><BookOpen size={18} /> Journal Entries</h4>
                                    {dailySummary.journalEntries?.length > 0 ? (
                                        <div className="space-y-2">
                                            {dailySummary.journalEntries.map(entry => (
                                                <div key={entry.id} className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                                    <p className="font-bold text-indigo-900 text-sm">{entry.title}</p>
                                                    <p className="text-indigo-700 text-xs mt-1 truncate">Locked Content</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No journal entries found.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <p>Failed to load data.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
