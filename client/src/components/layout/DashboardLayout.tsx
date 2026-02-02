import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Bus,
  MapPin,
  Route,
  TicketCheck,
  Users,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transport Fees", href: "/transport/fees", icon: TicketCheck },
    { name: "Pickup Points", href: "/transport/pickup-points", icon: MapPin },
    { name: "Vehicles", href: "/transport/vehicles", icon: Bus },
    { name: "Routes", href: "/transport/routes", icon: Route },
    { name: "Allocations", href: "/transport/allocations", icon: Users },
    { name: "Student Fees", href: "/transport/student-fees", icon: CreditCard },
    { name: "Students", href: "/students", icon: Users },
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
        )}>
        <div className='flex h-16 items-center justify-between px-4 bg-slate-950'>
          <h1 className='text-xl font-bold tracking-wider'>SCHOOL MS</h1>
          <button onClick={() => setSidebarOpen(false)} className='md:hidden'>
            <X size={24} />
          </button>
        </div>

        <nav className='flex-1 space-y-1 px-2 py-4'>
          <div className='px-3 mb-2 text-xs font-semibold uppercase text-slate-400'>
            Transport Module
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)} // Auto-close on link click (mobile mainly)
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                )}>
                <item.icon className='h-5 w-5 shrink-0' />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <header className='flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm'>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className='text-gray-500 hover:text-gray-700 md:hidden'>
            <Menu size={24} />
          </button>
          <div className='flex items-center gap-4'>
            {/* User Profile etc could go here */}
            <div className='h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold'>
              A
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
