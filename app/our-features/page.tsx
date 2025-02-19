"use client";
import {
    BookOpen,
    Lock,
    Gift,
    ShoppingBag,
    Users,
    Newspaper,
    ArrowRight,
    ChevronLeft,
    Circle,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';


const featureDetails = {
    "token-gated-education": {
        title: "Token-Gated Education",
        icon: <BookOpen className="w-16 h-16 text-[#FF4B51]" />,
        sections: [
            {
                heading: "Personalized Learning Ecosystem",
                content: "Our token-gated education platform represents a revolutionary approach to DeFi learning. By leveraging blockchain technology, we've created a dynamic educational environment that adapts to your expertise level and learning goals."
            },
            {
                heading: "Tiered Access Model",
                content: "Each membership tier unlocks progressively advanced content. From beginner introductions to complex smart contract development, our platform provides a structured path to DeFi mastery. Your token acts as a key, opening doors to increasingly sophisticated educational resources."
            },
            {
                heading: "Interactive Learning Experience",
                content: "Unlike traditional educational platforms, our system offers interactive workshops, live coding sessions, and real-time expert interactions. Learn not just through theory, but through practical, hands-on experiences that prepare you for real-world DeFi challenges."
            },
            {
                heading: "Continuous Content Evolution",
                content: "The DeFi landscape moves at lightning speed. Our platform ensures you're always ahead of the curve with constantly updated content, cutting-edge research, and insights from industry leaders. Your learning never becomes obsolete."
            }
        ],
        technicalDetails: {
            heading: "Technical Architecture",
            content: "Powered by ERC-721 token integration, our platform uses smart contract logic to dynamically gate and update educational content. Each learning module is cryptographically linked to specific token holdings, ensuring a secure and personalized learning experience."
        }
    },
    "secure-platform": {
        title: "Secure Platform",
        icon: <Lock className="w-16 h-16 text-[#FF4B51]" />,
        sections: [
            {
                heading: "UUPS Proxy Standard",
                content: "At the heart of our platform's security is the Universal Upgradeable Proxy Standard (UUPS). This advanced contract architecture allows us to implement critical security updates without disrupting user experience or compromising existing data integrity."
            },
            {
                heading: "Multi-Layer Security Protocol",
                content: "We've implemented a comprehensive security approach that goes beyond traditional blockchain platforms. Our multi-signature wallet controls, advanced encryption methods, and continuous security audits create an impenetrable fortress for your digital assets and personal information."
            },
            {
                heading: "Continuous Vulnerability Assessment",
                content: "Security is not a one-time implementation but an ongoing process. Our dedicated security team conducts regular penetration testing, code reviews, and vulnerability assessments to identify and mitigate potential risks before they can become actual threats."
            },
            {
                heading: "Transparent Security Reporting",
                content: "We believe in complete transparency. All security updates, audits, and potential vulnerability reports are immediately communicated to our community, ensuring that our users are always informed and can make confident decisions."
            }
        ],
        technicalDetails: {
            heading: "Architectural Resilience",
            content: "By utilizing the UUPS proxy pattern, we can upgrade contract logic without migrating user data. This means seamless updates, zero downtime, and a future-proof platform that can rapidly adapt to emerging blockchain technologies and security requirements."
        }
    },
    "airdrops-rewards": {
        title: "Airdrops & Rewards",
        icon: <Gift className="w-16 h-16 text-[#FF4B51]" />,
        sections: [
            {
                heading: "Dynamic Reward Mechanism",
                content: "Our advanced airdrop system goes beyond traditional token distributions. We've created a sophisticated, merit-based reward ecosystem that recognizes and incentivizes meaningful platform engagement."
            },
            {
                heading: "Refferal Rewards",
                content: "Earn rewards by inviting friends, family, and colleagues to join our platform. Our referral system provides instant incentives for every new user you bring to the DeFi learning community."
            },
            {
                heading: "Community-Driven Incentives",
                content: "Rewards are not just about tokens. Our system creates multiple pathways for community members to earn recognition, including educational achievements, platform contributions, and active participation in DeFi learning."
            },
            {
                heading: "Transparent Distribution",
                content: "Every airdrop and reward is tracked on-chain, ensuring complete transparency and fairness. Our smart contract-based system eliminates arbitrary decision-making and provides clear, verifiable reward criteria."
            }
        ],
        technicalDetails: {
            heading: "Reward Infrastructure",
            content: "Leveraging blockchain's transparency, our reward system uses complex smart contracts that automatically calculate and distribute rewards based on predefined, immutable rules. This ensures a fair and tamper-proof incentive mechanism."
        }
    },
    "web3-merchandise": {
        title: "Web3 Shopping",
        icon: <ShoppingBag className="w-16 h-16 text-[#FF4B51]" />,
        sections: [
            {
                heading: "Crypto-Enabled Shopping Experience",
                content: "Our merchandise store is more than just a shop—it's a bridge between digital collectibles and real-world products. Shop using multiple cryptocurrencies, with a seamless, secure payment process powered by blockchain technology."
            },
            {
                heading: "Exclusive Design Collections",
                content: "Each merchandise item is a statement of your Web3 journey. From limited-edition apparel to unique accessories, our collections are designed by artists and blockchain enthusiasts who understand the culture of decentralized technology."
            },
            {
                heading: "Blockchain Authentication",
                content: "Every merchandise item comes with a blockchain-verified certificate of authenticity. This means each product is a verified, collectible item that can potentially appreciate in value over time."
            },
            {
                heading: "Global Accessibility",
                content: "Our platform breaks down geographical barriers. Regardless of your location, you can access our exclusive merchandise, pay with crypto, and have items shipped globally with transparent tracking."
            }
        ],
        technicalDetails: {
            heading: "Payment and Logistics Infrastructure",
            content: "Integrated smart contracts manage the entire merchandise ecosystem—from payment processing to inventory management. Our system supports multiple cryptocurrency payment methods and ensures secure, transparent transactions."
        }
    },
    "community-access": {
        title: "Community Access",
        icon: <Users className="w-16 h-16 text-[#FF4B51]" />,
        sections: [
            {
                heading: "Global Networking Platform",
                content: "Our community is a global melting pot of DeFi enthusiasts, from beginners to industry experts. Connect, collaborate, and grow with professionals who are actively shaping the future of decentralized finance."
            },
            {
                heading: "Expert-Led Discussion Forums",
                content: "Engage in deep-dive discussions moderated by industry leaders. Our forums are not just chat rooms—they're structured learning environments where complex DeFi concepts are explored and debated."
            },
            {
                heading: "Collaborative Learning Channels",
                content: "Beyond discussions, we provide collaborative spaces for group projects, code reviews, and real-time problem-solving. Learn by doing, with support from a global community of like-minded individuals."
            },
            {
                heading: "Regular Community Events",
                content: "Participate in webinars, AMAs, and live Q&A sessions with blockchain experts. Our community events provide direct access to industry insights, market analyses, and exclusive DeFi knowledge."
            }
        ],
        technicalDetails: {
            heading: "Community Management Technology",
            content: "Powered by blockchain-verified user profiles and reputation systems, our community platform ensures high-quality interactions. Smart contract-based access controls and token-gated channels maintain a high-quality, spam-free environment."
        }
    },
    "latest-updates": {
        title: "Latest Updates",
        icon: <Newspaper className="w-16 h-16 text-[#FF4B51]" />,
        sections: [
            {
                heading: "Real-Time DeFi Intelligence",
                content: "Our integrated blog is more than a news platform—it's a comprehensive DeFi intelligence hub. Receive instant insights, market analyses, and breaking news that keep you ahead of the rapidly evolving blockchain ecosystem."
            },
            {
                heading: "Expert Analysis and Insights",
                content: "Each update is curated and often written by industry experts who bring deep technical knowledge and strategic insights. Move beyond surface-level news to understand the underlying technologies and market dynamics."
            },
            {
                heading: "Predictive Market Research",
                content: "Our research team doesn't just report news—we provide forward-looking analysis that helps you anticipate market trends, technological breakthroughs, and potential investment opportunities."
            },
            {
                heading: "Personalized Content Curation",
                content: "We personalize each tiers content to the users interest and expertise level. This ensures that you receive the most relevant, high-quality information tailored to your specific interests and expertise level."
            }
        ],
        technicalDetails: {
            heading: "Content Delivery Infrastructure",
            content: "Utilizing blockchain-based content verification and AI-driven personalization algorithms, our update system ensures that you receive the most relevant, high-quality information tailored to your specific interests and expertise level."
        }
    }
};


const FeatureDetailPage = () => {
    const [currentFeature, setCurrentFeature] = useState<keyof typeof featureDetails>("token-gated-education");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const feature = featureDetails[currentFeature];
    const features = Object.keys(featureDetails) as Array<keyof typeof featureDetails>;
    const currentIndex = features.indexOf(currentFeature);

    const handleFeatureChange = (featureKey: keyof typeof featureDetails) => {
        setIsTransitioning(true);
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            setCurrentFeature(featureKey);
            setIsTransitioning(false);
        }, 300);
    };

    const handleNextFeature = () => {
        const nextIndex = (currentIndex + 1) % features.length;
        handleFeatureChange(features[nextIndex]);
    };

    const handlePrevFeature = () => {
        const prevIndex = (currentIndex - 1 + features.length) % features.length;
        handleFeatureChange(features[prevIndex]);
    };

    // Close mobile menu on resize if screen becomes larger
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-black text-white">
            {/* Feature Navigation Bar */}
            <div className="bg-black/40 backdrop-blur-sm sticky top-0 z-50 border-b border-[#BC1A1E]/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-gray-400 hover:text-white p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex flex-1 items-center justify-start space-x-8">
                            {features.map((featureKey) => (
                                <button
                                    key={featureKey}
                                    onClick={() => handleFeatureChange(featureKey)}
                                    className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-300 ${currentFeature === featureKey
                                            ? 'border-[#FF4B51] text-white'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {featureDetails[featureKey].icon}
                                    <span className="text-sm font-medium">
                                        {featureDetails[featureKey].title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                    <div className="px-4 py-2 space-y-2 bg-black/60 backdrop-blur-sm">
                        {features.map((featureKey) => (
                            <button
                                key={featureKey}
                                onClick={() => handleFeatureChange(featureKey)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${currentFeature === featureKey
                                        ? 'bg-[#BC1A1E]/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {featureDetails[featureKey].icon}
                                <span className="text-sm font-medium">
                                    {featureDetails[featureKey].title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {/* Hero Section */}
                <div className="relative bg-black/50 border-b border-[#BC1A1E]/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrevFeature}
                                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <div className="text-center space-y-4 px-2">
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    {feature.icon}
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {feature.title}
                                    </h1>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    {features.map((_, index) => (
                                        <Circle
                                            key={index}
                                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${index === currentIndex
                                                    ? 'fill-[#FF4B51] text-[#FF4B51]'
                                                    : 'fill-gray-600 text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleNextFeature}
                                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                            >
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 space-y-12 lg:space-y-20">
                    {/* Overview Grid */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#FF4B51] mb-6 lg:mb-12 flex items-center">
                            <span className="mr-2">Overview</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#FF4B51]/50 to-transparent ml-4" />
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            {feature.sections.slice(0, 2).map((section, index) => (
                                <div key={index} className="space-y-4 lg:space-y-6">
                                    <h3 className="text-xl lg:text-2xl font-medium text-white flex items-center">
                                        <span className="text-[#FF4B51] mr-2">{String(index + 1).padStart(2, '0')}</span>
                                        {section.heading}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#FF4B51] mb-6 lg:mb-12 flex items-center">
                            <span className="mr-2">Key Features</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#FF4B51]/50 to-transparent ml-4" />
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            {feature.sections.slice(2).map((section, index) => (
                                <div key={index} className="space-y-4 lg:space-y-6">
                                    <h3 className="text-xl lg:text-2xl font-medium text-white flex items-center">
                                        <span className="text-[#FF4B51] mr-2">{String(index + 3).padStart(2, '0')}</span>
                                        {section.heading}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#FF4B51] mb-6 lg:mb-12 flex items-center">
                            <span className="mr-2">Technical Specifications</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#FF4B51]/50 to-transparent ml-4" />
                        </h2>
                        <div className="bg-black/50 p-6 sm:p-8 lg:p-12 rounded-lg border border-[#BC1A1E]/20 backdrop-blur-sm">
                            <h3 className="text-xl lg:text-2xl font-medium text-white mb-4 lg:mb-6">
                                {feature.technicalDetails.heading}
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                                {feature.technicalDetails.content}
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center pt-4">
                        <Link
                            href="#"
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:from-[#FF4B51] hover:to-[#BC1A1E] transition-all duration-300 group"
                        >
                            <span className="text-base sm:text-lg">Start Exploring</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureDetailPage;