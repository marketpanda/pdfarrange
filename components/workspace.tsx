"use client";

import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  FilePlus2,
  Files,
  FileText,
  FolderOpen,
  Grip,
  GripVertical,
  HelpCircle,
  LayoutGrid,
  Loader2,
  LockKeyhole,
  Menu,
  Merge,
  Plus,
  RotateCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  ZoomIn,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PdfThumbnail } from "@/components/pdf-thumbnail";
import {
  createExample,
  downloadPdf,
  exportPages,
  sourceColors,
  type PageItem,
  type Source,
} from "@/lib/pdf";

type Tool = "arrange" | "merge" | "split";
const toolNames = {
  arrange: "Organize pages",
  merge: "Merge PDFs",
  split: "Split PDF",
};
export function Workspace() {
  const [sources, setSources] = useState<Source[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tool, setTool] = useState<Tool>("arrange");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [signIn, setSignIn] = useState(false);
  const [help, setHelp] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [fileName, setFileName] = useState("My arranged document");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let alive = true;
    createExample()
      .then((source) => {
        if (alive) {
          setSources([source]);
          setPages(
            Array.from({ length: source.count }, (_, index) => ({
              id: `${source.id}-${index}`,
              sourceId: source.id,
              index,
              rotation: 0,
            })),
          );
        }
      })
      .catch(() => {
        if (alive)
          setNotice("The sample could not load. Upload a PDF to get started.");
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 7000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function upload(files: FileList | File[]) {
    if (busy) return;
    setBusy(true);
    try {
      const incoming = Array.from(files);
      const existing = sources.filter((s) => s.id !== "example");
      if (incoming.length + existing.length > 3)
        throw new Error(
          "Guest workspaces support up to 3 PDFs. Remove a file to add another.",
        );
      const next: Source[] = [];
      for (const file of incoming) {
        if (!file.name.toLowerCase().endsWith(".pdf"))
          throw new Error("Please upload PDF files only.");
        if (file.size > 20 * 1024 * 1024)
          throw new Error("Guest uploads are limited to 20 MB per file.");
        const bytes = new Uint8Array(await file.arrayBuffer());
        const doc = await PDFDocument.load(bytes);
        next.push({
          id: crypto.randomUUID(),
          name: file.name,
          bytes,
          count: doc.getPageCount(),
          color:
            sourceColors[(existing.length + next.length) % sourceColors.length],
        });
      }
      const existingPages = pages.filter((p) => p.sourceId !== "example");
      const newPages = next.flatMap((s) =>
        Array.from({ length: s.count }, (_, index) => ({
          id: `${s.id}-${index}`,
          sourceId: s.id,
          index,
          rotation: 0,
        })),
      );
      if (existingPages.length + newPages.length > 25)
        throw new Error(
          "Guest workspaces support up to 25 pages. Try a smaller document.",
        );
      setSources([...existing, ...next]);
      setPages([...existingPages, ...newPages]);
      setSelected(new Set());
      setFilter("all");
      setNotice(
        `${next.length} ${next.length === 1 ? "PDF" : "PDFs"} added. You're ready to arrange.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "This PDF could not be opened. Try an unencrypted PDF.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  const visiblePages = pages.filter(
    (p) => filter === "all" || p.sourceId === filter,
  );
  const previewPage = pages.find((p) => p.id === preview);
  function toggle(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function move(id: string, direction: number) {
    setPages((previous) => {
      const next = [...previous];
      const index = next.findIndex((p) => p.id === id);
      const target = index + direction;
      if (target >= 0 && target < next.length)
        [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function reorder(target: string) {
    if (!dragged || dragged === target) return;
    setPages((previous) => {
      const next = [...previous];
      const from = next.findIndex((p) => p.id === dragged);
      const to = next.findIndex((p) => p.id === target);
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDragged(null);
  }
  function removeSelected() {
    setPages((previous) => previous.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  }
  async function save() {
    if (!pages.length) return;
    const output =
      tool === "split" ? pages.filter((p) => selected.has(p.id)) : pages;
    if (!output.length) {
      setNotice("Select the pages you want to extract first.");
      return;
    }
    setBusy(true);
    try {
      downloadPdf(
        await exportPages(output, sources),
        `${fileName.trim() || "pdfarrange"}${tool === "split" ? "-extracted" : ""}.pdf`,
      );
      setNotice(`${output.length} pages exported. Your PDF is ready!`);
    } catch {
      setNotice("We couldn't export this document. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function chooseTool(next: Tool) {
    setTool(next);
    setSidebarOpen(false);
  }
  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <Link className="brand" href="/" aria-label="PDFarrange home">
          <span className="brand-icon">
            <Files size={22} strokeWidth={1.8} />
          </span>
          <span>
            pdf<span className="brand-light">arrange</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav className="main-nav" aria-label="PDF tools">
          <button
            className={tool === "arrange" ? "nav-item active" : "nav-item"}
            onClick={() => chooseTool("arrange")}
          >
            <LayoutGrid size={18} />
            Organize pages
            <span className="nav-active-dot" />
          </button>
          <button
            className={tool === "merge" ? "nav-item active" : "nav-item"}
            onClick={() => chooseTool("merge")}
          >
            <Merge size={18} />
            Merge PDFs
          </button>
          <button
            className={tool === "split" ? "nav-item active" : "nav-item"}
            onClick={() => chooseTool("split")}
          >
            <Scissors size={18} />
            Split PDF
          </button>
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-files-heading">
          <span>IN THIS SESSION</span>
          <span>{sources.length}</span>
        </div>
        <button
          className={`session-file ${filter === "all" ? "current" : ""}`}
          onClick={() => setFilter("all")}
        >
          <FolderOpen size={17} />
          <span>All documents</span>
          <span className="file-count">{pages.length}</span>
        </button>
        {sources.map((source) => (
          <div key={source.id} className="source-row">
            <button
              className={`session-file ${filter === source.id ? "current" : ""}`}
              onClick={() => setFilter(source.id)}
            >
              <FileText size={16} style={{ color: source.color }} />
              <span title={source.name}>{source.name}</span>
            </button>
            <button
              className="remove-source"
              aria-label={`Remove ${source.name}`}
              onClick={() => {
                setSources((prev) => prev.filter((s) => s.id !== source.id));
                setPages((prev) =>
                  prev.filter((p) => p.sourceId !== source.id),
                );
                setSelected(new Set());
                setFilter("all");
              }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button
          className="add-sidebar"
          onClick={() => input.current?.click()}
          disabled={busy}
        >
          <Plus size={15} />
          Add a document
        </button>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon">
              <Sparkles size={19} />
            </span>
            <h3>A little more room.</h3>
            <p>
              Working on something bigger?
              <br />
              An account is coming soon.
            </p>
            <Button variant="outline" onClick={() => setSignIn(true)}>
              Explore account access
              <ArrowRight size={14} />
            </Button>
          </div>
          <button className="help-button" onClick={() => setHelp(true)}>
            <HelpCircle size={17} />
            Help & getting started
            <ArrowRight size={14} />
          </button>
          <div className="sidebar-footnote">
            <span className="status-dot" />
            All systems locally yours
          </div>
        </div>
      </aside>
      {sidebarOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{toolNames[tool]}</strong>
          </div>
          <div className="account-actions">
            <span className="guest-badge">
              <span />
              Guest workspace
            </span>
            <Button variant="outline" size="sm" onClick={() => setSignIn(true)}>
              <GoogleIcon />
              Sign in with Google
            </Button>
            <div className="avatar">G</div>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">LESS PAPERWORK. MORE POSSIBILITY.</div>
              <h1>
                {tool === "arrange"
                  ? "A little order for your PDFs."
                  : tool === "merge"
                    ? "Better together."
                    : "Just the pages you need."}
              </h1>
              <p>
                {tool === "arrange"
                  ? "Rearrange, rotate, and tidy up. Your perfect PDF starts here."
                  : tool === "merge"
                    ? "Bring your documents together into one seamless PDF."
                    : "Select the pages you want and extract them into a new PDF."}
              </p>
            </div>
            <span className="heading-illustration">
              <Files size={43} strokeWidth={1.25} />
              <span className="illustration-spark">✦</span>
            </span>
          </div>
          <input
            ref={input}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files?.length) void upload(event.target.files);
            }}
          />
          <div
            className={`upload-zone ${dropActive ? "drop-active" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              if (event.dataTransfer.types.includes("Files"))
                setDropActive(true);
            }}
            onDragLeave={() => setDropActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDropActive(false);
              if (event.dataTransfer.files.length)
                void upload(event.dataTransfer.files);
            }}
          >
            <span className="upload-icon">
              <CloudUpload size={26} strokeWidth={1.5} />
            </span>
            <div className="upload-copy">
              <h2>Good things start with a drop.</h2>
              <p>
                Drag your PDFs here, or{" "}
                <button onClick={() => input.current?.click()} disabled={busy}>
                  browse files
                </button>
              </p>
              <span>PDF files up to 20 MB · Up to 3 files as a guest</span>
            </div>
            <Button
              variant="outline"
              onClick={() => input.current?.click()}
              disabled={busy}
            >
              {busy ? <Loader2 className="animate-spin" /> : <Plus />}Add PDFs
            </Button>
          </div>
          <div className="workspace-panel">
            <div className="panel-heading">
              <div className="document-heading">
                <span className="document-icon">
                  <Files size={19} />
                </span>
                <div>
                  <h2>
                    {sources.length === 1
                      ? sources[0].name.replace(/\.pdf$/i, "")
                      : "Your document collection"}
                    {sources[0]?.id === "example" && (
                      <span className="example-tag">SAMPLE</span>
                    )}
                  </h2>
                  <p>
                    {sources.length}{" "}
                    {sources.length === 1 ? "document" : "documents"}
                    <span>·</span>
                    {pages.length} pages<span>·</span>
                    {sources[0]?.id === "example"
                      ? "Try it out, or upload your own"
                      : "Changes saved in this session"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Add another PDF"
                onClick={() => input.current?.click()}
                disabled={busy}
              >
                <FilePlus2 />
              </Button>
            </div>
            <div className="workspace-toolbar">
              <div
                className="tool-tabs"
                role="tablist"
                aria-label="Document actions"
              >
                <button
                  role="tab"
                  aria-selected={tool === "arrange"}
                  className={tool === "arrange" ? "selected" : ""}
                  onClick={() => chooseTool("arrange")}
                >
                  <LayoutGrid size={15} />
                  Arrange
                </button>
                <button
                  role="tab"
                  aria-selected={tool === "merge"}
                  className={tool === "merge" ? "selected" : ""}
                  onClick={() => chooseTool("merge")}
                >
                  <Merge size={15} />
                  Merge
                </button>
                <button
                  role="tab"
                  aria-selected={tool === "split"}
                  className={tool === "split" ? "selected" : ""}
                  onClick={() => chooseTool("split")}
                >
                  <Scissors size={15} />
                  Split
                </button>
              </div>
              <div className="toolbar-actions">
                <button
                  onClick={() =>
                    setSelected((previous) =>
                      visiblePages.every((p) => previous.has(p.id))
                        ? new Set()
                        : new Set(visiblePages.map((p) => p.id)),
                    )
                  }
                  disabled={!visiblePages.length}
                >
                  <CheckCheck size={15} />
                  <span>
                    {visiblePages.length > 0 &&
                    visiblePages.every((p) => selected.has(p.id))
                      ? "Deselect all"
                      : "Select all"}
                  </span>
                </button>
                <span className="toolbar-divider" />
                <button
                  onClick={() =>
                    setPages((previous) =>
                      [...previous].sort(
                        (a, b) =>
                          sources.findIndex((s) => s.id === a.sourceId) -
                            sources.findIndex((s) => s.id === b.sourceId) ||
                          a.index - b.index,
                      ),
                    )
                  }
                  disabled={!pages.length}
                >
                  <ArrowUpDown size={15} />
                  <span>Sort by page</span>
                </button>
              </div>
            </div>
            <div className="grid-helper">
              <span>
                {selected.size
                  ? `${selected.size} ${selected.size === 1 ? "page" : "pages"} selected`
                  : tool === "split"
                    ? "Select pages to extract into a new PDF"
                    : "Drag pages to put them in the right order"}
              </span>
              <div>
                {selected.size > 0 && (
                  <>
                    <button
                      aria-label="Rotate selected pages"
                      onClick={() =>
                        setPages((prev) =>
                          prev.map((p) =>
                            selected.has(p.id)
                              ? { ...p, rotation: (p.rotation + 90) % 360 }
                              : p,
                          ),
                        )
                      }
                    >
                      <RotateCw size={14} />
                      Rotate
                    </button>
                    <button
                      className="delete-selected"
                      onClick={removeSelected}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </>
                )}
                <Grip size={15} />
                <span>{filter === "all" ? "All pages" : "Filtered pages"}</span>
              </div>
            </div>
            <div className="pages-grid">
              {visiblePages.map((page) => {
                const source = sources.find((s) => s.id === page.sourceId)!;
                const position = pages.findIndex((p) => p.id === page.id);
                return (
                  <article
                    className={`page-card ${selected.has(page.id) ? "is-selected" : ""} ${dragged === page.id ? "is-dragging" : ""}`}
                    key={page.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", page.id);
                      event.dataTransfer.effectAllowed = "move";
                      setDragged(page.id);
                    }}
                    onDragEnd={() => setDragged(null)}
                    onDragOver={(event) => {
                      if (dragged) event.preventDefault();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      reorder(page.id);
                    }}
                  >
                    <div className="page-preview">
                      <button
                        className={`page-checkbox ${selected.has(page.id) ? "checked" : ""}`}
                        aria-label={`Select page ${position + 1}`}
                        aria-pressed={selected.has(page.id)}
                        onClick={() => toggle(page.id)}
                      >
                        {selected.has(page.id) && (
                          <Check size={12} strokeWidth={3} />
                        )}
                      </button>
                      <button
                        className="preview-zoom"
                        aria-label={`Preview page ${position + 1}`}
                        onClick={() => setPreview(page.id)}
                      >
                        <ZoomIn size={15} />
                      </button>
                      <div
                        className="paper"
                        onDoubleClick={() => setPreview(page.id)}
                      >
                        <PdfThumbnail
                          source={source}
                          index={page.index}
                          rotation={page.rotation}
                        />
                      </div>
                      <div className="page-hover-actions">
                        <button
                          aria-label={`Move page ${position + 1} left`}
                          disabled={position === 0}
                          onClick={() => move(page.id, -1)}
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          aria-label={`Rotate page ${position + 1}`}
                          onClick={() =>
                            setPages((prev) =>
                              prev.map((p) =>
                                p.id === page.id
                                  ? { ...p, rotation: (p.rotation + 90) % 360 }
                                  : p,
                              ),
                            )
                          }
                        >
                          <RotateCw size={14} />
                        </button>
                        <button
                          aria-label={`Move page ${position + 1} right`}
                          disabled={position === pages.length - 1}
                          onClick={() => move(page.id, 1)}
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="page-card-footer">
                      <span>
                        <span
                          className="source-dot"
                          style={{ backgroundColor: source.color }}
                        />
                        Page {position + 1}
                      </span>
                      <GripVertical size={15} />
                    </div>
                    <div className="page-source" title={source.name}>
                      {source.name} · {page.index + 1}
                    </div>
                  </article>
                );
              })}
              {!visiblePages.length && (
                <div className="empty-state">
                  <Files size={36} />
                  <h3>A fresh start.</h3>
                  <p>Add a PDF to fill your workspace.</p>
                  <Button
                    variant="outline"
                    onClick={() => input.current?.click()}
                  >
                    Upload a PDF
                  </Button>
                </div>
              )}
            </div>
            <div className="panel-bottom">
              <span>
                <span
                  className="source-dot"
                  style={{ backgroundColor: sourceColors[0] }}
                />
                {sources.length === 1
                  ? "One document. Endless possibilities."
                  : "All your pages, in one place."}
              </span>
              <span>
                <LockKeyhole size={12} />
                Files stay in your browser
              </span>
            </div>
          </div>
          <div className="export-bar">
            <div className="export-info">
              <span className="export-icon">
                <FileText size={21} />
              </span>
              <div>
                <label htmlFor="output-name">Your finished PDF</label>
                <div className="output-name">
                  <input
                    id="output-name"
                    aria-label="Output PDF filename"
                    value={fileName}
                    onChange={(event) => setFileName(event.target.value)}
                    maxLength={100}
                  />
                  <span>.pdf</span>
                </div>
              </div>
            </div>
            <div className="export-actions">
              <span>
                {tool === "split" ? selected.size : pages.length} pages
                <ArrowRight size={13} />1 PDF
              </span>
              <Button
                onClick={() => void save()}
                disabled={
                  busy || !pages.length || (tool === "split" && !selected.size)
                }
              >
                {busy ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowDownToLine />
                )}
                {tool === "merge"
                  ? "Merge & download"
                  : tool === "split"
                    ? "Extract & download"
                    : "Export PDF"}
              </Button>
            </div>
          </div>
          <div className="trust-row">
            <span>
              <ShieldCheck size={15} />
              Private by design
            </span>
            <span className="trust-dot">·</span>
            <span>No uploads to a server</span>
            <span className="trust-dot">·</span>
            <span>
              Made for a smoother workflow<span className="tiny-spark">✦</span>
            </span>
          </div>
        </main>
        <SiteFooter workspace />
      </div>
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <Dialog open={signIn} onOpenChange={setSignIn}>
        <DialogContent>
          <div className="dialog-logo">
            <Files size={28} />
          </div>
          <DialogTitle className="mt-5 text-2xl font-semibold tracking-tight">
            Make room for more.
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">
            Your guest workspace includes 3 PDFs, 25 pages, and files up to 20
            MB. Arrange, merge, and extract pages right in your browser.
          </DialogDescription>
          <div className="auth-info">
            <LockKeyhole size={18} />
            <p>
              Google account access is coming soon, with cloud storage and more
              room for larger documents.
            </p>
          </div>
          <Button
            className="mt-5 w-full"
            disabled={!process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL}
            onClick={() => {
              if (process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL)
                window.location.assign(process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL);
            }}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          {!process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Google sign-in hasn’t been connected yet.
            </p>
          )}
          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={() => setSignIn(false)}
          >
            Continue as a guest
            <ArrowRight />
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent>
          <DialogTitle className="text-xl font-semibold">
            A little guidance.
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            Your PDF, exactly how you want it.
          </DialogDescription>
          <ol className="help-list">
            <li>
              <strong>01 / Add your PDFs</strong>
              <p>
                Drop files into the upload area. Your first upload replaces the
                sample.
              </p>
            </li>
            <li>
              <strong>02 / Make it yours</strong>
              <p>
                Drag to reorder, or use each page’s arrows. Select pages to
                rotate or remove them. Use the magnifying glass to preview.
              </p>
            </li>
            <li>
              <strong>03 / Export your document</strong>
              <p>
                Arrange and Merge export all pages in their current order. Split
                extracts selected pages into a separate PDF.
              </p>
            </li>
          </ol>
          <p className="text-xs leading-5 text-muted-foreground">
            Files stay in this browser session. Download your work before
            refreshing or leaving.
          </p>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!previewPage}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent className="preview-dialog">
          <DialogTitle className="text-base font-semibold">
            Page{" "}
            {previewPage
              ? pages.findIndex((p) => p.id === previewPage.id) + 1
              : ""}
          </DialogTitle>
          <DialogDescription className="mt-1 truncate text-xs text-muted-foreground">
            {sources.find((s) => s.id === previewPage?.sourceId)?.name}
          </DialogDescription>
          {previewPage && (
            <div className="large-preview">
              <PdfThumbnail
                source={sources.find((s) => s.id === previewPage.sourceId)!}
                index={previewPage.index}
                rotation={previewPage.rotation}
                large
              />
            </div>
          )}
          <div className="preview-navigation">
            <Button
              variant="outline"
              size="sm"
              disabled={!previewPage || pages.indexOf(previewPage) === 0}
              onClick={() => {
                if (previewPage)
                  setPreview(pages[pages.indexOf(previewPage) - 1]?.id ?? null);
              }}
            >
              <ChevronLeft />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                !previewPage || pages.indexOf(previewPage) === pages.length - 1
              }
              onClick={() => {
                if (previewPage)
                  setPreview(pages[pages.indexOf(previewPage) + 1]?.id ?? null);
              }}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.81-1.76-5.6-4.13H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.06a10 10 0 0 0 0 9.02l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.34 2.59A5.98 5.98 0 0 1 12 5.95Z"
      />
    </svg>
  );
}
