'use client'

import Image from "next/image"
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import {
  LayoutDashboard,
  Route,
  Gamepad2,
  Sparkles,
  Target,
  Briefcase,
  Settings,
  Menu,
  Bell,
  ChevronRight,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'

const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/onboarding',
  },
  {
    icon: Route,
    label: 'Pathways',
    href: '/recommendations',
  },
  {
    icon: Gamepad2,
    label: 'Simulations',
    href: '/simulations',
  },
  {
    icon: Sparkles,
    label: 'Skills',
    href: '#',
  },
  {
    icon: Target,
    label: 'Readiness',
    href: '#',
  },
  {
    icon: Briefcase,
    label: 'Opportunities',
    href: '#',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '#',
  },
]

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick}>
      <button
        className={cn(
          'group flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300',
          active
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,198,255,0.08)]'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
        )}
      >
        <Icon
          className={cn(
            'w-5 h-5 transition-transform duration-300',
            !active && 'group-hover:scale-110'
          )}
        />

        <span>{label}</span>

        {active && (
          <ChevronRight className="w-4 h-4 ml-auto" />
        )}
      </button>
    </Link>
  )
}

function SidebarContent({
  closeMobileMenu,
}: {
  closeMobileMenu?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/5 px-5 py-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={closeMobileMenu}
        >
          <Image
            src="/branding/logo.png"
            alt="Resolvr"
            width={120}
            height={28}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={pathname === item.href}
            onClick={closeMobileMenu}
          />
        ))}
      </nav>

      {/* AI Status */}
      <div className="border-t border-white/5 p-4">
        <div className="glass-panel rounded-2xl border border-white/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />

            <span className="text-xs font-semibold text-foreground">
              AI Active
            </span>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Analyzing simulation outcomes and optimizing your employability intelligence.          </p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/5 bg-sidebar/95 backdrop-blur-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 border border-white/10 bg-background/80 backdrop-blur-xl hover:bg-white/[0.03]"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">
              Open navigation menu
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-72 border-white/10 bg-sidebar/95 p-0 backdrop-blur-2xl"
        >
          <SidebarContent
            closeMobileMenu={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="pl-14 lg:pl-0">
          <h2 className="font-[var(--font-syne)] text-lg font-semibold tracking-tight text-foreground">
            Welcome Back
          </h2>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Your Career Intelligence Dashboard
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Pill */}
          <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:flex">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />

            <span className="text-xs font-medium text-primary">
              AI Online
            </span>
          </div>

          {/* Notification */}
          <button className="relative rounded-xl p-2 transition-colors duration-300 hover:bg-white/[0.04]">
            <Bell className="h-5 w-5 text-muted-foreground" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-primary/15 to-secondary/15">
            <span className="text-sm font-semibold text-foreground">
              U
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="safe-area-inset-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex min-w-[64px] flex-col items-center gap-1 rounded-xl p-2 transition-all duration-300',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />

              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}