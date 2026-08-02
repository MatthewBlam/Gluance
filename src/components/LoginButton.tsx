import { ComponentProps, forwardRef, MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

export interface LoginButtonProps extends ComponentProps<"button"> {
    click: MouseEventHandler;
    text: string;
    disabled: boolean;
    tabbable: boolean;
}

export const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
    (
        { children, className, click, text, disabled, tabbable, ...props },
        ref
    ) => {
        const tabIndex = tabbable ? 0 : -1;
        return (
            <button
                tabIndex={tabIndex}
                ref={ref}
                disabled={disabled}
                onClick={click}
                className={twMerge(
                    "ring-offset-app-background cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-brand select-none appearance-none font-medium text-base text-on-brand bg-brand outline-none ring-2 ring-transparent ring-offset-2 focus-visible:ring-2 focus-visible:ring-brand hover:bg-brand-hover p-2 rounded-full",
                    className
                )}
                {...props}>
                {text}
            </button>
        );
    }
);
