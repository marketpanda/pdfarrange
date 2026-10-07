import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { InfoPage } from "@/components/info-page";
import { ContactForm } from "@/components/contact-form";
import { contactEmail, supportUrl } from "@/lib/site";
export const metadata: Metadata = {
  title: "Contact Us | PDFarrange",
  description: "Ask a question, report a bug, or share an idea for PDFarrange.",
};
export default function ContactPage() {
  return (
    <InfoPage
      current="/contact"
      eyebrow="LET’S TALK"
      title="Good things start with a conversation."
      description="A question, an idea, or something that could work better. We’d like to hear about it."
    >
      <div className="contact-layout">
        <ContactForm email={contactEmail} />
        <aside className="contact-details">
          <section>
            <span className="contact-detail-icon">
              <MessageCircle size={22} />
            </span>
            <h2>A little help, when you need it.</h2>
            <p>
              For a bug report, include the tool you used, your browser, and
              what you expected to happen. A description is usually enough to
              get started.
            </p>
          </section>
          <section>
            {contactEmail ? (
              <>
                <Mail size={18} />
                <h3>Send us an email</h3>
                <a href={`mailto:${contactEmail}`}>
                  {contactEmail}
                  <ArrowUpRight size={14} />
                </a>
              </>
            ) : (
              <>
                <MessageCircle size={18} />
                <h3>Find us on GitHub</h3>
                <a href={supportUrl} target="_blank" rel="noopener noreferrer">
                  Questions, bugs & ideas
                  <ArrowUpRight size={14} />
                </a>
                <p>Our support channel currently uses public GitHub issues.</p>
              </>
            )}
          </section>
          <section>
            <ShieldCheck size={18} />
            <h3>Keep your documents private.</h3>
            <p>
              Please don’t attach confidential PDFs or include passwords,
              account details, or sensitive personal information in a support
              request.
            </p>
            <Link href="/privacy">
              Read our privacy policy
              <ArrowUpRight size={14} />
            </Link>
          </section>
        </aside>
      </div>
      <section className="contact-faq">
        <span className="section-kicker">A FEW QUICK ANSWERS</span>
        <h2>Before you send a message.</h2>
        <div>
          <article>
            <h3>Where are my PDFs stored?</h3>
            <p>
              In the current browser session. Download your finished document
              before refreshing or leaving the workspace.
            </p>
          </article>
          <article>
            <h3>Do I need an account?</h3>
            <p>
              No. Guest mode supports up to 3 files, 25 pages, and 20 MB per
              file. Account features are planned.
            </p>
          </article>
          <article>
            <h3>Can I upload an encrypted PDF?</h3>
            <p>
              Encrypted or password-protected PDFs aren’t supported yet. Use an
              unencrypted copy you’re authorized to edit.
            </p>
          </article>
        </div>
      </section>
    </InfoPage>
  );
}
