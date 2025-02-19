import React from 'react';

interface Contributor {
    name: string;
    role: string;
    bio: string;
    image: string;
}

const contributors: Contributor[] = [
    {
        name: "Alex Chen",
        role: "Lead Developer",
        bio: "Full-stack developer with 5 years of experience in React and Node.js. Passionate about clean code and user experience.",
        image: "/network-logos/flare.jpg"
    },
    {
        name: "Sarah Johnson",
        role: "UI/UX Designer",
        bio: "Creative designer with a keen eye for detail. Specializes in creating intuitive and beautiful user interfaces.",
        image: "/network-logos/flare.jpg"
    },
    {
        name: "Michael Park",
        role: "Backend Engineer",
        bio: "System architect with expertise in scalable solutions. Loves solving complex problems.",
        image: "/network-logos/flare.jpg"
    }
];

const SingleCardContainer: React.FC<{ contributor: Contributor }> = ({ contributor }) => {
    return (
        <div className="relative h-96 group">
            {/* Animated Card Container */}
            <div
                className="relative w-full transition-all duration-500 ease-out transform group-hover:-translate-y-2"
                style={{ perspective: '1000px' }}
            >
                {/* Main Card */}
                <div className="relative w-full bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Profile Image Container */}
                    <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-rose-600 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-red-500">
                            <img
                                src={contributor.image}
                                alt={contributor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                        {contributor.name}
                    </h3>
                    <p className="text-red-500 font-medium mb-4">
                        {contributor.role}
                    </p>
                    <p className="text-gray-300 text-center text-sm leading-relaxed">
                        {contributor.bio}
                    </p>
                </div>

                {/* Enhanced Reflection */}
                <div
                    className="absolute w-full h-64 bottom-0 overflow-hidden"
                    style={{
                        perspective: '1000px',
                        transformOrigin: 'bottom',
                    }}
                >
                    <div
                        className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                        style={{
                            transform: 'rotateX(60deg) scale(1, -0.6)',
                            transformOrigin: 'top',
                        }}
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-red-500">
                            <img
                                src={contributor.image}
                                alt={contributor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {contributor.name}
                        </h3>
                        <p className="text-red-500 font-medium mb-4">
                            {contributor.role}
                        </p>
                        <p className="text-gray-300 text-center text-sm">
                            {contributor.bio}
                        </p>
                    </div>

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
                </div>
            </div>
        </div>
    );
};

const Contributors: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold text-center mb-4">
                    Our Contributors
                </h1>
                <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-16">
                    Meet the amazing team behind our success. Each member brings unique skills and passion to our projects.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contributors.map((contributor) => (
                        <SingleCardContainer
                            key={contributor.name}
                            contributor={contributor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contributors;