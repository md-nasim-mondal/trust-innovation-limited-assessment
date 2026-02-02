import express from "express";
import { StudentRoutes } from "../modules/student/student.route";
import { TransportRoutes } from "../modules/transport/transport.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

const router: express.Router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/transport",
    route: TransportRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
