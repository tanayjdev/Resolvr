// components/ui/container.tsx

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: "default" | "wide" | "full"
}

const sizeVariants = {
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  full: "max-w-full",
}

export function Container({
  children,
  className,
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        // Layout
        "relative w-full mx-auto",

        // Responsive horizontal spacing
        "px-4 sm:px-6 lg:px-8 xl:px-10",

        // Prevent edge touching on very large screens
        "min-w-0",

        // Width variants
        sizeVariants[size],

        className
      )}
    >
      {children}
    </div>
  )
}