'use client';

import React from 'react';
import { Video, BookOpen, FileText, Trophy, Users } from 'lucide-react';
import { ContentType, ContentTypeOption } from '../types';

// Content type configuration
export const contentTypes: ContentTypeOption[] = [
    { id: 'videos', label: 'Videos', icon: <Video size={20} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'blogs', label: 'Blogs', icon: <FileText size={20} /> },
    { id: 'tests', label: 'Knowledge Tests', icon: <Trophy size={20} /> },
    { id: 'calls', label: 'Zoom Calls', icon: <Users size={20} /> }
];

interface ContentTypeSelectorProps {
    contentType: ContentType;
    setContentType: (type: ContentType) => void;
}

export default function ContentTypeSelector({
    contentType,
    setContentType
}: ContentTypeSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {contentTypes.map((type) => (
                <button
                    key={type.id}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${contentType === type.id ?
                            'bg-red-600 text-white' :
                            'bg-black/40 text-white/80 hover:bg-black/60'}`}
                    onClick={() => setContentType(type.id)}
                >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                </button>
            ))}
        </div>
    );
}