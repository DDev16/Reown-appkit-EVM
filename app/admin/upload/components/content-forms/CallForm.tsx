'use client';

import React from 'react';
import { CallFormData } from '../../types';

interface CallFormProps {
    formData: Partial<CallFormData>;
    onFormChange: (data: Partial<CallFormData>) => void;
}

export default function CallForm({ formData, onFormChange }: CallFormProps) {
    const { callHost, callDate, callTime, callDuration, callUrl } = formData;

    return (
        <>
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Host <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={callHost}
                    onChange={(e) => onFormChange({ callHost: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter call host name"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={callDate}
                        onChange={(e) => onFormChange({ callDate: e.target.value })}
                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        value={callTime}
                        onChange={(e) => onFormChange({ callTime: e.target.value })}
                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={callDuration}
                    onChange={(e) => onFormChange({ callDuration: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter call duration in minutes"
                    min="1"
                    required
                />
            </div>

            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Zoom URL <span className="text-red-500">*</span>
                </label>
                <input
                    type="url"
                    value={callUrl}
                    onChange={(e) => onFormChange({ callUrl: e.target.value })}
                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter Zoom meeting URL"
                    required
                />
            </div>
        </>
    );
}