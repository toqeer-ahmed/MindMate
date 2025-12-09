import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/20 selection:text-primary-dark">
            <Navbar />
            <main className="w-full">
                {children}
            </main>
            <footer className="w-full py-8 text-center text-text-muted text-sm bg-surface mt-20 border-t border-slate-100">
                <p>© {new Date().getFullYear()} MindMate. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
