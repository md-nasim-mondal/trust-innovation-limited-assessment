import express from "express";
import { TransportController } from "./transport.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TransportValidation } from "./transport.validation";

const router = express.Router();

// Vehicles
router.post(
  "/vehicles",
  validateRequest(TransportValidation.createVehicleZodSchema),
  TransportController.createVehicle,
);
router.get("/vehicles", TransportController.getAllVehicles);
router.delete("/vehicles/:id", TransportController.deleteVehicle);
router.patch("/vehicles/:id", TransportController.updateVehicle);

// Pickup Points
router.post(
  "/pickup-points",
  validateRequest(TransportValidation.createPickupPointZodSchema),
  TransportController.createPickupPoint,
);
router.get("/pickup-points", TransportController.getAllPickupPoints);
router.delete("/pickup-points/:id", TransportController.deletePickupPoint);
router.patch("/pickup-points/:id", TransportController.updatePickupPoint);

// Fees Master
router.post(
  "/fees",
  validateRequest(TransportValidation.createTransportFeeZodSchema),
  TransportController.createTransportFee,
);
router.get("/fees", TransportController.getAllTransportFees);
router.delete("/fees/:id", TransportController.deleteTransportFee);
router.patch("/fees/:id", TransportController.updateTransportFee);

// Routes
router.post(
  "/routes",
  validateRequest(TransportValidation.createRouteZodSchema),
  TransportController.createRoute,
);
router.get("/routes", TransportController.getAllRoutes);
router.delete("/routes/:id", TransportController.deleteRoute);
router.patch("/routes/:id", TransportController.updateRoute);

router.post(
  "/routes/assign-vehicle",
  validateRequest(TransportValidation.assignVehicleToRouteZodSchema),
  TransportController.assignVehicleToRoute,
);

// Allocation (Student Assignment)
router.post(
  "/allocations",
  validateRequest(TransportValidation.allocateTransportZodSchema),
  TransportController.allocateTransport,
);
router.get("/allocations", TransportController.getAllAllocations);
router.delete("/allocations/:id", TransportController.deleteAllocation);

// Student Fees
router.get("/student-fees", TransportController.getStudentFees);
router.delete("/student-fees/:id", TransportController.deleteStudentFee);
router.patch(
  "/student-fees/:id/pay",
  TransportController.updateStudentFeeStatus,
);

export const TransportRoutes: express.Router = router;
