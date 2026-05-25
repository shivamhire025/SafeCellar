"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  FileCheck,
  FlaskConical,
  LayoutDashboard,
  Settings,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard },
  { href: "/chemicals", icon: FlaskConical },
  { href: "/deliveries", icon: Truck },
  { href: "/sds-review", icon: ClipboardCheck },
  { href: "/compliance", icon: FileCheck },
  { href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-900 flex items-center justify-around py-2 z-40 border-t border-white/10">
      {navItems.map(({ href, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "p-2 rounded-lg transition-colors",
              active ? "text-white bg-brand-700" : "text-brand-200"
            )}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </nav>
  );
}
