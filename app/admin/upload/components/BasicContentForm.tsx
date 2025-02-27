'use client';

import React, { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { BaseContentFormData, ContentType } from '../types';
import { contentTypes } from './ContentTypeSelector';

interface BasicContentFormProps {
    contentType: ContentType;
    formData: BaseContentFormData;
    onFormChange: (data: Partial<BaseContentFormData>) => void;
}

export default function BasicContentForm({
    contentType,
    formData,
    onFormChange
}: BasicContentFormProps) {
    const { title, description, thumbnailFile } = formData;
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Handle thumbnail upload
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFormChange({ thumbnailFile: e.target.files[0] });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onFormChange({ title: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder={`Enter ${contentType.slice(0, -1)} title`}
                    required
                />
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => onFormChange({ description: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder={`Enter ${contentTypes.find(t => t.id === contentType)?.label.toLowerCase() || 'content'} description`}
                    rows={3}
                    required
                />
            </div>

            {/* Thumbnail upload */}
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Thumbnail Image <span className="text-red-500">*</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailUpload}
                    className="hidden"
                />
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="bg-black/40 hover:bg-black/60 border border-red-900/30 rounded-lg px-4 py-2 text-white flex items-center"
                    >
                        <Upload size={16} className="mr-2" />
                        {thumbnailFile ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    </button>
                    {thumbnailFile && (
                        <span className="text-green-400 text-sm flex items-center">
                            <Check size={16} className="mr-1" />
                            {thumbnailFile.name.length > 25 ?
                                thumbnailFile.name.substring(0, 25) + '...' :
                                thumbnailFile.name
                            }
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}