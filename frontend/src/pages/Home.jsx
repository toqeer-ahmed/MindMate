import React from 'react';
import { Brain, CheckCircle, Activity, ArrowRight, Smile, TrendingUp, BookOpen, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo2.png';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';

const Home = () => {
    const { token } = useAuthStore();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-text-main transition-colors duration-300 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full overflow-hidden pt-32 pb-24 px-6 lg:px-24">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/50 px-4 py-1.5 rounded-full shadow-sm mb-8 hover:scale-105 transition-transform cursor-default">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">AI Mood Detection 2.0 Live</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 mb-6 drop-shadow-sm leading-[0.9]">
                        Mind<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Mate</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl leading-relaxed mb-10">
                        Your intelligent companion for academic success and mental wellness.
                        Balance your <span className="text-gray-900 font-bold decoration-indigo-300 underline underline-offset-4">GPA</span> and your <span className="text-gray-900 font-bold decoration-purple-300 underline underline-offset-4">Mind</span> seamlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                        {token ? (
                            <Link to="/dashboard" className="px-10 py-4 rounded-2xl bg-gray-900 text-white text-lg font-bold shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                                Go to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-10 py-4 rounded-2xl bg-primary text-white text-lg font-bold shadow-xl shadow-primary/25 hover:bg-indigo-600 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    Get Started
                                </Link>
                                <Link to="/login" className="px-10 py-4 rounded-2xl bg-white text-gray-700 border border-gray-200 text-lg font-bold shadow-lg hover:bg-gray-50 hover:border-gray-300 hover:scale-105 transition-all">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Bento Grid Feature Preview */}
            <section className="max-w-7xl mx-auto px-6 pb-24 z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mood Tracking - Large Card */}
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-default">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Smile size={32} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">AI-Powered Mood Tracking</h3>
                            <p className="text-indigo-100 text-lg max-w-md leading-relaxed mb-8">
                                Use your camera to detect emotions instantly or log them manually. We analyze trends to prevent burnout before it happens.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold">📸 Live Detection</div>
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold">📈 History Graphs</div>
                            </div>
                        </div>
                        {/* Abstract visuals */}
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 group-hover:scale-125 transition-transform duration-700"></div>
                        <Smile size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    </div>

                    {/* Academic - Tall Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Academic Tracker</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Don't let grades slip. Track every quiz, assignment, and exam outcome in one beautiful dashboard.
                            </p>
                        </div>
                        <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-100 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">Software Arch.</span>
                                <span className="text-sm font-bold text-emerald-500">A</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 w-[92%] h-full rounded-full animate-width-fill"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform">
                            <CheckCircle size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Tasks</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Organize your deadlines with a wellness-first to-do list that prioritizes your peace of mind.
                        </p>
                    </div>

                    {/* Card 4 - Advisor */}
                    <div className="md:col-span-2 bg-gray-900 rounded-[2.5rem] p-10 text-gray-300 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1 text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">
                                    <Shield size={12} /> Advisor Support
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">You are never alone.</h3>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                    Our built-in intervention system notifies your advisor if you're consistently stressed or falling behind academically.
                                </p>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs font-bold text-white">Ad</div>)}
                                    <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold">+5</div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 aspect-square bg-gradient-to-tr from-gray-800 to-gray-700 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 border border-gray-600/30">
                                <Users size={64} className="text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
