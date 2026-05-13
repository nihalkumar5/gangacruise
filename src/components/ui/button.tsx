import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-3 rounded-[1.05rem] text-sm font-semibold transition-all duration-500 ease-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lotus/45 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-lotus text-white shadow-[0_18px_45px_rgba(172,43,151,0.22)] hover:bg-[#982084]",
        ghost:
          "bg-white/70 text-river ring-1 ring-stone-200 hover:bg-white hover:ring-lotus/25",
        outline:
          "bg-transparent text-river ring-1 ring-stone-300 hover:bg-white/70 hover:ring-lotus/35",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-7",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
