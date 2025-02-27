'use client';

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { UploadStatus as UploadStatusType } from '../types';

interface UploadStatusProps {
    uploadStatus: UploadStatusType;
}

export default function UploadStatus({ uploadStatus }: UploadStatusProps) {
    const { error, success, isUploading, progress } = uploadStatus;

    if (!error && !success && !isUploading) {
        return null;
    }

    return (
        <div className={`p-4 rounded-lg ${error ? 'bg-red-900/20 border border-red-500' :
            success ? 'bg-green-900/20 border border-green-500' :
                'bg-blue-900/20 border border-blue-500'
            }`}>
            {error && (
                <div className="flex items-start">
                    <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
                    <div>
                        <p className="text-red-500 font-medium">Upload Failed</p>
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {isUploading && (
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-blue-400">Uploading...</p>
                        <p className="text-blue-400">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-full bg-blue-900/40 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {success && (
                <div className="flex items-start">
                    <Check size={20} className="text-green-500 mr-2 mt-0.5" />
                    <div>
                        <p className="text-green-500 font-medium">Upload Successful</p>
                        <p className="text-green-400 text-sm">
                            Content has been uploaded and is now available to the selected tiers.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}