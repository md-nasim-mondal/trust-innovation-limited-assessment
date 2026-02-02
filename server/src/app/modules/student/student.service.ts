import { prisma } from "../../../shared/prisma";
import { Student, Prisma } from "@prisma/client";

const createStudent = async (
  data: Prisma.StudentCreateInput,
): Promise<Student> => {
  const result = await prisma.student.create({
    data,
  });
  return result;
};

const getAllStudents = async (): Promise<Student[]> => {
  const result = await prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const StudentService = {
  createStudent,
  getAllStudents,
};
