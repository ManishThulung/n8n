import { TriggerIntervals } from "@n8n/lib/enums/intervals";
import { z } from "zod";

const intervalKeys = Object.values(TriggerIntervals) as [string, ...string[]];

const intervalRanges = {
  minutes: { min: 1, max: 59 },
  hours: { min: 1, max: 23 },
  weeks: { min: 1, max: 4 },
  months: { min: 1, max: 11 },
} as const;

export const scheduleTriggerSchema = z
  .object({
    interval: z.enum(intervalKeys),
    minutes: z.string().optional(),
    hours: z.string().optional(),
    days: z.string().optional(),
    weeks: z.string().optional(),
    months: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { interval } = data;

    // Map interval → corresponding field
    const value = data[interval as keyof typeof data];

    // Required check
    if (value == null || value === "") {
      ctx.addIssue({
        path: [interval],
        message: `${interval} is required when interval is ${interval}`,
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    // Numeric check
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      ctx.addIssue({
        path: [interval],
        message: `${interval} must be a number`,
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    // Range validation (skip days if you don’t want range yet)
    if (interval in intervalRanges) {
      const { min, max } =
        intervalRanges[interval as keyof typeof intervalRanges];

      if (numericValue < min || numericValue > max) {
        ctx.addIssue({
          path: [interval],
          message: `${interval} must be between ${min} and ${max}`,
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

// export const scheduleTriggerSchema = z
//   .object({
//     interval: z.enum(intervalKeys),
//     minutes: z.string().optional(),
//     hours: z.string().optional(),
//     days: z.string().optional(),
//     weeks: z.string().optional(),
//     months: z.string().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.interval === "days" && data.days == null) {
//       ctx.addIssue({
//         path: ["days"],
//         message: "Days is required when interval is days",
//         code: z.ZodIssueCode.custom,
//       });
//     }

//     if (data.interval === "minutes" && data.minutes == null) {
//       ctx.addIssue({
//         path: ["minutes"],
//         message: "Minutes is required when interval is minutes",
//         code: z.ZodIssueCode.custom,
//       });
//     }

//     if (data.interval === "hours" && data.hours == null) {
//       ctx.addIssue({
//         path: ["hours"],
//         message: "Hours is required when interval is hours",
//         code: z.ZodIssueCode.custom,
//       });
//     }
//     if (data.interval === "weeks" && data.weeks == null) {
//       ctx.addIssue({
//         path: ["weeks"],
//         message: "Weeks is required when interval is weeks",
//         code: z.ZodIssueCode.custom,
//       });
//     }
//     if (data.interval === "months" && data.months == null) {
//       ctx.addIssue({
//         path: ["months"],
//         message: "Months is required when interval is months",
//         code: z.ZodIssueCode.custom,
//       });
//     }
//   });
