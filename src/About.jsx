import React from 'react';

const About = () => (
    <div className="max-w-2xl mx-auto text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-6">About RentManager</h1>
        <p className="mb-4">
            RentManager is a professional dashboard designed to help landlords and property managers track income and expenses effortlessly.
        </p>
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2">Version 1.0.0</h3>
            <p className="text-sm">Built with React, Firebase, and Tailwind CSS.</p>
        </div>
    </div>
);
export default About;
