import { z } from 'zod';

import { Gender } from '../enums';

export const FieldData = z.object({
  gender: z.nativeEnum(Gender),
  startAt: z.date(),
  lockAt: z.date(),
});
export type FieldData = z.infer<typeof FieldData>;
