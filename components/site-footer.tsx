import Link from "next/link";
import { siteLinks } from "@/lib/site";

export function SiteFooter({ workspace = false }: { workspace?: boolean }) {
  return (
    <footer
      className={`site-footer ${workspace ? "workspace-site-footer" : ""}`}
    >
      <div className="footer-top">
        <span>
          A little less chaos. A little more <strong>pdfarrange.</strong>
        </span>
        <nav aria-label="Company and policies">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={workspace ? "_blank" : undefined}
              rel={workspace ? "noopener noreferrer" : undefined}
              aria-label={
                workspace ? `${link.label} (opens in a new tab)` : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© 2026 PDFarrange. All rights reserved.</span>
        <span>Thoughtfully simple.</span>
      </div>
    </footer>
  );
}
