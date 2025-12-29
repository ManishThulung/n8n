import z from "zod";

export const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    nodeType: z.enum(["Action", "Trigger"]),
    metadata: z.any(),
    lable: z.string().optional(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  animated: z.boolean(),
});
