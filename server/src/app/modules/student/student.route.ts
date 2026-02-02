import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidation } from "./student.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudent,
);
router.get("/", StudentController.getAllStudents);

export const StudentRoutes: express.Router = router;
