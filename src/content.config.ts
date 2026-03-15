import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { sanityClient } from './sanity';
import { imageGroqQuery } from './utils/query';

const Cat = z.object({
    name: z.string(),
    birthDate: z.string(),
    passingDate: z.string().nullable(),
    iconUrl: z.string(),
    nicknames: z.array(z.string()),
});

const Image = z.object({
    cats: z.array(Cat),
    width: z.number(),
    height: z.number(),
    id: z.string(),
    url: z.string(),
    takenAt: z.string().nullable(),
    blurData: z.string(),
});

const images = defineCollection({
    loader: async () => {
        const data = await sanityClient.fetch(imageGroqQuery({ page: 0 }));
        return data.images;
    },
    schema: Image,
});

// Expose your defined collection to Astro
export const collections = { images };






