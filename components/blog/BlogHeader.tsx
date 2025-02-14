'use client';

interface BlogHeaderProps {
    title: string;
    subtitle?: string;
}

const BlogHeader = ({ title, subtitle = "Explore the latest insights and updates" }: BlogHeaderProps) => {
    return (
        <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,0,0.05),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(0,0,255,0.05),transparent_50%)]" />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            <div className="relative px-4 py-16 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-7xl">
                    {/* Decorative Elements */}
                    <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
                    <div className="absolute -right-4 bottom-0 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

                    {/* Content */}
                    <div className="relative">
                        <div className="text-center">
                            <h1 className="relative inline-block text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                {/* Red Glow Effect */}
                                <span className="absolute -inset-2 block rounded-lg bg-red-500/10 blur-xl" />
                                <span className="relative bg-gradient-to-b from-white via-white/90 to-gray-300 bg-clip-text text-transparent">
                                    {title}
                                </span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-400">
                                {subtitle}
                            </p>

                            {/* Decorative Line */}
                            <div className="mt-10 flex justify-center">
                                <div className="relative h-px w-40 bg-gradient-to-r from-transparent via-red-500/50 to-transparent">
                                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogHeader;