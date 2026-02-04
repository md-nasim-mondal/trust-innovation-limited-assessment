/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/axios";
import type { Vehicle } from "../../types/transport";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    helperName: "",
    contactNumber: "",
    capacity: 0,
  });

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await api.get("/transport/vehicles");
      setVehicles(res.data.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch vehicles");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchVehicles();
    };
    init();
  }, [fetchVehicles]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      driverName: vehicle.driverName,
      helperName: vehicle.helperName || "",
      contactNumber: vehicle.contactNumber,
      capacity: vehicle.capacity || 0,
    });
    setEditingId(vehicle.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/transport/vehicles/${id}`);
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error deleting vehicle");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleNumber: "",
      driverName: "",
      helperName: "",
      contactNumber: "",
      capacity: 0,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/transport/vehicles/${editingId}`, formData);
        toast.success("Vehicle updated successfully");
      } else {
        await api.post("/transport/vehicles", formData);
        toast.success("Vehicle created successfully");
      }
      fetchVehicles();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Vehicles</h1>
          <p className='text-sm text-gray-500'>
            Manage transport vehicles and drivers
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-gray-600'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
              <tr>
                <th className='px-6 py-4 whitespace-nowrap'>Vehicle No</th>
                <th className='px-6 py-4 whitespace-nowrap'>Driver</th>
                <th className='px-6 py-4 whitespace-nowrap'>Contact</th>
                <th className='px-6 py-4 whitespace-nowrap'>Capacity</th>
                <th className='px-6 py-4 text-right whitespace-nowrap'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                    {vehicle.vehicleNumber}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex flex-col'>
                      <span className='font-medium text-gray-900'>
                        {vehicle.driverName}
                      </span>
                      <span className='text-xs text-gray-400'>
                        Helper: {vehicle.helperName || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {vehicle.contactNumber}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {vehicle.capacity || "-"}
                  </td>
                  <td className='px-6 py-4 text-right whitespace-nowrap'>
                    <div className='flex justify-end gap-2 text-gray-400'>
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className='hover:text-amber-500'>
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className='hover:text-red-500'>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingId ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600'>
                <span className='sr-only'>Close</span>✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Vehicle Number
                </label>
                <input
                  type='text'
                  required
                  name='vehicleNumber'
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  value={formData.vehicleNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleNumber: e.target.value })
                  }
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Driver Name
                  </label>
                  <input
                    type='text'
                    required
                    name='driverName'
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                    value={formData.driverName}
                    onChange={(e) =>
                      setFormData({ ...formData, driverName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Contact
                  </label>
                  <input
                    type='text'
                    required
                    name='contactNumber'
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Helper Name
                  </label>
                  <input
                    type='text'
                    name='helperName'
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                    value={formData.helperName}
                    onChange={(e) =>
                      setFormData({ ...formData, helperName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Capacity
                  </label>
                  <input
                    type='number'
                    name='capacity'
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
                  {editingId ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
