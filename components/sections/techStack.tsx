"use client";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';

const TechStack = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50
        });
    }, []);

    const technologies = [
        {
            name: "Solidity",
            imageSrc: "/assets/solidity.png",
            alt: "Solidity Logo",
            link: "https://soliditylang.org"
        },
        {
            name: "Next.js",
            imageSrc: "/assets/Nextjs.png",
            alt: "Next.js Logo",
            link: "https://nextjs.org"
        },
        {
            name: "JavaScript",
            imageSrc: "/assets/Javascript.png",
            alt: "JavaScript Logo",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        },
        {
            name: "Three.js",
            imageSrc: "/assets/three.png",
            alt: "Three.js Logo",
            link: "https://threejs.org"
        },
        {
            name: "Firebase",
            imageSrc: "/assets/firebase.png",
            alt: "Firebase Logo",
            link: "https://firebase.google.com"
        },
        {
            name: "TypeScript",
            imageSrc: "/assets/typescript-logo.png",
            alt: "TypeScript Logo",
            link: "https://www.typescriptlang.org"
        },
        {
            name: "Reown Appkit",
            imageSrc: "/assets/reown.png",
            alt: "Reown Appkit Logo",
            link: "https://www.reown.com" // Replace with actual URL if available
        },
        {
            name: "Wagmi",
            imageSrc: "/assets/wagmi.png",
            alt: "Wagmi Logo",
            link: "https://wagmi.sh"
        },
        {
            name: "ShadCn/UI",
            imageSrc: "/assets/shadcn-ui.png",
            alt: "ShadCn Logo",
            link: "https://ui.shadcn.com"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden ">
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black via-black/0 via-black/0 to-transparent z-10 opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/0 via-black/0 to-transparent z-10 opacity-70" />

            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, #BC1A1E 1px, transparent 1px),
              linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />

                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                    </div>
                </div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h2 className="relative text-4xl font-bold text-white mb-4 py-2">
                                Our Tech Stack
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h2>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Built with cutting-edge technologies to deliver a powerful and seamless DeFi experience
                    </p>
                </div>

                <div className="relative w-full overflow-hidden py-8">
                    <div className="inline-flex logos-slide">
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <Link
                                href={tech.link}
                                key={index}
                                className="mx-4 group cursor-pointer"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="relative w-48 h-24">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-[2px] transition-all duration-500 group-hover:opacity-100" />
                                    <div className="relative h-full rounded-xl bg-black border border-[#BC1A1E]/20 transition-all duration-500 group-hover:-translate-y-1 backdrop-blur-sm flex items-center justify-center p-4">
                                        <img
                                            src={tech.imageSrc}
                                            alt={tech.alt}
                                            className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes flow-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.1); }
        }
        @keyframes flow-2 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(50px, -50px) scale(1); }
        }
        .animate-flow-1 {
          animation: flow-1 15s ease-in-out infinite;
        }
        .animate-flow-2 {
          animation: flow-2 15s ease-in-out infinite;
        }
        
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 2rem));
          }
        }
        
        .logos-slide {
          animation: slide 45s linear infinite;
          will-change: transform;
          white-space: nowrap;
        }
        
        .logos-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default TechStack;
