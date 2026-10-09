import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "danger" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-wider transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-1 disabled:border-b-0",
          {
            "bg-duo-green text-white border-b-4 border-duo-greenShadow hover:bg-duo-green/90": variant === "primary",
            "bg-duo-blue text-white border-b-4 border-duo-blueShadow hover:bg-duo-blue/90": variant === "secondary",
            "bg-duo-red text-white border-b-4 border-duo-redShadow hover:bg-duo-red/90": variant === "danger",
            "bg-white text-duo-textDark border-2 border-b-4 border-duo-grey hover:bg-gray-50": variant === "default",
            "bg-transparent text-duo-textDark hover:bg-gray-100": variant === "ghost",
            "h-12 px-4 py-2 text-md": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-14 px-8 text-lg rounded-2xl": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
