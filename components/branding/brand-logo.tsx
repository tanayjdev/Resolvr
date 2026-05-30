import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  BRAND_LOGO,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_WIDTH,
  BRAND_NAME,
} from "@/lib/branding"

/** Display-size hierarchy — navbar is largest, footer is smallest. */
const sizeClasses = {
  navbar: "h-9 w-auto sm:h-10 md:h-11",
  sidebar: "h-8 w-auto sm:h-9",
  footer: "h-7 w-auto sm:h-8",
  compact: "h-7 w-auto sm:h-8",
  loading: "h-10 w-auto sm:h-11",
} as const

export type BrandLogoSize = keyof typeof sizeClasses

interface BrandLogoProps {
  size?: BrandLogoSize
  className?: string
  priority?: boolean
}

export function BrandLogo({
  size = "navbar",
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO}
      alt={BRAND_NAME}
      width={BRAND_LOGO_WIDTH}
      height={BRAND_LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "shrink-0 object-contain object-left",
        sizeClasses[size],
        className
      )}
    />
  )
}
