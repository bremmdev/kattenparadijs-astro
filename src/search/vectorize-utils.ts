import { env } from "cloudflare:workers";

type BedrockCohereEmbedResponse = {
    embeddings?: number[][] | {
        float?: number[][];
    };
};

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

function getFloatEmbedding(data: BedrockCohereEmbedResponse): number[] {
    const embeddings = data.embeddings;

    if (!embeddings) {
        throw new Error("Bedrock embedding response did not contain embeddings");
    }

    if (Array.isArray(embeddings)) {
        const [embedding] = embeddings;
        if (embedding) return embedding;

        throw new Error("Bedrock embedding response did not contain a float embedding");
    }

    const [embedding] = embeddings.float ?? [];
    if (embedding) return embedding;

    throw new Error("Bedrock embedding response did not contain a float embedding");
}


export async function vectorizeImage(imageUrl: string): Promise<number[]> {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

    const buffer = await imageRes.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64}`;

    const modelId = "eu.cohere.embed-v4:0"
    const body = JSON.stringify({
        input_type: "search_query",
        images: [dataUrl],
        embedding_types: ["float"],
        output_dimension: 1024,
        truncate: "NONE",
    });

    try {
        const res = await fetch(`${env.AWS_BEDROCK_RUNTIME_URL}/model/${encodeURIComponent(modelId)}/invoke`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.AWS_BEARER_TOKEN_BEDROCK}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: new TextEncoder().encode(body),
        });

        if (!res.ok) {
            throw new Error(`Image embedding error: ${res.status} ${await res.text()}`);
        }

        const data = await res.json() as BedrockCohereEmbedResponse;
        return getFloatEmbedding(data);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to vectorize image");
    }
}