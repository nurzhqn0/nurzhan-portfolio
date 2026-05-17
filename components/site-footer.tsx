import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} nurzhqn0. Built with Next.js.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <Link href="/experience" className="hover:text-foreground">
            Experience
          </Link>
        </div>
      </div>
    </footer>
  );
}
