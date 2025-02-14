'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import {
    AlertTriangle,
    Lock,
    Mail,
    CheckCircle2,
    EyeOff,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function UltraAestheticSignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
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

    // Password strength checker
    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            // Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Create a user document in Firestore with all required fields
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: formData.email,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: 'user',
                isAdmin: false,
                uid: userCredential.user.uid,
                emailVerified: userCredential.user.emailVerified
            });

            router.push('/dashboard'); // Redirect to home page after signup
        } catch (err: any) {
            console.error('Signup error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists');
            } else {
                setError(err.message || 'Failed to create account');
            }
        } finally {
            setLoading(false);
        }
    };

    // Update form data and check password strength
    const handlePasswordChange = (value: string) => {
        setFormData({ ...formData, password: value });
        setPasswordStrength(checkPasswordStrength(value));
    };

    return (
        <div
            ref={backgroundRef}
            className="relative min-h-screen  overflow-hidden flex items-center justify-center px-4 py-12"
        >

            {/* Main Signup Container */}
            <div className="relative z-10 w-full max-w-md bg-black/80 border border-red-900/30 rounded-2xl shadow-2xl shadow-red-900/20 p-8">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 transform transition-transform hover:scale-110">
                        <Image
                            src="/assets/BullHead.png"
                            alt="DeFiBullWorld"
                            width={100}
                            height={100}
                            className="mx-auto rounded-full shadow-lg shadow-red-600/50  border-red-900"
                        />
                    </Link>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Unleash Your Financial Potential
                    </p>
                </div>

                {/* Signup Form */}
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
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            value={formData.password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            required
                            className="w-full pl-10 pr-12 py-3 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 group-focus-within:border-red-600"
                            placeholder="Create a password"
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

                    {/* Password Strength Indicator */}
                    <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${passwordStrength === 0 ? 'w-0 bg-red-900' :
                                passwordStrength <= 2 ? 'w-1/3 bg-red-700' :
                                    passwordStrength <= 4 ? 'w-2/3 bg-red-600' :
                                        'w-full bg-red-500'
                                }`}
                        ></div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CheckCircle2 className="text-gray-500 group-focus-within:text-red-600 transition" size={20} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 group-focus-within:border-red-600"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            required
                            className="h-4 w-4 rounded border-red-900 bg-black text-red-600 focus:ring-red-600"
                        />
                        <label className="ml-2 block text-sm text-gray-400">
                            I agree to the{' '}
                            <Link href="/terms" className="text-red-600 hover:text-red-500 transition">
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-red-600 hover:text-red-500 transition">
                                Privacy Policy
                            </Link>
                        </label>
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
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </span>
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-red-600 hover:text-red-500 transition"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}