-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'document');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "specialist_id" UUID,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "display_order" INTEGER,
    "mime_type" TEXT NOT NULL,
    "media_type" "MediaType" NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_fee" (
    "id" UUID NOT NULL,
    "tier_name" TEXT NOT NULL,
    "min_value" INTEGER NOT NULL,
    "max_value" INTEGER NOT NULL,
    "platform_fee_percentage" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_offerings" (
    "id" UUID NOT NULL,
    "specialist_id" UUID,
    "title" TEXT,
    "name" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialists" (
    "id" UUID NOT NULL,
    "average_rating" DECIMAL(10,2) DEFAULT 0,
    "is_draft" BOOLEAN NOT NULL DEFAULT true,
    "total_number_of_ratings" INTEGER DEFAULT 0,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL,
    "final_price" DECIMAL(10,2) NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "duration_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "specialists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "profile_photo" TEXT,
    "contact_number" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialists_slug_key" ON "specialists"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_specialist_id_fkey" FOREIGN KEY ("specialist_id") REFERENCES "specialists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_specialist_id_fkey" FOREIGN KEY ("specialist_id") REFERENCES "specialists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
