import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { ChevronLeft, BookOpen, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis, LineChart, Line } from 'recharts';

const AdvisorStudentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await api.get(`/advisor/student/${id}`);
                setStudent(res.data);
            } catch (error) {
                console.error("Failed to fetch student details", error);
                alert("Failed to load student data.");
                navigate('/advisor');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id, navigate]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading Student Profile...</div>
                </div>
            </Layout>
        );
    }

    if (!student) return null;

    const chartData = student.recentMoods.slice().reverse().map(m => ({
        date: new Date(m.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: m.moodScore
    }));

    // Calculate Academic Average
    let academicAvg = 0;
    if (student.courses && student.courses.length > 0) {
        // Need to replicate calculation logic or trust backend to send it?
        // Backend sent raw objects. Let's calc locally for display or map stored values if available.
        // The DTO sends full Course objects which have calculateCurrentPercentage method in Java,
        // but over JSON we just get fields. We need to re-implement calc logic or rely on fields.
        // Java getters that aren't fields @JsonIgnore or transient might not send unless annotated @JsonProperty.
        // Let's assume we need to calculate basic avg for display based on assessments sent.

        let totalPct = 0;
        student.courses.forEach(c => {
            // Simple simulation if detailed breakdown isn't needed or if fields are missing
            // Ideally, I'd check `assessments`.
            if (c.assessments) {
                let courseWeighted = 0;
                let courseWeightTotal = 0;
                c.assessments.forEach(a => {
                    if (a.totalMarks > 0) {
                        courseWeighted += (a.obtainedMarks / a.totalMarks) * 100 * a.weightage;
                        courseWeightTotal += a.weightage;
                    }
                });
                const courseGrade = courseWeightTotal === 0 ? 100 : (courseWeighted / courseWeightTotal);
                totalPct += courseGrade;
            } else {
                totalPct += 100; // Default
            }
        });
        academicAvg = totalPct / student.courses.length;
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/advisor')}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{student.firstName} {student.lastName}</h1>
                        <p className="text-gray-500">{student.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Column 1: Mood & Wellness */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Mood Chart */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Activity className="text-indigo-500" /> Wellness Trends
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                        <YAxis domain={[0, 10]} hide />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Mood Logs */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Recent Mood Logs</h3>
                            <div className="space-y-3">
                                {student.recentMoods.length > 0 ? student.recentMoods.map(mood => (
                                    <div key={mood.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${mood.moodScore >= 7 ? 'bg-green-400' : mood.moodScore >= 4 ? 'bg-yellow-400' : 'bg-red-400'}`}>
                                                {mood.moodScore}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{mood.moodLabel}</p>
                                                <p className="text-xs text-gray-500">{new Date(mood.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {mood.note && <span className="text-xs text-gray-500 italic max-w-[200px] truncate">{mood.note}</span>}
                                    </div>
                                )) : (
                                    <p className="text-gray-400 italic">No recent mood logs.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Academics & Tasks */}
                    <div className="space-y-6">
                        {/* Academics Card */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="text-blue-500" /> Academics
                            </h3>

                            {student.courses && student.courses.length > 0 ? (
                                <div className="space-y-4">
                                    {student.courses.map(course => {
                                        // Re-calc grade
                                        let grade = 100;
                                        if (course.assessments && course.assessments.length > 0) {
                                            let w = 0, wt = 0;
                                            course.assessments.forEach(a => {
                                                if (a.totalMarks > 0) {
                                                    w += (a.obtainedMarks / a.totalMarks) * 100 * a.weightage;
                                                    wt += a.weightage;
                                                }
                                            });
                                            grade = wt === 0 ? 100 : (w / wt);
                                        }

                                        return (
                                            <div key={course.id} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-gray-800">{course.courseName}</h4>
                                                    <span className={`font-bold text-lg ${grade >= 80 ? 'text-green-600' : grade >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {grade.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${grade}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-center py-4">No courses enrolled.</p>
                            )}
                        </div>

                        {/* Recent Tasks */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircle className="text-green-500" /> Recent Tasks
                            </h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {student.tasks && student.tasks.length > 0 ? student.tasks.slice(0, 5).map(task => (
                                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className={`mt-1 w-4 h-4 rounded-full border-2 ${task.status === 'DONE' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                                        <div>
                                            <p className={`text-sm font-medium ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-gray-400">{task.dueDate || 'No due date'}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 italic">No tasks found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdvisorStudentView;
