import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Frown, Meh, Plus, MoreHorizontal, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [moodHistory, setMoodHistory] = useState([
        { day: 'Mon', score: 65 }, { day: 'Tue', score: 59 }, { day: 'Wed', score: 80 }, { day: 'Thu', score: 81 }, { day: 'Fri', score: 56 }, { day: 'Sat', score: 95 }, { day: 'Sun', score: 60 }
    ]); // Mock data for chart visualization matching image
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Check emails', completed: false, time: '8:00 AM' },
        { id: 2, title: 'Lecture prep', completed: true, time: '10:00 AM' },
        { id: 3, title: 'Gym session', completed: false, time: '5:00 PM' },
    ]);

    // Mock Calendar Data
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const moodIcons = [
        { icon: Frown, color: 'text-red-400', bg: 'bg-red-100' },
        { icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-100' },
        { icon: Smile, color: 'text-green-400', bg: 'bg-green-100' },
        { icon: Smile, color: 'text-blue-400', bg: 'bg-blue-100' }, // Happy
        { icon: Smile, color: 'text-purple-400', bg: 'bg-purple-100' }, // Very Happy
    ];

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-text-main mb-2">Dashboard</h1>
                    <p className="text-text-muted">Welcome back, {user?.firstName || 'Student'}</p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                    <Plus size={18} />
                    <span>New Entry</span>
                </button>
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
                                <AreaChart data={moodHistory}>
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

                    {/* Additional Activity Card (Placeholder for bottom left in image) */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main">Daily Activity</h3>
                            <MoreHorizontal className="text-text-muted cursor-pointer" size={20} />
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="font-medium text-sm text-text-main">Meditation</span>
                                </div>
                                <span className="text-xs text-text-muted">15 mins</span>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="font-medium text-sm text-text-main">Reading</span>
                                </div>
                                <span className="text-xs text-text-muted">45 mins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Daily Task List */}
                <div className="bg-white p-6 rounded-[1.5rem] shadow-soft h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text-main">Daily Task List</h3>
                        <MoreHorizontal className="text-text-muted cursor-pointer" size={20} />
                    </div>

                    <div className="flex-1 space-y-3">
                        {tasks.map(task => (
                            <div key={task.id} className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {task.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-text-main'}`}>{task.title}</p>
                                    <p className="text-xs text-text-muted">{task.time}</p>
                                </div>
                            </div>
                        ))}
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

                {/* Column 3: Calendar & Mood */}
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

                    {/* Mood Tracker */}
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-soft">
                        <h3 className="text-lg font-bold text-text-main mb-4">Mood Tracker</h3>
                        <div className="flex justify-between">
                            {moodIcons.map((m, idx) => (
                                <button key={idx} className={`p-2 rounded-full ${m.bg} hover:scale-110 transition-transform`}>
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
