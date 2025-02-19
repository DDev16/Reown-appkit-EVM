"use client";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    User,
    MessageCircle,
    CheckCircle2,
    Loader2,

} from 'lucide-react';
import { FaTwitter, FaDiscord } from 'react-icons/fa';

import { useState, FormEvent } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setSubmitted(true);
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-transparent text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.08]" style={{
                backgroundImage: `
                    linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                    linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
            }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        Our team of DeFi experts is here to help. Whether you have questions about our platform
                        or need technical support, we&apos;re ready to assist.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Contact Form Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#BC1A1E]/20">
                            <h2 className="text-2xl font-semibold text-white mb-8">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="text-gray-400 w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51] transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="text-gray-400 w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51] transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                        Phone Number <span className="text-gray-500">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="text-gray-400 w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51] transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                                        Your Message
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                                            <MessageCircle className="text-gray-400 w-5 h-5" />
                                        </div>
                                        <textarea
                                            name="message"
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51] transition-all resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-bold py-4 px-6 rounded-xl hover:from-[#FF4B51] hover:to-[#BC1A1E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : submitted ? (
                                        <><CheckCircle2 className="mr-2 w-5 h-5" /> Message Sent!</>
                                    ) : (
                                        <><Send className="mr-2 w-5 h-5" /> Send Message</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-[#BC1A1E]/20">
                            <h2 className="text-2xl font-semibold text-white mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-[#BC1A1E]/10 p-3 rounded-lg">
                                        <Mail className="text-[#FF4B51] w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <a
                                            href="mailto:support@defiplatform.com"
                                            className="text-white hover:text-[#FF4B51] transition-colors"
                                        >
                                            Defibullworld@gmail.com
                                        </a>
                                    </div>
                                </div>


                                {/* Discord Contact */}
                                <div className="flex items-start space-x-4">
                                    <div className="bg-[#BC1A1E]/10 p-3 rounded-lg">
                                        <FaDiscord className="text-[#FF4B51] w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Discord</p>
                                        <a
                                            href="https://discord.gg/yourserver"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-[#FF4B51] transition-colors"
                                        >
                                            Join our Discord Server
                                        </a>
                                    </div>
                                </div>

                                {/* Twitter Contact */}
                                <div className="flex items-start space-x-4">
                                    <div className="bg-[#BC1A1E]/10 p-3 rounded-lg">
                                        <FaTwitter className="text-[#FF4B51] w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Twitter</p>
                                        <a
                                            href="https://x.com/XRP_FLR_SGB"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-[#FF4B51] transition-colors"
                                        >
                                            @XRP_FLR_SGB
                                        </a>
                                    </div>
                                </div>

                                <div >

                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-[#BC1A1E]/20">
                            <h2 className="text-2xl font-semibold text-white mb-6">
                                Support Hours
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-[#BC1A1E]/10">
                                    <span className="text-gray-400">Monday - Friday</span>
                                    <span className="text-white font-medium">9:00 AM - 6:00 PM EST</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[#BC1A1E]/10">
                                    <span className="text-gray-400">Saturday</span>
                                    <span className="text-white font-medium">10:00 AM - 4:00 PM EST</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-white font-medium">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;