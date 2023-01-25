"use client";
import { Popover } from "@headlessui/react";
import {
  HomeIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { SessionContextValue, SessionProvider } from "next-auth/react";
import Link from "next/link";
import React from "react";

const ClientPopover = () => {
  return (
    <Popover className="relative px-1">
      <Popover.Button>
        <div className="flex items-center gap-1">
          <HomeIcon className="h-6 w-6 " />
          <span className="hidden sm:mr-12 sm:inline">Home</span>
          <ChevronDownIcon className="h-6 w-6" />
        </div>
      </Popover.Button>
      <Popover.Panel className="absolute z-10">
        <div className="h-full w-40 rounded-sm bg-white p-2 text-black">
          <div className="flex flex-col">
            <Popover.Button
              as={Link}
              className="flex flex-row"
              href="/posts/create-post"
            >
              <span>
                <PlusIcon className="h-5 w-5" />
              </span>
              <span>Create Post</span>
            </Popover.Button>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ClientPopover;

const Client2Popover = ({
  userdata,
}: {
  userdata: SessionContextValue | null;
}) => {
  const userSession = userdata?.data;
  return (
    <Popover className="relative px-1">
      <Popover.Button>
        <div className="flex items-center gap-1">
          <UserIcon className="h-6 w-6" />
          <div className="text-black">{userSession?.user?.name}</div>
          <ChevronDownIcon className="h-6 w-6" />
        </div>
      </Popover.Button>
      <Popover.Panel className="absolute z-10">
        <div className="h-full w-40 rounded-sm bg-white p-2">
          <ul>
            <li className="flex items-center px-1">
              {userSession?.user?.id && (
                <ArrowLeftOnRectangleIcon className="h-8 w-8" />
              )}
              {!userSession?.user?.id && (
                <ArrowRightOnRectangleIcon className="h-8 w-8" />
              )}

              <Link
                href={
                  userSession?.user?.id ? "api/auth/signout" : "api/auth/signin"
                }
              >
                {userSession?.user?.id ? "Sign Out" : "Sign In"}
              </Link>
            </li>
          </ul>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export const WrappedClientPopover = ({ userSession }) => {
  return (
    <SessionProvider>
      <Client2Popover userSession={userSession} />
    </SessionProvider>
  );
};
