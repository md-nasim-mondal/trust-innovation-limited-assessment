export interface TransportFee {
  id: string;
  type: string; // MONTHLY, QUARTERLY, ONE_TIME
  amount: number;
  description?: string;
  effectiveDate: string;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  helperName?: string;
  contactNumber: string;
  capacity?: number;
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  transportFeeId?: string;
  transportFee?: TransportFee;
  stops?: RoutePickupPoint[];
  vehicleAssignments?: { vehicle: Vehicle }[];
}

export interface RoutePickupPoint {
  id: string;
  pickupPoint: PickupPoint;
  sequenceOrder: number;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  contactNumber?: string;
  address?: string;
  createdAt?: string;
}

export interface Allocation {
  id: string;
  student: Student;
  route: Route;
  vehicle: Vehicle;
  pickupPoint: PickupPoint;
  startDate: string;
}
