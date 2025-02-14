"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const [backgroundElements, setBackgroundElements] = useState<{
        width: number;
        height: number;
        left: number;
        top: number;
        delay: number;
        duration: number;
    }[]>([]);

    useEffect(() => {
        // Generate background elements only on client-side
        const elements = Array(20).fill(null).map(() => ({
            width: 100 + Math.floor(Math.random() * 250),
            height: 100 + Math.floor(Math.random() * 250),
            left: Math.floor(Math.random() * 100),
            top: Math.floor(Math.random() * 100),
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 3
        }));
        setBackgroundElements(elements);
    }, []);

    const goBack = () => {
        window.history.back();
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        }
    };

    const numberVariants = {
        hidden: { scale: 0, opacity: 0 },
        show: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                delay: i * 0.1,
                duration: 0.6
            }
        })
    };

    const floatingAnimation = {
        y: [-10, 10],
        transition: {
            y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  text-white p-4 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                {backgroundElements.map((element, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-red-500/10 via-gray-500/10 to-black/10"
                        style={{
                            width: element.width,
                            height: element.height,
                            left: `${element.left}%`,
                            top: `${element.top}%`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: element.duration,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: element.delay,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="max-w-2xl w-full text-center space-y-8 z-10"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* 404 Numbers */}
                <div className="flex justify-center items-center gap-4 mb-12">
                    {[4, 0, 4].map((number, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={numberVariants}
                            animate="show"
                            initial="hidden"
                            whileHover={{ scale: 1.1 }}
                            className={`text-8xl font-bold ${i === 0 ? 'text-red-600' :
                                i === 1 ? 'text-gray-500' :
                                    'text-white'
                                }`}
                        >
                            <motion.span
                                animate={floatingAnimation}
                                style={{ display: 'inline-block' }}
                            >
                                {number}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>

                {/* Text Content */}
                <motion.h2
                    variants={itemVariants}
                    className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-gray-500 to-black"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-gray-300 max-w-md mx-auto"
                >
                    Oops! It seems you&apos;ve ventured into uncharted territory. The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </motion.p>

                {/* Navigation Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center gap-4 pt-6"
                >
                    <motion.button
                        onClick={goBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 flex items-center gap-2 bg-transparent border border-gray-700 rounded-lg 
                            hover:border-red-600 transition-colors duration-300 group"
                    >
                        <motion.span
                            animate={{ x: [-2, 2] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </motion.span>
                        <span>Go Back</span>
                    </motion.button>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/"
                            className="px-6 py-3 flex items-center gap-2 bg-gradient-to-r from-red-600 via-gray-600 to-black 
                                rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home Page</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}