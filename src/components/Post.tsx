import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import React from "react";
import { ImArrowUp, ImArrowDown } from "react-icons/im";

type Props = {
  user: {
    name: string | null;
    id: string | null;
  };
  id: string;
  upvotedBy: {
    id: string;
  }[];
  body: string;
  title: string;
};

const Post = ({ body, id, title, user, upvotedBy }: Props) => {
  return (
    <div
      key={id}
      className="my-4 flex h-fit w-5/12 min-w-fit flex-row rounded-sm bg-white"
    >
      <div className="-z-1 flex flex-col items-center gap-y-1 bg-gray-100 p-2">
        <ImArrowUp className={clsx("h-6 w-6 text-gray-400")} />
        <span className="text-sm font-bold">Vote</span>
        <ImArrowDown className="h-6 w-6 text-gray-400 " />
      </div>
      <div className="flex-col px-4 py-2">
        <h6 className="text-xs font-normal text-gray-500">
          Posted by {user?.name}
        </h6>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="pb-2 text-sm">{body}</p>
        <div className="flex gap-x-5">
          <button className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200">
            <ChatBubbleBottomCenterIcon className="h-4 w-4" />
            <span className="prose-none">Comments</span>
          </button>
          <button className="flex items-center gap-x-1 rounded-sm px-2 py-1 hover:bg-gray-200">
            <ShareIcon className="h-4 w-4" />
            <span className="prose-none">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
