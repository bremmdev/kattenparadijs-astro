export const prerender = false;

import { sanityClient } from "../../sanity";
import { imageGroqQuery } from "../../utils/query";

function getQueryFilter(cat?: string) {
    if (!cat) return undefined;
    if (cat === "all") {
        return `length(cat) > 1`;
    }
    return `"${cat}" in cat[]->name && length(cat) == 1`;
}

export async function GET({ url }: { url: URL }) {
    const page = url.searchParams.get("page") ?? "0";
    const cat = url.searchParams.get("cat") ?? undefined;
    const queryFilter = getQueryFilter(cat);
    const images = await sanityClient.fetch(imageGroqQuery({ page: parseInt(page), filter: queryFilter }));

    return new Response(JSON.stringify(images), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}