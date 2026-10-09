import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-duo-grey", className)}
      {...props}
    >
      <div
        className="h-full bg-duo-green transition-all duration-500 ease-in-out relative"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      >
        <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full" />
      </div>
    </div>
  )
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
