import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export type Source = {
  id: string;
  name: string;
  bytes: Uint8Array;
  count: number;
  color: string;
};
export type PageItem = {
  id: string;
  sourceId: string;
  index: number;
  rotation: number;
};
export const sourceColors = ["#ef7948", "#719987", "#8199c5", "#b395ba"];

export async function createExample(): Promise<Source> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const titles = [
    "A clearer picture.",
    "The year in numbers",
    "Built for what is next",
    "Our progress",
    "People at the center",
    "Looking forward",
  ];
  for (let i = 0; i < titles.length; i++) {
    const page = doc.addPage([420, 594]);
    const accent = rgb(0.88, 0.36, 0.18);
    page.drawText("FORM & FIELD", {
      x: 34,
      y: 552,
      size: 9,
      font: bold,
      color: accent,
    });
    page.drawText("ANNUAL REPORT / 2025", {
      x: 34,
      y: 520,
      size: 7,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText(titles[i], {
      x: 34,
      y: 452,
      size: i === 0 ? 29 : 23,
      font: bold,
      color: rgb(0.16, 0.19, 0.17),
    });
    page.drawText("Small steps. Meaningful change.", {
      x: 34,
      y: 425,
      size: 10,
      font,
      color: rgb(0.4, 0.43, 0.41),
    });
    if (i === 0) {
      page.drawRectangle({
        x: 34,
        y: 99,
        width: 352,
        height: 285,
        color: rgb(0.88, 0.91, 0.85),
      });
      for (let j = 0; j < 5; j++)
        page.drawRectangle({
          x: 50 + j * 63,
          y: 99,
          width: 44,
          height: 70 + j * 39,
          color: rgb(0.27 + j * 0.03, 0.37 + j * 0.03, 0.29 + j * 0.03),
        });
      page.drawText("2025", {
        x: 50,
        y: 336,
        size: 35,
        font: bold,
        color: rgb(0.25, 0.36, 0.28),
      });
    } else {
      page.drawText(i % 2 ? "24%" : "Together, we grow.", {
        x: 34,
        y: 335,
        size: i % 2 ? 65 : 24,
        font: bold,
        color: accent,
      });
      page.drawText("A year of purposeful progress", {
        x: 34,
        y: 310,
        size: 10,
        font,
      });
      for (let j = 0; j < 12; j++)
        page.drawRectangle({
          x: 34,
          y: 258 - j * 11,
          width: j % 4 === 3 ? 240 : 352,
          height: 3,
          color: rgb(0.83, 0.85, 0.83),
        });
      for (let j = 0; j < 6; j++)
        page.drawRectangle({
          x: 34 + j * 57,
          y: 63,
          width: 39,
          height: 25 + ((j * 17 + i * 13) % 65),
          color: j % 2 ? rgb(0.82, 0.89, 0.8) : accent,
        });
    }
    page.drawText("FORM & FIELD  /  ANNUAL REPORT 2025", {
      x: 34,
      y: 30,
      size: 6,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText(String(i + 1).padStart(2, "0"), {
      x: 375,
      y: 30,
      size: 7,
      font,
    });
  }
  return {
    id: "example",
    name: "Annual report 2025.pdf",
    bytes: await doc.save(),
    count: 6,
    color: sourceColors[0],
  };
}

export async function exportPages(pages: PageItem[], sources: Source[]) {
  const result = await PDFDocument.create();
  const cache = new Map<string, PDFDocument>();
  for (const page of pages) {
    let source = cache.get(page.sourceId);
    if (!source) {
      const data = sources.find((s) => s.id === page.sourceId);
      if (!data) throw new Error("The source document could not be found.");
      source = await PDFDocument.load(data.bytes);
      cache.set(page.sourceId, source);
    }
    const [copy] = await result.copyPages(source, [page.index]);
    copy.setRotation(degrees((copy.getRotation().angle + page.rotation) % 360));
    result.addPage(copy);
  }
  return result.save();
}

export function downloadPdf(bytes: Uint8Array, name: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
