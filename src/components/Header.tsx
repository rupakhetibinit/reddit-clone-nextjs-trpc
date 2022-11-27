import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <nav className="mx-3 flex w-screen justify-between bg-purple-700">
      <div>{sessionData?.user?.name}</div>
      <ul>
        <button
          className="rounded-full bg-white/10 px-8 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
          onClick={async () => {
            await signOut();
            await router.push("/");
          }}
        >
          Sign Out
        </button>
      </ul>
    </nav>
  );
};

export default Header;
