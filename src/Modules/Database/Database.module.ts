import { Module } from '@nestjs/common';
import { SqliteModule } from './Sqlite_database/SqliteModule';

@Module({
  imports: [SqliteModule],
})
export default class SqliteDatabase {}
