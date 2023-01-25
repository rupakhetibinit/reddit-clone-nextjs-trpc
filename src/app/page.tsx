import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import Post from "../components/Post";
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
          id: true,
        },
      },
      upvotedBy: {
        select: {
          id: true,
        },
      },
    },
  });
  return posts;
};

const page = async () => {
  const posts = await getPosts();
  return (
    <section className="flex h-full w-screen justify-center">
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </section>
  );
};

export default page;
