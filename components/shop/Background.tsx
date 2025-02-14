// components/shop/Background.tsx
"use client";

const Background = () => {
    return (
        <div className="absolute inset-0">
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                        linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)"
                }}
            />
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                    <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                </div>
            </div>
        </div>
    );
};

export default Background;