import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const resumeRouter = createTRPCRouter({

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // get by slug
  getResumeBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }: { ctx: any; input: string }) => {
    const resume = await ctx.db.resume.findFirst({
      where: { slug: input },
    });

    return resume ?? null;
  }),

  // create resume (unprotected)

});
