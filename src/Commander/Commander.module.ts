import { Module } from '@nestjs/common';
import { TestCommand } from './Test.command';
import { VprokCommand } from './Vprok.command';
import { SequelizeModule } from '@nestjs/sequelize';
import KatalogCommand from './Katalog.command';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SequelizeModule.forFeature([], 'sqlite'), HttpModule],
  providers: [TestCommand, VprokCommand, KatalogCommand],
})
export class CommanderModule {}
