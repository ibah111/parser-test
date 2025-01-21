import { Module } from '@nestjs/common';
import { SequelizeOptions } from 'sequelize-typescript';
import { models } from './models';
import { SqliteSeed } from './Sqlite.seed';
import { SequelizeModule } from '@nestjs/sequelize';

export const SqliteConfig: SequelizeOptions = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
  models,
};

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      name: 'sqlite',
      useFactory: () => SqliteConfig,
    }),
  ],
  providers: [SqliteSeed],
})
export class SqliteModule {}
