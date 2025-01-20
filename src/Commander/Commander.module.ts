import { Module } from '@nestjs/common';
import { TestCommand } from './Test.command';

@Module({
  imports: [],
  providers: [TestCommand],
})
export class CommanderModule {}
