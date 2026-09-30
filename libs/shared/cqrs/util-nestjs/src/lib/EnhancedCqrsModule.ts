import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EnhancedCommandBus } from './EnhancedCommandBus';
import { EnhancedQueryBus } from './EnhancedQueryBus';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [EnhancedQueryBus, EnhancedCommandBus],
  exports: [EnhancedQueryBus, EnhancedCommandBus],
})
export class EnhancedCqrsModule {}
