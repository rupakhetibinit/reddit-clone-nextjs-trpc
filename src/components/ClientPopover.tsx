"use client";
import { Popover } from "@headlessui/react";
import {
  HomeIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { SessionProvider, useSession } from "next-auth/react";
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
          Feed
          <div className="flex flex-col">
            <span>Hello</span>
            <span>World</span>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ClientPopover;

const Client2Popover = () => {
  const { data: userSession } = useSession();

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

export const WrappedClientPopover = () => {
  return (
    <SessionProvider>
      <Client2Popover />
    </SessionProvider>
  );
};
