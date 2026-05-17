"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const liquid = pathname === "/" && !scrolled;

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 48);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header
      className={
        liquid
          ? "sticky top-0 z-40 border-b border-transparent bg-transparent transition-all duration-500"
          : "sticky top-0 z-40 border-b bg-background/95 shadow-sm backdrop-blur transition-all duration-500"
      }
    >
      <div
        className={
          liquid
            ? "mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 transition-all duration-500 sm:px-6"
            : "mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 transition-all duration-500 sm:px-6"
        }
      >
        <div
          className={
            liquid
              ? "liquid-header flex h-14 w-full items-center justify-between rounded-full border border-white/25 px-4 text-white shadow-lg shadow-black/10 backdrop-blur-xl sm:px-5"
              : "flex h-12 w-full items-center justify-between"
          }
        >
          <Link
            href="/"
            className={
              liquid
                ? "font-semibold tracking-normal text-white"
                : "font-semibold tracking-normal text-foreground"
            }
          >
            nurzhqn0
          </Link>
          <nav
            className={
              liquid
                ? "hidden items-center gap-6 text-sm text-white/75 md:flex"
                : "hidden items-center gap-6 text-sm text-muted-foreground md:flex"
            }
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={liquid ? "hover:text-white" : "hover:text-foreground"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            asChild
            size="sm"
            variant={liquid ? "secondary" : "outline"}
            className={
              liquid
                ? "border-white/25 bg-white/15 text-white hover:bg-white/25 hover:text-white"
                : ""
            }
          >
            <Link href="/#contact">
              Contact <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
