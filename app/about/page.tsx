import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Grip, ShieldCheck, Sparkles } from "lucide-react";
import { InfoPage } from "@/components/info-page";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "About Us | PDFarrange",
  description:
    "Meet PDFarrange: a simpler, more private way to organize your PDFs.",
};
export default function AboutPage() {
  return (
    <InfoPage
      current="/about"
      eyebrow="A LITTLE ABOUT US"
      title="Less paperwork. More possibility."
      description="We believe organizing a PDF should feel as simple as arranging a few things on your desk."
    >
      <section className="about-story">
        <div>
          <span className="section-kicker">WHY PDFARRANGE EXISTS</span>
          <h2>A little order goes a long way.</h2>
        </div>
        <div>
          <p>
            A report with one page out of place. A handful of documents that
            belong together. A long PDF when you only need a few pages. These
            small jobs should take moments.
          </p>
          <p>
            PDFarrange brings them into one calm workspace. Upload your
            documents, see every page, put things in order, and download a PDF
            that’s ready for what comes next.
          </p>
        </div>
      </section>
      <section className="about-values" aria-label="What matters to us">
        <article>
          <span>
            <ShieldCheck size={23} />
          </span>
          <h2>Your files, your space.</h2>
          <p>
            PDF editing happens in your browser. The current workspace doesn’t
            send your documents to a server or store them in a cloud account.
          </p>
        </article>
        <article>
          <span>
            <Sparkles size={23} />
          </span>
          <h2>Simple by intention.</h2>
          <p>
            A clear page grid, familiar controls, and a little orange. Spend
            your attention on your documents, with fewer things getting in the
            way.
          </p>
        </article>
        <article>
          <span>
            <Grip size={23} />
          </span>
          <h2>Ready for real life.</h2>
          <p>
            Reorder, rotate, remove, merge, and extract pages on desktop or
            mobile. Start as a guest, with no account needed for the current
            tools.
          </p>
        </article>
      </section>
      <section className="about-next">
        <div>
          <span className="section-kicker">ONE THOUGHTFUL STEP AT A TIME</span>
          <h2>A workspace that grows with you.</h2>
          <p>
            We’re exploring Google sign-in, cloud storage, and more room for
            larger projects. Those account features are planned; today’s guest
            workspace keeps your PDFs local.
          </p>
        </div>
        <div className="about-next-note">
          <strong>3 PDFs · 25 pages</strong>
          <span>A little room to get a lot done.</span>
          <span>Up to 20 MB per file in guest mode.</span>
        </div>
      </section>
      <div className="info-cta">
        <div>
          <h2>Make room for a little order.</h2>
          <p>Your next PDF is a good place to start.</p>
        </div>
        <Button asChild>
          <Link href="/">
            Arrange your PDFs
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </InfoPage>
  );
}
