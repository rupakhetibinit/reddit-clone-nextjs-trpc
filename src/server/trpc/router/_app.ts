import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { postsRouter } from "./posts";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
