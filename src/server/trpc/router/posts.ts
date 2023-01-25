import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 15,
      include: {
        user: {
          select: { name: true },
        },
        upvotedBy: {
          select: { id: true },
        },
      },
    });
    return posts;
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
  upvotePostById: protectedProcedure
    .input(z.object({ postId: z.string(), userId: z.string() }).required())
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.findFirst({
          where: {
            id: input.postId,
          },
          include: {
            upvotedBy: {
              where: {
                id: input.userId,
              },
            },
            _count: {
              select: {
                upvotedBy: true,
              },
            },
          },
        });
        console.log(post);
        if (post?.upvotedBy.length === 0) {
          const thing = await ctx.prisma.post.update({
            where: {
              id: input.postId,
            },
            select: {
              _count: {
                select: {
                  upvotedBy: true,
                },
              },
            },
            data: {
              upvotedBy: {
                connect: {
                  id: input.userId,
                },
              },
            },
          });
          return {
            thing,
            upvoted: true,
          };
        }
        if (post?.upvotedBy.length === 1) {
          const thing = await prisma?.post.update({
            where: {
              id: input.postId,
            },
            select: {
              _count: {
                select: {
                  upvotedBy: true,
                },
              },
            },
            data: {
              upvotedBy: {
                disconnect: {
                  id: input.userId,
                },
              },
            },
          });
          return {
            upvoted: false,
          };
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
});
