/*
  Warnings:

  - Changed the type of `mime_type` on the `media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tier_name` on the `platform_fee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('jpeg', 'png', 'jpg', 'pdf', 'mp4');

-- CreateEnum
CREATE TYPE "TierName" AS ENUM ('Basic', 'Standard', 'Premium');

-- AlterTable
ALTER TABLE "media" DROP COLUMN "mime_type",
ADD COLUMN     "mime_type" "MimeType" NOT NULL;

-- AlterTable
ALTER TABLE "platform_fee" DROP COLUMN "tier_name",
ADD COLUMN     "tier_name" "TierName" NOT NULL;
