import { trpc } from "@/utils/trpc";
import { Popover } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useEffect, useMemo } from "react";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { toast } from "react-toastify";

type Props = {
  user: {
    name: string | null;
  };
  id: string;
  upvotedBy: {
    id: string;
  }[];
  body: string;
  title: string;
  downvotedBy: {
    id: string;
  }[];
  _count: {
    upvotedBy: number;
    downvotedBy: number;
  };
};

const Post = memo(function Post({
  user,
  id,
  upvotedBy,
  body,
  title,
  downvotedBy,
  _count,
}: Props) {
  const router = useRouter();
  const { data } = useSession();
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.posts.upvotePostById.useMutation();
  const { mutateAsync: mutateD } = trpc.posts.downvotePostById.useMutation();
  const isUpvoted = useMemo(() => {
    return upvotedBy.filter((i) => i.id === data?.user?.id).length !== 0
      ? true
      : false;
  }, [upvotedBy, data]);
  const isDownvoted = useMemo(() => {
    return downvotedBy.filter((i) => i.id === data?.user?.id).length !== 0
      ? true
      : false;
  }, [downvotedBy, data]);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const upvotes = _count.upvotedBy - _count.downvotedBy;
  return (
    <div key={id} className="my-4 flex w-full flex-row rounded-sm bg-white">
      <div className="-z-1 flex w-12 flex-col items-center gap-y-1 bg-gray-100 p-2">
        <ImArrowUp
          onClick={async () => {
            if (data !== null) {
              await mutateAsync({
                postId: id,
              });
              await utils.invalidate();
            }
          }}
          className={clsx(
            "h-6 w-6 cursor-pointer hover:text-orange-400",
            isUpvoted ? "text-orange-500" : "text-gray-400"
          )}
        />
        <span className="text-sm font-bold">
          {upvotes === 0 ? "Vote" : upvotes}
        </span>
        <ImArrowDown
          onClick={async () => {
            if (data !== null) {
              await mutateD({
                postId: id,
              });
              await utils.invalidate();
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
          Posted by {user?.name}
        </h6>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="pb-2 text-sm">{body}</p>
        <div className="flex gap-x-5">
          <Link
            href={`/posts/${id}`}
            className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200"
          >
            <ChatBubbleBottomCenterIcon className="h-4 w-4" />
            <span className="prose-none">Comments</span>
          </Link>

          <button
            onClick={() => {
              async () => {
                await navigator.clipboard.writeText(`${origin}/posts/${id}`);
              };
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
        </div>
      </div>
    </div>
  );
});

export default Post;
