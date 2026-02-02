import express from "express";
import { StudentRoutes } from "../modules/student/student.route";
import { TransportRoutes } from "../modules/transport/transport.route";

const router: express.Router = express.Router();

const moduleRoutes = [
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
