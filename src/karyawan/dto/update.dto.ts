import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum Status {
    KONTRAK = 'kontrak', 
    TETAP = 'probation', 
    PROBATION = 'tetap'
}

export class UpdateKaryawanDTO {
    @IsNotEmpty()
    @IsString()
    nama: string;

    @IsNotEmpty()
    @IsString()
    nomor: string;

    @IsNotEmpty()
    @IsString()
    jabatan: string;

    @IsNotEmpty()
    @IsString()
    departemen: string;

    @IsDateString()
    tanggal_masuk: Date;

    @IsOptional()
    foto: string;

    @IsEnum(Status)
    status: Status;
}
