import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

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
      <div className="flex flex-row">
        <Image
          src={sessionData?.user?.image}
          alt="user image"
          width={20}
          height={20}
        />
        <div className="px-2">{sessionData?.user?.name}</div>
      </div>
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
