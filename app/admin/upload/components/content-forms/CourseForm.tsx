'use client';

import React from 'react';
import { CourseFormData } from '../../types';

interface CourseFormProps {
    formData: Partial<CourseFormData>;
    onFormChange: (data: Partial<CourseFormData>) => void;
}

export default function CourseForm({ formData, onFormChange }: CourseFormProps) {
    const { numLessons } = formData;

    return (
        <div>
            <label className="block text-white text-sm font-medium mb-2">
                Number of Lessons <span className="text-red-500">*</span>
            </label>
            <input
                type="number"
                value={numLessons}
                onChange={(e) => onFormChange({ numLessons: e.target.value })}
                className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                placeholder="Enter number of lessons"
                min="1"
                required
            />
        </div>
    );
}