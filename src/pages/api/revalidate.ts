export const prerender = false;

import type { APIRoute } from "astro";
import {
    assertValidSignature,
    isSignatureError,
    SIGNATURE_HEADER_NAME,
} from "@sanity/webhook";

// Manually call assertValidSignature as validateSignature is stubbed out in Cloudflare Workers environment
async function safeIsValidSignature(
    payload: string,
    signature: string,
    secret: string
) {
    try {
        await assertValidSignature(payload, signature, secret);
        return true;
    } catch (err) {
        if (isSignatureError(err)) return false;
        throw err;
    }
}

export const POST: APIRoute = async ({ request }) => {
    const secret = import.meta.env.WEBHOOK_SECRET;
    const githubToken = import.meta.env.GITHUB_TOKEN;
    const signature = request.headers.get(SIGNATURE_HEADER_NAME) || "";
    const rawBody = await request.text();

    if (!secret || !githubToken) {
        console.error("Missing required environment variables for revalidation", {
            hasWebhookSecret: Boolean(secret),
            hasGithubToken: Boolean(githubToken),
        });
        return new Response("Missing required environment variables", {
            status: 500,
        });
    }

    const isValid = await safeIsValidSignature(rawBody, signature, secret);

    if (!isValid) {
        return new Response("Invalid signature", { status: 401 });
    }

    try {
        const response = await fetch(
            "https://api.github.com/repos/bremmdev/kattenparadijs-astro/dispatches",
            {
                method: "POST",
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${githubToken}`,
                    "Content-Type": "application/json",
                    "User-Agent": "kattenparadijs-astro-webhook",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
                body: JSON.stringify({ event_type: "cms-update" }),
            }
        );
        const responseText = await response.text();

        if (!response.ok) {
            console.error("GitHub dispatch failed", {
                status: response.status,
                statusText: response.statusText,
                body: responseText,
            });
            return new Response("GitHub dispatch failed", { status: 502 });
        }
    } catch (error) {
        console.error('Error dispatching GitHub event:', error);
        return new Response("Error dispatching GitHub event", { status: 500 });
    }

    return new Response("OK", { status: 200 });
};