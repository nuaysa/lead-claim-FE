import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const button = cva(
  "flex items-center justify-center rounded-2xl transition-colors cursor-pointer gap-2 font-bold",
  {
    variants: {
      size: {
        SMALL: " px-4 py-3 h-[40px] text-sm",
        LARGE: "h-11 px-6 py-3 text-base",
        ICON: "p-2 rounded-full w-4 h-4",
      },
      variant: {
        PRIMARY: "bg-primary-main font-bold text-white hover:bg-primary-hover",
        BLACK: "bg-neutral-black font-bold text-white hover:bg-primary-hover",
        SECONDARY:
          "bg-neutral-white border-2 font-bold border-primary-main text-primary-main hover:text-primary-hover hover:border-primary-hover",
        PLAIN:
          "bg-neutral-white border-2 font-bold border-neutral-gray2 text-neutral-black hover:bg-neutral-gray3",
        "OUTLINE-PLAIN":
          "border-2 border-neutral-gray2 font-bold text-neutral-gray1 hover:text-neutral-black",
        OUTLINE:
          "p-0 font-bold text-primary-main hover:text-primary-hover bg-transparent border-none",
        DANGER:
          "bg-semantic-red1 font-bold text-neutral-white hover:bg-semantic-red2 hover:text-semantic-red1",
        TEXT: "bg-transparent text-primary-main hover:text-primary-hover border-none p-0",
        WARNING:
          "bg-semantic-yellow2 font-bold text-neutral-white hover:bg-semantic-yellow1 hover:text-semantic-yellow2",
      },
      disabled: {
        true: "disabled:cursor-not-allowed disabled:text-neutral-gray1 disabled:border-neutral-gray1 disabled:border-2 disabled:bg-neutral-gray3",
      },
    },
    defaultVariants: {
      size: "SMALL",
      variant: "PRIMARY",
    },
  }
);

interface IButton
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof button> {
  icon?: React.ReactElement;
  type?:"button" | "submit" 
  text?: string;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export default function Button({
  type = "button",
  icon,
  text,
  size,
  variant,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  className,
  ...props
}: IButton) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={button({
        size,
        variant,
        disabled: disabled || isLoading,
        className,
      })}
      {...props}
    >
      {isLoading ? (
        <span>{loadingText}</span>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
}
