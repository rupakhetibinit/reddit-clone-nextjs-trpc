import type { Post } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";

const Posts = () => {
  const { data: sessionData } = useSession();
  const { data: posts } = trpc.posts.getAll.useQuery();
  if (!sessionData?.user) {
    return <div>You are not authorized to see this page</div>;
  }
  return (
    <>
      <div className="flex flex-col  items-center">
        <Header />
        <div className="flex w-full flex-col items-center">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Link
          href="posts/create-post"
          className="m-1 rounded-sm bg-purple-500 px-6 py-2 disabled:bg-gray-500"
        >
          Create Post
        </Link>
      </div>
    </>
  );
};

export default Posts;
type ReturnedPost = Post & {
  user: {
    name: string | null;
  };
};
const PostCard = ({ post }: { post: ReturnedPost }) => {
  const { data: sessionData } = useSession();
  return (
    <div className="m-2 flex h-fit w-9/12 flex-row justify-between rounded-md bg-gray-300/80 p-4">
      <div>
        <Link href={"/posts/" + post.id}>
          <h3 className="text-2xl text-blue-600">{post.title}</h3>
        </Link>
        <p className="text-base">{post.body}</p>
        <p className="text-xs">
          Posted By
          <Link className="text-blue-600" href={"/" + post.userId}>
            {" " + post.user?.name}
          </Link>
        </p>

        {/* <div className="text-xs">comments</div> */}
      </div>
      <button
        className="m-1 bg-purple-500 px-6 py-2 disabled:bg-gray-500"
        // disabled={post.userId !== sessionData?.user?.id}
        disabled={true}
      >
        Edit
      </button>
    </div>
  );
};
