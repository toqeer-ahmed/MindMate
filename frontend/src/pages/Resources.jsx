import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Search, ChevronDown, ChevronUp, BookOpen, Activity, Heart, Zap, Phone, ExternalLink, PlayCircle, FileText } from 'lucide-react';

const Resources = () => {
    const [expandedResource, setExpandedResource] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
            details: 'Stress is a normal reaction to everyday pressures, but too much stress can affect your mood and health. Learn time management, relaxation techniques like deep breathing, and the importance of physical activity. Implementing small breaks and maintaining a balanced diet can also significantly reduce stress levels.',
            links: [
                { label: 'Read Guide', url: '#', type: 'article' },
                { label: 'Watch Workshop', url: '#', type: 'video' },
                { label: 'External Help', url: '#', type: 'external' }
            ]
        },
        {
            id: 2,
            title: 'Anxiety Relief',
            description: 'Understand anxiety and find tools to manage anxious thoughts and feelings.',
            icon: Zap,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
            details: 'Anxiety can range from mild worrying to panic attacks. Effective strategies include mindfulness meditation, grounding exercises (like the 5-4-3-2-1 technique), and cognitive behavioral approaches. Identifying triggers is the first step towards managing them.',
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
            details: 'Meditation is a simple, fast way to reduce stress. It involves focusing your attention and eliminating the stream of jumbled thoughts that may be crowding your mind and causing stress. Practice daily for best results.',
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
            details: 'Productivity isn’t just about doing more; it’s about managing your energy and attention. Explore techniques like the Pomodoro method, active recall, and spaced repetition to maximize your study sessions without burning out.',
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
            details: 'If you are in immediate danger, call campus security or emergency services. For confidential support, reach out to the counseling center or national helplines available 24/7. Your safety is the priority.',
            links: [
                { label: 'Campus Police: 555-0199', url: 'tel:5550199', type: 'phone' },
                { label: 'Crisis Hotline', url: '#', type: 'external' }
            ]
        }
    ];

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-10 text-center max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Wellness Resources</h1>
                <p className="text-gray-500 text-lg">
                    Curated guides, tools, and support to help you navigate your academic and personal journey.
                </p>
                <div className="mt-8 relative group">
                    <input
                        type="text"
                        placeholder="Search for resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-4 px-6 pl-12 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all group-hover:shadow-md"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                {filteredResources.map((resource) => (
                    <div
                        key={resource.id}
                        className={`bg-white rounded-[2rem] p-6 shadow-soft hover:shadow-xl transition-all border border-gray-100 flex flex-col`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-4 rounded-2xl ${resource.bgColor}`}>
                                <resource.icon className={`w-8 h-8 ${resource.color}`} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${resource.bgColor} ${resource.color.replace('text', 'text')}`}>
                                {resource.title.split(' ')[0]}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                        <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{resource.description}</p>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedResource === resource.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pt-4 border-t border-gray-100 mb-4">
                                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                    {resource.details}
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {resource.links.map((link, idx) => {
                                        let BtnIcon = ExternalLink;
                                        let btnClass = "bg-gray-50 text-gray-700 hover:bg-gray-100";

                                        if (link.type === 'video') { BtnIcon = PlayCircle; btnClass = "bg-red-50 text-red-600 hover:bg-red-100"; }
                                        else if (link.type === 'article') { BtnIcon = FileText; btnClass = "bg-blue-50 text-blue-600 hover:bg-blue-100"; }
                                        else if (link.type === 'phone') { BtnIcon = Phone; btnClass = "bg-green-50 text-green-600 hover:bg-green-100"; }

                                        return (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-colors ${btnClass}`}
                                            >
                                                <BtnIcon size={16} />
                                                {link.label}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleResource(resource.id)}
                            className={`w-full py-3 mt-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1 ${expandedResource === resource.id ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/10'}`}
                        >
                            {expandedResource === resource.id ? <><ChevronUp size={16} /> Show Less</> : <><ChevronDown size={16} /> View Resources</>}
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Resources;
