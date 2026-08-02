import { ComponentProps, ChangeEventHandler, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface TextInputProps extends ComponentProps<"div"> {
    label: string;
    placeholder: string;
    value: string;
    change: ChangeEventHandler;
    password?: boolean;
    disabled: boolean;
    tabbable: boolean;
}

export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
    (
        {
            children,
            className,
            label,
            placeholder,
            value,
            change,
            password = false,
            disabled,
            tabbable,
            ...props
        },
        ref
    ) => {
        const tabIndex = tabbable ? 0 : -1;
        return (
            <div
                className={twMerge("flex flex-col gap-1.5", className)}
                {...props}>
                <span className="font-medium text-xs text-app-text-muted pl-0.5 select-none">
                    {label}
                </span>
                <input
                    tabIndex={tabIndex}
                    className={twMerge(
                        "bg-app-background-light disabled:bg-app-border disabled:bg-opacity-40 border-app-border hover:border-app-text-muted disabled:hover:border-fg-dark disabled:border-app-border hover:border-opacity-70",
                        "font-medium text-sm placeholder-app-text-muted text-app-text disabled:text-app-text-muted disabled:cursor-not-allowed border-2 focus-visible:border-brand outline-none ring-none focus-visible:ring-none rounded-lg py-1.5 px-2.5 block w-full"
                    )}
                    type={password ? "password" : "text"}
                    placeholder={placeholder}
                    value={value}
                    onChange={change}
                    disabled={disabled}></input>
            </div>
        );
    }
);
