// components/shop/Header.tsx
"use client";

const Header = () => {
    return (
        <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                    <h1 className="relative text-4xl font-bold text-white mb-4 py-2">
                        DBW Shop
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                    </h1>
                </div>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-4">
                Exclusive merchandise and accessories for the DBW community
            </p>
        </div>
    );
};

export default Header;