import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import images as base64 or paths
import headerLogoImage from '../image/header_logo.png';
import headerShapeImage from '../image/header_shape.png';
import headerWhiteLogo from '../image/header_logo_white.png';
import triSquareRevImage from '../image/tri-square_rev.png';
import bannerImage from '../image/banner.png';
import noImage from '../image/no_image.png';
import triSquareImage from '../image/tri-square.png';
import squareAngleImage from '../image/square-angle.png';
import triSquareFooterImage from '../image/tri_square_footer.png';

interface Item {
  id: number;
  description: string;
  quantity: number;
  unit?: string;
  price: number;
  vatRate: number;
  imageUrl?: string;
}

interface Section {
  id: string;
  title: string;
  items: Item[];
  calculations: {
    subtotal: number;
    vatDetails: Record<number, number>;
    total: number;
  };
}

interface ProjectDetails {
  projectAddress: string;
  clientName: string;
  email: string;
  phone: string;
  date: string;
  invoiceNumber: string;
  projectDescription: string;
  validity: string;
  headerImages: string[];
  richTextHTML?: string;
}

/**
 * Helper function to convert image to base64 (if needed)
 */
const getImageDataUrl = async (imageSrc: any): Promise<string> => {
  // If it's already a data URL or base64 string, return it
  if (typeof imageSrc === 'string') {
    return imageSrc;
  }

  // If it's an imported Next.js image object with src property
  if (imageSrc && typeof imageSrc === 'object' && imageSrc.src) {
    return imageSrc.src;
  }

  return imageSrc;
};

/**
 * Helper function to create HTML for pages 1-2 (using original ReportTemplate style)
 */
