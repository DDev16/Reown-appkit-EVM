'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import {
    AlertTriangle,
    Lock,
    Mail,
    Eye,
    EyeOff
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function UltraAestheticLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const backgroundRef = useRef<HTMLDivElement>(null);

    // Advanced background effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!backgroundRef.current) return;

            const { clientX, clientY } = e;
            backgroundRef.current.style.backgroundImage = `
                radial-gradient(
                    600px circle at ${clientX}px ${clientY}px, 
                    rgba(255, 0, 0, 0.1), 
                    transparent 40%
                )
            `;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/'); // Redirect to user dashboard instead of admin
        } catch (err: any) {
            console.error('Login error:', err);

            // More specific error handling
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                default:
                    setError(err.message || 'Failed to sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={backgroundRef}
            className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12"
        >


            {/* Main Login Container */}
            <div className="relative z-10 w-full max-w-md bg-black/80 border border-red-900/30 rounded-2xl shadow-2xl shadow-red-900/20 p-8">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 transform transition-transform hover:scale-110">
                        <Image
                            src="/assets/BullHead.png"
                            alt="DeFiBullWorld"
                            width={150}
                            height={150}
                            className="mx-auto rounded-full shadow-lg shadow-red-600/50 border-red-900"
                        />
                    </Link>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to unlock your financial potential
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 flex items-center">
                            <AlertTriangle className="text-red-500 mr-3" />
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="text-gray-500 group-focus-within:text-red-600 transition" size={20} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 group-focus-within:border-red-600"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-gray-500 group-focus-within:text-red-600 transition" size={20} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-12 py-3 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 group-focus-within:border-red-600"
                            placeholder="Enter your password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-500 hover:text-red-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-red-900 bg-black text-red-600 focus:ring-red-600"
                            />
                            <label className="ml-2 block text-sm text-gray-400">
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm text-red-600 hover:text-red-500 transition"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden py-3 px-4 rounded-lg text-white 
                        bg-black border border-red-900/30 
                        before:absolute before:inset-0 
                        before:bg-gradient-to-r before:from-transparent before:via-red-600/20 before:to-transparent 
                        before:transition before:duration-500 
                        hover:before:translate-x-full
                        focus:outline-none focus:ring-2 focus:ring-red-600
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transform transition hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="relative z-10">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </span>
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/signup"
                            className="font-medium text-red-600 hover:text-red-500 transition"
                        >
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}