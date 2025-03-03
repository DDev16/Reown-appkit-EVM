'use client';

import React from 'react';
import { Check, AlertCircle, Pause, Play, XCircle } from 'lucide-react';
import { UploadStatus as UploadStatusType } from '../types';

interface UploadStatusProps {
    uploadStatus: UploadStatusType;
    onPause?: () => void;
    onResume?: () => void;
    onCancel?: () => void;
}

export default function UploadStatus({
    uploadStatus,
    onPause,
    onResume,
    onCancel
}: UploadStatusProps) {
    const {
        error,
        success,
        isUploading,
        progress,
        transferredMB,
        totalMB,
        state,
        pauseUpload,
        resumeUpload,
        cancelUpload
    } = uploadStatus;

    if (!error && !success && !isUploading) {
        return null;
    }

    // Format large numbers nicely
    const formatFileSize = (mb?: number) => {
        if (mb === undefined) return '0 MB';
        return mb >= 1000 ? `${(mb / 1000).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
    };

    // Calculate estimated time remaining based on progress and file size
    const getEstimatedTimeRemaining = () => {
        if (!transferredMB || !totalMB || progress <= 0 || progress >= 100) return null;

        // Rough calculation based on progress so far
        const elapsedSeconds = window.performance ? window.performance.now() / 1000 : 0;
        if (elapsedSeconds <= 0) return null;

        // Estimate time based on current transfer rate
        const transferRate = transferredMB / elapsedSeconds; // MB per second
        if (transferRate <= 0) return null;

        const remainingMB = totalMB - transferredMB;
        const remainingSeconds = remainingMB / transferRate;

        // Format the time nicely
        if (remainingSeconds < 60) {
            return `${Math.round(remainingSeconds)}s`;
        } else if (remainingSeconds < 3600) {
            return `${Math.round(remainingSeconds / 60)}m ${Math.round(remainingSeconds % 60)}s`;
        } else {
            return `${Math.floor(remainingSeconds / 3600)}h ${Math.round((remainingSeconds % 3600) / 60)}m`;
        }
    };

    // Handle pause/resume/cancel actions
    const handlePause = () => {
        if (onPause) {
            onPause();
        } else if (pauseUpload) {
            pauseUpload();
        }
    };

    const handleResume = () => {
        if (onResume) {
            onResume();
        } else if (resumeUpload) {
            resumeUpload();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (cancelUpload) {
            cancelUpload();
        }
    };

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
                        <p className="text-blue-400">
                            Uploading{state === 'paused' ? ' (Paused)' : '...'}
                        </p>
                        <p className="text-blue-400">{Math.round(progress)}%</p>
                    </div>

                    <div className="w-full bg-blue-900/40 rounded-full h-2 mb-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Show file size and time estimates */}
                    <div className="flex justify-between text-blue-400 text-sm mb-2">
                        {transferredMB !== undefined && totalMB !== undefined && (
                            <p>
                                {formatFileSize(transferredMB)} of {formatFileSize(totalMB)}
                            </p>
                        )}

                        {getEstimatedTimeRemaining() && state === 'running' && (
                            <p className="text-blue-300">
                                ~{getEstimatedTimeRemaining()} remaining
                            </p>
                        )}
                    </div>

                    {/* Controls for pause/resume/cancel */}
                    <div className="flex space-x-2 mt-2">
                        {state !== 'paused' && (pauseUpload || onPause) && (
                            <button
                                onClick={handlePause}
                                className="flex items-center text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded"
                            >
                                <Pause size={14} className="mr-1" /> Pause
                            </button>
                        )}

                        {state === 'paused' && (resumeUpload || onResume) && (
                            <button
                                onClick={handleResume}
                                className="flex items-center text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded"
                            >
                                <Play size={14} className="mr-1" /> Resume
                            </button>
                        )}

                        {(cancelUpload || onCancel) && (
                            <button
                                onClick={handleCancel}
                                className="flex items-center text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded"
                            >
                                <XCircle size={14} className="mr-1" /> Cancel
                            </button>
                        )}
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