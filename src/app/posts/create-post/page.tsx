"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { trpc } from "../../../utils/trpc";

const Page = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { mutate } = trpc.posts.createPost.useMutation();
  const session = useSession();

  return (
    <div className="flex w-screen flex-col items-center">
      <div className="flex w-11/12 flex-col space-y-4 sm:w-6/12">
        <h1 className="text-xl font-bold">Create a Post</h1>
        <input
          value={title}
          placeholder="Title"
          className="rounded-sm border border-gray-400 p-2"
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          maxLength={300}
        />

        <textarea
          value={body}
          placeholder="Body of post"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button
        disabled={!session.data?.user?.id}
        onClick={() => {
          mutate(
            {
              body: body,
              title: title,
            },
            {
              onSuccess: (data) => console.log(data),
            }
          );
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Page;
