'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadImageAction } from "@/actions/uploadActions";

type UploadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setAnalysis: (result: string | null) => void;
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
        setUploading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                <h1 className="text-xl font-bold mb-4 text-black">Upload & Analyze Image</h1>

                <form onSubmit={handleUpload} className="text-black">
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                    />
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>

                {preview && (
                    <div className="mt-6 relative w-full aspect-video rounded overflow-hidden shadow">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
