"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

class Particle {
    x: number;
    y: number;
    ctx: CanvasRenderingContext2D;
    color: string;
    radius: number;
    speedX: number;
    speedY: number;
    alpha: number;
    spin: number;
    size: number;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, color: string, isClick: boolean = false) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
        this.radius = isClick ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5;
        this.speedX = isClick ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.5;
        this.speedY = isClick ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.5;
        this.alpha = 1;
        this.spin = Math.random() * 360;
        this.size = isClick ? Math.random() * 10 + 5 : Math.random() * 3 + 2;
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((this.spin * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
        this.ctx.fillStyle = `rgba(${this.color}, ${this.alpha * 0.3})`;
        this.ctx.fill();
        this.ctx.restore();
    }

    update(): void {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
        this.spin += 0.2;
        this.size += 0.1;
    }
}

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx || !canvas) return;

            const dx = e.clientX - lastPositionRef.current.x;
            const dy = e.clientY - lastPositionRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                for (let i = 0; i < 3; i++) {
                    particlesRef.current.push(
                        new Particle(e.clientX, e.clientY, ctx, '188, 26, 30', false)
                    );
                }
                lastPositionRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleClick = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx || !canvas) return;

            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(
                    new Particle(position.x, position.y, ctx, '188, 26, 30', true)
                );
            }
        };

        const animate = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesRef.current = particlesRef.current.filter(particle => particle.alpha > 0);
            particlesRef.current.forEach(particle => {
                particle.update();
                particle.draw();
            });
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('click', handleClick);
        window.addEventListener('resize', resizeCanvas);
        document.body.style.cursor = 'none';

        resizeCanvas();
        animate();

        return () => {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('click', handleClick);
            window.removeEventListener('resize', resizeCanvas);
            document.body.style.cursor = 'default';
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [position]);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 10000
                }}
            />
            <motion.div
                className="cursor-wrapper"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
                    border: '2px solid white',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mixBlendMode: 'difference'
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: '16px',
                        height: '16px',
                        border: '1.5px solid white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <PlusCircle className="w-3 h-3" style={{ color: 'white' }} />
                </motion.div>
            </motion.div>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    transition: 'transform 0.1s ease',
                    mixBlendMode: 'difference'
                }}
            />
            <style jsx global>{`
                .cursor-wrapper {
                    isolation: isolate;
                }
            `}</style>
        </>
    );
};

export default CustomCursor;