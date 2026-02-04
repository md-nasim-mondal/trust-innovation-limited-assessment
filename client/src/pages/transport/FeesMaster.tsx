import { useEffect, useState, useCallback } from "react";
import api from "../../lib/axios";
import type { TransportFee } from "../../types/transport";
import { Plus, Trash2, Edit } from "lucide-react";

export default function FeesMaster() {
  const [fees, setFees] = useState<TransportFee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "MONTHLY",
    amount: 0,
    description: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  const fetchFees = useCallback(async () => {
    try {
      const res = await api.get("/transport/fees");
      setFees(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchFees();
    };
    init();
  }, [fetchFees]);

  const handleEdit = (fee: TransportFee) => {
    setFormData({
      type: fee.type,
      amount: fee.amount,
      description: fee.description || "",
      effectiveDate: String(fee.effectiveDate).split("T")[0],
    });
    setEditingId(fee.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this fee structure?")) {
      try {
        await api.delete(`/transport/fees/${id}`);
        fetchFees();
      } catch (error) {
        console.error(error);
        alert("Error deleting fee");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: "MONTHLY",
      amount: 0,
      description: "",
      effectiveDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/transport/fees/${editingId}`, formData);
      } else {
        await api.post("/transport/fees", formData);
      }
      fetchFees();
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
          <h1 className='text-2xl font-bold text-gray-900'>Fee Structures</h1>
          <p className='text-sm text-gray-500'>
            Manage transport fee types and amounts
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
          <Plus size={16} />
          Add Fee
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-gray-600'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
              <tr>
                <th className='px-6 py-4 whitespace-nowrap'>Type</th>
                <th className='px-6 py-4 whitespace-nowrap'>Amount</th>
                <th className='px-6 py-4 whitespace-nowrap'>Effective Date</th>
                <th className='px-6 py-4 whitespace-nowrap'>Description</th>
                <th className='px-6 py-4 text-right whitespace-nowrap'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {fees.map((fee) => (
                <tr key={fee.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                      {fee.type}
                    </span>
                  </td>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                    ${Number(fee.amount).toFixed(2)}
                  </td>
                  <td className='px-6 py-4 text-gray-500 whitespace-nowrap'>
                    {new Date(fee.effectiveDate).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-gray-500'>
                    {fee.description || "-"}
                  </td>
                  <td className='px-6 py-4 text-right whitespace-nowrap'>
                    <div className='flex justify-end gap-2 text-gray-400'>
                      <button
                        onClick={() => handleEdit(fee)}
                        className='hover:text-amber-500'>
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(fee.id)}
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
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingId ? "Edit Fee" : "Add Fee Structure"}
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
                  Fee Type
                </label>
                <select
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }>
                  <option value='MONTHLY'>Monthly</option>
                  <option value='QUARTERLY'>Quarterly</option>
                  <option value='ONE_TIME'>One Time</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Amount
                </label>
                <div className='relative mt-1 rounded-md shadow-sm'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <span className='text-gray-500 sm:text-sm'>$</span>
                  </div>
                  <input
                    type='number'
                    required
                    className='block w-full rounded-lg border border-gray-300 pl-7 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount:
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Effective Date
                </label>
                <input
                  type='date'
                  required
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  value={formData.effectiveDate}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Description
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  {editingId ? "Update Fee" : "Create Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
