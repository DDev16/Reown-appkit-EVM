"use client";
import {
    Mail,
    Phone,
    Send,
    User,
    MessageCircle,
    CheckCircle2,
    Loader2,
    Shield,
    Globe,
    Zap
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
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(formData.phone)) {
            errors.phone = "Invalid phone number format";
        }

        if (!formData.message.trim()) {
            errors.message = "Message is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, 1500);
            });

            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });

            setTimeout(() => setSubmitted(false), 3000);
        } catch (error) {
            alert('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        We&quot;re committed to providing exceptional support and addressing your inquiries with precision and care.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                    {/* Contact Form Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-black/50 backdrop-blur-md p-8 sm:p-10 lg:p-12 rounded-3xl border border-[#BC1A1E]/30 shadow-2xl">
                            <h2 className="text-3xl font-bold text-white mb-10 text-center">
                                Send Us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-7">
                                <div className="grid sm:grid-cols-2 gap-7">
                                    <div className="space-y-3">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="text-gray-400 w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-3.5 bg-black/60 border rounded-xl text-white 
                                                    ${formErrors.name
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-[#BC1A1E]/30 focus:ring-[#FF4B51]'
                                                    } 
                                                    focus:outline-none focus:ring-2 transition-all`}
                                                placeholder="Enter your full name"
                                            />
                                            {formErrors.name && (
                                                <p className="text-red-500 text-xs mt-1 pl-12">
                                                    {formErrors.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="text-gray-400 w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-3.5 bg-black/60 border rounded-xl text-white 
                                                    ${formErrors.email
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-[#BC1A1E]/30 focus:ring-[#FF4B51]'
                                                    } 
                                                    focus:outline-none focus:ring-2 transition-all`}
                                                placeholder="Enter your email"
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-xs mt-1 pl-12">
                                                    {formErrors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                        Phone Number <span className="text-gray-500">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="text-gray-400 w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-3.5 bg-black/60 border rounded-xl text-white 
                                                ${formErrors.phone
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-[#BC1A1E]/30 focus:ring-[#FF4B51]'
                                                } 
                                                focus:outline-none focus:ring-2 transition-all`}
                                            placeholder="Enter your phone number"
                                        />
                                        {formErrors.phone && (
                                            <p className="text-red-500 text-xs mt-1 pl-12">
                                                {formErrors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                                        Your Message
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                                            <MessageCircle className="text-gray-400 w-5 h-5" />
                                        </div>
                                        <textarea
                                            name="message"
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className={`w-full pl-12 pr-4 py-3.5 bg-black/60 border rounded-xl text-white 
                                                ${formErrors.message
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-[#BC1A1E]/30 focus:ring-[#FF4B51]'
                                                } 
                                                focus:outline-none focus:ring-2 transition-all resize-none`}
                                            placeholder="Describe how we can help you"
                                        />
                                        {formErrors.message && (
                                            <p className="text-red-500 text-xs mt-1 pl-12">
                                                {formErrors.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] 
                                        text-white font-bold py-4 rounded-xl 
                                        hover:from-[#FF4B51] hover:to-[#BC1A1E] 
                                        transition-all duration-300 
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        group"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin group-hover:rotate-180 transition-transform" />
                                    ) : submitted ? (
                                        <>
                                            <CheckCircle2 className="mr-3 w-6 h-6 text-green-400" />
                                            Message Sent Successfully
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Information and Support Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Connect Channels Section */}
                        <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl border border-[#BC1A1E]/30 shadow-2xl">
                            <h2 className="text-3xl font-bold text-white mb-10 text-center">
                                Connect With Us
                            </h2>
                            <div className="space-y-7">
                                {[
                                    {
                                        icon: Mail,
                                        title: "Email",
                                        value: "info@defibullworld.com",
                                        link: "mailto:info@defibullworld.com"
                                    },
                                    {
                                        icon: FaDiscord,
                                        title: "Discord",
                                        value: "Join our Discord Server",
                                        link: "https://discord.gg/yourserver"
                                    },
                                    {
                                        icon: FaTwitter,
                                        title: "Twitter",
                                        value: "@defibullworld",
                                        link: "https://x.com/defibullworld"
                                    }
                                ].map((contact, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-5 group"
                                    >
                                        <div className="bg-[#BC1A1E]/10 p-3.5 rounded-xl transition-all group-hover:bg-[#BC1A1E]/20">
                                            <contact.icon className="text-[#FF4B51] w-7 h-7 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                                                {contact.title}
                                            </p>
                                            <a
                                                href={contact.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white text-lg font-medium 
                                                    hover:text-[#FF4B51] 
                                                    transition-colors"
                                            >
                                                {contact.value}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support Commitment Section */}
                        <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl border border-[#BC1A1E]/30 shadow-2xl">
                            <h2 className="text-3xl font-bold text-white mb-6 text-center">
                                Our Support Commitment
                            </h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: Shield,
                                        title: "Dedicated Support",
                                        description: "Our expert team is committed to providing comprehensive and timely assistance."
                                    },
                                    {
                                        icon: Zap,
                                        title: "Rapid Response",
                                        description: "We prioritize quick and effective solutions to your inquiries and concerns."
                                    },
                                    {
                                        icon: Globe,
                                        title: "Global Accessibility",
                                        description: "Comprehensive support for our global community of users and investors."
                                    }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-5 group"
                                    >
                                        <div className="bg-[#BC1A1E]/10 p-3.5 rounded-xl transition-all group-hover:bg-[#BC1A1E]/20">
                                            <item.icon className="text-[#FF4B51] w-7 h-7 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h3 className="text-white text-lg font-semibold mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;