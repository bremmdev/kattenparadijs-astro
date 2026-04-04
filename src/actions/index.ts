import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { getSimilarImages } from '../search/similar-images';

export const server = {
    getSimilarCatPhotos: defineAction({
        input: z.object({
            url: z.string(),
            cat: z.string(),
        }),
        handler: async ({ url, cat }) => {
            try {
                return await getSimilarImages({ url, cat });
            } catch (error) {
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error instanceof Error ? error.message : "Failed to get similar cat photos",
                });
            }
        },
    })
}