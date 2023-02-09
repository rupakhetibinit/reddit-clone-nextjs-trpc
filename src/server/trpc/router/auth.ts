import { TRPCError } from "@trpc/server";
import { Input } from "postcss";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
    return profile;
  }),
  updateProfile: protectedProcedure
    .input(z.object({ name: z.string() }).required())
    .mutation(async ({ ctx, input }) => {
      try {
        const profile = await prisma?.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            id: input.name,
          },
        });
        return profile;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
});
