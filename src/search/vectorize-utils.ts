import { env } from "cloudflare:workers";
import OpenAI from "openai";

// Use CF env in production, local env in development
const openai = new OpenAI({
    apiKey: env.AZURE_AI_KEY!,
    baseURL: env.AZURE_AI_ENDPOINT!,
});

// Workers doesn't support Buffer.from, so we need to convert the array buffer to a base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";

    for (let index = 0; index < bytes.length; index += chunkSize) {
        const chunk = bytes.subarray(index, index + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
}

export async function vectorizeImage(imageUrl: string): Promise<number[]> {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

    const buffer = await imageRes.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64}`;

    try {
        const embedding = await openai.embeddings.create({
            model: "embed-v-4-0",
            input: [dataUrl],
            dimensions: 1024,
        });

        return embedding.data[0].embedding;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to vectorize image");
    }
}