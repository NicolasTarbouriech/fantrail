import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { datasourceOptions } from '@trail/shared/database/data-access-main';

@Module({
  imports: [TypeOrmModule.forRoot(datasourceOptions)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
