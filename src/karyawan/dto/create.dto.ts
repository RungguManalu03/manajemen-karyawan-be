import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum Status {
    KONTRAK = 'kontrak', 
    TETAP = 'probation', 
    PROBATION = 'tetap'
}

export class CreateKaryawanDTO {
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

    foto: string;

    @IsEnum(Status)
    status: Status;
}
