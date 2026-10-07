import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { policyUpdated } from "@/lib/site";
export const metadata: Metadata = {
  title: "Terms & Conditions | PDFarrange",
  description: "The terms for using PDFarrange’s PDF organization tools.",
};
const sections = [
  {
    id: "using-pdfarrange",
    title: "Using PDFarrange",
    text: "These terms apply to the PDFarrange website and its PDF organization tools. By using the service, you agree to these terms. If you do not agree, please stop using the service. PDFarrange currently provides browser-based tools for arranging, rotating, removing, merging, and extracting PDF pages.",
  },
  {
    id: "your-documents",
    title: "Your documents and responsibilities",
    text: "You retain ownership of your documents. You must have the rights or permission necessary to upload, edit, and use them. You are responsible for the documents you choose, the changes you make, and the way you use the resulting files. Keep an original copy and check the exported PDF before relying on it.",
  },
  {
    id: "guest-workspace",
    title: "Guest workspace and file handling",
    text: "Guest mode supports up to 3 PDFs, 25 pages, and 20 MB per file. Encrypted PDFs are not supported. Processing takes place in your browser; documents are not uploaded to a PDFarrange server by the current editing tools. This workspace is temporary. Refreshing or leaving can end the session, so download your work to keep it.",
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    text: "Use PDFarrange lawfully and respect other people’s rights. Do not use it to infringe copyright, distribute unlawful content, impersonate others, introduce malicious code, disrupt the service, or attempt to access systems or information without authorization. Do not misuse support channels or share other people’s private information.",
  },
  {
    id: "accounts",
    title: "Accounts and future features",
    text: "Google sign-in, cloud storage, and expanded account limits are planned features. They are not included in the current guest workspace. Any future account, subscription, or cloud service will be described before it is offered, along with applicable terms, prices, and privacy information. These terms do not authorize us to begin uploading your local PDFs automatically.",
  },
  {
    id: "availability",
    title: "Availability and output",
    text: "We aim to provide useful, reliable tools, but compatibility can vary by browser and document. Features may change, and the service may be interrupted for maintenance or technical reasons. We do not promise that every PDF will process successfully or that an export will preserve every interactive feature, annotation, signature, or form field. Review important output and keep your source files.",
  },
  {
    id: "your-rights",
    title: "Your legal rights",
    text: "Nothing in these terms excludes, restricts, or modifies rights or remedies that cannot lawfully be excluded, including applicable consumer guarantees. Subject to those rights, the service is provided as available and without additional promises beyond those expressly stated. Any limitation on responsibility applies only to the extent permitted by applicable law.",
  },
  {
    id: "copyright",
    title: "Copyright and intellectual property",
    text: "© 2026 PDFarrange. All rights reserved in our original branding, design, and content, except where another license is expressly provided. Third-party software, names, and materials remain subject to their respective owners’ rights and licenses. These terms do not transfer ownership of your PDFs to PDFarrange. Contact us if you believe material associated with the service infringes your rights.",
  },
  {
    id: "changes",
    title: "Changes to these terms",
    text: "We may update these terms as the service develops. The updated date identifies the version shown on this page. Material changes will be communicated through the website before they apply where required by law. Review the terms when using new features.",
  },
];
export default function TermsPage() {
  return (
    <InfoPage
      current="/terms"
      eyebrow="THE DETAILS, MADE CLEAR"
      title="Terms & Conditions"
      description="A few straightforward ground rules for a smoother PDF workflow."
    >
      <div className="policy-layout">
        <aside className="policy-contents">
          <span>ON THIS PAGE</span>
          <nav aria-label="Terms sections">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
            <a href="#contact">
              <span>10</span>Contact us
            </a>
          </nav>
        </aside>
        <article className="policy-article">
          <div className="policy-date">Last updated: {policyUpdated}</div>
          <div className="policy-summary">
            <strong>Your documents belong to you.</strong>
            <p>
              Use tools responsibly, keep an original copy, and download your
              work before leaving your session.
            </p>
          </div>
          {sections.map((section, index) => (
            <section id={section.id} key={section.id}>
              <h2>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <p>{section.text}</p>
            </section>
          ))}
          <section id="contact">
            <h2>
              <span>10</span>Contact us
            </h2>
            <p>
              For questions about these terms or a copyright concern, visit our{" "}
              <Link href="/contact">Contact Us page</Link>. For information
              about how data is handled, read our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </article>
      </div>
    </InfoPage>
  );
}
