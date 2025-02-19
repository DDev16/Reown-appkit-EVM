"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Contributor {
    name: string;
    role: string;
    bio: string;
    image: string;
}
const contributors: Contributor[] = [
    {
        name: "Flare Network",
        role: "Infrastructure Partner",
        bio: "Providing Layer 1 blockchain infrastructure and technical support for cross-chain capabilities.",
        image: "/network-logos/flare.jpg"
    },
    {
        name: "LayerZero",
        role: "Cross-Chain Solutions",
        bio: "Enabling secure and efficient cross-chain messaging and interoperability features.",
        image: "/network-logos/flare.jpg"
    },
    {
        name: "Chainlink",
        role: "Oracle Provider",
        bio: "Supplying reliable price feeds and decentralized oracle services for the protocol.",
        image: "/network-logos/flare.jpg"
    }
];

const createParticles = (scene: THREE.Scene) => {
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.05,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
};

const ContributorCard: React.FC<{ contributor: Contributor; index: number }> = ({ contributor, index }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const cardRef = useRef<THREE.Group>();
    const particlesRef = useRef<THREE.Points>();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Enhanced Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xff3333, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(0xff0000, 1, 10);
        pointLight1.position.set(-2, 2, 2);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0000ff, 1, 10);
        pointLight2.position.set(2, -2, 2);
        scene.add(pointLight2);

        // Create card group
        const cardGroup = new THREE.Group();
        cardRef.current = cardGroup;
        scene.add(cardGroup);

        // Create enhanced card geometry with beveled edges
        const cardGeometry = new THREE.BoxGeometry(3, 4, 0.1, 32, 32, 32);
        const cardMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.7,
            roughness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2,
            reflectivity: 1
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        cardGroup.add(card);

        // Add glowing edges
        const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        card.add(edges);

        // Enhanced reflection plane with ripple effect
        const planeGeometry = new THREE.PlaneGeometry(6, 8, 32, 32);
        const planeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -4;
        plane.rotation.x = -Math.PI / 3;
        cardGroup.add(plane);

        // Add particles
        const particles = createParticles(scene);
        particlesRef.current = particles;
        scene.add(particles);

        // Position card based on index
        cardGroup.position.x = (index - 1) * 4;

        let time = 0;
        // Enhanced animation loop
        const animate = () => {
            if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !cardRef.current || !particlesRef.current) return;

            time += 0.01;

            // Particle animation
            particlesRef.current.rotation.y = time * 0.1;
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;

            // Enhanced hover animation
            if (isHovered) {
                cardRef.current.rotation.y = THREE.MathUtils.lerp(
                    cardRef.current.rotation.y,
                    0.3,
                    0.05
                );
                cardRef.current.position.y = THREE.MathUtils.lerp(
                    cardRef.current.position.y,
                    0.3,
                    0.05
                );
                cardRef.current.scale.setScalar(
                    THREE.MathUtils.lerp(cardRef.current.scale.x, 1.1, 0.05)
                );
            } else {
                cardRef.current.rotation.y = THREE.MathUtils.lerp(
                    cardRef.current.rotation.y,
                    0,
                    0.05
                );
                cardRef.current.position.y = THREE.MathUtils.lerp(
                    cardRef.current.position.y,
                    0,
                    0.05
                );
                cardRef.current.scale.setScalar(
                    THREE.MathUtils.lerp(cardRef.current.scale.x, 1.0, 0.05)
                );
            }

            // Subtle floating animation
            cardRef.current.position.y += Math.sin(time) * 0.002;

            pointLight1.position.x = Math.sin(time) * 3;
            pointLight1.position.y = Math.cos(time) * 3;
            pointLight2.position.x = -Math.sin(time * 0.5) * 3;
            pointLight2.position.y = -Math.cos(time * 0.5) * 3;

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [index]);

    return (
        <div
            ref={mountRef}
            className="relative w-full aspect-square cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Enhanced overlay content with blur effect */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none backdrop-blur-sm bg-black/10">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-red-500 shadow-lg shadow-red-500/50">
                    <img
                        src={contributor.image}
                        alt={contributor.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                    {contributor.name}
                </h3>
                <p className="text-red-500 font-medium mb-4">
                    {contributor.role}
                </p>
                <p className="text-gray-300 text-center text-sm">
                    {contributor.bio}
                </p>
            </div>
        </div>
    );
};

const Contributors: React.FC = () => {
    return (
        <div className="min-h-screen text-white py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold text-center mb-4">
                    Our Contributors
                </h1>
                <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-16">
                    Meet the amazing team behind our success. Each member brings unique skills and passion to our projects.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contributors.map((contributor, index) => (
                        <ContributorCard
                            key={contributor.name}
                            contributor={contributor}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contributors;