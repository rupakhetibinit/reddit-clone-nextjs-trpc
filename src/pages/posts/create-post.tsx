import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

const CreatePost = () => {
  const { data: sessionData, status } = useSession();
  const mutation = trpc.posts.createPost.useMutation();

  const [post, setPost] = useState({
    title: "",
    body: "",
  });

  const handleClick = async () => {
    if (!!post.title && !!post.body) {
      await mutation.mutateAsync(post);
    }
  };
  if (status !== "authenticated") {
    <div>loading</div>;
  }
  if (!sessionData) {
    return <div>You are not logged in</div>;
  }
  return (
    <div className="h-[100vh] w-[100vw] items-center justify-center bg-slate-700 ">
      <label>Title of Post</label>
      <input
        type="text"
        onChange={(e) =>
          setPost((post) => ({ ...post, title: e.target.value }))
        }
      />
      <label>Body of post</label>
      <textarea
        onChange={(e) => setPost((post) => ({ ...post, body: e.target.value }))}
      />
      <button onClick={handleClick} disabled={mutation.isLoading}>
        Submit Post
      </button>
      {mutation.error && (
        <p className="text-red-500">
          Something went wrong! {mutation.error.message}
        </p>
      )}
    </div>
  );
};

export default CreatePost;
