"use client";

import React from "react";
import Image from "next/image";
import bannerImage from "../image/banner.png";
import noImage from "../image/no_image.png";
import squareAngleImage from "../image/square-angle.png";
import triSquareImage from "../image/tri-square.png";
import headerLogoImage from "../image/header_logo.png";
import headerShapeImage from "../image/header_shape.png";
import headerWhiteLogo from "../image/header_logo_white.png";
import triSquareRevImage from "../image/tri-square_rev.png";
import triSquareFooterImage from "../image/tri_square_footer.png";

const ReportTemplate = ({ projectDetails, sections }) => {
  return (
    <>
      {/* First Page */}
      <header className="h-20 max-w-[595px] bg-[#36a965] relative font-mulish">
        <Image
          src={headerShapeImage}
          alt="Banner"
          className=" h-[5.5rem] w-72 absolute top-0 -left-2"
        />
        <Image
          src={headerLogoImage}
          alt="Banner"
          className=" h-16 w-40 object-contain absolute top-2 left-0"
        />
      </header>
      <section className="w-full max-w-[595px] h-[700] font-mulish">
        <div>
          {projectDetails.headerImages &&
          projectDetails.headerImages.length > 0 ? (
            <div className="flex">
              {projectDetails.headerImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Header Image ${index + 1}`}
                  className="w-[200px] flex-1 h-[200px] object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex">
              <Image
                src={noImage}
                alt="noImage"
                className="w-[200px] flex-1 h-[200px] object-cover"
              />
              <Image
                src={noImage}
                alt="noImage"
                className="w-[200px] flex-1 h-[200px] object-cover"
              />
            </div>
          )}
        </div>
        {/* project Details */}
        <div className="flex break-all pl-2">
          <div className="flex-1 bg-white px-4 pt-8 pb-12">
            <h4 className="text-black font-bold text-[10px]">Project adres</h4>
            <h2 className=" text-[#257044] text-xl font-bold leading-6 mb-5">
              {projectDetails.projectAddress}
            </h2>
            <h4 className="text-black text-[10px] font-bold">Naam</h4>
            <h4 className="text-[#36a965] font-bold mb-3 text-sm">
              {projectDetails.clientName}
            </h4>
            <h4 className="text-black text-[10px] font-bold">Email</h4>
            <p className="text-xs text-gray-700 m-0 p-0 mb-3">
              {projectDetails.email}
            </p>
            <h4 className="text-black text-[10px] font-bold">Telefoon</h4>
            <p className="text-xs tracking-widest text-gray-700">
              {projectDetails.phone}
            </p>
          </div>
          <div className="flex-1 bg-[#f9f9f9] pl-6 pr-4  pt-8 pb-12">
            <h2 className=" text-black text-xl font-bold leading-6 mb-6 mt-4 text-center">
              Project details
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-black text-[11px] font-bold">Datum</div>
                <div className="text-[11px] text-[#36a965] tracking-widest">
                  {projectDetails.date}
                </div>
              </div>
              <div>
                <div className="text-black text-[11px] font-bold">
                  Offertenummer
                </div>
                <div className="text-[11px] text-[#36a965]">
                  {projectDetails.invoiceNumber}
                </div>
              </div>
              <div>
                <div className="text-black text-[11px] font-bold">Kenmerk</div>
                <div className="text-[11px] text-[#36a965]">
                  Totaalrenovatie {projectDetails.projectAddress?.trim().replace(/\s+/g, ' ')}
                </div>
              </div>
              <div>
                <div className="text-black text-[11px] font-bold">
                  Geldigheid
                </div>
                <div className="text-[11px] text-[#36a965]">
                  {projectDetails.validity}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Banner Section */}
        <div className="relative">
          <Image
            src={bannerImage}
            alt="Banner"
            className="h-[310px] w-full object-cover"
          />

          <div className=" absolute left-4 top-12 ">
            <h2 className="font-bold text-xl mb-3 text-white">
              De aannemer van groot Amsterdam
            </h2>
            <ul className="list-none p-0 grid grid-cols-2 text-xs">
              <li className="flex items-center mb-2 text-white font-semibold">
                <span className="text-green-400 mr-2 text-xs">✓</span> Ruwbouw
              </li>
              <li className="flex items-center mb-2 text-white font-semibold">
                <span className="text-green-400 mr-2 text-xs">✓</span>
                Totaalrenovatie
              </li>
              <li className="flex items-center mb-2 text-white font-semibold">
                <span className="text-green-400 mr-2 text-xs">✓</span>
                Sloopwerk
              </li>
              <li className="flex items-center mb-2 text-white font-semibold">
                <span className="text-green-400 mr-2 text-xs">✓</span>
                Nieuwbouw
              </li>
              <li className="flex items-center mb-2 text-white font-semibold">
                <span className="text-green-400 mr-2 text-xs">✓</span>
                Verduurzaming
              </li>
              <li className="flex items-center mb-2 text-white font-semibold">
                <span className="text-green-400 mr-2 text-xs">✓</span>
                Warmtepompen
              </li>
            </ul>
          </div>
          <div className="relative">
            <Image
              src={triSquareImage}
              alt="triSquareImage"
              className=" w-[500px] object-cover absolute -right-[0.15rem] -bottom-3"
            />
            <Image
              src={squareAngleImage}
              alt="squareAngleImage"
              className="h-24 w-24 object-cover absolute -right-2 bottom-6"
            />
            <span className="font-bold text-[11px] absolute left-36 bottom-3 text-white">
              Labelbewust
            </span>
            <span className="font-bold text-[11px] absolute right-6 bottom-3 text-white">
              De aannemer op wie je kan bouwen
            </span>
          </div>
        </div>
      </section>

      {/* Second Page */}
      <header className="h-20 max-w-[595px] bg-white relative mt-16 font-mulish">
        <Image
          src={headerWhiteLogo}
          alt="Banner"
          width={500}
          height={100}
          className=" h-14 w-40 absolute top-2 left-4"
        />
        <Image
          src={triSquareRevImage}
          alt="Banner"
          width={500}
          height={100}
          className="h-20 w-20 object-contain absolute -top-2 -right-2"
        />
        <span className=" text-[#257044] text-3xl font-bold absolute right-28 top-6 tracking-wider">
          OFFERTE
        </span>
      </header>
      <section className="max-w-[595px] w-full bg-white pt-2 break-all relative font-mulish">
        <div className="border-2 border-dashed border-green-500 p-4 max-w-sm ml-6">
          <h2 className="text-green-700 text-lg font-bold mb-2">
            {projectDetails.clientName}
          </h2>
          <p className="text-gray-700 m-0 p-0 text-[9px]">
            {projectDetails.email}
          </p>
          <p className="text-gray-700 tracking-wider m-0 p-0 text-[9px]">
            {projectDetails.phone}
          </p>
          <p className="text-gray-700 m-0 p-0 mt-4 text-[9px]">
            Offertenummer {projectDetails.invoiceNumber}
          </p>
          <p className="text-gray-700 m-0 p-0 tracking-wider text-[9px]">
            {projectDetails.date}
          </p>
          <p className="text-gray-700 m-0 p-0 text-[9px]">
            Totaalrenovatie {projectDetails.projectAddress?.trim().replace(/\s+/g, ' ')}
          </p>
        </div>
        <div className="px-6 pt-2 h-[23.2rem]">
          <h1 className="text-[9px] font-bold text-gray-900 mb-1">
            Werkzaamheden opgenomen in deze offerte
          </h1>
          <div
            className="rich-text-viewer text-[9px] text-gray-700"
            dangerouslySetInnerHTML={{
              __html: projectDetails.richTextHTML || "",
            }}
          ></div>
        </div>
        {/* Signature */}
        <div className="px-6 pt-2 text-[9px]">
          <p>
            Door ondertekening van deze offerte komt de aannemingsovereenkomst
            tot stand.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p>Met vriendelijke groet</p>
              <p>Verkoopteam Labelbewust</p>
            </div>
            <div>
              <p className="border-b border-black pb-3">Datum:</p>
              <p className="border-b border-black pb-3">Plaats:</p>
              <p className="pb-3">Handtekening:</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Image
            src={triSquareFooterImage}
            alt="Banner"
            className="object-cover h-auto w-4/5 -ml-4"
          />
        </div>
      </section>

      {/* Third Page */}
      <header className="h-20 max-w-[595px] bg-white relative">
        <Image
          src={headerWhiteLogo}
          alt="headerWhiteLogo"
          className=" h-14 w-40 absolute top-8 left-4"
        />
        <Image
          src={triSquareRevImage}
          alt="triSquareRevImage"
          className="h-20 w-20 object-contain absolute top-4 -right-2"
        />
        <span className=" text-[#257044] text-3xl font-bold absolute right-28 top-6 tracking-wider">
          OFFERTE
        </span>
      </header>

      <section className="max-w-[595px] w-full bg-white pt-6 break-all relative font-mulish">
        <div>
          {sections.map((section, sectionIndex) => {
            return (
              <React.Fragment key={sectionIndex}>
                <table className="w-full mb-4">
                  <thead>
                    <tr>
                      <th className="px-4 pb-3 text-left bg-[#257044] text-white font-bold text-[8px]">
                        {section.id} {section.title}
                      </th>
                      <th className="px-2 pb-3 text-left  text-[#36a965] font-bold text-[8px]">
                        Aantal
                      </th>
                      <th className="px-2 pb-3 text-left text-[#36a965] font-bold text-[8px]">
                        Eenheid
                      </th>
                      <th className="px-2 pb-3 text-left text-[#36a965] font-bold text-[8px]">
                        Prijs
                      </th>
                      <th className="px-2 pb-3 text-left text-[#36a965] font-bold text-[8px]">
                        Subtotaal
                      </th>
                      <th className="px-2 pb-3 text-left text-[#36a965] font-bold text-[8px]">
                        BTW
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="text-[8px]">
                        <td className="px-4 py-2 flex items-center justify-between gap-2">
                          <span className="max-w-40">
                            {item.description || " "}
                          </span>
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt="Item"
                              className="h-10 w-10 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-2 py-2">{item.quantity || "-"}</td>
                        <td className="px-2 py-2 ">{item.unit || "-"}</td>
                        <td className="px-2 py-2 ">
                          € {item.price?.toFixed(2) || "-"}
                        </td>
                        <td className="px-2 py-2 ">
                          € {(item.quantity * item.price)?.toFixed(2) || "-"}
                        </td>
                        <td className="px-2 py-2 ">{item.vatRate}%</td>
                      </tr>
                    ))}

                    <tr className="text-[8px]">
                      <td colSpan={4}></td>
                      <td className="px-4 py-0 text-right font-semibold">
                        Subtotaal
                      </td>
                      <td className="px-4 py-0 text-right">
                        € {section.calculations.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    {Object.entries(section.calculations.vatDetails).map(
                      ([rate, amount]) => (
                        <tr key={rate} className="text-[8px]">
                          <td colSpan={4}></td>
                          <td className="px-4 py-0 text-right font-semibold">
                            VAT ({rate || 0}%):
                          </td>
                          <td className="px-4 py-0 text-right">
                            € {amount.toFixed(2)}
                          </td>
                        </tr>
                      )
                    )}
                    <tr className="text-[8px]">
                      <td colSpan={4}></td>
                      <td className="px-4 py-2 text-right font-semibold">
                        Subtotaal incl. BTW
                      </td>
                      <td className="px-4 py-2 text-right">
                        € {section.calculations.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Last Page */}
      <section className="max-w-[595px] w-full bg-white pt-6 break-all relative font-mulish">
        <div className=" p-6">
          <p className="text-[9px] my-2">Voorwaarden</p>
          <p className="text-[9px] my-2">
            Op deze aanbieding zijn de UAV 2012 van toepassing met onderstaande
            afwijkingen:
          </p>
          <p className="text-[9px] my-2">
            In het geval dat bepalingen in deze offerte strijdig zijn met
            bepalingen uit een eerder gesloten raamovereenkomst met dezelfde
            opdrachtgever, prevaleren de bepalingen uit de raamovereenkomst.
          </p>
        </div>
      </section>
    </>
  );
};

export default ReportTemplate;
