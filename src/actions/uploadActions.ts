// app/upload/actions.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import analyzeImageWithGemini from '@/lib/gemini';
import { revalidatePath } from 'next/cache';

export async function uploadImageAction(formData: FormData) {
    const file: File | null = formData.get('image') as File;

    if (!file) throw new Error('No file uploaded');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'userImages', fileName);

    await fs.writeFile(filePath, buffer);

    const result = await analyzeImageWithGemini(filePath);

    revalidatePath('/upload'); // Optional: revalidate page
    return { fileName, result };
}
