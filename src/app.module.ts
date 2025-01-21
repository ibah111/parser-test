import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import ModuleModules from './Modules/Modules.module';
import { PagesModule } from './Pages/Pages.module';
import { CommanderModule } from './Commander/Commander.module';

@Module({
  imports: [
    PagesModule,
    ModuleModules,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommanderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
