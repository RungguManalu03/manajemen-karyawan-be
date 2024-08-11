import { Module } from '@nestjs/common';
import { KaryawanController } from './karyawan.controller';
import { KaryawanService } from './karyawan.service';
import { KaryawanRepository } from './karyawan-repository/karyawan-repository';

@Module({
  controllers: [KaryawanController],
  providers: [KaryawanService, KaryawanRepository]
})
export class KaryawanModule {}
