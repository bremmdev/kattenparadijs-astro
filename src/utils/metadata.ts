import type { CatName } from "../types/types";

const ogImages: Record<CatName | "all", string> = {
    all: "https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png",
    norris: "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2F92e0eeeeea41b32476afc39d5da4d4362617b51e-1200x1600.jpg&w=640&q=75",
    moos: "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2Fb28bb4b619123c5d657fb5e01204b6ac1cb8efd4-1536x2048.jpg&w=828&q=75",
    daantje: "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2F28fa09b34211bda594d0c8d51a18e6282ebe23cb-1200x1600.jpg&w=640&q=75",
    flynn: "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2F5b9fc1c4970fa7ce993d1f9b1352e30ce4c2eae1-1536x2048.jpg&w=828&q=75",
};

function capitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1);
}

export function getDetailMeta(cat: CatName | "all") {
    const label = capitalize(cat);
    return {
        title: `Kattenparadijs | ${label}`,
        description: `Bekijk alle foto's van ${cat === "all" ? "onze katten" : label}`,
        og: {
            title: `Kattenparadijs | ${label}`,
            url: `https://kattenparadijs-astro.bremmdev.me/${cat}`,
            description: `Bekijk alle foto's van ${cat === "all" ? "onze katten" : label}`,
            image: ogImages[cat],
            imageWidth: 1920,
            imageHeight: 1080,
            imageAlt: `Kattenparadijs - ${label}`,
        },
    };
}

export const metadata = {
    "index": {
        title: "Kattenparadijs",
        description: "Foto's van al onze katten",
        og: {
            title: "Kattenparadijs",
            url: "https://kattenparadijs-astro.bremmdev.me",
            description: "Foto's van al onze katten",
            image: "https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png",
            imageWidth: 1920,
            imageHeight: 1080,
            imageAlt: "Kattenparadijs",
        },
    },
    "videos": {
        title: "Kattenparadijs | Videos",
        description: "Bekijk alle video's van onze katten",
        og: {
            title: "Kattenparadijs | Videos",
            url: "https://kattenparadijs-astro.bremmdev.me/videos",
            description: "Bekijk alle video's van onze katten",
            image: "https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png",
            imageWidth: 1920,
            imageHeight: 1080,
            imageAlt: "Kattenparadijs",
        },
    }
}





