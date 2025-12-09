import React from 'react';
import Layout from '../components/Layout';
import { Search, ChevronRight, BookOpen, PenTool } from 'lucide-react';

const Resources = () => {
    const articles = [
        { id: 1, title: 'The Best Ideas for Today in Campus', date: 'Apr 13, 2022', desc: 'Tour various wellness spots, your understands the health aspect...', image: 'bg-green-100' },
        { id: 2, title: 'Tips to Mental Health - Study Tips', date: 'Apr 11, 2023', desc: 'Mental health toxic mental health gets how mental health study...', image: 'bg-blue-100' },
    ];

    const tools = [
        'Articles', 'Mental Health', 'Health Tips', 'Study Tips', 'BlessedGround', 'Exam Tips', 'Understand Studies'
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">Articles</h1>
                <p className="text-text-muted">Explore resources to help you thrive.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Articles Section */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-white rounded-[1.5rem] p-4 shadow-soft hover:shadow-lg transition-all group cursor-pointer border border-transparent hover:border-primary/20">
                            <div className={`h-40 rounded-xl mb-4 ${article.image} flex items-center justify-center`}>
                                <BookOpen className="text-text-muted/50 w-12 h-12" />
                            </div>
                            <div className="p-2">
                                <h3 className="font-bold text-lg text-text-main leading-tight mb-2 group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-text-muted mb-2 font-medium">{article.date}</p>
                                <p className="text-sm text-text-muted line-clamp-3">
                                    {article.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tools Section */}
                <div>
                    <div className="bg-white rounded-[1.5rem] p-6 shadow-soft">
                        <h3 className="text-xl font-bold text-text-main mb-6">Tools</h3>
                        <div className="space-y-2">
                            {tools.map((tool, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                                    <span className="text-text-main font-medium group-hover:text-primary transition-colors">{tool}</span>
                                    <ChevronRight size={16} className="text-text-muted group-hover:text-primary" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Resources;
