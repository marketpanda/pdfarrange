"use client";
import { useEffect, useRef, useState } from "react";
import type { Source } from "@/lib/pdf";
import { FileText } from "lucide-react";

export function PdfThumbnail({
  source,
  index,
  rotation,
  large = false,
}: {
  source: Source;
  index: number;
  rotation: number;
  large?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    async function render() {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const task = pdfjs.getDocument({ data: source.bytes.slice() });
      cleanup = () => {
        void task.destroy();
      };
      const doc = await task.promise;
      if (cancelled) return;
      const page = await doc.getPage(index + 1);
      const viewport = page.getViewport({
        scale: large ? 1.5 : 0.7,
        rotation: (page.rotate + rotation) % 360,
      });
      if (!canvas.current || cancelled) return;
      canvas.current.width = viewport.width;
      canvas.current.height = viewport.height;
      const context = canvas.current.getContext("2d");
      if (context)
        await page.render({
          canvas: canvas.current,
          canvasContext: context,
          viewport,
        }).promise;
    }
    render().catch(() => {
      if (!cancelled) setFailed(true);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [source, index, rotation, large]);
  return failed ? (
    <div className="thumbnail-fallback">
      <FileText size={32} />
      <span>Page {index + 1}</span>
    </div>
  ) : (
    <canvas
      ref={canvas}
      className="pdf-canvas"
      aria-label={`Page ${index + 1} of ${source.name}`}
    />
  );
}
