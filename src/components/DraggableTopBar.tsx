import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface DraggableTopBarProps extends ComponentProps<"div"> {
  hideLogo?: boolean;
}

export const DraggableTopBar = ({ hideLogo: _hideLogo, className, ...props }: DraggableTopBarProps) => {
  return <div className={twMerge("draggabletopbar absolute inset-0 h-10 bg-transparent flex justify-center align-middle items-center", className)} {...props}></div>;
};
