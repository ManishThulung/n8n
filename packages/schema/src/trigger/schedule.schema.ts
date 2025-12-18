import { TriggerIntervals } from "@n8n/lib/enums/intervals";
import { z } from "zod";

const intervalKeys = Object.values(TriggerIntervals) as [string, ...string[]];

export const scheduleTriggerSchema = z
  .object({
    interval: z.enum(intervalKeys),
    seconds: z.string().optional(),
    minutes: z.string().optional(),
    hours: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.interval === "seconds" && data.seconds == null) {
      ctx.addIssue({
        path: ["seconds"],
        message: "Seconds is required when interval is seconds",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.interval === "minutes" && data.minutes == null) {
      ctx.addIssue({
        path: ["minutes"],
        message: "Minutes is required when interval is minutes",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.interval === "hours" && data.hours == null) {
      ctx.addIssue({
        path: ["hours"],
        message: "Hours is required when interval is hours",
        code: z.ZodIssueCode.custom,
      });
    }
  });
