'use client';

import { useState } from 'react';
import Image from 'next/image';
import {uploadImageAction} from "@/actions/uploadActions";

export default function UploadPage() {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setUploadedUrl(null);
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
        setUploadedUrl(url.fileName);
        setUploading(false);
    };

    const handleAnalyze = async () => {
        if (!uploadedUrl) return;

        const filename = uploadedUrl.split('/').pop();
        const res = await fetch('/upload/analyze', {
            method: 'POST',
            body: JSON.stringify({ filename }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        setAnalysis(data.result);
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">Upload & Analyze Image</h1>

            <form onSubmit={handleUpload}>
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
                    <Image src={preview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
            )}

            {uploadedUrl && (
                <div className="mt-6">
                    <p className="text-sm text-gray-700">Image uploaded to: <a href={uploadedUrl} className="text-blue-600 underline">{uploadedUrl}</a></p>
                    <button
                        onClick={handleAnalyze}
                        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
                    >
                        Analyze with Gemini
                    </button>
                </div>
            )}

            {analysis && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <strong>Gemini Analysis:</strong>
                    <p className="mt-1 whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
    );
}
