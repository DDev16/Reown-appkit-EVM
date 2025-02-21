"use client";
import React, { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2, Send } from 'lucide-react';

const ApplyPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const roles = [
        'Core Contributor',
        'Frontend Developer',
        'Backend Engineer',
        'Blockchain Architect',
        'Smart Contract Developer',
        'UI/UX Designer',
        'DevOps Engineer',
        'Security Researcher',
        'Protocol Economist',
        'Community Manager',
        'Machine Learning Engineer',
        'Data Scientist',
        'Technical Writer',
        'Product Manager',
        'Research Scientist'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual form submission logic
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen text-white py-16 px-4 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                        Join Our Innovation Frontier
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        We&apos;re not just building technology—we&apos;re crafting the future of decentralized systems.
                        Your unique skills could be the missing piece in our revolutionary ecosystem.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Motivation */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-red-500/50 transition-all group">
                            <div className="flex items-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-red-500 mr-4" />
                                <h3 className="text-2xl font-bold text-white">
                                    Impact-Driven Culture
                                </h3>
                            </div>
                            <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                We believe in empowering innovators who can transform complex challenges into elegant solutions.
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-red-500/50 transition-all group">
                            <div className="flex items-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-red-500 mr-4" />
                                <h3 className="text-2xl font-bold text-white">
                                    Global Collaboration
                                </h3>
                            </div>
                            <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                Work with a diverse, talented team spread across the globe, united by a passion for cutting-edge technology.
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-red-500/50 transition-all group">
                            <div className="flex items-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-red-500 mr-4" />
                                <h3 className="text-2xl font-bold text-white">
                                    Continuous Learning
                                </h3>
                            </div>
                            <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                An environment that encourages personal growth, innovation, and pushing the boundaries of what&apos;s possible.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Application Form */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-lg">
                        {!submitted ? (
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-3xl font-bold mb-6 text-white">
                                    Your Journey Starts Here
                                </h2>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
                                    />

                                    <select
                                        name="role"
                                        required
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
                                    >
                                        <option value="">Select Your Role</option>
                                        {roles.map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>

                                    <textarea
                                        name="message"
                                        placeholder="Why do you want to join our team? Share your passion, vision, and unique perspective."
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors group"
                                >
                                    Submit Application
                                    <Send className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6">
                                <CheckCircle2 className="mx-auto w-24 h-24 text-red-500" />
                                <h2 className="text-3xl font-bold text-white">
                                    Application Received!
                                </h2>
                                <p className="text-zinc-400">
                                    Thank you for your interest. Our team will review your application and get back to you soon.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mx-auto flex items-center px-6 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors group"
                                >
                                    Submit Another Application
                                    <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyPage;