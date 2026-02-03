"use client";

import { useEffect, useRef } from 'react';
import headerLogoImage from '../../image/header_logo.png';
import headerShapeImage from '../../image/header_shape.png';
import headerWhiteLogo from '../../image/header_logo_white.png';
import triSquareRevImage from '../../image/tri-square_rev.png';
import bannerImage from '../../image/banner.png';
import noImage from '../../image/no_image.png';
import triSquareImage from '../../image/tri-square.png';
import squareAngleImage from '../../image/square-angle.png';
import triSquareFooterImage from '../../image/tri_square_footer.png';

// Sample project details for preview
const sampleProjectDetails = {
  projectAddress: "Keizersgracht 123, Amsterdam",
  clientName: "Jan de Vries",
  email: "jan.devries@example.com",
  phone: "+31 6 12345678",
  date: "15-01-2025",
  invoiceNumber: "2025-001",
  projectDescription: "Totale renovatie van het pand",
  validity: "30 dagen",
  headerImages: [] as string[],
  richTextHTML: `
    <p>Volledige renovatie van het pand inclusief:</p>
    <ul>
      <li>Vernieuwing van alle sanitair</li>
      <li>Nieuwe vloeren in alle kamers</li>
      <li>Schilderwerk binnen en buiten</li>
      <li>Vervanging van alle kozijnen</li>
    </ul>
  `,
};

export default function PreviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const headerShapeSrc = typeof headerShapeImage === 'string' ? headerShapeImage : headerShapeImage.src;
      const headerLogoSrc = typeof headerLogoImage === 'string' ? headerLogoImage : headerLogoImage.src;
      const noImageSrc = typeof noImage === 'string' ? noImage : noImage.src;
      const bannerSrc = typeof bannerImage === 'string' ? bannerImage : bannerImage.src;
      const triSquareSrc = typeof triSquareImage === 'string' ? triSquareImage : triSquareImage.src;
      const squareAngleSrc = typeof squareAngleImage === 'string' ? squareAngleImage : squareAngleImage.src;
      const headerWhiteLogoSrc = typeof headerWhiteLogo === 'string' ? headerWhiteLogo : headerWhiteLogo.src;
      const triSquareRevSrc = typeof triSquareRevImage === 'string' ? triSquareRevImage : triSquareRevImage.src;
      const triSquareFooterSrc = typeof triSquareFooterImage === 'string' ? triSquareFooterImage : triSquareFooterImage.src;

      const htmlContent = `
        <div style="font-family: 'Mulish', Arial, sans-serif; width: 595px; margin: 0; padding: 0;">
          <!-- First Page -->
          <header style="height: 80px; max-width: 595px; background-color: #36a965; position: relative;">
            <img src="${headerShapeSrc}" alt="Banner" style="height: 88px; width: 288px; position: absolute; top: 0; left: -8px;" />
            <img src="${headerLogoSrc}" alt="Banner" style="height: 64px; width: 160px; object-fit: contain; position: absolute; top: 8px; left: 0;" />
          </header>
          <section style="width: 100%; max-width: 595px; height: 100%;">
            <div>
              ${sampleProjectDetails.headerImages && sampleProjectDetails.headerImages.length > 0
                ? `<div style="display: flex;">
                    ${sampleProjectDetails.headerImages.map((image) =>
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
                  ${sampleProjectDetails.projectAddress}
                </h2>
                <h4 style="color: black; font-weight: bold; font-size: 10px; margin: 0;">Naam</h4>
                <h4 style="color: #36a965; font-weight: bold; margin: 0 0 12px 0; font-size: 14px;">
                  ${sampleProjectDetails.clientName}
                </h4>
                <h4 style="color: black; font-weight: bold; font-size: 10px; margin: 0;">Email</h4>
                <p style="font-size: 12px; color: #374151; margin: 0 0 12px 0; padding: 0;">${sampleProjectDetails.email}</p>
                <h4 style="color: black; font-weight: bold; font-size: 10px; margin: 0;">Telefoon</h4>
                <p style="font-size: 12px; letter-spacing: 0.05em; color: #374151; margin: 0; padding: 0;">${sampleProjectDetails.phone}</p>
              </div>
              <div style="flex: 1; background-color: #f9f9f9; padding: 16px 16px 48px 24px;">
                <h2 style="color: black; font-size: 20px; font-weight: bold; line-height: 24px; margin: 16px 0 24px 0; text-align: center;">
                  Project details
                </h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <div>
                    <div style="color: black; font-size: 11px; font-weight: bold;">Datum</div>
                    <div style="font-size: 11px; color: #36a965; letter-spacing: 0.05em;">${sampleProjectDetails.date}</div>
                  </div>
                  <div>
                    <div style="color: black; font-size: 11px; font-weight: bold;">Offertenummer</div>
                    <div style="font-size: 11px; color: #36a965;">${sampleProjectDetails.invoiceNumber}</div>
                  </div>
                  <div>
                    <div style="color: black; font-size: 11px; font-weight: bold;">Kenmerk</div>
                    <div style="font-size: 11px; color: #36a965;">Totaalrenovatie ${(sampleProjectDetails.projectAddress || '').trim().replace(/\s+/g, ' ')}</div>
                  </div>
                  <div>
                    <div style="color: black; font-size: 11px; font-weight: bold;">Geldigheid</div>
                    <div style="font-size: 11px; color: #36a965;">${sampleProjectDetails.validity}</div>
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
                <img src="${triSquareSrc}" alt="triSquareImage" style="width: 500px; object-fit: cover; position: absolute; right: -0.15rem; bottom: -18px; z-index: 20" />
                <img src="${squareAngleSrc}" alt="squareAngleImage" style="height: 96px; width: 96px; object-fit: cover; position: absolute; right: -8px; bottom: -50px;" />
                <span style="font-weight: bold; font-size: 11px; position: absolute; left: 144px; bottom: 8px; color: white; z-index: 30;">
                  Labelbewust
                </span>
                <span style="font-weight: bold; font-size: 11px; position: absolute; right: 24px; bottom: 8px; color: white; z-index: 30;">
                  Een aannemer op wie je kunt bouwen
                </span>
              </div>
            </div>
          </section>

          <!-- Second Page -->
          <header style="height: 80px; max-width: 595px; background-color: white; position: relative; margin-top: 64px;">
            <img src="${headerWhiteLogoSrc}" alt="Banner" style="height: 56px; width: 160px; position: absolute; top: 8px; left: 16px;" />
            <img src="${triSquareRevSrc}" alt="Banner" style="height: 80px; width: 80px; object-fit: contain; position: absolute; top: -8px; right: -8px;" />
            <p style="color: #257044; font-size: 30px; font-weight: bold; position: absolute; left: 200px; top: 14px; letter-spacing: 0.05em;">
              OFFERTE
            </p>
          </header>
          <section style="max-width: 595px; width: 100%; background-color: white; padding-top: 8px; word-break: break-all; position: relative;">
            <div style="border: 2px dashed #22c55e; padding: 16px; max-width: 350px; margin-left: 24px;">
              <h2 style="color: #15803d; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">
                ${sampleProjectDetails.clientName}
              </h2>
              <p style="color: #374151; margin: 0; padding: 0; font-size: 9px;">${sampleProjectDetails.email}</p>
              <p style="color: #374151; letter-spacing: 0.05em; margin: 0; padding: 0; font-size: 9px;">${sampleProjectDetails.phone}</p>
              <p style="color: #374151; margin: 16px 0 0 0; padding: 0; font-size: 9px;">
                Offertenummer ${sampleProjectDetails.invoiceNumber}
              </p>
              <p style="color: #374151; margin: 0; padding: 0; letter-spacing: 0.05em; font-size: 9px;">${sampleProjectDetails.date}</p>
              <p style="color: #374151; margin: 0; padding: 0; font-size: 9px;">
                Totaalrenovatie ${(sampleProjectDetails.projectAddress || '').trim().replace(/\s+/g, ' ')}
              </p>
            </div>
            <div style="padding: 8px 24px; min-height: 370px;">
              <h1 style="font-size: 9px; font-weight: bold; color: #111827; margin: 0 0 4px 0;">
                Werkzaamheden opgenomen in deze offerte
              </h1>
              <div style="font-size: 9px; color: #374151;">
                ${sampleProjectDetails.richTextHTML || ''}
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
            <div style="position: relative;">
              <img src="${triSquareFooterSrc}" alt="Banner" style="object-fit: cover; height: auto; width: 80%; margin-left: -16px;" />
            </div>
          </section>
        </div>
      `;

      containerRef.current.innerHTML = htmlContent;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold mb-2">PDF Preview - Pages 1 & 2</h1>
          <p className="text-gray-600">This preview shows the exact HTML that gets rendered in the PDF for pages 1 and 2.</p>
          <a href="/" className="text-blue-500 hover:underline mt-2 inline-block">← Back to Home</a>
        </div>

        <div className="flex justify-center">
          <div
            ref={containerRef}
            className="bg-white shadow-2xl"
            style={{
              width: '595px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
