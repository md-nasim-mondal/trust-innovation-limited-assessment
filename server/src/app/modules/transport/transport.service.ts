import { prisma } from "../../../shared/prisma";
import {
  Vehicle,
  PickupPoint,
  TransportFeeMaster,
  Route,
  Prisma,
} from "@prisma/client";

const createVehicle = async (
  data: Prisma.VehicleCreateInput,
): Promise<Vehicle> => {
  return await prisma.vehicle.create({ data });
};

const getAllVehicles = async (): Promise<Vehicle[]> => {
  return await prisma.vehicle.findMany();
};

const createPickupPoint = async (
  data: Prisma.PickupPointCreateInput,
): Promise<PickupPoint> => {
  return await prisma.pickupPoint.create({ data });
};

const getAllPickupPoints = async (): Promise<PickupPoint[]> => {
  return await prisma.pickupPoint.findMany();
};

const createTransportFee = async (
  data: Prisma.TransportFeeMasterCreateInput,
): Promise<TransportFeeMaster> => {
  return await prisma.transportFeeMaster.create({ data });
};

const getAllTransportFees = async (): Promise<TransportFeeMaster[]> => {
  return await prisma.transportFeeMaster.findMany();
};

const createRoute = async (data: any): Promise<Route> => {
  const { stops, ...routeData } = data;

  const result = await prisma.route.create({
    data: {
      ...routeData,
      stops:
        stops && stops.length > 0
          ? {
              create: stops.map((stop: any) => ({
                pickupPointId: stop.pickupPointId,
                sequenceOrder: stop.sequenceOrder,
              })),
            }
          : undefined,
    },
    include: {
      stops: {
        include: {
          pickupPoint: true,
        },
      },
      transportFee: true,
    },
  });
  return result;
};

const getAllRoutes = async (): Promise<Route[]> => {
  return await prisma.route.findMany({
    include: {
      transportFee: true,
      stops: {
        include: {
          pickupPoint: true,
        },
        orderBy: {
          sequenceOrder: "asc",
        },
      },
      vehicleAssignments: {
        where: { isActive: true },
        include: {
          vehicle: true,
        },
      },
    },
  });
};

const assignVehicleToRoute = async (data: {
  vehicleId: string;
  routeId: string;
}) => {
  // Deactivate previous active assignment for this vehicle if needed?
  // Or just create new assignment. Assume one vehicle can be on one route at a time?
  // Requirement: "Assign Vehicle - Assign a specific vehicle to a specific route."
  return await prisma.vehicleRouteAssignment.create({
    data: {
      vehicleId: data.vehicleId,
      routeId: data.routeId,
      isActive: true,
    },
  });
};

const allocateTransport = async (
  data: Prisma.TransportAllocationUncheckedCreateInput,
) => {
  // Transaction to ensure atomicity and consistency
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Allocation
    // Check if student already has allocation?
    const existing = await tx.transportAllocation.findUnique({
      where: { studentId: data.studentId },
    });

    if (existing) {
      throw new Error("Student already has a transport allocation.");
    }

    const allocation = await tx.transportAllocation.create({
      data,
    });

    // 2. Fetch Route Fee details
    const route = await tx.route.findUnique({
      where: { id: data.routeId },
      include: { transportFee: true },
    });

    if (!route) {
      throw new Error("Route not found");
    }

    // 3. Generate Fee
    if (route.transportFee) {
      const date = new Date();
      const currentMonth = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      await tx.studentFeeAssignment.create({
        data: {
          studentId: data.studentId,
          feeDescription: `Transport Fee - ${route.transportFee.name} (${currentMonth})`,
          amount: route.transportFee.amount,
          month: currentMonth,
          status: "PENDING",
        },
      });
    }

    return allocation;
  });
  return result;
};

const getAllAllocations = async () => {
  return await prisma.transportAllocation.findMany({
    include: {
      student: true,
      route: true,
      vehicle: true,
      pickupPoint: true,
    },
  });
};

const getStudentFees = async () => {
  return await prisma.studentFeeAssignment.findMany({
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const deleteVehicle = async (id: string): Promise<Vehicle> => {
  return await prisma.vehicle.delete({ where: { id } });
};

const updateVehicle = async (
  id: string,
  data: Prisma.VehicleUpdateInput,
): Promise<Vehicle> => {
  return await prisma.vehicle.update({ where: { id }, data });
};

const deletePickupPoint = async (id: string): Promise<PickupPoint> => {
  return await prisma.pickupPoint.delete({ where: { id } });
};

const updatePickupPoint = async (
  id: string,
  data: Prisma.PickupPointUpdateInput,
): Promise<PickupPoint> => {
  return await prisma.pickupPoint.update({ where: { id }, data });
};

const deleteTransportFee = async (id: string): Promise<TransportFeeMaster> => {
  return await prisma.transportFeeMaster.delete({ where: { id } });
};

const updateTransportFee = async (
  id: string,
  data: Prisma.TransportFeeMasterUpdateInput,
): Promise<TransportFeeMaster> => {
  return await prisma.transportFeeMaster.update({ where: { id }, data });
};

const deleteRoute = async (id: string): Promise<Route> => {
  return await prisma.route.delete({ where: { id } });
};

const updateRoute = async (id: string, data: any): Promise<Route> => {
  const { stops, ...routeData } = data;

  return await prisma.$transaction(async (tx) => {
    const updatedRoute = await tx.route.update({
      where: { id },
      data: routeData,
    });

    if (stops) {
      await tx.routePickupPoint.deleteMany({
        where: { routeId: id },
      });
      if (stops.length > 0) {
        await tx.routePickupPoint.createMany({
          data: stops.map((stop: any) => ({
            routeId: id,
            pickupPointId: stop.pickupPointId,
            sequenceOrder: stop.sequenceOrder,
          })),
        });
      }
    }

    return updatedRoute;
  });
};

const deleteAllocation = async (id: string) => {
  return await prisma.transportAllocation.delete({ where: { id } });
};

const deleteStudentFee = async (id: string) => {
  return await prisma.studentFeeAssignment.delete({ where: { id } });
};

const updateStudentFeeStatus = async (id: string, status: string) => {
  return await prisma.studentFeeAssignment.update({
    where: { id },
    data: { status },
  });
};

export const TransportService = {
  createVehicle,
  getAllVehicles,
  deleteVehicle,
  updateVehicle,
  createPickupPoint,
  getAllPickupPoints,
  deletePickupPoint,
  updatePickupPoint,
  createTransportFee,
  getAllTransportFees,
  deleteTransportFee,
  updateTransportFee,
  createRoute,
  getAllRoutes,
  deleteRoute,
  updateRoute,
  assignVehicleToRoute,
  allocateTransport,
  getAllAllocations,
  deleteAllocation,
  getStudentFees,
  deleteStudentFee,
  updateStudentFeeStatus,
};
