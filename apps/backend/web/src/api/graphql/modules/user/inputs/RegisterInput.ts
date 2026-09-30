import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field(() => String)
  email: string;

  @Field(() => String, {
    description: '3 to 20 characters, unique regardless of case and accents',
  })
  pseudo: string;

  @Field(() => String, {
    description:
      'At least 8 characters with a letter, a digit and a special character',
  })
  password: string;
}
