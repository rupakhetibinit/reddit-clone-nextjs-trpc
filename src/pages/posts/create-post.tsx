import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const CreatePost = () => {
  const router = useRouter();
  const [post, setPost] = useState({
    title: "",
    body: "",
  });
  const mutation = trpc.posts.createPost.useMutation();

  const handlePost = async () => {
    const mutationPost = await mutation.mutateAsync({
      body: post.body,
      title: post.title,
    });

    if (mutationPost?.id !== null || undefined) {
      router.replace("/posts/" + mutationPost?.id);
    }
  };
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen justify-center bg-gray-300">
        <Layout isAuthed={!!session}>
          <div className="flex w-6/12 flex-col items-center pt-20">
            <h1 className="text-lg font-bold tracking-wide">Create Post</h1>
            <div className="w-7/12 space-y-5 bg-gray-300">
              <div className="">
                <label className="mb-4" htmlFor="title">
                  Title
                </label>
                <input
                  name="title"
                  className="mt-2 w-full rounded-sm p-2"
                  value={post.title}
                  maxLength={300}
                  onChange={(e) =>
                    setPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="">
                <label className="" htmlFor="body">
                  Body
                </label>
                <textarea
                  name="body"
                  maxLength={3000}
                  className="mt-2 w-full rounded-sm p-2"
                  value={post.body}
                  onChange={(e) =>
                    setPost((prev) => ({ ...prev, body: e.target.value }))
                  }
                />
              </div>
            </div>
            <button
              className="mt-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
              onClick={handlePost}
            >
              Create Post
            </button>
            {mutation.error && (
              <p className="text-red-500">
                Something went wrong! {mutation.error.message}
              </p>
            )}
          </div>
        </Layout>
      </main>
    </>
  );
};
export default CreatePost;
