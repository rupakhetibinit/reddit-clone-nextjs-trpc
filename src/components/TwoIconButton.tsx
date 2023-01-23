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
}

const TwoIconButton = ({ LeftIcon, RightIcon }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <LeftIcon className="h-8 w-8" />
      <RightIcon className="h-8 w-8" />
    </div>
  );
};

export default TwoIconButton;
