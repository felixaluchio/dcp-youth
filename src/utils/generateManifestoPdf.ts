import { jsPDF } from 'jspdf';
import { ELEVEN_PILLARS } from '../data/kenyaData';

export const generateManifestoPdf = async (): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2;
  const topMargin = 22;
  const bottomMargin = 22;

  let currentY = topMargin;

  // Colors
  const COLOR_GREEN: [number, number, number] = [0, 132, 61]; // Kenya Green #00843D
  const COLOR_RED: [number, number, number] = [187, 0, 0]; // Kenya Red #BB0000
  const COLOR_BLACK: [number, number, number] = [15, 23, 42]; // Slate 900
  const COLOR_MUTED: [number, number, number] = [100, 116, 139]; // Slate 500
  const COLOR_LIGHT_BG: [number, number, number] = [248, 250, 252]; // Slate 50
  const COLOR_BORDER: [number, number, number] = [226, 232, 240]; // Slate 200

  const drawKenyaFlagBar = (y: number, height: number = 2.5) => {
    const barWidth = contentWidth / 3;
    // Black segment
    doc.setFillColor(0, 0, 0);
    doc.rect(marginX, y, barWidth, height, 'F');
    // Red segment
    doc.setFillColor(...COLOR_RED);
    doc.rect(marginX + barWidth, y, barWidth, height, 'F');
    // Green segment
    doc.setFillColor(...COLOR_GREEN);
    doc.rect(marginX + barWidth * 2, y, barWidth, height, 'F');
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = topMargin + 10;
    }
  };

  // ================= PAGE 1: COVER & EXECUTIVE SUMMARY =================
  drawKenyaFlagBar(currentY, 3);
  currentY += 8;

  // Party Super-header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_GREEN);
  doc.text('DEMOCRACY FOR THE CITIZENS PARTY (DCP)', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('MOTTO: "SKIZA WAKENYA" (LISTEN TO CITIZENS)', pageWidth - marginX, currentY, { align: 'right' });
  currentY += 6;

  // Divider
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 12;

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLOR_BLACK);
  doc.text('THE 11-PILLAR PARTY MANIFESTO', marginX, currentY);
  currentY += 7;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_GREEN);
  doc.text('A Citizen-Centred Blueprint for Devolution, Economic Equity & Dignity', marginX, currentY);
  currentY += 10;

  // Metadata Box
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(marginX, currentY, contentWidth, 16, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_BLACK);
  doc.text('OFFICIAL POLICY DOCUMENT', marginX + 5, currentY + 6);
  doc.text('STATUS: ADOPTED FOR NATIONWIDE ROLLOUT', marginX + 5, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_MUTED);
  doc.text('Publication: September 2026', pageWidth - marginX - 5, currentY + 6, { align: 'right' });
  doc.text('Jurisdiction: All 47 Counties of Kenya', pageWidth - marginX - 5, currentY + 11, { align: 'right' });
  currentY += 24;

  // Executive Preamble
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_BLACK);
  doc.text('1. Executive Preamble & Core Ideology', marginX, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const preambleLines = doc.splitTextToSize(
    'Democracy for the Citizens Party (DCP) presents this comprehensive 11-Pillar Manifesto as an unshakeable social contract with the sovereign people of the Republic of Kenya. Our vision is firmly anchored on democratic social governance, radical economic devolution to the grassroots, complete transparency, and universal citizen empowerment.\n\n' +
    'For far too long, public policymaking has excluded ordinary citizens from decision-making. DCP flips the paradigm through our guiding ethos—"Skiza Wakenya"—ensuring that government listens to the farmer in the village, the small-scale trader in the marketplace, the unemployed graduate, the mother seeking healthcare, and every Kenyan striving for a dignified livelihood. Below are the eleven strategic pillars designed to power Kenya into an equitable, prosperous future.',
    contentWidth
  );
  doc.text(preambleLines, marginX, currentY);
  currentY += preambleLines.length * 4.8 + 8;

  // Pillars Overview Grid (Quick Reference Table)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_BLACK);
  doc.text('2. Summary Matrix: The 11 Pillars at a Glance', marginX, currentY);
  currentY += 6;

  const colWidth = (contentWidth - 6) / 2;
  const cardHeight = 16;

  ELEVEN_PILLARS.slice(0, 6).forEach((p, idx) => {
    const col = idx % 2;
    const x = marginX + col * (colWidth + 6);
    const y = currentY + Math.floor(idx / 2) * (cardHeight + 4);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.roundedRect(x, y, colWidth, cardHeight, 1.5, 1.5, 'FD');

    // Accent line on left
    doc.setFillColor(...COLOR_GREEN);
    doc.rect(x, y, 2, cardHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_BLACK);
    doc.text(`${p.title}`, x + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    const summaryLine = doc.splitTextToSize(p.shortDescription, colWidth - 8)[0] || '';
    doc.text(summaryLine, x + 5, y + 11);
  });

  currentY += Math.ceil(6 / 2) * (cardHeight + 4) + 6;

  // Remaining pillars overview (7 to 11)
  ELEVEN_PILLARS.slice(6, 11).forEach((p, idx) => {
    const col = idx % 2;
    const x = marginX + col * (colWidth + 6);
    const y = currentY + Math.floor(idx / 2) * (cardHeight + 4);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.roundedRect(x, y, colWidth, cardHeight, 1.5, 1.5, 'FD');

    // Accent line on left
    doc.setFillColor(...COLOR_GREEN);
    doc.rect(x, y, 2, cardHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_BLACK);
    doc.text(`${p.title}`, x + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    const summaryLine = doc.splitTextToSize(p.shortDescription, colWidth - 8)[0] || '';
    doc.text(summaryLine, x + 5, y + 11);
  });

  currentY += Math.ceil(5 / 2) * (cardHeight + 4) + 12;

  // ================= DETAILED PILLARS SECTION =================
  doc.addPage();
  currentY = topMargin + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_BLACK);
  doc.text('3. Detailed Policy Commitments & Strategic Framework', marginX, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('Comprehensive policy positions, actionable goals, and implementation strategies for each pillar.', marginX, currentY);
  currentY += 10;

  ELEVEN_PILLARS.forEach((pillar) => {
    // Estimate height needed for this pillar block
    const fullDescLines = doc.splitTextToSize(pillar.fullDescription, contentWidth - 12);
    const goalsCount = pillar.keyGoals.length;
    const estimatedHeight = 18 + fullDescLines.length * 4.4 + goalsCount * 7 + 10;

    checkPageBreak(estimatedHeight);

    // Pillar Card Container
    const blockStartY = currentY;

    // Header strip of pillar
    doc.setFillColor(...COLOR_LIGHT_BG);
    doc.setDrawColor(...COLOR_BORDER);
    doc.roundedRect(marginX, currentY, contentWidth, 10, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_BLACK);
    doc.text(`PILLAR ${pillar.id}: ${pillar.title.replace(/^\d+\.\s*/, '').toUpperCase()}`, marginX + 4, currentY + 6.5);

    // Category badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GREEN);
    doc.text(`[ ${pillar.category.toUpperCase()} ]`, pageWidth - marginX - 4, currentY + 6.5, { align: 'right' });
    currentY += 14;

    // Short Summary in bold/italic
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const shortDescLines = doc.splitTextToSize(`"${pillar.shortDescription}"`, contentWidth - 8);
    doc.text(shortDescLines, marginX + 4, currentY);
    currentY += shortDescLines.length * 4.5 + 4;

    // Full Description / Policy Statement
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(fullDescLines, marginX + 4, currentY);
    currentY += fullDescLines.length * 4.4 + 6;

    // Key Goals Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_GREEN);
    doc.text('STRATEGIC ACTION TARGETS & LEGISLATIVE COMMITMENTS:', marginX + 4, currentY);
    currentY += 5;

    // Goals Bullets
    pillar.keyGoals.forEach((goal) => {
      checkPageBreak(8);
      // Bullet mark
      doc.setFillColor(...COLOR_GREEN);
      doc.circle(marginX + 6, currentY - 1.2, 1, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const goalLines = doc.splitTextToSize(goal, contentWidth - 18);
      doc.text(goalLines, marginX + 11, currentY);
      currentY += goalLines.length * 4.2 + 2;
    });

    // Separator line between pillars
    currentY += 4;
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 8;
  });

  // ================= CONCLUDING PARTY CHARTER =================
  checkPageBreak(65);

  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_GREEN);
  doc.setLineWidth(0.8);
  doc.roundedRect(marginX, currentY, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_GREEN);
  doc.text('DCP CITIZEN CHARTER & ACCOUNTABILITY GUARANTEE', marginX + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const pledgeText = doc.splitTextToSize(
    'Every policy item in this 11-Pillar Manifesto is subject to the direct oversight of Kenyan citizens through regular ward-level Skiza Wakenya barazas, annual party scorecards, and legislative tracking by our elected representatives. ' +
    'We pledge uncompromising fidelity to Chapter 6 of the Constitution of Kenya (Leadership & Integrity) and an unwavering focus on transforming livelihoods for this and future generations.',
    contentWidth - 12
  );
  doc.text(pledgeText, marginX + 6, currentY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_BLACK);
  doc.text('DEMOCRACY FOR THE CITIZENS PARTY SECRETARIAT', marginX + 6, currentY + 44);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_MUTED);
  doc.text('Musa Gitau Road, Lavington, Nairobi | Contact: info@dcp.or.ke | Hotline: +254 700 123 456', marginX + 6, currentY + 49);

  // ================= ADD HEADERS & FOOTERS TO ALL PAGES =================
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Header (on pages 2 and later)
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLOR_MUTED);
      doc.text('DEMOCRACY FOR THE CITIZENS PARTY (DCP) · OFFICIAL 11-PILLAR MANIFESTO', marginX, 12);
      doc.text('SKIZA WAKENYA', pageWidth - marginX, 12, { align: 'right' });

      doc.setDrawColor(...COLOR_BORDER);
      doc.setLineWidth(0.3);
      doc.line(marginX, 14, pageWidth - marginX, 14);
    }

    // Footer (on all pages)
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('Official Party Manifesto · Free Citizen Distribution · All 47 Counties', marginX, pageHeight - 9);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, pageHeight - 9, { align: 'right' });
  }

  // Trigger download
  doc.save('DCP_Kenya_Official_11_Pillar_Manifesto.pdf');
};
