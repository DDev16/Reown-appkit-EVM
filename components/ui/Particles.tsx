"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<THREE.Points | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 300;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Particles setup
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 10000;

        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i += 3) {
            // More dense and spread distribution
            posArray[i] = (Math.random() - 0.5) * 1500;     // x
            posArray[i + 1] = (Math.random() - 0.5) * 1500; // y
            posArray[i + 2] = (Math.random() - 0.5) * 1500; // z
        }

        particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(posArray, 3)
        );

        const particlesMaterial = new THREE.PointsMaterial({
            size: 1.5, // Increased particle size
            color: 0xFF4B51, // Vibrant red
            transparent: true,
            opacity: 0.7, // Increased opacity
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        particlesRef.current = particlesMesh;

        // Animate function
        const animate = () => {
            requestAnimationFrame(animate);

            if (particlesRef.current) {
                const positions = particlesRef.current.geometry.getAttribute('position');

                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    const z = positions.getZ(i);

                    // Subtle, slow drifting movement with more pronounced variation
                    positions.setX(i, x + Math.sin(i * 0.001 + Date.now() * 0.0001) * 0.3);
                    positions.setY(i, y + Math.cos(i * 0.001 + Date.now() * 0.0001) * 0.3);
                }

                positions.needsUpdate = true;

                // More noticeable rotation
                particlesRef.current.rotation.y += 0.0005;
                particlesRef.current.rotation.x += 0.0002;
            }

            renderer.render(scene, camera);
        };

        // Resize handler
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        // Add resize listener
        window.addEventListener('resize', onResize);

        // Start animation
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);

            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }

            particlesMesh.geometry.dispose();
            particlesMesh.material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        />
    );
};

export default ParticleBackground;