const createPages1And2HTML = (projectDetails: ProjectDetails): string => {
  const headerShapeSrc = typeof headerShapeImage === 'string' ? headerShapeImage : headerShapeImage.src;
  const headerLogoSrc = typeof headerLogoImage === 'string' ? headerLogoImage : headerLogoImage.src;
  const noImageSrc = typeof noImage === 'string' ? noImage : noImage.src;
  const bannerSrc = typeof bannerImage === 'string' ? bannerImage : bannerImage.src;
  const triSquareSrc = typeof triSquareImage === 'string' ? triSquareImage : triSquareImage.src;
  const squareAngleSrc = typeof squareAngleImage === 'string' ? squareAngleImage : squareAngleImage.src;
  const headerWhiteLogoSrc = typeof headerWhiteLogo === 'string' ? headerWhiteLogo : headerWhiteLogo.src;
  const triSquareRevSrc = typeof triSquareRevImage === 'string' ? triSquareRevImage : triSquareRevImage.src;
  const triSquareFooterSrc = typeof triSquareFooterImage === 'string' ? triSquareFooterImage : triSquareFooterImage.src;

  return `
    <div style="font-family: 'Mulish', Arial, sans-serif; width: 595px; margin: 0; padding: 0;">
      <!-- First Page - EXACTLY 842px -->
      <div style="width: 595px; height: 842px; overflow: hidden; position: relative; page-break-after: always;">
      <header style="height: 80px; max-width: 595px; background-color: #36a965; position: relative;">
        <img src="${headerShapeSrc}" alt="Banner" style="height: 88px; width: 288px; position: absolute; top: 0; left: -8px;" />
        <img src="${headerLogoSrc}" alt="Banner" style="height: 64px; width: 160px; object-fit: contain; position: absolute; top: 8px; left: 0;" />
      </header>
      <section style="width: 100%; max-width: 595px; height: calc(842px - 80px);">
        <div>
          ${projectDetails.headerImages && projectDetails.headerImages.length > 0
            ? `<div style="display: flex;">
                ${projectDetails.headerImages.map((image) =>
                  `<img src="${image}" alt="Header Image" style="width: 200px; flex: 1; height: 200px; object-fit: cover;" />`
                ).join('')}
              </div>`
            : `<div style="display: flex;">
                <img src="${noImageSrc}" alt="noImage" style="width: 200px; flex: 1; height: 200px; object-fit: cover;" />
                <img src="${noImageSrc}" alt="noImage" style="width: 200px; flex: 1; height: 200px; object-fit: cover;" />
              </div>`
          }
        </div>
        <!-- Project Details -->
        <div style="display: flex; word-break: break-all; padding-left: 8px;">
          <div style="flex: 1; background-color: white; padding: 16px 16px 48px 16px;">
            <h4 style="color: black; font-weight: bold; font-size: 10px; margin: 0 0 8px 0;">Project adres</h4>
            <h2 style="color: #257044; font-size: 20px; font-weight: bold; line-height: 24px; margin: 0 0 20px 0;">
              ${projectDetails.projectAddress}
            </h2>
            <h4 style="color: #36a965; font-weight: bold; margin: 0 0 20px 0; font-size: 14px;">
              ${projectDetails.clientName}
            </h4>
            <p style="font-size: 12px; color: #374151; margin: 0; padding: 0;">${projectDetails.email}</p>
            <p style="font-size: 12px; letter-spacing: 0.05em; color: #374151; margin: 0; padding: 0;">${projectDetails.phone}</p>
          </div>
          <div style="flex: 1; background-color: #f9f9f9; padding: 16px 16px 48px 24px;">
            <h2 style="color: black; font-size: 20px; font-weight: bold; line-height: 24px; margin: 16px 0 24px 0; text-align: center;">
              Project details
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <div style="color: black; font-size: 11px; font-weight: bold;">Datum</div>
                <div style="font-size: 11px; color: #36a965; letter-spacing: 0.05em;">${projectDetails.date}</div>
              </div>
              <div>
                <div style="color: black; font-size: 11px; font-weight: bold;">Offertenummer</div>
                <div style="font-size: 11px; color: #36a965;">${projectDetails.invoiceNumber}</div>
              </div>
              <div>
                <div style="color: black; font-size: 11px; font-weight: bold;">Kenmerk</div>
                <div style="font-size: 11px; color: #36a965;">Totaal renovatie ${projectDetails.projectAddress}</div>
              </div>
              <div>
                <div style="color: black; font-size: 11px; font-weight: bold;">Geldigheid</div>
                <div style="font-size: 11px; color: #36a965;">${projectDetails.validity}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Banner Section -->
        <div style="position: relative;">
          <img src="${bannerSrc}" alt="Banner" style="height: 310px; width: 100%; object-fit: cover;" />
          <div style="position: absolute; left: 16px; top: 48px;">
            <h2 style="font-weight: bold; font-size: 20px; margin: 0 0 12px 0; color: white;">
              De aannemer van groot Amsterdam
            </h2>
            <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; font-size: 12px; margin: 0;">
              <li style="display: flex; align-items: center; margin-bottom: 8px; color: white; font-weight: 600;">
                <span style="color: #4ade80; margin-right: 8px; font-size: 12px;">✓</span> Ruwbouw
              </li>
              <li style="display: flex; align-items: center; margin-bottom: 8px; color: white; font-weight: 600;">
                <span style="color: #4ade80; margin-right: 8px; font-size: 12px;">✓</span> Totaalrenovatie
              </li>
              <li style="display: flex; align-items: center; margin-bottom: 8px; color: white; font-weight: 600;">
                <span style="color: #4ade80; margin-right: 8px; font-size: 12px;">✓</span> Sloopwerk
              </li>
              <li style="display: flex; align-items: center; margin-bottom: 8px; color: white; font-weight: 600;">
                <span style="color: #4ade80; margin-right: 8px; font-size: 12px;">✓</span> Nieuwbouw
              </li>
              <li style="display: flex; align-items: center; margin-bottom: 8px; color: white; font-weight: 600;">
                <span style="color: #4ade80; margin-right: 8px; font-size: 12px;">✓</span> Staaframe bouw
              </li>
              <li style="display: flex; align-items: center; margin-bottom: 8px; color: white; font-weight: 600;">
                <span style="color: #4ade80; margin-right: 8px; font-size: 12px;">✓</span> Hallenbouw
              </li>
            </ul>
          </div>
          <div style="position: relative;">
            <img src="${triSquareSrc}" alt="triSquareImage" style="width: 500px; object-fit: cover; position: absolute; right: -0.15rem; bottom: -12px; z-index: 20;" />
            <img src="${squareAngleSrc}" alt="squareAngleImage" style="height: 96px; width: 96px; object-fit: cover; position: absolute; right: -8px; bottom: -30px;" />
            <span style="font-weight: bold; font-size: 11px; position: absolute; left: 144px; bottom: 12px; color: white; z-index: 30;">
              Labelbewust
            </span>
            <span style="font-weight: bold; font-size: 11px; position: absolute; right: 24px; bottom: 12px; color: white; z-index: 30;">
              Een aannemer op wie je kunt bouwen
            </span>
          </div>
        </div>
      </section>
      </div>

      <!-- Second Page - EXACTLY 842px -->
      <div style="width: 595px; height: 842px; overflow: hidden; position: relative; page-break-after: always;">
      <header style="height: 80px; max-width: 595px; background-color: white; position: relative;">
        <img src="${headerWhiteLogoSrc}" alt="Banner" style="height: 56px; width: 160px; position: absolute; top: 8px; left: 16px;" />
        <img src="${triSquareRevSrc}" alt="Banner" style="height: 80px; width: 80px; object-fit: contain; position: absolute; top: -4px; right: -8px;" />
        <span style="color: #257044; font-size: 30px; font-weight: bold; position: absolute; left: 220px; top: 30px; letter-spacing: 0.05em;">
          OFFERTE
        </span>
      </header>
      <section style="max-width: 595px; width: 100%; background-color: white; padding-top: 8px; word-break: break-all; position: relative; height: calc(842px - 80px);">
        <div style="border: 2px dashed #22c55e; padding: 16px; max-width: 350px; margin-left: 24px;">
          <h2 style="color: #15803d; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">
            ${projectDetails.clientName}
          </h2>
          <p style="color: #374151; margin: 0; padding: 0; font-size: 9px;">${projectDetails.email}</p>
          <p style="color: #374151; letter-spacing: 0.05em; margin: 0; padding: 0; font-size: 9px;">${projectDetails.phone}</p>
          <p style="color: #374151; margin: 16px 0 0 0; padding: 0; font-size: 9px;">
            Offertenummer ${projectDetails.invoiceNumber}
          </p>
          <p style="color: #374151; margin: 0; padding: 0; letter-spacing: 0.05em; font-size: 9px;">${projectDetails.date}</p>
          <p style="color: #374151; margin: 0; padding: 0; font-size: 9px;">
            Totaal renovatie ${projectDetails.projectAddress}
          </p>
        </div>
        <div style="padding-top: 8px; padding-right: 24px; padding-bottom: 0; padding-left: 24px; min-height: 425px;">
          <h1 style="font-size: 9px; font-weight: bold; color: #111827; margin: 0 0 4px 0;">
            Werkzaamheden opgenomen in deze offerte
          </h1>
          <div style="font-size: 9px; color: #374151;">
            ${projectDetails.richTextHTML || ''}
          </div>
        </div>
        <!-- Signature -->
        <div style="padding: 8px 24px; font-size: 9px;">
          <p style="margin: 0 0 8px 0;">
            Door ondertekening van deze offerte komt de aannemingsovereenkomst
            tot stand.
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding-top: 8px;">
            <div>
              <p style="margin: 0;">Met vriendelijke groet</p>
              <p style="margin: 0;">Verkoopteam Labelbewust</p>
            </div>
            <div>
              <p style="border-bottom: 1px solid black; padding-bottom: 12px; margin: 0;">Datum:</p>
              <p style="border-bottom: 1px solid black; padding-bottom: 12px; margin: 0;">Plaats:</p>
              <p style="padding-bottom: 12px; margin: 0;">Handtekening:</p>
            </div>
          </div>
        </div>
        <div style="position: relative">
          <img src="${triSquareFooterSrc}" alt="Banner" style="object-fit: cover; height: auto; width: 80%; margin-left: -16px;" />
        </div>
      </section>
      </div>
    </div>
  `;
};

