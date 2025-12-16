import { TriggerIntervals } from "@n8n/lib/enums/intervals";
import { z } from "zod";

const intervalKeys = Object.keys(TriggerIntervals) as [string, ...string[]];

export const scheduleTriggerSchema = z.object({
  interval: z.enum(intervalKeys),
});
