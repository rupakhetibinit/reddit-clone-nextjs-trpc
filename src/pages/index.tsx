import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import Post from "@/components/Post";
import Head from "next/head";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { prisma } from "@/server/db/client";
import React from "react";
import type { Session } from "next-auth";
import type Posts from "@/types/Post";
import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";
export const getServerSideProps: GetServerSideProps<{
  isAuthed: boolean;
  session: Session | null;
}> = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  let isAuthed = false;
  if (session) {
    isAuthed = true;
  }

  // const posts = await prisma.post.findMany({
  //   select: {
  //     body: true,
  //     id: true,
  //     title: true,
  //     user: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //     upvotedBy: {
  //       select: {
  //         id: true,
  //       },
  //     },
  //   },
  // });

  return {
    props: {
      // posts: posts,
      isAuthed: isAuthed,
      session: session,
    },
  };
};

const Home = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAuthed: _,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: posts, isLoading } = trpc.posts.getPosts.useQuery();
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex max-h-fit min-h-screen w-full justify-center bg-gray-300">
        <Layout isAuthed={!!session}>
          <Suspense fallback={<div>Loading...</div>}>
            <section className="w-6/12 min-w-fit pt-16">
              {posts?.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </section>
          </Suspense>
        </Layout>
      </main>
    </>
  );
};

export default Home;