/**
 * Main PDF generation function with smart page breaks
 */
export const generateInvoicePDF = async (
  projectDetails: ProjectDetails,
  sections: Section[]
): Promise<jsPDF> => {
  const doc = new jsPDF({
    format: 'a4',
    unit: 'px',
    orientation: 'portrait',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;

  /**
   * Check if we need to add a new page
   * Returns true if a new page was added
   */
  const checkAddPage = (requiredHeight: number, addHeader: boolean = false): boolean => {
    const availableSpace = pageHeight - currentY - margin;

    if (requiredHeight > availableSpace) {
      doc.addPage();
      currentY = margin;

      if (addHeader) {
        addTablePageHeader();
      }

      return true;
    }
    return false;
  };

  /**
   * Add repeating header for table pages (Page 3+)
   */
  const addTablePageHeader = async () => {
    const headerHeight = 80;
    const headerStartY = 0; // Start header at top of page

    // Add white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    try {
      // Add white logo
      const logoUrl = await getImageDataUrl(headerWhiteLogo);
      doc.addImage(logoUrl, 'PNG', margin + 4, headerStartY + 8, 140, 56);

      // Add triangle decoration
      const triangleUrl = await getImageDataUrl(triSquareRevImage);
      doc.addImage(triangleUrl, 'PNG', pageWidth - 75, headerStartY - 8, 80, 80);
    } catch (error) {
      console.warn('Could not load header images:', error);
    }

    // Add "OFFERTE" text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(37, 112, 68); // #257044
    doc.text('OFFERTE', pageWidth - 228, headerStartY + 42);

    currentY = headerHeight + margin; // Set currentY to after header plus margin
  };

  // ========================================================================
  // PAGES 1-2: Use doc.html() to preserve original design
  // ========================================================================

  // Create HTML for pages 1 and 2
  const pages1And2HTML = createPages1And2HTML(projectDetails);

  // Create a temporary div and render HTML to PDF
  if (typeof window !== 'undefined') {
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    tempDiv.innerHTML = pages1And2HTML;

    // Use doc.html() for pages 1-2 to preserve the exact design
    await new Promise<void>((resolve) => {
      doc.html(tempDiv, {
        width: 595,
        windowWidth: 595,
        html2canvas: {
          scale: 0.75,
          useCORS: true,
        },
        callback: (doc) => {
          document.body.removeChild(tempDiv);
          resolve();
        },
      });
    });
  }

  // ========================================================================
  // PAGE 3+: TABLES WITH SMART PAGE BREAKS
  // ========================================================================

  // The doc.html() with page-break-after on page 2 creates a blank page 3
  // Check total pages - if > 2, we already have a blank page 3
  const totalPages = doc.getNumberOfPages();

  if (totalPages === 2) {
    // Only add a new page if doc.html didn't already create one
    doc.addPage();
  } else if (totalPages > 2) {
    // If there's already a page 3 (blank from page-break-after), go to it
    doc.setPage(3);
  }

  currentY = margin;
  await addTablePageHeader();

  // Process each section with autoTable
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];

    // Prepare table data
    const tableHead = [
      [
        `${section.id} ${section.title}`,
        'Aantal',
        'Eenheid',
        'Prijs',
        'Subtotaal',
        'BTW'
      ]
    ];

    const tableBody: any[] = [];

    // Add item rows
    section.items.forEach((item) => {
      tableBody.push([
        item.description || ' ',
        item.quantity?.toString() || '-',
        item.unit || '-',
        `€ ${item.price?.toFixed(2) || '-'}`,
        `€ ${(item.quantity * item.price)?.toFixed(2) || '-'}`,
        `${item.vatRate}%`
      ]);
    });

    // Add subtotal row
    tableBody.push([
      { content: 'Subtotaal', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
      `€ ${section.calculations.subtotal.toFixed(2)}`,
      ''
    ]);

    // Add VAT detail rows
    Object.entries(section.calculations.vatDetails).forEach(([rate, amount]) => {
      tableBody.push([
        { content: `VAT (${rate}%):`, colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        `€ ${amount.toFixed(2)}`,
        ''
      ]);
    });

    // Add total row
    tableBody.push([
      { content: 'Subtotaal incl. BTW', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
      `€ ${section.calculations.total.toFixed(2)}`,
      ''
    ]);

    // Render table with autoTable
    autoTable(doc, {
      startY: currentY,
      head: tableHead,
      body: tableBody,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 6,
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [37, 112, 68], // #257044 for first column
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 200, fontStyle: 'normal', fillColor: undefined, textColor: [0, 0, 0] },
        1: { cellWidth: 50, halign: 'left', textColor: [54, 169, 101] },
        2: { cellWidth: 60, halign: 'left', textColor: [54, 169, 101] },
        3: { cellWidth: 60, halign: 'left', textColor: [54, 169, 101] },
        4: { cellWidth: 80, halign: 'left', textColor: [54, 169, 101] },
        5: { cellWidth: 45, halign: 'left', textColor: [54, 169, 101] },
      },
      margin: { left: margin, right: margin, top: 10, bottom: margin },
      pageBreak: 'auto',
      rowPageBreak: 'avoid', // THIS IS THE KEY - prevents rows from splitting
      showHead: 'everyPage',
    });

    // Update currentY after table
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Check if we need a new page for the next section
    if (sectionIndex < sections.length - 1) {
      checkAddPage(100); // Minimum space needed for next table header
    }
  }

  // ========================================================================
  // LAST PAGE: TERMS & CONDITIONS
  // ========================================================================

  checkAddPage(100, false);
  currentY += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  doc.text('Voorwaarden', margin + 6, currentY);
  currentY += 15;

  const terms = [
    'Op deze aanbieding zijn de UAV 2012 van toepassing met onderstaande',
    'afwijkingen:',
    '',
    'In het geval dat bepalingen in deze offerte strijdig zijn met',
    'bepalingen uit een eerder gesloten raamovereenkomst met dezelfde',
    'opdrachtgever, prevaleren de bepalingen uit de raamovereenkomst.',
  ];

  terms.forEach((line) => {
    doc.text(line, margin + 6, currentY);
    currentY += 12;
  });

  return doc;
};
