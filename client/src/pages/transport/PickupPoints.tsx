import { useEffect, useState, useCallback } from "react";
import api from "../../lib/axios";
import type { PickupPoint } from "../../types/transport";
import { Plus, Trash2, Edit } from "lucide-react";

export default function PickupPoints() {
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const fetchPoints = useCallback(async () => {
    try {
      const res = await api.get("/transport/pickup-points");
      setPoints(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchPoints();
    };
    init();
  }, [fetchPoints]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (point: PickupPoint) => {
    setFormData({
      name: point.name,
      address: point.address || "",
    });
    setEditingId(point.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pickup point?")) {
      try {
        await api.delete(`/transport/pickup-points/${id}`);
        fetchPoints();
      } catch (error) {
        console.error(error);
        alert("Error deleting pickup point");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/transport/pickup-points/${editingId}`, formData);
      } else {
        await api.post("/transport/pickup-points", formData);
      }
      fetchPoints();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Pickup Points</h1>
          <p className='text-sm text-gray-500'>
            Manage stop locations for transport routes
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
          <Plus size={16} />
          Add Stop
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <table className='w-full text-left text-sm text-gray-600'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
            <tr>
              <th className='px-6 py-4'>Stop Name</th>
              <th className='px-6 py-4'>Address/Location</th>
              <th className='px-6 py-4 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {points.map((point) => (
              <tr key={point.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {point.name}
                </td>
                <td className='px-6 py-4'>{point.address || "-"}</td>
                <td className='px-6 py-4 text-right'>
                  <div className='flex justify-end gap-2 text-gray-400'>
                    <button
                      onClick={() => handleEdit(point)}
                      className='hover:text-amber-500'>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(point.id)}
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

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingId ? "Edit Stop" : "Add New Stop"}
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
                  Stop Name
                </label>
                <input
                  type='text'
                  required
                  name='name'
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Address (Optional)
                </label>
                <textarea
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  rows={3}
                  name='address'
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
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
                  {editingId ? "Update Stop" : "Create Stop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
