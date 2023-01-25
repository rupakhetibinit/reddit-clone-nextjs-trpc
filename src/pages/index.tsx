import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Post from "../components/Post";
import Head from "next/head";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { prisma } from "../server/db/client";
import Layout from "../components/Layout";
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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

export default function Home({
  isAuthed,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen justify-center bg-gray-300">
        <Layout isAuthed={isAuthed}>
          <section className="w-6/12 min-w-fit pt-16">
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </section>
        </Layout>
      </main>
    </>
  );
}
