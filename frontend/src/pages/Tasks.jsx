import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        status: 'TODO'
    });

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            setFormData({ title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'TODO' });
            setShowForm(false);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
            await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Task
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg resize-none h-24"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700"
                            >
                                Save Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task.id} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 ${task.status === 'DONE' ? 'opacity-60' : ''}`}>
                        <button onClick={() => toggleStatus(task)} className="text-gray-400 hover:text-primary transition-colors">
                            {task.status === 'DONE' ? <CheckCircle size={24} className="text-green-500" /> : <Circle size={24} />}
                        </button>

                        <div className="flex-1">
                            <h3 className={`font-bold text-lg ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{task.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && !showForm && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No tasks found. Create one to get started!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Tasks;
