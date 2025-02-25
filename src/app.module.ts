import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KaryawanModule } from './karyawan/karyawan.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [KaryawanModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
