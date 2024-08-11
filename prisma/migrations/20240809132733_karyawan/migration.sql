-- CreateTable
CREATE TABLE "karyawans" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "nomor" VARCHAR(255) NOT NULL,
    "jabatan" VARCHAR(255) NOT NULL,
    "departemen" VARCHAR(255) NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawans_pkey" PRIMARY KEY ("id")
);
