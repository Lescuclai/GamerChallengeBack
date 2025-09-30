import { z } from "zod"

export const entrySchema = z.object({
  title: z
    .string()
    .min(5)
    .refine((val) => !/<script.*?>.*?<\/script>/i.test(val)),
  video_url: z.url().refine((val) => !/<script.*?>.*?<\/script>/i.test(val)),
})
