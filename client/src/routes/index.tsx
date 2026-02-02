import { createBrowserRouter } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../pages/Home";
import FeesMaster from "../pages/transport/FeesMaster";
import PickupPoints from "../pages/transport/PickupPoints";
import Vehicles from "../pages/transport/Vehicles";
import RoutesPage from "../pages/transport/Routes";
import Allocations from "../pages/transport/Allocations";
import StudentFees from "../pages/transport/StudentFees";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "transport/fees",
        element: <FeesMaster />,
      },
      {
        path: "transport/pickup-points",
        element: <PickupPoints />,
      },
      {
        path: "transport/vehicles",
        element: <Vehicles />,
      },
      {
        path: "transport/routes",
        element: <RoutesPage />,
      },
      {
        path: "transport/allocations",
        element: <Allocations />,
      },
      {
        path: "transport/student-fees",
        element: <StudentFees />,
      },
    ],
  },
]);
