'use client';

import React, { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { TestFormData, TestDifficulty } from '../../types';

interface TestFormProps {
    formData: Partial<TestFormData>;
    onFormChange: (data: Partial<TestFormData>) => void;
}

export default function TestForm({ formData, onFormChange }: TestFormProps) {
    const { numQuestions, estimatedTime, testDifficulty, contentFile } = formData;
    const contentInputRef = useRef<HTMLInputElement>(null);

    // Test difficulty options
    const difficultyOptions = [
        { value: 'beginner', label: 'Beginner', color: 'bg-green-700 hover:bg-green-600' },
        { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-700 hover:bg-yellow-600' },
        { value: 'advanced', label: 'Advanced', color: 'bg-red-700 hover:bg-red-600' }
    ];

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
                    Difficulty Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {difficultyOptions.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            onClick={() => onFormChange({ testDifficulty: option.value as TestDifficulty })}
                            className={`py-2 px-3 rounded-lg text-sm transition-colors text-white
                                ${testDifficulty === option.value
                                    ? option.color
                                    : 'bg-black/40 hover:bg-black/60'}`}
                        >
                            {testDifficulty === option.value && (
                                <Check size={16} className="inline-block mr-1" />
                            )}
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => onFormChange({ numQuestions: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter number of questions"
                    min="1"
                    required
                />
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Estimated Time (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => onFormChange({ estimatedTime: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter estimated completion time in minutes"
                    min="1"
                    required
                />
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Test Content File (Optional)
                </label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.json"
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
                        {contentFile ? 'Change File' : 'Upload Test Document'}
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
                <p className="text-gray-400 text-xs mt-1">
                    Upload a document with test questions and answers (PDF, Word, or JSON format)
                </p>
            </div>
        </>
    );
}