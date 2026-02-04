import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as any;
      if (parsed.params) req.params = parsed.params as any;
      if (parsed.cookies) req.cookies = parsed.cookies as any;
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
