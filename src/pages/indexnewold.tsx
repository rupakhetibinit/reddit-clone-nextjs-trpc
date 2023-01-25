import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import Search from "../components/Search";
import TwoIconPopover from "../components/TwoIconPopover";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import {
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import {
  UserIcon,
  ChevronDownIcon,
  ChatBubbleBottomCenterIcon,
  ShareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { prisma } from "../server/db/client";
import clsx from "clsx";
import Post from "../components/Post";
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
  const { mutateAsync } = trpc.posts.upvotePostById.useMutation();
  const userSession = useSession();
  console.log(userSession);
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-fit w-full justify-center pt-16">
        {posts?.map((props) => (
          <Post key={props.id} {...props} />
        ))}
      </section>
    </>
  );
}
