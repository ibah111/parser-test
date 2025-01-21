import { Module } from '@nestjs/common';
import { TestCommand } from './Test.command';
import { VprokCommand } from './Vprok.command';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([], 'sqlite')],
  providers: [TestCommand, VprokCommand],
})
export class CommanderModule {}
