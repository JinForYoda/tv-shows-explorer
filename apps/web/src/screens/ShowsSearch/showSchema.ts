import { z } from 'zod';
import { toShow } from './toShow';

export const tvmazeShowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  genres: z.array(z.string()),
  premiered: z.string().nullable(),
  rating: z.object({ average: z.number().nullable() }),
  image: z.object({ medium: z.string() }).nullable(),
  summary: z.string().nullable(),
});

export const showSchema = tvmazeShowSchema.transform(toShow);

export const searchShowsResponseSchema = z.array(
  z.object({ show: showSchema }),
);

export type TvmazeShow = z.infer<typeof tvmazeShowSchema>;
