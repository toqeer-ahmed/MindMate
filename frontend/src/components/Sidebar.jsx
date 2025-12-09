import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Smile, BookOpen, CheckSquare, LogOut, FileBarChart } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const linkClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(path)
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col p-4 fixed left-0 top-0">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <h1 className="text-xl font-bold text-gray-800">MindMate</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {user?.role === 'STUDENT' && (
                    <>
                        <Link to="/dashboard" className={linkClass('/dashboard')}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </Link>
                        <Link to="/mood" className={linkClass('/mood')}>
                            <Smile size={20} />
                            Mood Tracker
                        </Link>
                        <Link to="/journal" className={linkClass('/journal')}>
                            <BookOpen size={20} />
                            Journal
                        </Link>
                        <Link to="/tasks" className={linkClass('/tasks')}>
                            <CheckSquare size={20} />
                            Tasks
                        </Link>
                    </>
                )}

                {user?.role === 'ADVISOR' && (
                    <Link to="/advisor" className={linkClass('/advisor')}>
                        <FileBarChart size={20} />
                        Wellness Reports
                    </Link>
                )}
            </nav>

            <div className="border-t pt-4">
                <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
