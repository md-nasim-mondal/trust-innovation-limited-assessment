import { useEffect, useState, useCallback } from "react";
import api from "../lib/axios";
import {
  Users,
  Bus,
  Route,
  CreditCard,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalVehicles: number;
  totalRoutes: number;
  activeAllocations: number;
  pendingFeesCount: number;
  totalPendingAmount: string | number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/transport/stats");
      setStats(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchStats();
    };
    init();
  }, [fetchStats]);

  const cards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "bg-blue-500",
      description: "Registered students",
    },
    {
      title: "Active Transport Users",
      value: stats?.activeAllocations || 0,
      icon: UserCheck,
      color: "bg-emerald-500",
      description: "Students with transport",
    },
    {
      title: "Fleet Size",
      value: stats?.totalVehicles || 0,
      icon: Bus,
      color: "bg-indigo-500",
      description: "Total vehicles",
    },
    {
      title: "Total Routes",
      value: stats?.totalRoutes || 0,
      icon: Route,
      color: "bg-purple-500",
      description: "Active routes",
    },
    {
      title: "Pending Fee Records",
      value: stats?.pendingFeesCount || 0,
      icon: CreditCard,
      color: "bg-amber-500",
      description: "Unpaid fee assignments",
    },
    {
      title: "Outstanding Amount",
      value: `$${Number(stats?.totalPendingAmount || 0).toLocaleString()}`,
      icon: CreditCard,
      color: "bg-rose-500",
      description: "Total pending fees",
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-indigo-100 rounded-lg text-indigo-700'>
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-sm text-gray-500'>
            Overview of School Transport System
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {cards.map((card, index) => (
          <div
            key={index}
            className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md'>
            <div className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    {card.title}
                  </p>
                  <p className='mt-2 text-3xl font-bold text-gray-900'>
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color} text-white shadow-md`}>
                  <card.icon size={24} />
                </div>
              </div>
              <div className='mt-4 flex items-center'>
                <span className='text-xs font-medium text-gray-400'>
                  {card.description}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='rounded-xl border border-gray-200 bg-linear-to-br from-indigo-500 to-purple-600 p-6 text-white'>
          <h3 className='text-lg font-bold'>Quick Actions</h3>
          <p className='mb-6 opacity-90 text-sm'>Common tasks to get started</p>
          <div className='grid grid-cols-2 gap-3'>
            <a
              href='/students'
              className='rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors'>
              Add New Student
            </a>
            <a
              href='/transport/allocations'
              className='rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors'>
              Allocate Transport
            </a>
            <a
              href='/transport/vehicles'
              className='rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors'>
              Manage Vehicles
            </a>
            <a
              href='/transport/routes'
              className='rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors'>
              Manage Routes
            </a>
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>
            System Status
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between py-2 border-b border-gray-100'>
              <span className='text-sm text-gray-600'>Database Connection</span>
              <span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700'>
                <span className='h-2 w-2 rounded-full bg-green-500'></span>
                Active
              </span>
            </div>
            <div className='flex items-center justify-between py-2 border-b border-gray-100'>
              <span className='text-sm text-gray-600'>Auto-Fee Generation</span>
              <span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700'>
                <span className='h-2 w-2 rounded-full bg-green-500'></span>
                Enabled
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span className='text-sm text-gray-600'>Last Updated</span>
              <span className='text-xs font-medium text-gray-500'>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
