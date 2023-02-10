import Layout from "@/components/Layout";
import Error from "next/error";
import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense, useMemo, useState } from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { trpc } from "../../utils/trpc";
import { ToastContainer, toast } from "react-toastify";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/rpc";

const SinglePost = () => {
  const session = useSession();
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.posts.addCommentToPost.useMutation({
    // onError(error, _variables, _context) {
    //   if (error.shape?.code === TRPC_ERROR_CODES_BY_KEY["UNAUTHORIZED"]) {
    //     return toast("You are not logged in", {});
    //   }
    // },
  });
  const router = useRouter();
  const pid = router.query["pid"];
  const [comment, setComment] = useState("");
  const { data: post, isLoading } = trpc.posts.getPostById.useQuery({
    id: pid as string,
  });

  const { mutateAsync: upvotePost } = trpc.posts.upvotePostById.useMutation({
    // onError(error) {
    //   if (error.shape?.code === TRPC_ERROR_CODES_BY_KEY["UNAUTHORIZED"]) {
    //     return toast("You are not logged in", {});
    //   }
    // },
  });
  const { mutateAsync: mutateD } = trpc.posts.downvotePostById.useMutation({
    // onError(error) {
    //   if (error.shape?.code === TRPC_ERROR_CODES_BY_KEY["UNAUTHORIZED"]) {
    //     return toast("You are not logged in", {});
    //   }
    // },
  });
  const isUpvoted = useMemo(() => {
    return post?.upvotedBy.filter((i) => i.id === session.data?.user?.id)
      .length !== 0
      ? true
      : false;
  }, [post?.upvotedBy, session.data?.user?.id]);
  const isDownvoted = useMemo(() => {
    return post?.downvotedBy.filter((i) => i.id === session.data?.user?.id)
      .length !== 0
      ? true
      : false;
  }, [post?.downvotedBy, session.data?.user?.id]);
  if (!router.isReady || isLoading) {
    return null;
  }
  if (post === null || undefined) {
    return <Error statusCode={404} />;
  }
  const upvotes =
    (post?._count?.upvotedBy as number) - (post?._count.downvotedBy as number);
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen justify-center bg-gray-300">
        <Layout isAuthed={!!session.data}>
          <div className="flex w-6/12 flex-col items-center pt-20">
            <Suspense fallback={<div>Loading...</div>}>
              <div
                key={post?.id}
                className="my-4 flex w-full flex-row rounded-sm bg-white"
              >
                <div className="-z-1 flex flex-col items-center gap-y-1 bg-gray-100 p-2">
                  <ImArrowUp
                    onClick={async () => {
                      if (session.data !== null) {
                        try {
                          await upvotePost({
                            postId: pid as string,
                          });

                          await utils.invalidate();
                        } catch (error) {}
                      }
                    }}
                    className={clsx(
                      "h-6 w-6 cursor-pointer hover:text-orange-400",
                      isUpvoted ? "text-orange-500" : "text-gray-400"
                    )}
                  />
                  <span className="text-sm font-bold">
                    {upvotes === 0 ? "Vote" : upvotes.toString()}
                  </span>
                  <ImArrowDown
                    onClick={async () => {
                      if (session.data !== null) {
                        try {
                          await mutateD({
                            postId: pid as string,
                          });
                          await utils.invalidate();
                        } catch (error) {}
                      }
                    }}
                    className={clsx(
                      "h-6 w-6 cursor-pointer hover:text-orange-400",
                      isDownvoted ? "text-orange-500" : "text-gray-400"
                    )}
                  />
                </div>
                <div className="flex-col px-4 py-2">
                  <h6 className="text-xs font-normal text-gray-500">
                    Posted by {post?.user.name}
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
                      if (
                        comment.length !== 0 ||
                        session.data !== null ||
                        undefined
                      ) {
                        try {
                          const thing = await mutateAsync({
                            body: comment,
                            postId: pid as string,
                          });
                          if (!!thing) {
                            setComment("");
                            utils.posts.getPostById.invalidate();
                          }
                        } catch (error) {}
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
