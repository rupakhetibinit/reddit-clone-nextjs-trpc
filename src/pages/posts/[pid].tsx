import Layout from "@/components/Layout";
import Post from "@/components/Post";
import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense, useState } from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { trpc } from "../../utils/trpc";

const SinglePost = () => {
  const session = useSession();
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.posts.addCommentToPost.useMutation();
  const router = useRouter();
  const { pid } = router.query;
  const [comment, setComment] = useState("");
  const { data: post } = trpc.posts.getPostById.useQuery({
    id: pid as string,
  });
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen justify-center bg-gray-300">
        <Layout isAuthed={!!session}>
          <div className="flex w-6/12 flex-col items-center pt-20">
            <Suspense fallback={<div>Loading...</div>}>
              <div
                key={post?.id}
                className="my-4 flex w-full flex-row rounded-sm bg-white"
              >
                <div className="-z-1 flex flex-col items-center gap-y-1 bg-gray-100 p-2">
                  <ImArrowUp className={clsx("h-6 w-6 text-gray-400")} />
                  <span className="text-sm font-bold">Vote</span>
                  <ImArrowDown className="h-6 w-6 text-gray-400 " />
                </div>
                <div className="flex-col px-4 py-2">
                  <h6 className="text-xs font-normal text-gray-500">
                    Posted by {session.data?.user?.name}
                  </h6>
                  <h3 className="text-lg font-semibold">{post?.title}</h3>
                  <p className="pb-2 text-sm">{post?.body}</p>
                  <div className="flex gap-x-5">
                    <Link
                      href={`/posts/${post?.id}`}
                      className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200"
                    >
                      <ChatBubbleBottomCenterIcon className="h-4 w-4" />
                      <span className="prose-none">Comments</span>
                    </Link>
                    <button className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200">
                      <ShareIcon className="h-4 w-4" />
                      <span className="prose-none">Share</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-end">
                <textarea
                  className="flex h-24 w-full resize-none bg-gray-200 p-4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="px-4 py-2">
                  <button
                    onClick={async () => {
                      if (comment.length !== 0) {
                        const thing = await mutateAsync({
                          body: comment,
                          postId: pid as string,
                        });
                        if (!!thing) {
                          setComment("");
                          utils.posts.getPostById.invalidate();
                        }
                      }
                    }}
                    className="rounded-md bg-orange-500 px-4 py-2 hover:bg-orange-400"
                  >
                    Comment
                  </button>
                </div>
              </div>
              <div className="w-full">
                {post?.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="my-2 flex-col bg-white px-4 py-2"
                  >
                    <h6 className="text-xs font-normal text-gray-500">
                      Commented by {comment.User.name}
                    </h6>
                    <p className="text-sm">{comment.body}</p>
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default SinglePost;
