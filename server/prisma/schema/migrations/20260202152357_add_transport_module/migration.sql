-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "need_password_change" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "roll_no" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "contact_number" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_assignments" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "fee_description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "month" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fee_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_fee_masters" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_fee_masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "driver_name" TEXT NOT NULL,
    "helper_name" TEXT,
    "contact_number" TEXT NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_points" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickup_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_point" TEXT NOT NULL,
    "end_point" TEXT NOT NULL,
    "transport_fee_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_pickup_points" (
    "id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "pickup_point_id" UUID NOT NULL,
    "sequence_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_pickup_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_route_assignments" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_route_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_allocations" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "pickup_point_id" UUID,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_roll_no_key" ON "students"("roll_no");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vehicle_number_key" ON "vehicles"("vehicle_number");

-- CreateIndex
CREATE UNIQUE INDEX "transport_allocations_student_id_key" ON "transport_allocations"("student_id");

-- AddForeignKey
ALTER TABLE "student_fee_assignments" ADD CONSTRAINT "student_fee_assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_transport_fee_id_fkey" FOREIGN KEY ("transport_fee_id") REFERENCES "transport_fee_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_pickup_points" ADD CONSTRAINT "route_pickup_points_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_pickup_points" ADD CONSTRAINT "route_pickup_points_pickup_point_id_fkey" FOREIGN KEY ("pickup_point_id") REFERENCES "pickup_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_route_assignments" ADD CONSTRAINT "vehicle_route_assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_route_assignments" ADD CONSTRAINT "vehicle_route_assignments_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_allocations" ADD CONSTRAINT "transport_allocations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_allocations" ADD CONSTRAINT "transport_allocations_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_allocations" ADD CONSTRAINT "transport_allocations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_allocations" ADD CONSTRAINT "transport_allocations_pickup_point_id_fkey" FOREIGN KEY ("pickup_point_id") REFERENCES "pickup_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
