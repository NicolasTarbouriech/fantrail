import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';

@Module({ imports: [GraphQLSchemaBuilderModule] })
class SchemaGeneratorModule {}

const HEADER =
  '# ------------------------------------------------------\n' +
  '# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n' +
  '# ------------------------------------------------------\n\n';

export async function generateSchema({
  resolverList,
  scalarList = [],
  destinationFile,
}: {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  resolverList: Function[];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  scalarList?: Function[];
  destinationFile: string;
}): Promise<void> {
  const app = await NestFactory.create(SchemaGeneratorModule, {
    logger: false,
  });
  await app.init();
  const schema = await app
    .get(GraphQLSchemaFactory)
    .create(resolverList, scalarList);
  writeFileSync(destinationFile, HEADER + printSchema(schema) + '\n');
  await app.close();
}
