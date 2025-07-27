import {createPartFromUri, createUserContent, GoogleGenAI} from "@google/genai";
import path from "path";
import fs from "fs/promises";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export default async function analyzeImageWithGemini(filePath: string) {
    const myfile = await ai.files.upload({
        file: filePath,
        config: { mimeType: "image/jpeg" },
    });

    const jsonDirectory = path.join(process.cwd(), 'public');
    const fPath = path.join(jsonDirectory, 'cleaned_data.json');

    const fileContents = await fs.readFile(fPath, 'utf8');
    const data = JSON.parse(fileContents);
    console.log(data);

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent([
            createPartFromUri(myfile.uri || "", myfile.mimeType || ""),
            "\n\n",
            "Describe whether or not parts of the car are damaged. Rate each part as \"As new\", A, B, and C. Use the provided JSON of car parts below. Return the exact same JSON with the field name \"grade\" corresponding to the part rating. If the part is not in the image, or the part is not clear, set the grade as null.\n" +
            "\n" +
            "Part JSON:" +
            data
        ]),
    });
    console.log(result.text);

    return result.text;
}