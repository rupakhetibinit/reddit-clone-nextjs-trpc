import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { Suspense, useState } from "react";

const Profile = () => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const { data: profile } = trpc.auth.getProfile.useQuery();
  const { mutateAsync } = trpc.auth.updateProfile.useMutation();
  const [name, setName] = useState("");
  return (
    <>
      <Head>
        <title>Reddit Clone | Nextjs</title>
        <meta name="description" content="Front of the internet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex max-h-fit min-h-screen w-full justify-center bg-gray-300">
        <Layout isAuthed={!!session}>
          <Suspense fallback={<div>Loading...</div>}>
            <section className="w-6/12 min-w-fit pt-16">
              <div className="w-full rounded-md bg-white p-4">
                <h1 className="font-bold">Name : </h1>
                <span className="inline font-medium">{profile?.name}</span>
                <h1 className="font-bold">Email : </h1>
                <span className="inline font-medium">{profile?.email}</span>
              </div>
              <div className="my-2 w-full rounded-md bg-white p-4">
                <h1 className="font-bold">Edit Profile</h1>
                <div>
                  <label htmlFor="name">Name : </label>
                  <input
                    id={name}
                    className="border"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <button
                  className="mt-4 rounded-md bg-orange-400 px-4 py-2 text-white hover:bg-orange-500"
                  onClick={async () => {
                    if (name.length !== 0) {
                      await mutateAsync({ name: name });
                      await utils.invalidate();
                      setName("");
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </section>
          </Suspense>
        </Layout>
      </main>
    </>
  );
};
export default Profile;
