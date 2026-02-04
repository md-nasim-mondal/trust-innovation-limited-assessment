/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import api from "../lib/axios";
import { Plus, User } from "lucide-react";
import type { Student } from "../types/transport";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    grade: "",
    contactNumber: "",
    address: "",
  });

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get("/students");
      setStudents(res?.data?.data);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to fetch students");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchStudents();
    };
    init();
  }, [fetchStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/students", formData);
      fetchStudents();
      setIsModalOpen(false);
      setFormData({
        name: "",
        rollNo: "",
        grade: "",
        contactNumber: "",
        address: "",
      });
      toast.success("Student created successfully");
    } catch (error: any) {
      console.error(error);
      let message = "Error creating student";
      if (isAxiosError(error) && error?.response?.data?.message) {
        message = error?.response?.data?.message;
      }
      toast.error(message);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Students</h1>
          <p className='text-sm text-gray-500'>Manage student records</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
          <Plus size={16} />
          Add Student
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-gray-600'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
              <tr>
                <th className='px-6 py-4 whitespace-nowrap'>Name / Roll</th>
                <th className='px-6 py-4 whitespace-nowrap'>Grade</th>
                <th className='px-6 py-4 whitespace-nowrap'>Contact</th>
                <th className='px-6 py-4 whitespace-nowrap'>Address</th>
                <th className='px-6 py-4 whitespace-nowrap'>Joined</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {students.map((student) => (
                <tr key={student.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 min-w-50'>
                    <div className='flex items-center gap-3'>
                      <div className='h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500'>
                        <User size={14} />
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {student?.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Roll: {student?.rollNo}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>{student?.grade}</td>
                  <td className='px-6 py-4'>{student?.contactNumber || "-"}</td>
                  <td
                    className='px-6 py-4 truncate max-w-xs'
                    title={student?.address || ""}>
                    {student?.address || "-"}
                  </td>
                  <td className='px-6 py-4 text-gray-500 whitespace-nowrap'>
                    {new Date(student?.createdAt || "").toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-8 text-center text-gray-500 italic'>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>Add Student</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600'>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Name
                </label>
                <input
                  type='text'
                  required
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Roll No
                  </label>
                  <input
                    type='text'
                    required
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                    value={formData.rollNo}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Grade
                  </label>
                  <input
                    type='text'
                    required
                    className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Contact Number
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Address
                </label>
                <textarea
                  className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2'
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
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
