import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TransportService } from "./transport.service";

// Vehicles
const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.createVehicle(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vehicle created successfully!",
    data: result,
  });
});

const getAllVehicles = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.getAllVehicles();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicles retrieved successfully!",
    data: result,
  });
});

// Pickup Points
const createPickupPoint = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.createPickupPoint(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Pickup Point created successfully!",
    data: result,
  });
});

const getAllPickupPoints = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.getAllPickupPoints();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup Points retrieved successfully!",
    data: result,
  });
});

// Fees Master
const createTransportFee = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.createTransportFee(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Transport Fee Structure created successfully!",
    data: result,
  });
});

const getAllTransportFees = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.getAllTransportFees();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transport Fees retrieved successfully!",
    data: result,
  });
});

// Routes
const createRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.createRoute(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Route created successfully!",
    data: result,
  });
});

const getAllRoutes = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.getAllRoutes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Routes retrieved successfully!",
    data: result,
  });
});

const assignVehicleToRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.assignVehicleToRoute(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vehicle assigned to route successfully!",
    data: result,
  });
});

// Allocation
const allocateTransport = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.allocateTransport(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student allocated to transport and fee generated successfully!",
    data: result,
  });
});

const getAllAllocations = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.getAllAllocations();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Allocations retrieved successfully!",
    data: result,
  });
});

const getStudentFees = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.getStudentFees();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Fees retrieved successfully!",
    data: result,
  });
});

// Vehicles
const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.deleteVehicle(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle deleted successfully!",
    data: result,
  });
});

const updateVehicle = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.updateVehicle(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle updated successfully!",
    data: result,
  });
});

// Pickup Points
const deletePickupPoint = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.deletePickupPoint(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup Point deleted successfully!",
    data: result,
  });
});

const updatePickupPoint = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.updatePickupPoint(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup Point updated successfully!",
    data: result,
  });
});

// Fees Master
const deleteTransportFee = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.deleteTransportFee(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transport Fee Structure deleted successfully!",
    data: result,
  });
});

const updateTransportFee = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.updateTransportFee(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transport Fee Structure updated successfully!",
    data: result,
  });
});

// Routes
const deleteRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.deleteRoute(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Route deleted successfully!",
    data: result,
  });
});

const updateRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.updateRoute(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Route updated successfully!",
    data: result,
  });
});

// Allocations
const deleteAllocation = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.deleteAllocation(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Allocation deleted successfully!",
    data: result,
  });
});

// Student Fees
const deleteStudentFee = catchAsync(async (req: Request, res: Response) => {
  const result = await TransportService.deleteStudentFee(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fee record deleted successfully!",
    data: result,
  });
});

const updateStudentFeeStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TransportService.updateStudentFeeStatus(
      req.params.id as string,
      req.body.status,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fee status updated successfully!",
      data: result,
    });
  },
);

export const TransportController = {
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
