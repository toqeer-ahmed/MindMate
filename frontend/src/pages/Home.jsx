import React from 'react';
import { Brain, CheckCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';
import { useAuthStore } from '../store/authStore';

import Navbar from '../components/Navbar';

const Home = () => {
    const { token } = useAuthStore();

    return (
        <div className="flex flex-col items-center">
            <Navbar />
            {/* Hero Section */}
            <section className="w-full relative overflow-hidden py-32 px-6 md:px-12 lg:px-24">
                {/* Background Image with Overlay */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <img src={heroBg} alt="Campus" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/80 via-white/60 to-white dark:from-slate-900/90 dark:via-slate-900/80 dark:to-background"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
                    {/* Floating Brain Icon Removed - Logo is now big in Navbar or can be kept here if desired, but text is focus */}

                    <h1 className="text-5xl md:text-7xl font-extrabold text-text-main mb-6 tracking-tight drop-shadow-sm">
                        MindMate
                    </h1>
                    <p className="text-xl md:text-2xl text-text-muted font-medium max-w-2xl leading-relaxed mb-10">
                        Your Campus Wellness <br className="hidden md:block" />& Productivity Companion
                    </p>

                    <div className="mt-10 flex gap-4">
                        {token ? (
                            <Link to="/dashboard" className="px-8 py-3.5 rounded-full bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 transition-all">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-8 py-3.5 rounded-full bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 transition-all">
                                    Get Started
                                </Link>
                                <Link to="/login" className="px-8 py-3.5 rounded-full bg-white text-primary text-lg font-bold shadow-md hover:bg-gray-50 hover:scale-105 transition-all">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Feature Cards Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20 grid md:grid-cols-2 gap-8">
                {/* Wellness Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-soft flex items-start gap-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                        <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-main mb-2">Wellness</h2>
                        <p className="text-text-muted leading-relaxed">
                            Improve your campus wellness, health, beneath, and explanation wellness.
                            (Track your mood, get advisor support, and manage stress).
                        </p>
                    </div>
                </div>

                {/* Productivity Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-soft flex items-start gap-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-main mb-2">Productivity</h2>
                        <p className="text-text-muted leading-relaxed">
                            Compune your campus, wellness and productive snecan effects for your productivity.
                            (Manage tasks, track academic schedules, and stay organized).
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
