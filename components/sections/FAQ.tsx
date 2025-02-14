"use client";
import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            question: "What are the membership tiers available?",
            answer: "Our platform offers multiple membership tiers (Tier 1 - Tier 6), each providing access to exclusive educational content and benefits. Each tier builds upon the previous one, offering more advanced DeFi learning modules and features."
        },
        {
            question: "How does the token-gated education system work?",
            answer: "Our education system uses NFT-based access control. By holding a membership NFT, you gain access to tier-specific educational content. Higher tier NFTs unlock more advanced courses and exclusive learning materials."
        },
        {
            question: "What are the benefits of upgrading my membership tier?",
            answer: "Upgrading your membership tier provides access to more advanced DeFi courses, exclusive content, and potential airdrops. Higher tiers also receive priority access to new features and educational materials."
        },
        {
            question: "How do I mint a membership NFT?",
            answer: "You can mint membership NFTs through our dedicated minting page. Simply connect your wallet, select your desired tier, and complete the transaction. A 10% mint fee is automatically distributed to True Gems."
        },
        {
            question: "Can I participate in airdrops?",
            answer: "Yes! NFT holders are eligible for airdrops based on their membership tier. Our airdrop tool distributes both ERC20 tokens and additional NFTs to eligible holders based on specific conditions."
        }
    ];

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 " />
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
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-80 h-80">
                        <div className="absolute inset-0 bg-red-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob opacity-20" />
                    </div>
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80">
                        <div className="absolute inset-0 bg-rose-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 opacity-20" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-16" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h2 className="relative text-4xl font-bold text-white mb-4 py-2">
                                Frequently Asked Questions
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h2>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Everything you need to know about our Web3 education platform and membership system
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="group relative"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-[2px] transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative rounded-xl bg-black/80 backdrop-blur-xl border border-[#BC1A1E]/20 transition-all duration-500 group-hover:-translate-y-1">
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#BC1A1E]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Question Button */}
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="relative w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-lg text-white group-hover:text-[#FF4B51] transition-colors duration-300">
                                        {faq.question}
                                    </span>
                                    <div className="flex-shrink-0 ml-4 relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                                        {activeIndex === index ? (
                                            <Minus className="w-5 h-5 text-[#FF4B51]" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#FF4B51] transition-colors duration-300" />
                                        )}
                                    </div>
                                </button>

                                {/* Answer Panel */}
                                <div
                                    className={`relative overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="p-6 pt-0">
                                        <p className="text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Contact Section */}
                <div className="mt-16 text-center" data-aos="fade-up">
                    <p className="text-gray-400 mb-6">
                        Still have questions? We&quote;re here to help!
                    </p>
                    <button className="group relative px-8 py-4 font-semibold">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-lg blur-md transition-all duration-500 group-hover:blur-lg" />
                        <span className="relative bg-black block rounded-lg px-8 py-4 text-white transition-colors duration-300 group-hover:bg-black/80">
                            Contact Support
                        </span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -20px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(20px, 20px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 15s ease-in-out infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
};

export default FAQ;