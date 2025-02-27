'use client';

import React, { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { VideoFormData } from '../../types';

interface VideoFormProps {
    formData: Partial<VideoFormData>;
    onFormChange: (data: Partial<VideoFormData>) => void;
}

export default function VideoForm({ formData, onFormChange }: VideoFormProps) {
    const { contentFile, duration } = formData;
    const contentInputRef = useRef<HTMLInputElement>(null);

    // Handle content file upload
    const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFormChange({ contentFile: e.target.files[0] });
        }
    };

    return (
        <>
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Video File <span className="text-red-500">*</span>
                </label>
                <input
                    type="file"
                    accept="video/*"
                    ref={contentInputRef}
                    onChange={handleContentUpload}
                    className="hidden"
                />
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => contentInputRef.current?.click()}
                        className="bg-black/40 hover:bg-black/60 border border-red-900/30 rounded-lg px-4 py-2 text-white flex items-center"
                    >
                        <Upload size={16} className="mr-2" />
                        {contentFile ? 'Change Video' : 'Upload Video'}
                    </button>
                    {contentFile && (
                        <span className="text-green-400 text-sm flex items-center">
                            <Check size={16} className="mr-1" />
                            {contentFile.name.length > 25 ?
                                contentFile.name.substring(0, 25) + '...' :
                                contentFile.name
                            }
                        </span>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Duration (seconds) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => onFormChange({ duration: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter video duration in seconds"
                    min="1"
                    required
                />
            </div>
        </>
    );
}