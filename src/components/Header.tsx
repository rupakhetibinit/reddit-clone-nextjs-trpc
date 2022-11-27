import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  const { data: sessionData } = useSession();
  const handleClick = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <nav className="flex w-full items-center justify-between bg-purple-700 py-3 px-4">
      <div>{sessionData?.user?.name}</div>
      <ul>
        <button
          className="rounded-full bg-white/10 px-8 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
          onClick={handleClick}
        >
          Sign Out
        </button>
      </ul>
    </nav>
  );
};

export default Header;
