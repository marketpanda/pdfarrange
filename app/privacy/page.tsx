import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { contactEmail, policyUpdated } from "@/lib/site";
export const metadata: Metadata = {
  title: "Privacy Policy | PDFarrange",
  description:
    "How PDFarrange handles local PDF files, support requests, and website information.",
};
const sections = [
  {
    id: "scope",
    title: "About this policy",
    text: "This policy describes how the current PDFarrange website handles information when you use its PDF tools or contact us. It distinguishes the local guest workspace from account and cloud features that are still planned. It does not describe those planned features as already operating.",
  },
  {
    id: "your-pdfs",
    title: "Your PDFs stay in your browser",
    text: "The current editing tools read PDF files you select into browser memory and process them locally. The tools do not upload your PDF contents, filenames, page previews, or exported documents to a PDFarrange server. We do not use those local documents for advertising or model training. Your exported PDF is downloaded to the location managed by your browser.",
  },
  {
    id: "session",
    title: "Temporary workspace and retention",
    text: "The app does not save your PDF workspace to an account, database, browser local storage, or browser IndexedDB. Removing a document removes it from the active workspace. Refreshing, leaving, or closing the session can clear the workspace. Downloads and original files remain on your device until you remove them. Browser and operating-system memory management is outside the app’s control, so this is not a promise of secure deletion from your device.",
  },
  {
    id: "website-data",
    title: "Website requests and technical information",
    text: "Opening the website sends normal web requests to the hosting infrastructure. Depending on deployment configuration, hosting providers may process information such as IP addresses, requested URLs, browser details, request times, and errors to deliver and protect the website. These requests do not include your local PDF contents. Hosting log retention depends on the provider and the deployment’s settings; no fixed retention period is represented here.",
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    text: "The current application does not add advertising trackers, analytics tools, or app-managed cookies. Hosting infrastructure and external websites may apply their own cookie policies. PDFarrange’s editing workflow does not require access to your Google account. If you follow a Google sign-in link configured by the site operator, that authentication service handles the information you provide under its own notices.",
  },
  {
    id: "support",
    title: "When you contact us",
    text: contactEmail
      ? "If you choose to contact us by email, we receive the address and message you send, along with any details you choose to include. We use them to respond to your question, investigate an issue, or handle a request. The contact form opens your email app; it does not submit your message or PDF files to a server itself. Please do not send confidential documents or unnecessary sensitive information."
      : "Support currently uses GitHub issues. The contact form creates a draft in GitHub; it does not submit a message to PDFarrange itself. If you publish an issue, GitHub processes your account information and the content you provide, and that issue can be publicly visible. Do not include confidential documents or personal information. GitHub controls its own records and retention under its privacy policy.",
  },
  {
    id: "third-parties",
    title: "External services",
    text: "Links to GitHub or an authentication provider take you to services that operate independently of PDFarrange. Their privacy policies govern information you give them. The PDF processing libraries are delivered as part of this application; they do not require uploading your PDFs to an external processing service.",
  },
  {
    id: "future-features",
    title: "Future accounts and cloud storage",
    text: "Google account access and cloud document storage are planned. Before those features launch, this policy will be updated to explain what account and document information is collected, why it is used, where it is stored, who processes it, retention periods, and available deletion controls. An existing local workspace will not be treated as consent to upload your documents automatically.",
  },
  {
    id: "your-choices",
    title: "Your choices and privacy requests",
    text: "You can use the current tools as a guest, remove documents from your workspace, and decide whether to save exported files. We cannot access or retrieve PDFs that remain only in your browser. For questions, corrections, or deletion requests relating to information you have shared through support, use the Contact Us page. Describe a privacy concern without publishing sensitive or identifying information; third-party account or issue records may also need to be managed with that provider.",
  },
  {
    id: "changes",
    title: "Policy updates",
    text: "We will update this page when the application’s data handling changes. The date above identifies the current version. Material changes will be communicated through the website where required. The description on this page applies to the current service, rather than features that may be added later.",
  },
];
export default function PrivacyPage() {
  return (
    <InfoPage
      current="/privacy"
      eyebrow="YOUR FILES. YOUR SPACE."
      title="Privacy Policy"
      description="Clear information about what stays on your device and what happens when you visit or get in touch."
    >
      <div className="policy-layout">
        <aside className="policy-contents">
          <span>ON THIS PAGE</span>
          <nav aria-label="Privacy sections">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
            <a href="#contact">
              <span>11</span>Contact us
            </a>
          </nav>
        </aside>
        <article className="policy-article">
          <div className="policy-date">Last updated: {policyUpdated}</div>
          <div className="policy-summary">
            <strong>Your documents are processed locally.</strong>
            <p>
              The current PDF tools keep your files in your browser. Website
              hosting and support services are described separately below.
            </p>
          </div>
          {sections.map((section, index) => (
            <section id={section.id} key={section.id}>
              <h2>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <p>{section.text}</p>
              {section.id === "third-parties" && (
                <p>
                  Learn more in{" "}
                  <a
                    href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub’s Privacy Statement
                  </a>
                  .
                </p>
              )}
            </section>
          ))}
          <section id="contact">
            <h2>
              <span>11</span>Contact us
            </h2>
            <p>
              For privacy questions or concerns, visit our{" "}
              <Link href="/contact">Contact Us page</Link>
              {contactEmail ? (
                <>
                  {" "}
                  or email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </>
              ) : null}
              . Please don’t post private documents or identifying details in a
              public support issue.
            </p>
          </section>
        </article>
      </div>
    </InfoPage>
  );
}
