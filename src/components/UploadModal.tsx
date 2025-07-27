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
        <div className="z-50 fixed inset-0 flex justify-center items-center">
            <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-xl">
                <button
                    className="top-2 right-2 absolute text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                <h1 className="mb-4 font-bold text-black text-xl">Upload & Analyze Image</h1>

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
                        className="bg-blue-600 mt-4 px-4 py-2 rounded text-white"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>

                {preview && (
                    <div className="relative shadow mt-6 rounded w-full aspect-video overflow-hidden">
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
