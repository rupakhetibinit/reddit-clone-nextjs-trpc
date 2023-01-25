// import { httpBatchLink, loggerLink } from "@trpc/client";
// import { createTRPCNext } from "@trpc/next";
// import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
// import superjson from "superjson";

// import { type AppRouter } from "../server/trpc/router/_app";

// const getBaseUrl = () => {
//   if (typeof window !== "undefined") return ""; // browser should use relative url
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
//   return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
// };

// export const trpc = createTRPCNext<AppRouter>({
//   config() {
//     return {
//       transformer: superjson,
//       links: [
//         loggerLink({
//           enabled: (opts) =>
//             process.env.NODE_ENV === "development" ||
//             (opts.direction === "down" && opts.result instanceof Error),
//         }),
//         httpBatchLink({
//           url: `${getBaseUrl()}/api/trpc`,
//         }),
//       ],
//     };
//   },
//   ssr: false,
// });

// /**
//  * Inference helper for inputs
//  * @example type HelloInput = RouterInputs['example']['hello']
//  **/
// export type RouterInputs = inferRouterInputs<AppRouter>;
// /**
//  * Inference helper for outputs
//  * @example type HelloOutput = RouterOutputs['example']['hello']
//  **/
// export type RouterOutputs = inferRouterOutputs<AppRouter>;

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { TrpcQueryOptionsForUseQueries } from "@trpc/react-query/dist/internals/useQueries";
import { useState } from "react";
import superjson from "superjson";
import type { AppRouter } from "../server/trpc/router/_app";

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function ClientProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
