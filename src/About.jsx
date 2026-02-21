import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './components/ui/all-ui';
import { User, Code, Lightbulb, Bug, Mail, Rocket, Wrench, Database } from 'lucide-react';

const About = () => {
    // Bug Report / Feedback Handler
    const handleFeedback = () => {
        // Replace with your actual preferred email if different
        const email = "omjagtappatil07@gmail.com";
        const subject = "RentManager: Bug Report / Feature Suggestion";
        const body = "Hi Om,%0D%0A%0D%0AI was using the RentManager app and wanted to share the following feedback/bug:%0D%0A%0D%0A[Please describe the issue or idea here]%0D%0A%0D%0AThanks!";

        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">About RentManager</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    A modern, serverless property management dashboard built to simplify rent tracking and financial analytics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* THE STORY CARD */}
                <Card className="md:col-span-2 group hover:border-indigo-500/50 transition-all">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                            <Lightbulb className="text-indigo-400" /> The Vision & Purpose
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-300 space-y-4 leading-relaxed">
                        <p>
                            Managing rental properties often involves messy spreadsheets, scattered WhatsApp messages, and a lot of manual math. <strong>RentManager</strong> was created to solve this real-world problem by providing landlords with a clean, automated, and professional dashboard.
                        </p>
                        <p>
                            Beyond solving a practical issue, this application serves as an <strong>academic capstone project</strong>. It bridges the gap between theoretical computer science concepts and practical, industry-standard software engineering.
                        </p>
                    </CardContent>
                </Card>

                {/* THE DEVELOPER CARD */}
                <Card className="group hover:border-purple-500/50 transition-all">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                            <User className="text-purple-400" /> The Developer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-300 space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                OJ
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Om Jagtap</h3>
                                <p className="text-indigo-400 text-sm font-medium">B.Tech Computer Science Engineering</p>
                            </div>
                        </div>
                        <p className="text-sm">
                            Passionate about full-stack development, UI/UX design, and building scalable SaaS applications that solve everyday problems.
                        </p>
                    </CardContent>
                </Card>

                {/* TECH STACK CARD */}
                <Card className="group hover:border-emerald-500/50 transition-all">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                            <Code className="text-emerald-400" /> Under the Hood
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-slate-900 rounded border border-slate-800"><Rocket size={16} className="text-blue-400" /></div>
                                <span><strong>Frontend:</strong> React.js, Vite, React Router</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-slate-900 rounded border border-slate-800"><Wrench size={16} className="text-cyan-400" /></div>
                                <span><strong>Styling:</strong> Tailwind CSS, Glassmorphism UI</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-slate-900 rounded border border-slate-800"><Database size={16} className="text-amber-400" /></div>
                                <span><strong>Backend & Auth:</strong> Firebase Firestore, Google OAuth</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-slate-900 rounded border border-slate-800"><Lightbulb size={16} className="text-rose-400" /></div>
                                <span><strong>Data Viz:</strong> Recharts</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* FEEDBACK & SUPPORT CARD */}
                <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950/20 border-indigo-500/20">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                            <Bug className="text-indigo-400" /> Feedback & Bug Reporting
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-slate-300 max-w-xl leading-relaxed">
                            Notice a glitch? Have a great idea for a new feature? This project is continuously evolving, and I'd love to hear your thoughts. Click below to drop me an email directly.
                        </p>
                        {/* FEEDBACK BUTTON - Changed to an Anchor tag for better browser support */}
                        <a
                            href="mailto:omjagtappatil07@gmail.com?subject=RentManager:%20Bug%20Report%20/%20Feature%20Suggestion&body=Hi%20Om,%0D%0A%0D%0AI%20was%20using%20the%20RentManager%20app%20and%20wanted%20to%20share%20the%20following%20feedback/bug:%0D%0A%0D%0A[Please%20describe%20the%20issue%20or%20idea%20here]%0D%0A%0D%0AThanks!"
                            className="inline-flex items-center justify-center w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-indigo-500/25 gap-3 transition-transform hover:-translate-y-1"
                        >
                            <Mail size={20} />
                            Contact Developer
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default About;