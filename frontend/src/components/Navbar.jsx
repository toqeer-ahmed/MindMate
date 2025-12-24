import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import logo from '../assets/logo2.png';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

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
                <Link to="/" className="flex items-center gap-3 group">
                    <img src={logo} alt="MindMate Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold text-text-main">MindMate</span>
                </Link>

                {/* Navigation Links - Centered */}
                <div className="hidden md:flex items-center gap-8 text-lg font-medium">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                    <Link to="/resources" className={isActive('/resources')}>Resources</Link>
                    <Link to="/profile" className={isActive('/profile')}>Profile</Link>
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
