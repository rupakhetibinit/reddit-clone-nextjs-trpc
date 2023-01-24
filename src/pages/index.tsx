import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import Search from "../components/Search";
import TwoIconPopover from "../components/TwoIconPopover";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import {
  ArrowDownIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import {
  UserIcon,
  ChevronDownIcon,
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
interface Props {
  props: {
    post: Post[] | undefined;
    session: Session | null;
    isAuthed: boolean;
  };
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);
  let isAuthed = false;
  if (session) {
    isAuthed = true;
  }

  const posts = await prisma?.post.findMany({
    select: {
      body: true,
      id: true,
      title: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  console.log(posts);

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
      <main className="flex h-screen w-screen justify-center bg-gray-300">
        <header className="fixed flex w-full items-center justify-between gap-2 bg-white py-2 px-4">
          <div className="flex gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              viewBox="0 0 20 20"
            >
              <g>
                <circle fill="#FF4500" cx="10" cy="10" r="10"></circle>
                <path
                  fill="#FFF"
                  d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"
                ></path>
              </g>
            </svg>
            <svg
              className="hidden h-10 w-14 md:inline"
              viewBox="0 0 57 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#1c1c1c">
                <path d="M54.63,16.52V7.68h1a1,1,0,0,0,1.09-1V6.65a1,1,0,0,0-.93-1.12H54.63V3.88a1.23,1.23,0,0,0-1.12-1.23,1.2,1.2,0,0,0-1.27,1.11V5.55h-1a1,1,0,0,0-1.09,1v.07a1,1,0,0,0,.93,1.12h1.13v8.81a1.19,1.19,0,0,0,1.19,1.19h0a1.19,1.19,0,0,0,1.25-1.12A.17.17,0,0,0,54.63,16.52Z"></path>
                <circle fill="#FF4500" cx="47.26" cy="3.44" r="2.12"></circle>
                <path d="M48.44,7.81a1.19,1.19,0,1,0-2.38,0h0v8.71a1.19,1.19,0,0,0,2.38,0Z"></path>
                <path d="M30.84,1.19A1.19,1.19,0,0,0,29.65,0h0a1.19,1.19,0,0,0-1.19,1.19V6.51a4.11,4.11,0,0,0-3-1.21c-3.1,0-5.69,2.85-5.69,6.35S22.28,18,25.42,18a4.26,4.26,0,0,0,3.1-1.23,1.17,1.17,0,0,0,1.47.8,1.2,1.2,0,0,0,.85-1.05ZM25.41,15.64c-1.83,0-3.32-1.77-3.32-4s1.48-4,3.32-4,3.31,1.78,3.31,4-1.47,3.95-3.3,3.95Z"></path>
                <path d="M43.28,1.19A1.19,1.19,0,0,0,42.09,0h0a1.18,1.18,0,0,0-1.18,1.19h0V6.51a4.15,4.15,0,0,0-3-1.21c-3.1,0-5.69,2.85-5.69,6.35S34.72,18,37.86,18A4.26,4.26,0,0,0,41,16.77a1.17,1.17,0,0,0,1.47.8,1.19,1.19,0,0,0,.85-1.05ZM37.85,15.64c-1.83,0-3.31-1.77-3.31-4s1.47-4,3.31-4,3.31,1.78,3.31,4-1.47,3.95-3.3,3.95Z"></path>
                <path d="M17.27,12.44a1.49,1.49,0,0,0,1.59-1.38v-.15a4.81,4.81,0,0,0-.1-.85A5.83,5.83,0,0,0,13.25,5.3c-3.1,0-5.69,2.85-5.69,6.35S10.11,18,13.25,18a5.66,5.66,0,0,0,4.39-1.84,1.23,1.23,0,0,0-.08-1.74l-.11-.09a1.29,1.29,0,0,0-1.58.17,3.91,3.91,0,0,1-2.62,1.12A3.54,3.54,0,0,1,10,12.44h7.27Zm-4-4.76a3.41,3.41,0,0,1,3.09,2.64H10.14A3.41,3.41,0,0,1,13.24,7.68Z"></path>
                <path d="M7.68,6.53a1.19,1.19,0,0,0-1-1.18A4.56,4.56,0,0,0,2.39,6.91V6.75A1.2,1.2,0,0,0,0,6.75v9.77a1.23,1.23,0,0,0,1.12,1.24,1.19,1.19,0,0,0,1.26-1.1.66.66,0,0,0,0-.14v-5A3.62,3.62,0,0,1,5.81,7.7a4.87,4.87,0,0,1,.54,0h.24A1.18,1.18,0,0,0,7.68,6.53Z"></path>
              </g>
            </svg>
          </div>

          {/* Home Icon */}
          <TwoIconPopover
            LeftIcon={HomeIcon}
            RightIcon={ChevronDownIcon}
            middleContent={
              <span className="hidden sm:mr-12 sm:inline">Home</span>
            }
          >
            <div className="h-full w-40 rounded-sm bg-white p-2 text-black">
              Feed
              <div className="flex flex-col">
                <span>Hello</span>
                <span>World</span>
              </div>
            </div>
          </TwoIconPopover>
          <Search />

          <nav>
            <ul>
              <li className="hidden rounded-full bg-orange-600 px-4 py-2 font-bold text-white md:inline">
                <Link href={isAuthed ? "api/auth/signout" : "api/auth/signin"}>
                  {isAuthed ? "Sign Out" : "Sign In"}
                </Link>
              </li>
            </ul>
          </nav>
          <TwoIconPopover
            LeftIcon={UserIcon}
            RightIcon={ChevronDownIcon}
            middleContent={
              <div className="text-black">{userSession.data?.user?.name}</div>
            }
          >
            <div className="h-full w-40 rounded-sm bg-white p-2">
              <ul>
                <li className="flex items-center px-1">
                  {isAuthed && <ArrowLeftOnRectangleIcon className="h-8 w-8" />}
                  {!isAuthed && (
                    <ArrowRightOnRectangleIcon className="h-8 w-8" />
                  )}

                  <Link
                    href={isAuthed ? "api/auth/signout" : "api/auth/signin"}
                  >
                    {isAuthed ? "Sign Out" : "Sign In"}
                  </Link>
                </li>
              </ul>
            </div>
          </TwoIconPopover>
        </header>
        <section className="h-full w-auto pt-16">
          {posts?.map(({ user, body, id, title }) => (
            <div
              key={id}
              className="prose my-4 flex w-full flex-row rounded-sm bg-white pr-12"
            >
              <div className="-z-1 flex flex-col items-center gap-y-1 bg-gray-100 p-2">
                <BiUpvote
                  onClick={() =>
                    mutateAsync({
                      userId: userSession.data?.user?.id as string,
                      postId: id,
                    })
                  }
                  className="h-6 w-6"
                />
                <span></span>
                <div className="text-sm font-bold">Vote</div>
                <BiDownvote className="h-6 w-6" />
              </div>
              <div className="flex flex-col px-4">
                <h6 className="prose">Posted by {user?.name}</h6>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="flex items-center justify-around">
                  <div className="flex items-center gap-x-2">
                    <ChatBubbleBottomCenterIcon className="h-4 w-4" />
                    <span className="prose-none">Comment</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <ShareIcon className="h-4 w-4" />
                    <span className="prose-none">Share</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
