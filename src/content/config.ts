import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    citations: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          authors: z.string().optional(),
          year: z.union([z.string(), z.number()]).optional(),
          url: z.string().url()
        })
      )
      .default([]),
    draft: z.boolean().default(false)
  })
});

const resume = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string().url()
      })
    )
  })
});

export const collections = { blog, resume };
