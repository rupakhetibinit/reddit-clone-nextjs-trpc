import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userAgent } from "next/server";
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
  addCommentToPost: protectedProcedure
    .input(z.object({ postId: z.string(), body: z.string() }).required())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this request",
        });
      }
      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body: input.body,
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        });
        return comment;
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
  getPostById: publicProcedure
    .input(z.object({ id: z.string() }).required())
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.findFirst({
          where: {
            id: input.id,
          },
          select: {
            body: true,
            id: true,
            title: true,
            user: {
              select: {
                name: true,
              },
            },
            upvotedBy: {
              select: {
                id: true,
              },
            },
            downvotedBy: {
              select: { id: true },
            },
            comments: {
              select: {
                body: true,
                id: true,
                User: true,
              },
            },
            _count: {
              select: {
                comments: true,
                upvotedBy: true,
                downvotedBy: true,
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
    .input(z.object({ postId: z.string() }).required())
    .mutation(async ({ ctx, input }) => {
      try {
        //check if post is upvoted
        const upvotedPostCheck = await ctx.prisma.post.findFirst({
          where: {
            id: input.postId,
            upvotedBy: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        //check if post is downvoted
        const downvotePostCheck = await prisma?.post.findFirst({
          where: {
            id: input.postId,
            downvotedBy: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        // if post is downvoted then remove it from downvote and upvote it
        if (downvotePostCheck !== null) {
          const removeDownvotePost = ctx.prisma.post.update({
            where: {
              id: input.postId,
            },
            data: {
              downvotedBy: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
              upvotedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
          return removeDownvotePost;
        }

        // if post is not upvoted, upvote it
        if (upvotedPostCheck === null) {
          const upvotePost = await ctx.prisma.post.update({
            data: {
              upvotedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
            where: {
              id: input.postId,
            },
          });
          return upvotePost;
        }
        // if post is upvoted, remove it

        if (upvotedPostCheck !== null) {
          const removeUpvotePost = await ctx.prisma.post.update({
            where: {
              id: input.postId,
            },
            data: {
              upvotedBy: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
          return removeUpvotePost;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
  downvotePostById: protectedProcedure
    .input(z.object({ postId: z.string() }).required())
    .mutation(async ({ ctx, input }) => {
      try {
        //check if post is upvoted
        const upvotedPostCheck = await ctx.prisma.post.findFirst({
          where: {
            id: input.postId,
            upvotedBy: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        //check if post is downvoted
        const downvotePostCheck = await prisma?.post.findFirst({
          where: {
            id: input.postId,
            downvotedBy: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        // if post is upvoted then remove it from upvote and downvote it
        if (upvotedPostCheck !== null) {
          const addDownvotePost = ctx.prisma.post.update({
            where: {
              id: input.postId,
            },
            data: {
              downvotedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              upvotedBy: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
          return addDownvotePost;
        }

        // if post is not downvoted, downvote it
        if (downvotePostCheck === null) {
          const upvotePost = await ctx.prisma.post.update({
            data: {
              downvotedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
            where: {
              id: input.postId,
            },
          });
          return upvotePost;
        }
        // if post is downvoted, remove it

        if (downvotePostCheck !== null) {
          const removeUpvotePost = await ctx.prisma.post.update({
            where: {
              id: input.postId,
            },
            data: {
              downvotedBy: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
          return removeUpvotePost;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
  getPosts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      select: {
        body: true,
        id: true,
        title: true,
        user: {
          select: {
            name: true,
          },
        },
        upvotedBy: {
          select: {
            id: true,
          },
        },
        downvotedBy: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            upvotedBy: true,
            downvotedBy: true,
          },
        },
      },
    });
  }),
  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }).required())
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.prisma.comment.findFirst({
          where: {
            id: input.id,
          },
        });
        if (!comment) return;
        if (comment.userId === ctx.session.user.id) {
          await ctx.prisma.comment.delete({
            where: {
              id: input.id,
            },
          });
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
