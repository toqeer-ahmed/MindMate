import React from 'react';
import { Brain, CheckCircle, Activity, ArrowRight, Smile, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';
import logo from '../assets/logo2.png';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';

const Home = () => {
    const { token } = useAuthStore();

    return (
        <div className="flex flex-col min-h-screen bg-background text-text-main transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-32 pb-20 px-6 lg:px-24 text-center">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 bg-surface/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm mb-8 border border-surface/50">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Now with AI Mood Detection</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                        <img src={logo} alt="MindMate Logo" className="w-12 h-12 md:w-20 md:h-20 object-contain drop-shadow-lg" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-secondary drop-shadow-sm">
                            MindMate
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl text-text-muted font-medium max-w-2xl leading-relaxed mb-10">
                        Elevate your campus life. <br className="hidden md:block" />
                        Master your <span className="text-primary font-bold">Wellness</span> & <span className="text-secondary font-bold">Productivity</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {token ? (
                            <Link to="/dashboard" className="px-8 py-4 rounded-full bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                                Go to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-8 py-4 rounded-full bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                    Get Started
                                </Link>
                                <Link to="/login" className="px-8 py-4 rounded-full bg-white text-text-main border border-gray-100 text-lg font-bold shadow-lg shadow-gray-200/50 hover:bg-gray-50 hover:scale-105 transition-all">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Feature Previews Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">

                {/* Mood Tracking Card */}
                <div className="group bg-white rounded-[2rem] p-8 shadow-soft border border-transparent hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                        <Smile size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Mood Tracking</h3>
                    <p className="text-text-muted leading-relaxed mb-4">
                        Understand your emotions with AI-powered analysis. Track daily moods and get personalized wellness insights.
                    </p>
                    <div className="flex items-center text-pink-500 font-semibold text-sm">
                        <span>New AI Camera Feature</span>
                        <Activity size={16} className="ml-2 animate-pulse" />
                    </div>
                </div>

                {/* Task Management Card */}
                <div className="group bg-white rounded-[2rem] p-8 shadow-soft border border-transparent hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Smart Tasks</h3>
                    <p className="text-text-muted leading-relaxed mb-4">
                        Stay on top of assignments and exams. Organize your academic life with an intuitive task manager.
                    </p>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-3/4 group-hover:w-full transition-all duration-1000 ease-out"></div>
                    </div>
                </div>

                {/* Wellness Insights Card */}
                <div className="group bg-white rounded-[2rem] p-8 shadow-soft border border-transparent hover:border-purple-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Growth Insights</h3>
                    <p className="text-text-muted leading-relaxed mb-4">
                        Visualize your progress. See how your wellness score correlates with your productivity over time.
                    </p>
                    <div className="flex gap-1 items-end h-8">
                        <div className="w-2 bg-purple-200 h-4 rounded-sm"></div>
                        <div className="w-2 bg-purple-300 h-6 rounded-sm"></div>
                        <div className="w-2 bg-purple-500 h-8 rounded-sm animate-bounce group-hover:animate-none"></div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default Home;
