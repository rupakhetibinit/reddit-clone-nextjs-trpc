import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      take: 15,
      include: {
        user: {
          select: { name: true },
        },
      },
    });
  }),
  createPost: protectedProcedure
    .input(
      z
        .object({
          title: z.string(),
          body: z.string(),
        })
        .required()
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this request",
        });
      }
      console.log(ctx.session.user);
      try {
        const post = await ctx.prisma.post.create({
          data: {
            body: input.body,
            title: input.title,
            userId: ctx.session.user.id,
          },
        });
        return post;
      } catch (error) {
        console.log(error);
        return null;
      }
    }),
  getPostsByUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      return posts;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        cause: error,
      });
    }
  }),
  getPostById: protectedProcedure
    .input(z.object({ id: z.string() }).required())
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: input.id,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        });
        return post;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
});
