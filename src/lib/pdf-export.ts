import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const MARGIN_MM = 14;
const FOOTER_MM = 10;

async function render(element: HTMLElement) {
  return html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
}

/** Fit an entire element onto one A4 page (used for the one-page summary). */
export async function exportElementToPdf(element: HTMLElement, fileName: string) {
  const canvas = await render(element);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const maxW = pageW - MARGIN_MM * 2;
  const maxH = pageH - MARGIN_MM * 2;
  const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", (pageW - w) / 2, MARGIN_MM, w, h);
  pdf.save(`${fileName}.pdf`);
}

/**
 * Multi-page A4 export that breaks pages between block elements (never through
 * a heading, paragraph, table row or list item) so the document reads cleanly.
 */
export async function exportElementToPaginatedPdf(
  element: HTMLElement,
  fileName: string,
  meta?: { title?: string; subtitle?: string },
) {
  const canvas = await render(element);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN_MM * 2;
  const contentH = pageH - MARGIN_MM - FOOTER_MM - MARGIN_MM;

  const scale = canvas.width / element.offsetWidth; // css px -> canvas px
  const mmPerPx = contentW / canvas.width; // canvas px -> mm
  const pageSlicePx = Math.floor(contentH / mmPerPx); // canvas px per page

  // Candidate break offsets: bottom edge of every block-level descendant.
  const rootTop = element.getBoundingClientRect().top;
  const breaks = new Set<number>([0, canvas.height]);
  element
    .querySelectorAll<HTMLElement>("h1,h2,h3,h4,p,li,tr,pre,blockquote,table,hr,img,div.a4-block")
    .forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.height <= 0) return;
      breaks.add(Math.round((rect.bottom - rootTop) * scale));
      breaks.add(Math.round((rect.top - rootTop) * scale));
    });
  const stops = [...breaks].filter((v) => v >= 0 && v <= canvas.height).sort((a, b) => a - b);

  const slices: Array<[number, number]> = [];
  let cursor = 0;
  while (cursor < canvas.height - 2) {
    const limit = cursor + pageSlicePx;
    if (limit >= canvas.height) {
      slices.push([cursor, canvas.height]);
      break;
    }
    // last block boundary that fits on this page
    let end = 0;
    for (const s of stops) {
      if (s > cursor + pageSlicePx * 0.35 && s <= limit) end = s;
    }
    if (!end) end = limit; // no clean break available — hard cut
    slices.push([cursor, end]);
    cursor = end;
  }

  const total = slices.length;
  slices.forEach(([from, to], i) => {
    if (i > 0) pdf.addPage();
    const h = to - from;
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = h;
    const ctx = slice.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, from, canvas.width, h, 0, 0, canvas.width, h);
    pdf.addImage(
      slice.toDataURL("image/jpeg", 0.92),
      "JPEG",
      MARGIN_MM,
      MARGIN_MM,
      contentW,
      h * mmPerPx,
    );

    pdf.setFontSize(8);
    pdf.setTextColor(130);
    const left = meta?.title ? `${meta.title}${meta.subtitle ? ` · ${meta.subtitle}` : ""}` : "Aniweb Designs";
    pdf.text(left.slice(0, 90), MARGIN_MM, pageH - FOOTER_MM + 2);
    pdf.text(`Page ${i + 1} of ${total}`, pageW - MARGIN_MM, pageH - FOOTER_MM + 2, { align: "right" });
  });

  pdf.save(`${fileName}.pdf`);
}