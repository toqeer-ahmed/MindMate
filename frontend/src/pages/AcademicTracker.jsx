import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { BookOpen, Plus, Trash2, Award, TrendingUp, AlertCircle, Save } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AcademicTracker = () => {
    const [courses, setCourses] = useState([]);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [newCourse, setNewCourse] = useState({ courseName: '', creditHours: 3 });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showAssessmentForm, setShowAssessmentForm] = useState(false);

    // Assessment Form State
    const [newAssessment, setNewAssessment] = useState({
        name: '',
        type: 'QUIZ',
        totalMarks: 10,
        obtainedMarks: 0,
        weightage: 10
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/academic/courses');
            setCourses(res.data || []);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newCourse,
                creditHours: parseInt(newCourse.creditHours, 10)
            };
            await api.post('/academic/courses', payload);
            setNewCourse({ courseName: '', creditHours: 3 });
            setShowCourseForm(false);
            fetchCourses();
            alert("Course added successfully!");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to add course: ${msg}`);
        }
    };

    const handleAddAssessment = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;
        try {
            const payload = {
                ...newAssessment,
                totalMarks: parseFloat(newAssessment.totalMarks),
                obtainedMarks: parseFloat(newAssessment.obtainedMarks),
                weightage: parseFloat(newAssessment.weightage)
            };
            await api.post(`/academic/courses/${selectedCourse.id}/assessments`, payload);
            // Reset and refresh
            setNewAssessment({ name: '', type: 'QUIZ', totalMarks: 10, obtainedMarks: 0, weightage: 10 });
            setShowAssessmentForm(false);
            fetchCourses();
            alert("Assessment saved!");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to save assessment: ${msg}`);
        }
    };

    const calculatePercentage = (course) => {
        if (!course.assessments || course.assessments.length === 0) return 100;
        let totalWeighted = 0;
        let totalWeight = 0;
        course.assessments.forEach(a => {
            if (a.totalMarks > 0) {
                const pct = (a.obtainedMarks / a.totalMarks) * 100;
                totalWeighted += (pct * a.weightage);
                totalWeight += a.weightage;
            }
        });
        return totalWeight === 0 ? 100 : (totalWeighted / totalWeight);
    };

    const getGradeColor = (pct) => {
        if (pct >= 85) return '#10B981'; // Green
        if (pct >= 70) return '#3B82F6'; // Blue
        if (pct >= 60) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Academic Tracker</h1>
                        <p className="text-gray-500">Monitor your courses, grades, and academic wellness.</p>
                    </div>
                    <button
                        onClick={() => setShowCourseForm(true)}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all shadow-md"
                    >
                        <Plus size={20} /> Add Course
                    </button>
                </div>

                {/* Course Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => {
                        const pct = calculatePercentage(course);
                        return (
                            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                                <div className={`absolute top-0 left-0 w-2 h-full`} style={{ backgroundColor: getGradeColor(pct) }} />

                                <div className="flex justify-between items-start mb-4 pl-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{course.courseName}</h3>
                                        <span className="text-xs text-gray-400 font-medium">{course.creditHours} Credit Hours</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold" style={{ color: getGradeColor(pct) }}>{pct.toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pl-4 flex-grow">
                                    {course.assessments && course.assessments.slice(0, 3).map((assess, idx) => (
                                        <div key={assess.id || idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{assess.name}</span>
                                            <span className="font-medium">
                                                {assess.obtainedMarks} / {assess.totalMarks}
                                            </span>
                                        </div>
                                    ))}
                                    {course.assessments && course.assessments.length > 3 && (
                                        <p className="text-xs text-gray-400 text-center">+ {course.assessments.length - 3} more</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => { setSelectedCourse(course); setShowAssessmentForm(true); }}
                                    className="mt-6 w-full py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors border border-gray-200"
                                >
                                    Add Assessment
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* FormsModal */}
                {(showCourseForm || showAssessmentForm) && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <h3 className="text-xl font-bold mb-4">
                                {showCourseForm ? 'Add New Course' : `Add Assessment for ${selectedCourse?.courseName}`}
                            </h3>

                            {showCourseForm ? (
                                <form onSubmit={handleAddCourse} className="space-y-4">
                                    <input
                                        type="text" placeholder="Course Name" required
                                        value={newCourse.courseName}
                                        onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl"
                                    />
                                    <input
                                        type="number" placeholder="Credit Hours" required min="1" max="5"
                                        value={newCourse.creditHours}
                                        onChange={e => setNewCourse({ ...newCourse, creditHours: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl"
                                    />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowCourseForm(false)} className="flex-1 py-2 bg-gray-100 rounded-xl">Cancel</button>
                                        <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-xl">Save</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleAddAssessment} className="space-y-4">
                                    <input
                                        type="text" placeholder="Assessment Name (e.g. Quiz 1)" required
                                        value={newAssessment.name}
                                        onChange={e => setNewAssessment({ ...newAssessment, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            value={newAssessment.type}
                                            onChange={e => setNewAssessment({ ...newAssessment, type: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl"
                                        >
                                            <option value="QUIZ">Quiz</option>
                                            <option value="ASSIGNMENT">Assignment</option>
                                            <option value="OEL">OEL</option>
                                            <option value="MIDTERM">Midterm</option>
                                            <option value="FINAL">Final</option>
                                        </select>
                                        <input
                                            type="number" placeholder="Weightage (%)" required
                                            value={newAssessment.weightage}
                                            onChange={e => setNewAssessment({ ...newAssessment, weightage: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number" placeholder="Total Marks" required
                                            value={newAssessment.totalMarks}
                                            onChange={e => setNewAssessment({ ...newAssessment, totalMarks: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl"
                                        />
                                        <input
                                            type="number" placeholder="Obtained Marks" required
                                            value={newAssessment.obtainedMarks}
                                            onChange={e => setNewAssessment({ ...newAssessment, obtainedMarks: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowAssessmentForm(false)} className="flex-1 py-2 bg-gray-100 rounded-xl">Cancel</button>
                                        <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-xl">Save</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AcademicTracker;
