import { Popover } from "@headlessui/react";
import React from "react";

interface Props {
  LeftIcon: (
    props: React.ComponentProps<"svg"> & {
      title?: string;
      titleId?: string;
    }
  ) => JSX.Element;

  RightIcon: (
    props: React.ComponentProps<"svg"> & {
      title?: string;
      titleId?: string;
    }
  ) => JSX.Element;
  children: React.ReactNode;
  middleContent?: React.ReactNode;
}

const TwoIconPopover = ({
  LeftIcon,
  RightIcon,
  children,
  middleContent = <></>,
}: Props) => {
  return (
    <Popover className="relative px-1">
      <Popover.Button>
        <div className="flex items-center gap-1">
          <LeftIcon className="h-6 w-6 " />
          {middleContent}
          <RightIcon className="h-6 w-6" />
        </div>
      </Popover.Button>
      <Popover.Panel className="absolute z-10">{children}</Popover.Panel>
    </Popover>
  );
};

export default TwoIconPopover;
