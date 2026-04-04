import { env } from "cloudflare:workers";

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
        // Use CF env in production, local env in development
        const AZURE_AI_ENDPOINT = env.AZURE_AI_ENDPOINT ?? import.meta.env.AZURE_AI_ENDPOINT;
        const AZURE_AI_KEY = env.AZURE_AI_KEY ?? import.meta.env.AZURE_AI_KEY;

        const res = await fetch(
            `${AZURE_AI_ENDPOINT}/images/embeddings?api-version=2024-05-01-preview`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": AZURE_AI_KEY!,
                },
                body: JSON.stringify({
                    model: "embed-v-4-0",
                    input: [{ image: dataUrl }],
                    dimensions: 1024,
                }),
            }
        );

        if (!res.ok) {
            throw new Error("Image embedding error");
        }

        const data = await res.json() as { data: { embedding: number[] }[] };
        return data.data[0].embedding;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to vectorize image");
    }
}