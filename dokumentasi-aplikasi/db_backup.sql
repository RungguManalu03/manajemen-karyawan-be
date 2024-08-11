/*
 Navicat Premium Data Transfer

 Source Server         : server_postgre_local
 Source Server Type    : PostgreSQL
 Source Server Version : 140005 (140005)
 Source Host           : localhost:5432
 Source Catalog        : technical_test
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140005 (140005)
 File Encoding         : 65001

 Date: 11/08/2024 15:14:33
*/


-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS "public"."_prisma_migrations";
CREATE TABLE "public"."_prisma_migrations" (
  "id" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
  "checksum" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "finished_at" timestamptz(6),
  "migration_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "logs" text COLLATE "pg_catalog"."default",
  "rolled_back_at" timestamptz(6),
  "started_at" timestamptz(6) NOT NULL DEFAULT now(),
  "applied_steps_count" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO "public"."_prisma_migrations" VALUES ('863ceb3f-3c47-4441-beca-9d970113df1f', '483a42039bd0a23d3b3a140320012fd067da1618ebc2b8d166134c39082618b9', '2024-08-09 20:51:27.968061+07', '20240809132733_karyawan', NULL, NULL, '2024-08-09 20:51:27.879944+07', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('116ab0b1-8cf7-4d74-ac28-899b50b9213e', 'f8e5e4f056bd69926f81be00c8edf1286b182cf99594a896a06fb51e1489f9fc', '2024-08-09 20:51:28.002718+07', '20240809134800_karyawan', NULL, NULL, '2024-08-09 20:51:27.975585+07', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('35320446-49c3-45e5-bd77-5be96ae3b94b', '85d693d733b97d37b68cb88f55a7303b6d008a51a3abed2f8c16d72813316cb2', '2024-08-09 20:52:30.295499+07', '20240809135230_karyawan', NULL, NULL, '2024-08-09 20:52:30.235415+07', 1);

-- ----------------------------
-- Table structure for karyawans
-- ----------------------------
DROP TABLE IF EXISTS "public"."karyawans";
CREATE TABLE "public"."karyawans" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "nama" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "nomor" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "jabatan" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "departemen" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "tanggal_masuk" timestamp(3) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "foto" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "status" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of karyawans
-- ----------------------------
INSERT INTO "public"."karyawans" VALUES ('a44ae44a-9c66-4967-923a-9f063aee3759', 'Runggu Marusaha Manalu', 'ID030301', 'STAFF', 'IT', '2024-08-09 14:40:45', '2024-08-10 07:17:34.673', '2024-08-10 07:17:34.673', 'foto-1723274254619-727672522.png', 'kontrak');
INSERT INTO "public"."karyawans" VALUES ('faa4c41f-7d86-45eb-a557-006c68464375', 'Annisa Hutagalung', 'ID010101', 'STAFF', 'HR', '2024-08-10 14:40:45', '2024-08-10 07:18:29.325', '2024-08-10 07:22:24.487', 'foto-1723274544427-250761306.jpg', 'probation');

-- ----------------------------
-- Primary Key structure for table _prisma_migrations
-- ----------------------------
ALTER TABLE "public"."_prisma_migrations" ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table karyawans
-- ----------------------------
ALTER TABLE "public"."karyawans" ADD CONSTRAINT "karyawans_pkey" PRIMARY KEY ("id");
