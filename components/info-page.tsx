import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { siteLinks } from "@/lib/site";

export function InfoPage({
  eyebrow,
  title,
  description,
  current,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="info-shell">
      <header className="info-header">
        <Link className="brand" href="/" aria-label="PDFarrange home">
          <span className="brand-icon">
            <Files size={22} strokeWidth={1.8} />
          </span>
          <span>
            pdf<span className="brand-light">arrange</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <nav aria-label="Information pages">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            Open workspace
            <ArrowUpRight />
          </Link>
        </Button>
      </header>
      <main className="info-main">
        <Link href="/" className="back-to-workspace">
          <ArrowLeft size={14} />
          Back to workspace
        </Link>
        <div className="info-hero">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
