import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Moon, Sun, Bell, Check, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import logo from '../assets/logo2.png';
import api from '../services/api';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    const [alerts, setAlerts] = useState([]);
    const [showAlerts, setShowAlerts] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        // Only fetch alerts if user is logged in AND is a STUDENT
        if (token && user?.role === 'STUDENT') {
            fetchAlerts();
            const interval = setInterval(fetchAlerts, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [token, user]);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/alerts/student');
            setAlerts(res.data);
            setUnreadCount(res.data.filter(a => !a.read).length);
        } catch (error) {
            // silent fail
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/alerts/student/${id}/read`);
            setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path
            ? 'text-primary font-bold'
            : 'text-text-muted hover:text-primary transition-colors';
    };

    return (
        <nav className="w-full bg-surface/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm border-b border-surface/50 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src={logo} alt="MindMate Logo" className="w-9 h-9 object-contain group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold text-text-main">MindMate</span>
                </Link>

                {/* Navigation Links - Centered */}
                <div className="hidden md:flex items-center gap-6 text-lg font-medium">
                    {!user?.role || user.role === 'STUDENT' ? (
                        <>
                            <Link to="/" className={isActive('/')}>Home</Link>
                            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                            <Link to="/academic" className={isActive('/academic')}>Academic</Link>
                            <Link to="/resources" className={isActive('/resources')}>Resources</Link>
                            <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                        </>
                    ) : (
                        // Advisor Links
                        <>
                            <Link to="/advisor" className={isActive('/advisor')}>Advisor Portal</Link>
                            <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Notifications (Only for Students) */}
                    {token && user?.role === 'STUDENT' && (
                        <div className="relative">
                            <button
                                onClick={() => setShowAlerts(!showAlerts)}
                                className="p-2 relative text-text-muted hover:text-primary transition-colors"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
                                )}
                            </button>

                            {/* Dropdown */}
                            {showAlerts && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                        <h4 className="font-bold text-gray-700 text-sm">Notifications</h4>
                                        <button onClick={() => setShowAlerts(false)}><X size={16} className="text-gray-400" /></button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {alerts.length > 0 ? (
                                            alerts.map(alert => (
                                                <div key={alert.id} className={`p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors ${!alert.read ? 'bg-blue-50/50' : ''}`}>
                                                    <p className="text-sm text-gray-800 font-medium mb-1">{alert.message}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                                        {!alert.read && (
                                                            <button
                                                                onClick={() => markAsRead(alert.id)}
                                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                            >
                                                                <Check size={12} /> Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-400 text-sm">
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Auth Buttons */}
                    {token ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hidden lg:block px-5 py-2 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2.5 rounded-full bg-primary text-white font-medium shadow-md shadow-primary/30 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
