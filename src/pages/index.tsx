import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Post from "@/components/Post";
import Head from "next/head";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { prisma } from "@/server/db/client";
import React from "react";
import type { Session } from "next-auth";
import type Posts from "@/types/Post";

export const getServerSideProps: GetServerSideProps<{
  posts: Posts[];
  isAuthed: boolean;
  session: Session | null;
}> = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  let isAuthed = false;
  if (session) {
    isAuthed = true;
  }

  const posts = await prisma.post.findMany({
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
    },
  });

  return {
    props: {
      posts: posts,
      isAuthed: isAuthed,
      session: session,
    },
  };
};

const Home = ({
  isAuthed,
  session,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen justify-center bg-gray-300">
        <section className="w-6/12 min-w-fit pt-16">
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </section>
      </main>
    </>
  );
};

export default Home;
