import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from 'src/common/filters/http-error/http-error.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success/success.interceptor';
import { KaryawanService } from './karyawan.service';
import { CreateKaryawanDTO } from './dto/create.dto';
import { Karyawan } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import { UpdateKaryawanDTO } from './dto/update.dto';
import { Response } from 'express'; 

@Controller('karyawan')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpErrorFilter)
export class KaryawanController {
    constructor(private readonly karyawanService: KaryawanService){}
    //find dan serach karyawan
    @Get('api/v1')
    async findAll(@Query('search') search?: string): Promise<Karyawan[]> {
        return this.karyawanService.findAll(search);
    }

    //find data karyawan by ID
    @Get('api/v1/:id')
    async findById(@Param('id') id: string): Promise<Karyawan> {
        return this.karyawanService.findById(id);
    }

    // find data statistik
    @Get('statistik/api/v1')
    async getKaryawanStatistik() {
        return this.karyawanService.getKaryawanStatistik();
    }

    //export data csv
    @Get('export/api/v1')
    async exportCsv(@Res() res: Response) {
        const fileName = await this.karyawanService.exportToCsv();
        const filePath = path.join(process.cwd(), 'upload', 'csv', fileName);
        res.download(filePath, fileName);
    }

    //import data csv
    @Post('import/api/v1')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload/csv',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async importCsv(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File CSV tidak ditemukan');
        }
        const importedCount = await this.karyawanService.importFromCsv(file);
        return { message: `${importedCount} data berhasil diimpor` };
    }

    //import data pdf
    @Get('generate-pdf/api/v1')
    async generatePDF(@Res() res: Response) {
        const stream = await this.karyawanService.generatePDF();

        res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=karyawan.pdf',
        });

        stream.pipe(res);
    }

    //create karyawan
    @Post('api/v1')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(
        FileInterceptor('foto', {
            storage: diskStorage({
                destination: './upload/foto',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = extname(file.originalname);
                    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
        })
    )
    async createKaryawan( @UploadedFile() file: Express.Multer.File, @Body() createKaryawanDTO: CreateKaryawanDTO): Promise<Karyawan> {
        if (!file) {
            throw new BadRequestException('File foto tidak ditemukan');
        }
        createKaryawanDTO.foto = file.filename;
        return this.karyawanService.createKaryawan(createKaryawanDTO)
    }

    //update karyawan
    @Put('api/v1/:id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(
        FileInterceptor('foto', {
            storage: diskStorage({
                destination: './upload/foto',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = extname(file.originalname);
                    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
        })
    )
     async updateKaryawan(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateKaryawanDTO: UpdateKaryawanDTO
    ): Promise<Karyawan> {
        if (file) {
            updateKaryawanDTO.foto = file.filename;
        }
        return this.karyawanService.updateKaryawan(id, updateKaryawanDTO);
    }

    //delete data karyawan by ID
    @Delete('api/v1/:id')
    async delete(@Param('id') id: string): Promise<Karyawan> {
        return this.karyawanService.delete(id);
    }
}
