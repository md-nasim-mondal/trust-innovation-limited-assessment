import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { StudentService } from "./student.service";

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.createStudent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student created successfully!",
    data: result,
  });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getAllStudents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully!",
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudents,
};
