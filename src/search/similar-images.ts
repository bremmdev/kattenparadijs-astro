const INDEX_NAME = "cat-photos";
import { vectorizeImage } from "../search/vectorize-utils";
import { env } from "cloudflare:workers";
import { type SimilarCatPhoto } from "../types/types";

export async function getSimilarImages({ url, cat }: { url: string, cat: string }) {
    const vector = await vectorizeImage(url);

    try {
        // Use CF env in production, local env in development
        const AZURE_SEARCH_ENDPOINT = env.AZURE_SEARCH_ENDPOINT ?? import.meta.env.AZURE_SEARCH_ENDPOINT;
        const AZURE_SEARCH_ADMIN_KEY = env.AZURE_SEARCH_ADMIN_KEY ?? import.meta.env.AZURE_SEARCH_ADMIN_KEY;

        const res = await fetch(
            `${AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/search?api-version=2025-09-01`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": AZURE_SEARCH_ADMIN_KEY!,
                },
                body: JSON.stringify({
                    filter: `catName eq '${cat}'`,
                    vectorQueries: [
                        {
                            kind: "vector",
                            vector: vector,
                            k: 4,
                            fields: "imageVector",
                        },
                    ],
                }),
            }
        );
        const data = await res.json() as { value: SimilarCatPhoto[] };
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get similar images from Search Index");
    }
}