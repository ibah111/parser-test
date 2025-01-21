import { InjectConnection } from '@nestjs/sequelize';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { OnModuleInit } from '@nestjs/common';
import createUmzug from 'src/Modules/umzug';

export class SqliteSeed implements OnModuleInit {
  constructor(
    @InjectConnection('sqlite') private readonly sequelize: Sequelize,
  ) {}
  async onModuleInit() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'migrations'),
      'MigrationMeta',
    );
    try {
      await this.sequelize.authenticate();
      await umzug.up();
      await this.seed();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async seed() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'seeds'),
      'SeedMeta',
    );
    await umzug.up();
  }
}
