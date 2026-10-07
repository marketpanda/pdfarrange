"use client";
import { useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supportUrl } from "@/lib/site";

export function ContactForm({ email }: { email?: string }) {
  const [topic, setTopic] = useState("General question");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || message.trim().length < 10) {
      setError("Please add a subject and a message of at least 10 characters.");
      return;
    }
    setError("");
    const title = `[${topic}] ${subject.trim()}`;
    const body = message.trim();
    const url = email
      ? `mailto:${email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
      : `${supportUrl}/new?${new URLSearchParams({ title, body }).toString()}`;
    if (email) window.location.assign(url);
    else window.open(url, "_blank", "noopener,noreferrer");
    setOpened(true);
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="section-kicker">
        <Mail size={16} />
        START A CONVERSATION
      </div>
      <h2>A small question? A big idea?</h2>
      <p>
        {email
          ? "Write your message below, then send it through your email app."
          : "Write your message below, then review and submit it on GitHub."}
      </p>
      <label htmlFor="contact-topic">What can we help with?</label>
      <select
        id="contact-topic"
        value={topic}
        onChange={(e) => {
          setTopic(e.target.value);
          setOpened(false);
        }}
      >
        <option>General question</option>
        <option>Report a bug</option>
        <option>Feature request</option>
        <option>Privacy question</option>
        <option>Copyright concern</option>
      </select>
      <label htmlFor="contact-subject">Subject</label>
      <input
        id="contact-subject"
        required
        maxLength={120}
        placeholder="Give your message a little context"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          setOpened(false);
        }}
      />
      <label htmlFor="contact-message">Your message</label>
      <textarea
        id="contact-message"
        required
        minLength={10}
        maxLength={3000}
        rows={6}
        placeholder="Tell us what’s on your mind…"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setOpened(false);
        }}
      />
      <p className="contact-disclosure">
        {email
          ? "Please leave out confidential documents and sensitive personal information."
          : "GitHub issues are public and require a GitHub account. Please leave out private documents and personal information. For a privacy question, describe the issue without sharing identifying details."}
      </p>
      <Button type="submit">
        {email ? "Open email draft" : "Continue on GitHub"}
        <ArrowUpRight />
      </Button>
      {error && (
        <p className="contact-feedback" role="alert">
          {error}
        </p>
      )}
      {opened && (
        <p className="contact-feedback" role="status">
          {email
            ? "Your email draft was requested. Send it from your email app to complete your message."
            : "A GitHub issue draft was opened. Review it and submit it there to complete your message. If a new tab didn’t open, allow pop-ups and try again."}
        </p>
      )}
    </form>
  );
}
