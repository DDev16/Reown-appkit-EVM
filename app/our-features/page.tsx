"use client";
import {
    BookOpen,
    Lock,
    Gift,
    ShoppingBag,
    Users,
    Newspaper,
    ArrowRight,
    ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
            content: "Powered by ERC-20 token integration, our platform uses smart contract logic to dynamically gate and update educational content. Each learning module is cryptographically linked to specific token holdings, ensuring a secure and personalized learning experience."
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
                heading: "Exclusive NFT Collections",
                content: "Members can earn unique, limited-edition NFTs that represent more than just digital art. These NFTs serve as status symbols, provide additional platform benefits, and can be valuable assets in the broader Web3 ecosystem."
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
                content: "From virtual hackathons to AMAs (Ask Me Anything) with blockchain pioneers, our community events provide continuous learning and networking opportunities that extend beyond traditional educational platforms."
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
                content: "Leveraging AI and your platform engagement, our system curates content specifically tailored to your learning journey and interests. Stay informed without information overload."
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

    const feature = featureDetails[currentFeature];

    const handleNextFeature = () => {
        const features = Object.keys(featureDetails) as Array<keyof typeof featureDetails>;
        const currentIndex = features.indexOf(currentFeature);
        const nextIndex = (currentIndex + 1) % features.length;
        setCurrentFeature(features[nextIndex]);
    };

    const handlePrevFeature = () => {
        const features = Object.keys(featureDetails) as Array<keyof typeof featureDetails>;
        const currentIndex = features.indexOf(currentFeature);
        const prevIndex = (currentIndex - 1 + features.length) % features.length;
        setCurrentFeature(features[prevIndex]);
    };

    return (
        <div className="text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={handlePrevFeature}
                        className="text-gray-400 hover:text-white"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <div className="flex items-center space-x-4">
                        {feature.icon}
                        <h1 className="text-4xl font-bold">{feature.title}</h1>
                    </div>
                    <button
                        onClick={handleNextFeature}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowRight className="w-8 h-8" />
                    </button>
                </div>

                {feature.sections.map((section, index) => (
                    <div key={index} className="mb-12 bg-[#1A1A1A] p-6 rounded-xl border border-[#BC1A1E]/20">
                        <h2 className="text-2xl font-semibold text-[#FF4B51] mb-4">{section.heading}</h2>
                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                    </div>
                ))}

                <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#BC1A1E]/20">
                    <h2 className="text-2xl font-semibold text-[#FF4B51] mb-4">
                        {feature.technicalDetails.heading}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        {feature.technicalDetails.content}
                    </p>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="#"
                        className="inline-block bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all"
                    >
                        Explore More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeatureDetailPage;