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
import { Suspense, useMemo, useRef, useState } from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { trpc } from "../../utils/trpc";
import type { User } from "@prisma/client";
import { Dialog } from "@headlessui/react";
import { AiFillDelete, AiFillEdit, AiFillSave } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SinglePost = () => {
  const [editing, setEditing] = useState(false);
  const session = useSession();
  const utils = trpc.useContext();
  const { mutateAsync: mutateAsyncEditPost } =
    trpc.posts.editPost.useMutation();
  const { mutateAsync: mutateAsyncDeletePost, error } =
    trpc.posts.deletePost.useMutation();
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
  const isEditableByUser = useMemo(() => {
    return session?.data?.user?.id === post?.user.id ? true : false;
  }, [post, session.data]);

  const [editedBody, setEditedBody] = useState<string | undefined>(post?.body);

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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  if (!router.isReady || isLoading) {
    return null;
  }
  if (post === null || undefined) {
    return <Error statusCode={404} />;
  }
  const handleEdit = async () => {
    if (editing) {
      try {
        await mutateAsyncEditPost({
          id: post?.id as string,
          body: editedBody as string,
        });
        await utils.posts.getPostById.invalidate();
        await utils.invalidate();
        setEditing(false);
      } catch (error) {}
    }
    if (!editing) {
      setEditing(true);
    }
  };
  const upvotes =
    (post?._count?.upvotedBy as number) - (post?._count.downvotedBy as number);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-screen w-full justify-center bg-gray-300">
        <Layout isAuthed={!!session.data}>
          <div className="flex w-6/12 min-w-fit flex-col items-center pt-20">
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
                  <textarea
                    disabled={!editing || !isEditableByUser || !session.data}
                    onChange={(e) => setEditedBody(e.target.value)}
                    className="w-full resize-none bg-white pb-2 text-sm text-black"
                    defaultValue={post?.body}
                  >
                    {/* {post?.body} */}
                  </textarea>
                  <div className="flex gap-x-5">
                    <Link
                      href={`/posts/${post?.id}`}
                      className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200"
                    >
                      <ChatBubbleBottomCenterIcon className="h-4 w-4" />
                      <span className="prose-none">Comments</span>
                    </Link>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `${origin}/posts/${post?.id}`
                        );
                        toast("Copied to clipboard", {
                          hideProgressBar: true,
                          autoClose: 2000,
                          type: "success",
                        });
                      }}
                      className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200"
                    >
                      <ShareIcon className="h-4 w-4" />
                      <span className="prose-none">Share</span>
                    </button>
                    <button
                      disabled={!session.data || !isEditableByUser}
                      onClick={handleEdit}
                      className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200"
                    >
                      {!editing ? (
                        <AiFillEdit className="h-4 w-4" />
                      ) : (
                        <AiFillSave className="h-4 w-4" />
                      )}
                      <span className="prose-none">
                        {editing ? "Save" : "Edit"}
                      </span>
                    </button>
                    <button
                      disabled={!isEditableByUser || !session.data}
                      onClick={() => setIsDeleteOpen(true)}
                      className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200"
                    >
                      <AiFillDelete className="h-4 w-4" />
                      <span className="prose-none">Delete</span>
                    </button>
                    <div className="relative z-50">
                      <Dialog
                        className="absolute top-[25%] left-[25%] w-1/2"
                        open={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                      >
                        <div
                          className="fixed inset-0 bg-black/30"
                          aria-hidden="true"
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                          <Dialog.Panel className="bg-white p-8">
                            <Dialog.Title className="text-md font-bold">
                              Delete post
                            </Dialog.Title>
                            <Dialog.Description className="mb-4">
                              This will permanently delete your post
                            </Dialog.Description>
                            <button
                              className="mr-4 rounded-md bg-green-400 px-4 py-2 text-white hover:bg-green-600"
                              onClick={() => setIsDeleteOpen(false)}
                            >
                              Cancel
                            </button>
                            <button
                              className="rounded-md bg-red-400 px-4 py-2 text-white hover:bg-red-600 "
                              onClick={async () => {
                                await mutateAsyncDeletePost({
                                  postId: post?.id as string,
                                });
                                if (!error) {
                                  await utils.invalidate();
                                  setIsDeleteOpen(false);
                                  router.replace("/");
                                }
                              }}
                            >
                              Delete
                            </button>
                          </Dialog.Panel>
                        </div>
                      </Dialog>
                    </div>
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
                  <Comment key={comment.id} {...comment} />
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

export const Comment = ({
  User,
  id,
  body,
}: {
  User: User;
  id: string;
  body: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(body);
  const session = useSession();
  const utils = trpc.useContext();
  const { mutateAsync, error } = trpc.posts.deleteComment.useMutation();
  const { mutateAsync: mutateAsyncEditComment } =
    trpc.posts.editComment.useMutation();
  const isEditableByUser = useMemo(() => {
    return session.data?.user?.id === User.id ? true : false;
  }, [User, session.data]);
  const editRef = useRef<HTMLTextAreaElement | null>(null);
  const handleEdit = async () => {
    if (isEditing) {
      try {
        await mutateAsyncEditComment({ id: id, body: editedBody });

        await utils.invalidate();
        setIsEditing(false);
      } catch (error) {}
    }
    if (!isEditing) {
      setIsEditing(true);
      editRef.current?.focus();
    }
  };

  return (
    <>
      <div key={id} className="my-2 flex-col bg-white px-4 py-2">
        <h6 className="text-xs font-normal text-gray-500">
          Commented by {User.name}
        </h6>
        <textarea
          ref={editRef}
          autoFocus={true}
          disabled={!isEditing}
          onChange={(e) => setEditedBody(e.target.value)}
          className="w-full resize-none text-sm"
          value={editedBody}
        />
        <div className="space-x-2">
          <button
            onClick={handleEdit}
            disabled={!session.data || !isEditableByUser}
            className="text-sm text-blue-500 underline disabled:text-gray-500 disabled:no-underline"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={() => setOpen(true)}
            disabled={!session.data || !isEditableByUser}
            className="text-sm text-blue-500 underline disabled:text-gray-500 disabled:no-underline"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="relative z-50">
        <Dialog
          className="absolute top-[25%] left-[25%] w-1/2"
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-8">
              <Dialog.Title className="text-md font-bold">
                Delete comment
              </Dialog.Title>
              <Dialog.Description className="mb-4">
                This will permanently delete your comment
              </Dialog.Description>
              <button
                className="mr-4 rounded-md bg-green-400 px-4 py-2 text-white hover:bg-green-600"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-400 px-4 py-2 text-white hover:bg-red-600 "
                onClick={async () => {
                  await mutateAsync({ id: id });
                  if (!error) {
                    await utils.invalidate();
                    setOpen(false);
                  }
                }}
              >
                Delete
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
        {/* <div className="relative z-50">
          <Dialog
            className="absolute top-[25%] left-[25%] w-1/2"
            open={edit}
            onClose={() => setEdit(false)}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-8">
                <Dialog.Title className="text-md font-bold">
                  Edit comment
                </Dialog.Title>
                <Dialog.Description className="mb-4">
                
              </Dialog.Description>
                <button
                  className="mr-4 rounded-md bg-green-400 px-4 py-2 text-white hover:bg-green-600"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-red-400 px-4 py-2 text-white hover:bg-red-600 "
                  onClick={async () => {
                    await mutateAsyncEditComment({
                      id: id,
                      body: editedBody,
                    });
                    if (!error) {
                      utils.invalidate();
                      setOpen(false);
                    }
                  }}
                >
                  Delete
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div> */}
      </div>
    </>
  );
};
