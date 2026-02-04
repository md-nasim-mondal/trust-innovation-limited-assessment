/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/axios";
import { Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

// Minimal interface for fee response
interface FeeRecord {
  id: string;
  student: {
    name: string;
    rollNo: string;
  };
  feeDescription: string;
  month: string;
  amount: number | string;
  status: string;
  createdAt: string;
}

export default function StudentFees() {
  const [studentFees, setStudentFees] = useState<FeeRecord[]>([]);

  const fetchStudentFees = useCallback(async () => {
    try {
      const res = await api.get("/transport/student-fees");
      setStudentFees(res?.data?.data);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch student fees",
      );
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchStudentFees();
    };
    init();
  }, [fetchStudentFees]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this fee record?")) {
      try {
        await api.delete(`/transport/student-fees/${id}`);
        toast.success("Fee record deleted successfully");
        fetchStudentFees();
      } catch (error: any) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Error deleting fee record",
        );
      }
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.patch(`/transport/student-fees/${id}/pay`, { status: "PAID" });
      toast.success("Fee status updated to PAID");
      fetchStudentFees();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>
          Computed Student Fees
        </h1>
        <p className='text-sm text-gray-500'>
          View automatically generated fee assignments
        </p>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-gray-600'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
              <tr>
                <th className='px-6 py-4 whitespace-nowrap'>Student</th>
                <th className='px-6 py-4 whitespace-nowrap'>Description</th>
                <th className='px-6 py-4 whitespace-nowrap'>Month</th>
                <th className='px-6 py-4 whitespace-nowrap'>Amount</th>
                <th className='px-6 py-4 whitespace-nowrap'>Status</th>
                <th className='px-6 py-4 whitespace-nowrap'>Date Generated</th>
                <th className='px-6 py-4 text-right whitespace-nowrap'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {studentFees.map((fee) => (
                <tr key={fee.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                    {fee?.student?.name}{" "}
                    <span className='text-xs text-gray-500'>
                      ({fee?.student?.rollNo})
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {fee?.feeDescription}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{fee?.month}</td>
                  <td className='px-6 py-4 font-bold text-gray-900 whitespace-nowrap'>
                    ${Number(fee?.amount).toFixed(2)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        fee?.status === "PAID"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                      {fee?.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-gray-500 whitespace-nowrap'>
                    {new Date(fee.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-right whitespace-nowrap'>
                    <div className='flex justify-end gap-2 text-gray-400'>
                      {fee.status !== "PAID" && (
                        <button
                          onClick={() => handleMarkPaid(fee.id)}
                          className='text-green-600 hover:text-green-800'
                          title='Mark as Paid'>
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(fee.id)}
                        className='hover:text-red-500'
                        title='Delete Record'>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {studentFees.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-8 text-center text-gray-500 italic'>
                    No fee records found. Assign a student to transport to see
                    generated fees.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
