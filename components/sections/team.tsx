"use client";
import { useEffect } from 'react';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    socials: {
        twitter?: string;
        github?: string;
        linkedin?: string;
        website?: string;
        discord?: string;
    };
}

const Team = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const team: TeamMember[] = [
        {
            name: "Frank",
            role: "Founder & CEO",
            image: "/assets/BullHead.png",
            bio: "Blockchain veteran with 10+ years of experience in DeFi",
            socials: {
                twitter: "#",
                discord: "#"
            }
        },
        {
            name: "Dillon",
            role: "Lead Developer",
            image: "/assets/Dill.png",
            bio: "Smart contract expert specializing in secure DeFi protocols",
            socials: {
                github: "#",
                twitter: "#",
                discord: "#"

            }
        },
        {
            name: "Dan Rocky",
            role: "IT architect & advisor",
            image: "/assets/dan.jpg",
            bio: "Award-winning UI/UX designer with blockchain expertise",
            socials: {
                twitter: "#",
                linkedin: "#",
                discord: "#"

            }
        },

    ];

    const renderSocialIcons = (socials: TeamMember['socials']) => {
        return (
            <div className="flex gap-3">
                {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#FF4B51] transition-colors duration-300">
                        <FaTwitter className="w-5 h-5" />
                    </a>
                )}
                {socials.github && (
                    <a href={socials.github} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#FF4B51] transition-colors duration-300">
                        <FaGithub className="w-5 h-5" />
                    </a>
                )}
                {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#FF4B51] transition-colors duration-300">
                        <FaLinkedin className="w-5 h-5" />
                    </a>
                )}
                {socials.website && (
                    <a href={socials.website} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#FF4B51] transition-colors duration-300">
                        <Globe className="w-5 h-5" />
                    </a>
                )}
                {socials.discord && (
                    <a href={socials.discord} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#FF4B51] transition-colors duration-300">
                        <FaDiscord className="w-5 h-5" />
                    </a>
                )}
            </div>
        );
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />

                {/* Animated Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {team.map((_, index) => (
                        <div
                            key={index}
                            className={`absolute w-96 h-96 transition-all duration-1000 ease-in-out
                                ${index % 4 === 0 ? 'left-[20%]' :
                                    index % 4 === 1 ? 'left-[40%]' :
                                        index % 4 === 2 ? 'left-[60%]' : 'left-[40%]'}
                                ${index % 2 === 0 ? 'top-[40%]' : 'top-[30%]'}`}
                        >
                            <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                            <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2 delay-75"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/0 via-black/0 to-transparent z-10 opacity-70" />


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Title */}
                <div className="text-center mb-20 relative" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h2 className="text-[#BC1A1E] text-5xl font-bold">Our Team</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white relative">
                            Our Team
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Meet the innovators behind our vision
                    </p>
                </div>

                {/* Team Grid */}
                <div className="flex justify-center">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="group relative"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Card with Glowing Border */}
                                <div className="relative">
                                    {/* Glowing Border */}
                                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>

                                    <div className="relative rounded-2xl bg-black/90 p-6 backdrop-blur-sm border border-[#BC1A1E]/20">
                                        {/* Image Container */}
                                        <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Image Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                            <p className="text-[#FF4B51] font-medium">{member.role}</p>
                                            <p className="text-gray-400 text-sm">{member.bio}</p>
                                            <div className="pt-3 border-t border-[#BC1A1E]/20">
                                                {renderSocialIcons(member.socials)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(-30px, 30px) scale(1.1); opacity: 0.3; }
                }
                @keyframes flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.15; }
                    50% { transform: translate(30px, -30px) scale(1); opacity: 0.25; }
                }
                
                .animate-flow-1 {
                    animation: flow-1 15s ease-in-out infinite;
                }
                .animate-flow-2 {
                    animation: flow-2 15s ease-in-out infinite;
                }

                .delay-75 {
                    animation-delay: 75ms;
                }
            `}</style>
        </section>
    );
};

export default Team;