import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, BookOpen, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [moodHistory, setMoodHistory] = useState([]);
    const [recentJournals, setRecentJournals] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moodRes, journalRes, taskRes] = await Promise.all([
                    api.get('/mood'),
                    api.get('/journal'),
                    api.get('/tasks')
                ]);
                setMoodHistory(moodRes.data);
                setRecentJournals(journalRes.data.slice(0, 3));
                setPendingTasks(taskRes.data.filter(t => t.status !== 'DONE').slice(0, 3));
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const chartData = moodHistory.slice(0, 7).reverse().map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        score: entry.moodScore
    }));

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.firstName}! 👋</h1>
                <p className="text-gray-600">Here's your daily wellness overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Smile size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Average Mood</p>
                            <h3 className="text-2xl font-bold">
                                {moodHistory.length > 0
                                    ? (moodHistory.reduce((acc, curr) => acc + curr.moodScore, 0) / moodHistory.length).toFixed(1)
                                    : '-'}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Journal Entries</p>
                            <h3 className="text-2xl font-bold">{recentJournals.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Tasks</p>
                            <h3 className="text-2xl font-bold">{pendingTasks.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Mood Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Recent Tasks</h3>
                            <Link to="/tasks" className="text-primary text-sm hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {pendingTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' :
                                            task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                    <span className="flex-1 font-medium">{task.title}</span>
                                    <span className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {pendingTasks.length === 0 && <p className="text-gray-500 text-center">No pending tasks!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
