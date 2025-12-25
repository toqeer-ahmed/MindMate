import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT',
        studentId: '',
        department: '',
        officeLocation: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        logout(); // ensure clean state
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            const { token, role, firstName, lastName } = response.data;
            setAuth(token, { role, firstName, lastName });
            if (role === 'ADVISOR') {
                navigate('/advisor');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                // If register returns 403, it might be a weird security config, but usually 500/409
                setError('Registration failed. Access denied.');
            } else if (err.response && err.response.status === 500) {
                setError('Registration failed. Email might already exist.');
            } else {
                setError('Registration failed. Try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input name="firstName" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input name="lastName" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select name="role" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                            <option value="STUDENT">Student</option>
                            <option value="ADVISOR">Advisor</option>
                        </select>
                    </div>

                    {formData.role === 'STUDENT' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                <input name="studentId" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input name="department" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input name="department" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Office Location</label>
                                <input name="officeLocation" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-4"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
