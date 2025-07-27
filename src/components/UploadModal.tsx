'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadImageAction } from "@/actions/uploadActions";

interface Part {
  name: string;
  image: string;
  parts: Part[];
  grade?: string | null;
}

type UploadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setAnalysis: (result: Part[] | null) => void;
};

export default function UploadModal({ isOpen, onClose, setAnalysis }: UploadModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setAnalysis(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        const url = await uploadImageAction(formData);
        const cleanedJson = (url.result || "")
            .replace(/^```json\s*/i, '')  // remove starting ```json
            .replace(/```$/, '')          // remove ending ```
            .trim();
        const partsData = JSON.parse(cleanedJson);
        setAnalysis(partsData);
        console.log(partsData)
        setUploading(false);
        
        // Auto-close modal after successful analysis
        onClose();
    };

    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="relative bg-white shadow-2xl p-8 border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                <button
                    className="top-4 right-4 absolute flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                <div className="mb-6">
                    <h1 className="mb-2 font-bold text-gray-900 text-2xl">Upload & Analyze Vehicle Image</h1>
                    <p className="text-gray-600">Upload a photo of your vehicle to get an AI-powered parts assessment</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-3">
                        <label className="block font-medium text-gray-700 text-sm">
                            Select Vehicle Image
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                className="block hover:file:bg-blue-100 file:bg-blue-50 file:mr-4 file:px-4 file:py-2 border-gray-300 file:border-0 focus:border-blue-500 rounded-lg file:rounded-lg focus:ring-blue-500 w-full file:font-medium file:text-blue-700 text-sm file:text-sm transition-colors"
                            />
                        </div>
                        <p className="text-gray-500 text-xs">Supported formats: JPG, PNG, WebP (Max 10MB)</p>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                            uploading || !file
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                        {uploading ? (
                            <div className="flex justify-center items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing Image...
                            </div>
                        ) : (
                            <div className="flex justify-center items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                {file ? 'Analyze Vehicle Parts' : 'Select an Image First'}
                            </div>
                        )}
                    </button>
                </form>

                {preview && (
                    <div className="space-y-3 mt-6">
                        <label className="block font-medium text-gray-700 text-sm">Preview</label>
                        <div className="relative bg-gray-50 shadow-lg border border-gray-200 rounded-xl w-full aspect-video overflow-hidden">
                            <Image
                                src={preview}
                                alt="Vehicle preview"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600 text-sm">Ready for analysis</p>
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Image loaded successfully
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
