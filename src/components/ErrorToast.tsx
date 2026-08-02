import { forwardRef, MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { HTMLMotionProps, motion } from "motion/react";
import { TriangleAlert, X } from "lucide-react";

export interface ErrorToastProps extends HTMLMotionProps<"div"> {
  active: boolean;
  text: string;
  close: MouseEventHandler;
}

const variants = {
  hidden: { y: 0, x: "-50%" },
  visible: { y: -400, x: "-50%" },
};

export const ErrorToast = forwardRef<HTMLDivElement, ErrorToastProps>(({ children, className, active, text, close, ...props }, ref) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      transition={{
        ease: "linear",
        duration: 0.1,
      }}
      ref={ref}
      className={twMerge("flex w-max content-center align-middle justify-center gap-2.5 px-4 py-3 rounded bg-reading-low select-none", className)}
      {...props}>
      <TriangleAlert className="shrink-0 w-[18px] h-[18px] text-on-error" strokeWidth={2} />

      <span className="flex items-center font-semibold text-xs pr-1 text-on-error select-none">{text.trim()}</span>

      <X onClick={close} className="shrink-0 size-4 text-on-error/70 hover:text-on-error cursor-pointer pt-[1.25px]" strokeWidth={2.75} />
    </motion.div>
  );
});
