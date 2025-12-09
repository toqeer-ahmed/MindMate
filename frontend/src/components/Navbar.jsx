import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
    const location = useLocation();
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary font-bold' : 'text-text-muted hover:text-primary transition-colors';
    };

    return (
        <nav className="w-full bg-surface/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Brain className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold text-text-main">MindMate</span>
                </Link>

                {/* Navigation Links - Centered */}
                <div className="hidden md:flex items-center gap-8 text-lg font-medium">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                    <Link to="/resources" className={isActive('/resources')}>Resources</Link>
                    <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {token ? (
                        <div className="flex items-center gap-4">
                             <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                            <button 
                                onClick={logout}
                                className="px-5 py-2 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login"
                            className="px-6 py-2.5 rounded-full bg-primary text-white font-medium shadow-md shadow-primary/30 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
                        >
                            Log In/Sign Up
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
