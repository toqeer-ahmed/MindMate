import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { AlertTriangle, CheckCircle, MinusCircle, Send, X, MoreHorizontal, Search, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdvisorDashboard = () => {
    const { user } = useAuthStore();
    const [reports, setReports] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/advisor/reports');
                setReports(res.data);
            } catch (error) {
                console.error("Failed to load advisor reports", error);
            }
        };
        fetchReports();
    }, []);

    const getRiskBadge = (level) => {
        switch (level) {
            case 'HIGH':
                return <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200"><AlertTriangle size={14} /> HIGH RISK</span>;
            case 'MEDIUM':
                return <span className="flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-200"><MinusCircle size={14} /> MEDIUM RISK</span>;
            default:
                return <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200"><CheckCircle size={14} /> LOW RISK</span>;
        }
    };

    const handleSendAlert = async () => {
        if (!selectedStudent || !alertMessage.trim()) return;
        setIsSending(true);
        try {
            await api.post(`/advisor/send-alert/${selectedStudent.studentId}`, {
                message: alertMessage
            });
            alert('Alert sent successfully!');
            setSelectedStudent(null);
            setAlertMessage('');
        } catch (error) {
            console.error("Failed to send alert", error);
            alert('Failed to send alert. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Advisor Portal</h1>
                        <p className="text-gray-500 mt-2 font-medium">Monitoring wellness for {reports.length} students</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm w-64"
                            />
                        </div>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary hover:border-primary transition-colors shadow-sm">
                            <Bell size={20} />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                <AlertTriangle size={24} />
                            </div>
                            <span className="text-red-800 font-semibold">High Risk</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{reports.filter(r => r.riskLevel === 'HIGH').length}</p>
                        <p className="text-sm text-gray-500 mt-1">Students needing immediate attention</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl border border-yellow-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                                <MinusCircle size={24} />
                            </div>
                            <span className="text-yellow-800 font-semibold">Medium Risk</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{reports.filter(r => r.riskLevel === 'MEDIUM').length}</p>
                        <p className="text-sm text-gray-500 mt-1">Students to monitor closely</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                            <span className="text-green-800 font-semibold">All Clear</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{reports.filter(r => r.riskLevel !== 'HIGH' && r.riskLevel !== 'MEDIUM').length}</p>
                        <p className="text-sm text-gray-500 mt-1">Students with stable wellness</p>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Mood</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Journals</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tasks Done</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Level</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reports.map((report) => (
                                    <tr key={report.studentId} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                    {report.studentName.charAt(0)}
                                                </div>
                                                <div className="font-semibold text-gray-900">{report.studentName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${report.averageMoodScore < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                                                    {report.averageMoodScore.toFixed(1)}
                                                </span>
                                                <span className="text-xs text-gray-400">/ 10</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-gray-500 font-medium">
                                            {report.journalCount} entries
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-gray-500 font-medium">
                                            {report.tasksCompleted} tasks
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {getRiskBadge(report.riskLevel)}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedStudent(report)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium shadow-sm"
                                            >
                                                <Send size={16} />
                                                Alert
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Send Alert Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Send Alert to Student</h3>
                            <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Recipient</p>
                                <p className="text-gray-900 font-medium text-lg">{selectedStudent.studentName}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={alertMessage}
                                    onChange={(e) => setAlertMessage(e.target.value)}
                                    placeholder="Type your alert message here..."
                                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendAlert}
                                    disabled={!alertMessage.trim() || isSending}
                                    className={`flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSending ? 'Sending...' : (
                                        <>
                                            <Send size={18} /> Send Alert
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdvisorDashboard;
