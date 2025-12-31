import { HttpMethods } from "@n8n/lib/enums/intervals";
import { z } from "zod";

const keys = Object.values(HttpMethods) as [string, ...string[]];

export const httpActionSchema = z
  .object({
    method: z.enum(keys),
    url: z.string(),
    body: z.string().optional(),
    query: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method == "POST" && data.body == null) {
      ctx.addIssue({
        path: ["body"],
        message: "Body is required when using post method",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const emailActionSchema = z.object({
  subject: z.string(),
  to: z.string(),
  body: z.string(),
});
