import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Journal = () => {
    const [entries, setEntries] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [moodTag, setMoodTag] = useState('Neutral');
    const [loading, setLoading] = useState(false);

    const fetchEntries = async () => {
        try {
            const res = await api.get('/journal');
            setEntries(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/journal', { title, content, moodTag });
            setTitle('');
            setContent('');
            setMoodTag('Neutral');
            fetchEntries();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Journal</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">New Entry</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <select
                                    value={moodTag}
                                    onChange={(e) => setMoodTag(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="Happy">Happy</option>
                                    <option value="Excited">Excited</option>
                                    <option value="Neutral">Neutral</option>
                                    <option value="Sad">Sad</option>
                                    <option value="Anxious">Anxious</option>
                                    <option value="Angry">Angry</option>
                                </select>
                            </div>
                            <div>
                                <textarea
                                    placeholder="Write your thoughts..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg h-64 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h2 className="text-xl font-bold mb-6">Recent Entries</h2>
                        <div className="space-y-4 overflow-y-auto max-h-[600px]">
                            {entries.map(entry => (
                                <div key={entry.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                    <h3 className="font-bold text-gray-800 mb-1">{entry.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        <span className="px-2 py-0.5 bg-gray-200 rounded-full">{entry.moodTag}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-3">{entry.content}</p>
                                </div>
                            ))}
                            {entries.length === 0 && <p className="text-gray-500 text-center">No entries yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Journal;
