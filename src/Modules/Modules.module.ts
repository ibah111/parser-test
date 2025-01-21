import { Module } from '@nestjs/common';
import SqliteDatabase from './Database/Database.module';

@Module({
  imports: [SqliteDatabase],
})
export default class ModuleModules {}
