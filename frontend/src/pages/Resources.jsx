import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Search, ChevronDown, ChevronUp, BookOpen, Activity, Heart, Zap, Phone, ExternalLink, PlayCircle } from 'lucide-react';

const Resources = () => {
    const [expandedResource, setExpandedResource] = useState(null);

    const toggleResource = (id) => {
        setExpandedResource(expandedResource === id ? null : id);
    };

    const resources = [
        {
            id: 1,
            title: 'Stress Management',
            description: 'Techniques and strategies to reduce stress in your daily student life.',
            icon: Activity,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
            details: 'Stress is a normal reaction to everyday pressures, but too much stress can affect your mood and health. Learn time management, relaxation techniques like deep breathing, and the importance of physical activity.',
            links: [
                { label: 'Read Guide', url: '#', type: 'article' },
                { label: 'Watch Workshop', url: '#', type: 'video' }
            ]
        },
        {
            id: 2,
            title: 'Anxiety Relief',
            description: 'Understand anxiety and find tools to manage anxious thoughts and feelings.',
            icon: Zap,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
            details: 'Anxiety can range from mild worrying to panic attacks. Effective strategies include mindfulness meditation, grounding exercises (like the 5-4-3-2-1 technique), and cognitive behavioral approaches.',
            links: [
                { label: 'Calming Exercises', url: '#', type: 'article' },
                { label: 'Mindfulness Video', url: '#', type: 'video' }
            ]
        },
        {
            id: 3,
            title: 'Meditation & Mindfulness',
            description: 'Guided meditations to help you stay present and focused.',
            icon: Heart,
            color: 'text-pink-500',
            bgColor: 'bg-pink-100',
            details: 'Meditation is a simple, fast way to reduce stress. It involves focusing your attention and eliminating the stream of jumbled thoughts that may be crowding your mind and causing stress.',
            links: [
                { label: 'Beginner Guide', url: '#', type: 'article' },
                { label: '10-min Guided Audio', url: '#', type: 'video' }
            ]
        },
        {
            id: 4,
            title: 'Academic Productivity',
            description: 'Boost your focus and study efficiency with these proven methods.',
            icon: BookOpen,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
            details: 'Productivity isn’t just about doing more; it’s about managing your energy and attention. Explore techniques like the Pomodoro method, active recall, and spaced repetition.',
            links: [
                { label: 'Study Hacks', url: '#', type: 'article' },
                { label: 'Planner Templates', url: '#', type: 'article' }
            ]
        },
        {
            id: 5,
            title: 'Emergency Help',
            description: 'Immediate support resources if you or someone else is in crisis.',
            icon: Phone,
            color: 'text-red-500',
            bgColor: 'bg-red-100',
            details: 'If you are in immediate danger, call campus security or emergency services. For confidential support, reach out to the counseling center or national helplines available 24/7.',
            links: [
                { label: 'Campus Police: 555-0199', url: 'tel:5550199', type: 'phone' },
                { label: 'Crisis Hotline', url: '#', type: 'external' }
            ]
        }
    ];

    return (
        <Layout>
            <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-text-main mb-4">Wellness Resources</h1>
                <p className="text-text-muted text-lg">
                    Curated guides, tools, and support to help you navigate your academic and personal journey.
                </p>
                <div className="mt-6 relative">
                    <input
                        type="text"
                        placeholder="Search for resources..."
                        className="w-full py-3 px-5 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className={`bg-white rounded-[1.5rem] p-6 shadow-soft hover:shadow-lg transition-all border border-transparent hover:border-${resource.color.split('-')[1]}-200 flex flex-col`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${resource.bgColor}`}>
                                <resource.icon className={`w-8 h-8 ${resource.color}`} />
                            </div>
                            <button
                                onClick={() => toggleResource(resource.id)}
                                className="text-text-muted hover:text-primary transition-colors"
                            >
                                {expandedResource === resource.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-text-main mb-2">{resource.title}</h3>
                        <p className="text-text-muted text-sm mb-4 flex-grow">{resource.description}</p>

                        {expandedResource === resource.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                                <p className="text-text-main text-sm mb-4 leading-relaxed">
                                    {resource.details}
                                </p>
                                <div className="space-y-2">
                                    {resource.links.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            className={`flex items-center gap-2 text-sm font-medium ${resource.color} hover:underline`}
                                        >
                                            {link.type === 'video' ? <PlayCircle size={16} /> :
                                                link.type === 'phone' ? <Phone size={16} /> :
                                                    <ExternalLink size={16} />}
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => toggleResource(resource.id)}
                            className={`w-full py-2.5 mt-auto rounded-xl font-semibold text-sm transition-colors ${expandedResource === resource.id ? 'bg-gray-100 text-text-main' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                        >
                            {expandedResource === resource.id ? 'Show Less' : 'Learn More'}
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Resources;
