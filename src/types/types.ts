import { z } from "astro/zod";

export const CatSchema = z.object({
    name: z.string(),
    birthDate: z.string(),
    passingDate: z.string().nullable(),
    iconUrl: z.string(),
    nicknames: z.array(z.string()),
});

export const ImageSchema = z.object({
    cats: z.array(CatSchema),
    width: z.number(),
    height: z.number(),
    id: z.string(),
    url: z.string(),
    takenAt: z.string().nullable(),
    blurData: z.string(),
    _createdAt: z.string(),
});

export type Cat = z.infer<typeof CatSchema>;
export type ImageWithDimensions = z.infer<typeof ImageSchema>;
