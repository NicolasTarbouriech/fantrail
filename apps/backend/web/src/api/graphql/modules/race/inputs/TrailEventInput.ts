import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TrailEventInput {
  @Field(() => String, { description: 'Unique regardless of case and accents' })
  name: string;

  @Field(() => String, {
    nullable: true,
    description:
      'Base64 data URL of a PNG, JPEG, WebP or SVG logo of 100 KB at most, null without logo',
  })
  logoDataUrl?: string | null;
}
