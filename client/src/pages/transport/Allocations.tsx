import { useEffect, useState, useCallback } from "react";
import api from "../../lib/axios";
import type { Route, Allocation, Student } from "../../types/transport";
import { Plus, CheckCircle, User, Trash2 } from "lucide-react";
import { isAxiosError } from "axios";

export default function Allocations() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const fetchAllocations = useCallback(async () => {
    try {
      const res = await api.get("/transport/allocations");
      setAllocations(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchRoutes = useCallback(async () => {
    try {
      const res = await api.get("/transport/routes");
      setRoutes(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    // Need to implement student listing endpoint or minimal search
    try {
      const res = await api.get("/students");
      setStudents(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchAllocations(), fetchRoutes(), fetchStudents()]);
    };
    init();
  }, [fetchAllocations, fetchRoutes, fetchStudents]);

  // Derived state for vehicle selection based on route
  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  const availableVehicles =
    selectedRoute?.vehicleAssignments?.map((va) => va.vehicle) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/transport/allocations", {
        studentId: selectedStudentId,
        routeId: selectedRouteId,
        vehicleId: selectedVehicleId,
      });
      fetchAllocations();
      setIsModalOpen(false);
      setSelectedStudentId("");
      setSelectedRouteId("");
      setSelectedVehicleId("");
      alert("Student allocated successfully! Fee record generated.");
    } catch (error) {
      console.error(error);
      let message = "Error creating allocation";
      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      alert(message);
    }
  };

  const handleCancelAllocation = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this allocation? This will stop future fees generation.",
      )
    ) {
      try {
        await api.delete(`/transport/allocations/${id}`);
        fetchAllocations();
      } catch (error) {
        console.error(error);
        alert("Error deleting allocation");
      }
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Student Allocation
          </h1>
          <p className='text-sm text-gray-500'>
            Assign students to transport routes and auto-generate fees
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'>
          <Plus size={16} />
          New Allocation
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <table className='w-full text-left text-sm text-gray-600'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
            <tr>
              <th className='px-6 py-4'>Student</th>
              <th className='px-6 py-4'>Route</th>
              <th className='px-6 py-4'>Vehicle</th>
              <th className='px-6 py-4'>Start Date</th>
              <th className='px-6 py-4'>Status</th>
              <th className='px-6 py-4 text-right'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {allocations.map((alloc) => (
              <tr key={alloc.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500'>
                      <User size={14} />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {alloc.student.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        Roll: {alloc.student.rollNo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 font-medium'>{alloc.route.name}</td>
                <td className='px-6 py-4 text-gray-500'>
                  {alloc.vehicle.vehicleNumber}
                </td>
                <td className='px-6 py-4 text-gray-500'>
                  {new Date(alloc.startDate).toLocaleDateString()}
                </td>
                <td className='px-6 py-4'>
                  <span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700'>
                    <CheckCircle size={10} /> Active
                  </span>
                </td>
                <td className='px-6 py-4 text-right'>
                  <button
                    onClick={() => handleCancelAllocation(alloc.id)}
                    className='text-gray-400 hover:text-red-500'
                    title='Cancel Allocation'>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {allocations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-8 text-center text-gray-500 italic'>
                  No active allocations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>
                Allocate Transport
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600'>
                ✕
              </button>
            </div>

            <div className='mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800'>
              <strong>Note:</strong> Allocating a student will automatically
              generate a transport fee record for the current month.
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Select Student
                </label>
                <select
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}>
                  <option value=''>Choose Student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Select Route
                </label>
                <select
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  required
                  value={selectedRouteId}
                  onChange={(e) => {
                    setSelectedRouteId(e.target.value);
                    setSelectedVehicleId("");
                  }}>
                  <option value=''>Choose Route...</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.startPoint} - {r.endPoint})
                    </option>
                  ))}
                </select>
              </div>

              {selectedRouteId && (
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Select Vehicle
                  </label>
                  {availableVehicles.length > 0 ? (
                    <select
                      className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                      required
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}>
                      <option value=''>Choose Vehicle...</option>
                      {availableVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.vehicleNumber} (Driver: {v.driverName})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className='mt-1 text-sm text-red-500'>
                      No vehicles assigned to this route yet.
                    </p>
                  )}
                </div>
              )}

              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!selectedVehicleId}
                  className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50'>
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
