"use client";
import { TrendingUp, BookOpen, Shield, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroFeatures = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
      offset: 50,
    });
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Analysis",
      description: "Expert insights on market trends and opportunities",
      position: "translate-y-0 lg:translate-y-12",
      animation: "fade-right",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Education First",
      description: "Comprehensive DeFi learning modules for all levels",
      position: "translate-y-0",
      animation: "fade-up",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Built with cutting-edge Web3 security standards",
      position: "translate-y-0 lg:translate-y-12",
      animation: "fade-left",
    },
  ];

  return (
    <div className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[75%] opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #BC1A1E 1px, transparent 1px),
              linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
          }}
        />
        {/* Floating Element */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-[1500px] h-[100px] rounded-full animate-float"
            style={{
              backgroundImage: `
                radial-gradient(circle at center, rgba(188,26,29,1) 100%, transparent 80%),
                url('/assets/noise.png')
              `,
              backgroundSize: "cover, 200px 200px",
              backgroundRepeat: "no-repeat, repeat",
              filter: "blur(80px)",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative ${feature.position} transition-transform duration-500`}
              data-aos={feature.animation}
              data-aos-delay={index * 150}
            >
              <div className="relative backdrop-blur-md rounded-2xl p-8 bg-transparent border border-[#BC1A1E]/40 transition-all duration-700 hover:scale-105 hover:shadow-[0_0_15px_rgba(188,26,29,0.5)]">
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

                {/* Icon */}
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-[#BC1A1E] rounded-xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                  <div className="relative p-4 rounded-xl border border-[#BC1A1E]/40 transition-colors duration-700">
                    <div className="text-[#BC1A1E] group-hover:text-[#FF4B51] transition-colors duration-700">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white/90 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed text-sm group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="pt-4 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-[#BC1A1E] hover:text-[#FF4B51] transition-colors duration-300 font-medium"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: scale(1) translate(0, 0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1) translate(-10px, 10px) rotate(5deg);
            opacity: 0.4;
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroFeatures;
