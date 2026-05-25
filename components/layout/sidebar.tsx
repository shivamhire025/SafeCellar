"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "safecellar-sidebar-collapsed";

// Sidebar uses brand-900 shell + brand-200/800 for inactive/hover (see tailwind brand scale).

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chemicals", icon: FlaskConical, label: "Chemicals" },
  { href: "/deliveries", icon: Truck, label: "Deliveries" },
  { href: "/sds-review", icon: ClipboardCheck, label: "SDS Review" },
  { href: "/incidents", icon: ClipboardList, label: "Incidents" },
  { href: "/workers", icon: Users, label: "Workers" },
];

function SidebarTooltip({
  label,
  show,
}: {
  label: string;
  show: boolean;
}) {
  if (!show) return null;
  return (
    <span
      role="tooltip"
      className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md pointer-events-none transition-opacity duration-150 group-hover/link:opacity-100 group-hover/button:opacity-100"
    >
      {label}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
    </span>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link relative flex items-center rounded-lg transition-colors duration-150",
        collapsed
          ? "mx-auto h-10 w-10 justify-center"
          : "mx-2 gap-3 px-3 py-2",
        active
          ? "bg-brand-700 text-white"
          : "text-brand-200 hover:bg-brand-800 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <span className="text-sm font-medium truncate">
          <AbbreviationText text={label} />
        </span>
      )}
      <SidebarTooltip label={label} show={collapsed} />
    </Link>
  );
}

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-brand-900 min-h-screen flex-shrink-0 transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-[220px]"
      )}
    >
      <div
        className={cn(
          "flex h-[60px] items-center border-b border-white/10 flex-shrink-0",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 text-white font-bold min-w-0",
            collapsed && "justify-center"
          )}
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-700 text-xs">
            SC
          </span>
          {!collapsed && (
            <span className="text-sm truncate">SafeCellar</span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-brand-200 hover:bg-brand-800 hover:text-white transition-colors duration-150"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center py-2 border-b border-white/10">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            className="group/button relative flex h-8 w-8 items-center justify-center rounded-lg text-brand-200 hover:bg-brand-800 hover:text-white transition-colors duration-150"
          >
            <ChevronRight className="h-4 w-4" />
            <SidebarTooltip label="Expand sidebar" show />
          </button>
        </div>
      )}

      <nav
        className={cn(
          "flex-1 flex flex-col py-4 gap-1",
          collapsed ? "items-center px-2" : "px-0"
        )}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname.startsWith(item.href)}
            collapsed={mounted && collapsed}
          />
        ))}
      </nav>

      <div
        className={cn(
          "flex flex-col border-t border-white/10 py-4 gap-1",
          collapsed ? "items-center px-2" : "px-0"
        )}
      >
        <Link
          href="/settings"
          className={cn(
            "group/link relative flex items-center rounded-lg transition-colors duration-150",
            collapsed
              ? "mx-auto h-10 w-10 justify-center"
              : "mx-2 gap-3 px-3 py-2",
            pathname.startsWith("/settings")
              ? "bg-brand-700 text-white"
              : "text-brand-200 hover:bg-brand-800 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">Settings</span>
          )}
          <SidebarTooltip label="Settings" show={mounted && collapsed} />
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className={cn(
            "group/button relative flex items-center rounded-lg text-brand-200 hover:bg-brand-800 hover:text-white transition-colors duration-150",
            collapsed
              ? "mx-auto h-10 w-10 justify-center"
              : "mx-2 gap-3 px-3 py-2 w-[calc(100%-1rem)]"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">Sign out</span>
          )}
          <SidebarTooltip label="Sign out" show={mounted && collapsed} />
        </button>

        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center pt-2" : "mx-2 gap-3 px-3 py-2"
          )}
        >
          <div
            className="group/link relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-700 text-white text-xs font-medium"
            title={!collapsed ? undefined : userName}
          >
            {initials}
            <SidebarTooltip label={userName} show={mounted && collapsed} />
          </div>
          {!collapsed && (
            <span className="text-sm font-medium text-brand-200 truncate">
              {userName}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
