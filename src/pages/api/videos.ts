export const prerender = false;

import { sanityClient } from "../../sanity";
import { videoGroqQuery } from "../../utils/query";

export async function GET({ url }: { url: URL }) {
    const page = url.searchParams.get("page") ?? "0";
    const videosData = await sanityClient.fetch(videoGroqQuery({ page: parseInt(page) }));

    return new Response(JSON.stringify(videosData.videos), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}