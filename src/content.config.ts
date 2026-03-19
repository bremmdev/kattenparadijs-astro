import { defineCollection } from 'astro:content';
import { sanityClient } from './sanity';
import { imageGroqQuery } from './utils/query';
import { ImageSchema } from './types/types';

const images = defineCollection({
    loader: async () => {
        const data = await sanityClient.fetch(imageGroqQuery({ page: 0 }));
        return data.images
    },
    schema: ImageSchema,
});

// Expose your defined collection to Astro
export const collections = { images };






