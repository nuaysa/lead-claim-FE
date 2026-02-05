import { cva } from "class-variance-authority";


export const modalVariants = cva(
  "bg-neutral-white rounded-lg w-full max-w-lg mx-auto",
  {
    variants: {
      variant: {
        warning: "border-t-4 border-primary-main",
        danger: "border-t-4 border-semantic-red1",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

export const modalIconVariants = cva("mb-4", {
  variants: {
    variant: {
      warning: "text-semantic-yellow1",
      danger: "text-semantic-red1",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});
