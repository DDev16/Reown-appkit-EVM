"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

let globalAudio: HTMLAudioElement | null = null;

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (!globalAudio) {
            globalAudio = new Audio('/music/FreeYourMind.mp3');
            globalAudio.loop = true;
            globalAudio.volume = 0.5;
        }

        const handleEnded = () => setIsPlaying(false);
        globalAudio.addEventListener('ended', handleEnded);

        return () => {
            globalAudio?.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!globalAudio) return;

        if (isPlaying) {
            globalAudio.pause();
        } else {
            globalAudio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!globalAudio) return;

        globalAudio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="flex items-center gap-2 px-2">
            <button
                onClick={togglePlay}
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-[#BC1A1E]/10 transition-colors"
                aria-label="Toggle music"
            >
                {isPlaying ? (
                    <Pause size={20} />
                ) : (
                    <Play size={20} />
                )}
            </button>
            <button
                onClick={toggleMute}
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-[#BC1A1E]/10 transition-colors"
                aria-label="Toggle mute"
            >
                {isMuted ? (
                    <VolumeX size={20} />
                ) : (
                    <Volume2 size={20} />
                )}
            </button>
        </div>
    );
};

export default MusicPlayer;