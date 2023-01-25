"use client";
import { Popover } from "@headlessui/react";
import { HomeIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
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

export const Client2Popover = () => {
  const userSession = useSession();
  return (
    <TwoIconPopover
      LeftIcon={UserIcon}
      RightIcon={ChevronDownIcon}
      middleContent={
        <div className="text-black">{userSession?.user?.name}</div>
      }
    >
      <div className="h-full w-40 rounded-sm bg-white p-2">
        <ul>
          <li className="flex items-center px-1">
            {isAuthed && <ArrowLeftOnRectangleIcon className="h-8 w-8" />}
            {!isAuthed && <ArrowRightOnRectangleIcon className="h-8 w-8" />}

            <Link href={isAuthed ? "api/auth/signout" : "api/auth/signin"}>
              {isAuthed ? "Sign Out" : "Sign In"}
            </Link>
          </li>
        </ul>
      </div>
    </TwoIconPopover>
  );
};
