/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/axios";
import type {
  Route,
  TransportFee,
  PickupPoint,
  Vehicle,
} from "../../types/transport";
import { Plus, MapPin, Bus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [fees, setFees] = useState<TransportFee[]>([]);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Modals
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isAssignVehicleModalOpen, setIsAssignVehicleModalOpen] =
    useState(false);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [routeForm, setRouteForm] = useState({
    name: "",
    startPoint: "",
    endPoint: "",
    transportFeeId: "",
    stopIds: [] as string[],
  });

  const [assignVehicleForm, setAssignVehicleForm] = useState({
    vehicleId: "",
  });

  const fetchRoutes = useCallback(async () => {
    try {
      const res = await api.get("/transport/routes");
      setRoutes(res.data.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch routes");
    }
  }, []);

  const fetchFees = useCallback(async () => {
    try {
      const res = await api.get("/transport/fees"); // Updated endpoint
      setFees(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchPoints = useCallback(async () => {
    try {
      const res = await api.get("/transport/pickup-points");
      setPoints(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await api.get("/transport/vehicles");
      setVehicles(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchRoutes(),
        fetchFees(),
        fetchPoints(),
        fetchVehicles(),
      ]);
    };
    init();
  }, [fetchRoutes, fetchFees, fetchPoints, fetchVehicles]);

  const handleEdit = (route: Route) => {
    setRouteForm({
      name: route.name,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      transportFeeId: route.transportFeeId || "",
      stopIds: route.stops?.map((s) => s.pickupPoint?.id || "") || [],
    });
    setEditingId(route.id);
    setIsRouteModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      try {
        await api.delete(`/transport/routes/${id}`);
        toast.success("Route deleted successfully");
        fetchRoutes();
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error deleting route");
      }
    }
  };

  const resetForm = () => {
    setRouteForm({
      name: "",
      startPoint: "",
      endPoint: "",
      transportFeeId: "",
      stopIds: [],
    });
    setEditingId(null);
  };

  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Transform stopIds to the structure expected by backend
      const stops = routeForm.stopIds.map((id, index) => ({
        pickupPointId: id,
        sequenceOrder: index + 1,
      }));

      const payload = {
        ...routeForm,
        stops: stops.length > 0 ? stops : undefined,
      };

      if (editingId) {
        await api.patch(`/transport/routes/${editingId}`, payload);
        toast.success("Route updated successfully");
      } else {
        await api.post("/transport/routes", payload);
        toast.success("Route description created successfully");
      }
      fetchRoutes();
      setIsRouteModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleAssignVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteId) return;
    try {
      await api.post("/transport/routes/assign-vehicle", {
        routeId: selectedRouteId,
        vehicleId: assignVehicleForm.vehicleId,
      });
      toast.success("Vehicle assigned successfully");
      fetchRoutes(); // refresh to hopefully show assigned vehicle
      setIsAssignVehicleModalOpen(false);
      setAssignVehicleForm({ vehicleId: "" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to assign vehicle");
    }
  };

  const toggleStopSelection = (id: string) => {
    setRouteForm((prev) => {
      if (prev.stopIds.includes(id)) {
        return { ...prev, stopIds: prev.stopIds.filter((sid) => sid !== id) };
      } else {
        return { ...prev, stopIds: [...prev.stopIds, id] };
      }
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Transport Routes</h1>
          <p className='text-sm text-gray-500'>
            Manage routes, stops and vehicle assignments
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsRouteModalOpen(true);
          }}
          className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
          <Plus size={16} />
          Create Route
        </button>
      </div>

      <div className='grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {routes.map((route) => (
          <div
            key={route.id}
            className='relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
            <div className='border-b bg-gray-50 px-5 py-4'>
              <div className='flex items-start justify-between'>
                <h3 className='text-lg font-bold text-gray-900'>
                  {route.name}
                  {route.transportFee && (
                    <span className='ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700'>
                      {route.transportFee.type} (${route.transportFee.amount})
                    </span>
                  )}
                </h3>
                <div className='flex gap-1 shrink-0'>
                  <button
                    onClick={() => handleEdit(route)}
                    className='text-gray-400 hover:text-amber-500'>
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
                    className='text-gray-400 hover:text-red-500'>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className='mt-1 flex items-center gap-2 text-xs text-gray-500 flex-wrap'>
                <span className='font-semibold text-gray-700'>
                  {route.startPoint}
                </span>
                <span>→</span>
                <span className='font-semibold text-gray-700'>
                  {route.endPoint}
                </span>
              </div>
            </div>

            <div className='flex-1 p-5'>
              {/* Stops */}
              <div className='mb-4'>
                <h4 className='mb-2 text-xs font-semibold uppercase text-gray-400'>
                  Stops
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {route.stops && route.stops.length > 0 ? (
                    route.stops.map((stop) => (
                      <span
                        key={stop.id}
                        className='inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600'>
                        <MapPin size={10} />
                        {stop.pickupPoint.name}
                      </span>
                    ))
                  ) : (
                    <span className='text-xs text-gray-400 italic'>
                      No intermediate stops
                    </span>
                  )}
                </div>
              </div>

              {/* Assigned Vehicle */}
              <div>
                <h4 className='mb-2 text-xs font-semibold uppercase text-gray-400'>
                  Assigned Vehicle
                </h4>
                {route.vehicleAssignments &&
                route.vehicleAssignments.length > 0 ? (
                  <div className='flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2'>
                    <div className='rounded-md bg-white p-2 shadow-sm text-indigo-600'>
                      <Bus size={16} />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-gray-900'>
                        {route.vehicleAssignments[0].vehicle.vehicleNumber}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {route.vehicleAssignments[0].vehicle.driverName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedRouteId(route.id);
                      setIsAssignVehicleModalOpen(true);
                    }}
                    className='w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-gray-50'>
                    + Assign Vehicle
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Route Modal */}
      {isRouteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingId ? "Edit Route" : "Create New Route"}
              </h2>
              <button
                onClick={() => setIsRouteModalOpen(false)}
                className='text-gray-400 hover:text-gray-600'>
                ✕
              </button>
            </div>
            <form onSubmit={handleRouteSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Route Name
                </label>
                <input
                  type='text'
                  required
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  value={routeForm.name}
                  onChange={(e) =>
                    setRouteForm({ ...routeForm, name: e.target.value })
                  }
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Start Point
                  </label>
                  <input
                    type='text'
                    required
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                    value={routeForm.startPoint}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, startPoint: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    End Point
                  </label>
                  <input
                    type='text'
                    required
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                    value={routeForm.endPoint}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, endPoint: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Fee Structure (Zone)
                </label>
                <select
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  value={routeForm.transportFeeId}
                  onChange={(e) =>
                    setRouteForm({
                      ...routeForm,
                      transportFeeId: e.target.value,
                    })
                  }>
                  <option value=''>Select Fee Structure</option>
                  {fees.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.type} - ${f.amount}
                      {f.description ? ` (${f.description})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Select Stops (In Order)
                </label>
                <div className='grid grid-cols-2 gap-2 h-40 overflow-y-auto border rounded-lg p-2'>
                  {points.map((point) => (
                    <div
                      key={point.id}
                      onClick={() => toggleStopSelection(point.id)}
                      className={`cursor-pointer rounded-md p-2 text-sm border ${
                        routeForm.stopIds.includes(point.id)
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-gray-50 border-gray-100 text-gray-600"
                      }`}>
                      {point.name}
                    </div>
                  ))}
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Click to select/deselect stops for this route.
                </p>
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsRouteModalOpen(false)}
                  className='rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
                  {editingId ? "Update Route" : "Create Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Vehicle Modal */}
      {isAssignVehicleModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-bold text-gray-900'>
                Assign Vehicle
              </h2>
              <button
                onClick={() => setIsAssignVehicleModalOpen(false)}
                className='text-gray-400 hover:text-gray-600'>
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignVehicle}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Select Vehicle
                </label>
                <select
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  required
                  value={assignVehicleForm.vehicleId}
                  onChange={(e) =>
                    setAssignVehicleForm({
                      ...assignVehicleForm,
                      vehicleId: e.target.value,
                    })
                  }>
                  <option value=''>Choose a vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.driverName})
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setIsAssignVehicleModalOpen(false)}
                  className='rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700'>
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
