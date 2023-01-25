import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { prisma } from "../server/db/client";

const getPosts = async () => {
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
    },
  });
  return posts;
};

const page = async () => {
  const posts = await getPosts();
  return (
    <section className="h-full w-auto pt-16">
      {posts?.map(({ user, body, id, title }) => (
        <div
          key={id}
          className="prose my-4 flex w-full flex-row rounded-sm bg-white pr-12"
        >
          <div className="-z-1 flex flex-col items-center gap-y-1 bg-gray-100 p-2">
            <BiUpvote
              // onClick={() =>
              //   mutateAsync({
              //     userId: userSession.data?.user?.id as string,
              //     postId: id,
              //   })
              // }
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
  );
};

export default page;
