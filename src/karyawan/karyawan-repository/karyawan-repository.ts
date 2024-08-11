import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma/prisma.service";
import { CreateKaryawanDTO } from "../dto/create.dto";
import { Karyawan, Prisma } from "@prisma/client";
import { UpdateKaryawanDTO } from "../dto/update.dto";
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { createObjectCsvWriter } from "csv-writer";
import { config } from "src/config/config";

@Injectable()
export class KaryawanRepository {
    constructor(private prismaService: PrismaService){}

    private getFullPhotoUrl(filename: string): string {
        return `${config.baseUrl}/upload/foto/${filename}`;
    }
    
    async findAll(search?: string): Promise<Karyawan[]> {
        const where: Prisma.KaryawanWhereInput = search
            ? {
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { nomor: { contains: search, mode: 'insensitive' } },
                    { jabatan: { contains: search, mode: 'insensitive' } },
                    { departemen: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        return this.prismaService.karyawan.findMany({ where });
    }

    async findById(id: string): Promise<Karyawan | null> {
        return this.prismaService.karyawan.findUnique({
            where: { id }
        });
    }

     async findStatistik() {
        const totalKaryawan = await this.prismaService.karyawan.count();

        const statusCount = await this.prismaService.karyawan.groupBy({
        by: ['status'],
        _count: {
            status: true,
        },
        });

        const departemenCount = await this.prismaService.karyawan.groupBy({
        by: ['departemen'],
        _count: {
            departemen: true,
        },
        });

        return {
            totalKaryawan,
            statusCount,
            departemenCount,
        };
    }

    async exportToCsv(filePath: string): Promise<number> {
        const karyawans = await this.prismaService.karyawan.findMany();
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                {id: 'nama', title: 'nama'},
                {id: 'nomor', title: 'nomor'},
                {id: 'jabatan', title: 'jabatan'},
                {id: 'departemen', title: 'departemen'},
                {id: 'tanggal_masuk', title: 'tanggal_masuk'},
                {id: 'foto', title: 'foto'},
                {id: 'status', title: 'status'}
            ]
        });
        
        await csvWriter.writeRecords(karyawans.map(k => ({
            ...k,
            foto: this.getFullPhotoUrl(k.foto),
            tanggal_masuk: k.tanggal_masuk.toISOString().split('T')[0]
        })));

        return karyawans.length;
    }
    
     async importFromCsv(filePath: string): Promise<number> {
        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        const importedCount = await this.prismaService.karyawan.createMany({
                            data: results.map(row => ({
                                nama: row.nama,
                                nomor: row.nomor,
                                jabatan: row.jabatan,
                                departemen: row.departmen,
                                tanggal_masuk: new Date(row.tanggal_masuk),
                                foto: row.foto,
                                status: row.status
                            })),
                            skipDuplicates: true
                        });
                        resolve(importedCount.count);
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }
    
    async createKaryawan(createKaryawanDTO: CreateKaryawanDTO): Promise<Karyawan> {
        const tanggalMasuk = new Date(createKaryawanDTO.tanggal_masuk);

        return this.prismaService.karyawan.create({
            data: {
                nama: createKaryawanDTO.nama,
                nomor: createKaryawanDTO.nomor,
                jabatan: createKaryawanDTO.jabatan,
                departemen: createKaryawanDTO.departemen,
                tanggal_masuk: tanggalMasuk,
                foto: createKaryawanDTO.foto,
                status: createKaryawanDTO.status,
            }
        })
    }

   async updateKaryawan(updateKaryawanDTO: UpdateKaryawanDTO, karyawanId: string): Promise<Karyawan> {
        const tanggalMasuk = new Date(updateKaryawanDTO.tanggal_masuk);

        const updateData: any = {
            nama: updateKaryawanDTO.nama,
            nomor: updateKaryawanDTO.nomor,
            jabatan: updateKaryawanDTO.jabatan,
            departemen: updateKaryawanDTO.departemen,
            tanggal_masuk: tanggalMasuk,
            status: updateKaryawanDTO.status,
        };

        if (updateKaryawanDTO.foto) {
            updateData.foto = updateKaryawanDTO.foto;
        }

        return this.prismaService.karyawan.update({
            where: {
                id: karyawanId
            },
            data: updateData
        });
    }

     async delete(id: string): Promise<Karyawan> {
        const karyawan = await this.prismaService.karyawan.delete({
            where: { id }
        });

        if (karyawan.foto) {
            const fotoPath = path.join(process.cwd(), 'upload', 'foto', karyawan.foto);
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
            }
        }

        return karyawan;
    }
}