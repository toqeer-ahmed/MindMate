import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { AlertTriangle, CheckCircle, MinusCircle } from 'lucide-react';

const AdvisorDashboard = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/advisor/reports');
                setReports(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReports();
    }, []);

    const getRiskBadge = (level) => {
        switch (level) {
            case 'HIGH':
                return <span className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium"><AlertTriangle size={16} /> High Risk</span>;
            case 'MEDIUM':
                return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium"><MinusCircle size={16} /> Medium Risk</span>;
            default:
                return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium"><CheckCircle size={16} /> Low Risk</span>;
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Advisor Dashboard</h1>
                <p className="text-gray-600">Overview of student wellness reports.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Mood</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journals</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Done</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reports.map((report) => (
                                <tr key={report.studentId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{report.studentName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {report.averageMoodScore.toFixed(1)} / 10
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {report.journalCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {report.tasksCompleted}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRiskBadge(report.riskLevel)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-primary hover:text-indigo-900 font-medium text-sm">Send Alert</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AdvisorDashboard;
