import type { z } from 'zod';
import type { showSchema } from '../showSchema';

export type Show = z.output<typeof showSchema>;

export type Genre = Show['genres'][number];
