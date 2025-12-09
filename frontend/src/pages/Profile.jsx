import React from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Shield, Bell } from 'lucide-react';

const Profile = () => {
    const { user } = useAuthStore();

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">User Settings</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Profile Card */}
                <div className="w-full md:w-1/3 bg-white rounded-[1.5rem] p-8 shadow-soft flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-500">
                        <User size={64} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-text-muted mb-6">{user?.email}</p>
                    <button className="px-6 py-2 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all">
                        Edit Profile
                    </button>
                </div>

                {/* Settings Form */}
                <div className="w-full md:w-2/3 bg-white rounded-[1.5rem] p-8 shadow-soft">
                    <h3 className="text-xl font-bold text-text-main mb-6">Account Information</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">User name</label>
                            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <User size={18} className="text-text-muted" />
                                <input type="text" defaultValue={user?.firstName} className="flex-1 outline-none text-text-main" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Email address</label>
                            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <Mail size={18} className="text-text-muted" />
                                <input type="email" defaultValue={user?.email} className="flex-1 outline-none text-text-main" disabled />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
                            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <Shield size={18} className="text-text-muted" />
                                <input type="password" value="********" className="flex-1 outline-none text-text-main" disabled />
                                <button className="text-sm text-primary font-medium hover:underline">Change</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
