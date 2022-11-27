import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";

const CreatePost = () => {
  const { data: sessionData, status } = useSession();
  const mutation = trpc.posts.createPost.useMutation();
  const router = useRouter();

  const [post, setPost] = useState({
    title: "",
    body: "",
  });

  const handleClick = async () => {
    if (!!post.title && !!post.body) {
      const thing = await mutation.mutateAsync(post);
      if (!thing) return;
      await router.replace("/posts/" + thing.id);
    }
    // if (!mutation?.error?.message) {
    //   await router.replace("/posts");
    // }
    console.log(mutation);
  };
  if (status !== "authenticated") {
    <div>loading</div>;
  }
  if (!sessionData) {
    return <div>You are not logged in</div>;
  }
  return (
    <div className="flex min-h-screen min-w-full flex-col items-center bg-purple-500  ">
      <Header />
      <label>Title of Post</label>
      <input
        type="text"
        className="w-96 rounded-md p-2"
        onChange={(e) =>
          setPost((post) => ({ ...post, title: e.target.value }))
        }
      />
      <label>Body of Post</label>
      <textarea
        onChange={(e) => setPost((post) => ({ ...post, body: e.target.value }))}
        className="h-24 w-96 resize-none rounded-md p-2"
      />
      <button
        className="m-2 rounded-md bg-purple-900 px-8 py-2 text-white hover:bg-purple-700 disabled:bg-gray-800"
        onClick={handleClick}
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Submitting Post" : "Submit Post"}
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
