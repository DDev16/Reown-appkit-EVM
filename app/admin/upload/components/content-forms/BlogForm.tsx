'use client';

import React, { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { BlogFormData } from '../../types';

interface BlogFormProps {
    formData: Partial<BlogFormData>;
    onFormChange: (data: Partial<BlogFormData>) => void;
}

export default function BlogForm({ formData, onFormChange }: BlogFormProps) {
    const { author, readTime, contentFile } = formData;
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
                    Author <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => onFormChange({ author: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter blog author"
                    required
                />
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Read Time (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={readTime}
                    onChange={(e) => onFormChange({ readTime: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter estimated read time in minutes"
                    min="1"
                    required
                />
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Blog Content File (PDF/Doc)
                </label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
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
                        {contentFile ? 'Change File' : 'Upload File'}
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
        </>
    );
}