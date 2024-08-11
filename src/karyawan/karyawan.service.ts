import { Injectable, NotFoundException } from '@nestjs/common';
import { KaryawanRepository } from './karyawan-repository/karyawan-repository';
import { Karyawan } from '@prisma/client';
import { CreateKaryawanDTO } from './dto/create.dto';
import { UpdateKaryawanDTO } from './dto/update.dto';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import * as path from 'path';

@Injectable()
export class KaryawanService {
    constructor(private karyawanRepository: KaryawanRepository){}

    async findAll(search?: string): Promise<Karyawan[]> {
        return this.karyawanRepository.findAll(search);
    }

    async findById(id: string): Promise<Karyawan> {
        const karyawan = await this.karyawanRepository.findById(id);
        if (!karyawan) {
            throw new NotFoundException(`Karyawan dengan ID ${id} tidak ditemukan`);
        }
        return karyawan;
    }

    async getKaryawanStatistik() {
        return this.karyawanRepository.findStatistik();
    }

    async exportToCsv(): Promise<string> {
        const fileName = `karyawan_export_${Date.now()}.csv`;
        const filePath = path.join(process.cwd(), 'upload', 'csv', fileName);
        await this.karyawanRepository.exportToCsv(filePath);
        return fileName;
    }

    async importFromCsv(file: Express.Multer.File): Promise<number> {
        const filePath = path.join(process.cwd(), 'upload', 'csv', file.filename);
        return this.karyawanRepository.importFromCsv(filePath);
    }

    async generatePDF(): Promise<PassThrough> {
    const karyawans = await this.karyawanRepository.findAll();
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const passThroughStream = new PassThrough();

    doc.pipe(passThroughStream);

    doc.fontSize(18).text('Daftar Karyawan', { align: 'center' });
    doc.moveDown();

    const headers = [
      "Nama", "Nomor", "Jabatan", "Departemen", "Tanggal Masuk", "Status"
    ];

    const rows = karyawans.map(k => [
      k.nama,
      k.nomor,
      k.jabatan,
      k.departemen,
      new Date(k.tanggal_masuk).toLocaleDateString(),
      k.status
    ]);

    const startX = 50;
    const startY = 150;
    const rowHeight = 30;
    const colWidth = (doc.page.width - 100) / headers.length;

    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, startX + i * colWidth, startY, { width: colWidth, align: 'center' });
    });

    doc.font('Helvetica').fontSize(8);
    rows.forEach((row, rowIndex) => {
      const y = startY + (rowIndex + 1) * rowHeight;
      
      row.forEach((cell, colIndex) => {
        doc.text(cell, startX + colIndex * colWidth, y + 5, { width: colWidth, align: 'center' });
      });
    });

    doc.end();

    return passThroughStream;
  }

    async createKaryawan(createKaryawanDTO: CreateKaryawanDTO): Promise<Karyawan> {
        return this.karyawanRepository.createKaryawan(createKaryawanDTO)
    }

    async updateKaryawan(id: string, updateKaryawanDTO: UpdateKaryawanDTO): Promise<Karyawan> {
        return this.karyawanRepository.updateKaryawan(updateKaryawanDTO, id);
    }

    async delete(id: string): Promise<Karyawan> {
        const karyawan = await this.karyawanRepository.findById(id);
        if (!karyawan) {
            throw new NotFoundException(`Karyawan dengan ID ${id} tidak ditemukan`);
        }
        return this.karyawanRepository.delete(id);
    }
}
