import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Post = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { data: session } = useSession();
  console.log(session);
  const { data: post, isLoading } = trpc.posts.getPostById.useQuery({
    id: pid as string,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>No Post</div>;
  if (!session?.user?.email)
    return (
      <div>
        <div>Unauthorized</div>
        <div>
          Return to login
          <button onClick={() => router.replace("/")}>Login</button>
        </div>
      </div>
    );
  return (
    <div>
      <div className="m-2 flex h-fit w-9/12 flex-row justify-between rounded-md bg-gray-300/80 p-4">
        <div>
          <Link href={"/posts/" + post?.id}>
            <h3 className="text-2xl text-blue-600">{post?.title}</h3>
          </Link>
          <p className="text-base">{post?.body}</p>
          <p className="text-xs">
            Posted By
            <Link className="text-blue-600" href={"/" + post?.userId}>
              {" " + post?.user?.name}
            </Link>
          </p>

          {/* <div className="text-xs">comments</div> */}
        </div>
        <button
          className="m-1 cursor-pointer bg-purple-500 px-6 py-2 disabled:bg-gray-300"
          disabled={post.userId !== session.user.id}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Post;
