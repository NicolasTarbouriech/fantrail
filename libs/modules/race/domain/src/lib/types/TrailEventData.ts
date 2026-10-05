import { z } from 'zod';

export const TrailEventName = z.string().trim().min(2).max(60);

// Shape only: the accepted formats and the size are business rules, see TrailEventLogoAssertion.
export const TrailEventLogo = z.object({
  contentType: z.string().min(1).max(32),
  bytes: z.custom<Uint8Array>((value) => ArrayBuffer.isView(value), {
    message: 'Expected the logo bytes',
  }),
});
export type TrailEventLogo = z.infer<typeof TrailEventLogo>;

export const TrailEventData = z.object({
  name: TrailEventName,
  logo: TrailEventLogo.nullable(),
});
export type TrailEventData = z.infer<typeof TrailEventData>;
