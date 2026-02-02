import { z } from "zod";

const createStudentZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    rollNo: z.string().min(1, "Roll No is required"),
    grade: z.string().min(1, "Grade is required"),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const StudentValidation = {
  createStudentZodSchema,
};
