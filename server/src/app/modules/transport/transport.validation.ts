import { z } from "zod";

const createVehicleZodSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().min(1, "Vehicle Number is required"),
    driverName: z.string().min(1, "Driver Name is required"),
    helperName: z.string().optional(),
    contactNumber: z.string().min(1, "Contact Number is required"),
    capacity: z.number().optional(),
  }),
});

const createPickupPointZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
  }),
});

const createTransportFeeZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    amount: z.number().min(0, "Amount must be non-negative"),
    description: z.string().optional(),
    effectiveDate: z.string().optional(),
  }),
});

const createRouteZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Route Name is required"),
    startPoint: z.string().min(1, "Start Point is required"),
    endPoint: z.string().min(1, "End Point is required"),
    transportFeeId: z.string().optional(), // Can assign fee initially
    stops: z
      .array(
        z.object({
          pickupPointId: z.string().min(1, "Pickup Point ID is required"),
          sequenceOrder: z.number().min(1, "Sequence is required"),
        }),
      )
      .optional(),
  }),
});

const assignVehicleToRouteZodSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    routeId: z.string().min(1, "Route ID is required"),
  }),
});

const allocateTransportZodSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, "Student ID is required"),
    routeId: z.string().min(1, "Route ID is required"),
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    pickupPointId: z.string().optional(),
  }),
});

export const TransportValidation = {
  createVehicleZodSchema,
  createPickupPointZodSchema,
  createTransportFeeZodSchema,
  createRouteZodSchema,
  assignVehicleToRouteZodSchema,
  allocateTransportZodSchema,
};
