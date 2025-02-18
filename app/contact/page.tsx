"use client";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    User,
    MessageCircle
} from 'lucide-react';
import { useState, FormEvent } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        console.log('Form submitted:', formData);
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <div className=" text-white min-h-screen">
            <div className="absolute inset-0 opacity-[0.15]" style={{
                backgroundImage: `
                    linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                    linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
            }} />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <div className="inline-block relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                        <h1 className="relative text-4xl font-bold text-white mb-4 py-2">
                            Contact Us
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-4">
                        We&apos;re here to help you navigate the world of DeFi. Reach out with any questions or inquiries.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-[#1A1A1A] p-8 rounded-xl border border-[#BC1A1E]/20">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
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
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51]"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51]"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                    Phone Number (Optional)
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
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51]"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
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
                                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#BC1A1E]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF4B51]"
                                        placeholder="Write your message here"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
                            >
                                <Send className="mr-2 w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-[#1A1A1A] p-8 rounded-xl border border-[#BC1A1E]/20">
                            <h2 className="text-2xl font-semibold text-[#FF4B51] mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Mail className="text-[#FF4B51] w-8 h-8" />
                                    <div>
                                        <p className="text-gray-300">Email</p>
                                        <a
                                            href="mailto:support@defiplatform.com"
                                            className="text-white hover:text-[#FF4B51] transition-colors"
                                        >
                                            support@defiplatform.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Phone className="text-[#FF4B51] w-8 h-8" />
                                    <div>
                                        <p className="text-gray-300">Phone</p>
                                        <a
                                            href="tel:+18005551234"
                                            className="text-white hover:text-[#FF4B51] transition-colors"
                                        >
                                            +1 (800) 555-1234
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <MapPin className="text-[#FF4B51] w-8 h-8" />
                                    <div>
                                        <p className="text-gray-300">Address</p>
                                        <p className="text-white">
                                            123 Blockchain Avenue,
                                            Tech District,
                                            Crypto City, DC 12345
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1A1A1E]/10 p-8 rounded-xl border border-[#BC1A1E]/20">
                            <h2 className="text-2xl font-semibold text-[#FF4B51] mb-4">
                                Support Hours
                            </h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Monday - Friday</span>
                                    <span className="text-white">9:00 AM - 6:00 PM EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Saturday</span>
                                    <span className="text-white">10:00 AM - 4:00 PM EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Sunday</span>
                                    <span className="text-white">Closed</span>
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