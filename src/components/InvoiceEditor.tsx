// @ts-nocheck

// src/components/InvoiceEditor.tsx
"use client";
import { generateInvoicePDF } from "@/lib/pdfGeneratorWithPageBreaks";
import type { Language } from "@/lib/translations";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Download, Trash2, Upload } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDOMServer from "react-dom/server";
import ReportTemplate from "./ReportTemplate";
import { useRef } from "react";
import jsPDF from "jspdf";

interface Item {
  id: number;
  description: string;
  quantity: number;
  price: number;
  vatRate: number;
  imageUrl?: string;
}

interface Section {
  id: string;
  title: string;
  items: Item[];
  vatRate: number;
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
  language?: Language;
  paymentOnOrder: number;
  paymentAtStart: number;
  paymentOnCompletion: number;
}

interface InvoiceEditorProps {
  initialData: {
    projectDetails: ProjectDetails;
    sections: Section[];
  };
  invoiceId: string;
}

export default function InvoiceEditor({
  initialData,
  invoiceId,
}: InvoiceEditorProps) {
  const router = useRouter();
  const reportTemplateRef = useRef(null);
  const detachedDivRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>(initialData.sections);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  // Initialize project details
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    ...initialData.projectDetails,
    paymentOnOrder: initialData.projectDetails.paymentOnOrder || 35,
    paymentAtStart: initialData.projectDetails.paymentAtStart || 50,
    paymentOnCompletion: initialData.projectDetails.paymentOnCompletion || 15,
  });

  // Initialize the ref in useEffect to avoid server-side rendering issues
  useEffect(() => {
    detachedDivRef.current = document.createElement("div");
  }, []);

  // Loading overlay component
  const LoadingOverlay = ({
    message,
    isGeneratingPdf,
  }: {
    message: string;
    isGeneratingPdf?: boolean;
  }) => {
    useEffect(() => {
      if (isGeneratingPdf) {
        // Save the current scroll position
        const scrollY = window.scrollY;
        // Disable scrolling
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";

        return () => {
          // Re-enable scrolling
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
          document.body.style.overflow = "";
          window.scrollTo(0, scrollY);
        };
      }
    }, [isGeneratingPdf]);

    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isGeneratingPdf ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium">{message}</p>
          {isGeneratingPdf && (
            <p className="text-sm text-gray-500 mt-2">
              Dit kan een paar momenten duren...
            </p>
          )}
        </div>
      </div>
    );
  };

  const handleGeneratePdf = async () => {
  // Validatie: controleer of factuurnummer is ingevuld
  if (!projectDetails.invoiceNumber || projectDetails.invoiceNumber.trim() === "") {
    toast.error("Factuurnummer is verplicht. Vul een factuurnummer in voordat je een PDF genereert.", {
      position: "top-right",
      autoClose: 5000,
    });
    return;
  }

  setIsGeneratingPdf(true);
  const toastId = toast.loading("PDF Genereren...", {
    position: "top-right",
  });

  try {
    // Prepare sections with calculations
    const sectionsWithCalculations = sections.map((section) => ({
      ...section,
      calculations: {
        subtotal: calculateSubtotal(section.items),
        vatDetails: calculateVAT(section.items),
        total: calculateTotal(section.items),
      },
    }));

    // Use new PDF generator with smart page breaks
    const doc = await generateInvoicePDF(
      projectDetails,
      sectionsWithCalculations
    );

    // Save the PDF
    doc.save(
      `${projectDetails.projectAddress}-${projectDetails.invoiceNumber}.pdf`
    );

    toast.update(toastId, {
      render: `PDF gegenereerd voor ${projectDetails.clientName}`,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (error: any) {
    toast.update(toastId, {
      render: `Fout bij genereren PDF: ${error.message}`,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
  } finally {
    setIsGeneratingPdf(false);
  }
};
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const newImages = [...(projectDetails.headerImages || [])];
          newImages[index] = e.target.result as string;
          setProjectDetails((prev) => ({
            ...prev,
            headerImages: newImages,
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(projectDetails.headerImages || [])];
    newImages[index] = "";
    setProjectDetails((prev) => ({
      ...prev,
      headerImages: newImages,
    }));
  };

  const handleSave = async () => {
    // Validatie: controleer of factuurnummer is ingevuld
    if (!projectDetails.invoiceNumber || projectDetails.invoiceNumber.trim() === "") {
      toast.error("Factuurnummer is verplicht. Vul een factuurnummer in voordat je opslaat.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setIsSaving(true);
      toast.info("Factuur opslaan...", { autoClose: false });

      // Prepare the data to save
      const dataToSave = {
        projectDetails: {
          ...projectDetails,
        },
        sections,
        updatedAt: serverTimestamp(),
      };

      // console.log(
      //   "Data being saved to Firebase:",
      //   JSON.stringify(dataToSave, null, 2)
      // );

      const docRef = doc(db, "invoices", invoiceId);
      await updateDoc(docRef, dataToSave);
      toast.success("Factuur succesvol opgeslagen!", { autoClose: 1000 });
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error(`Fout bij opslaan factuur: ${error.message}`, {
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
      toast.dismiss();
    }
  };
  // Section management functions
  const addSection = () => {
    const lastSection = sections[sections.length - 1];
    const newSectionNumber =
      String(Number(lastSection.id) + 1).padStart(2, "0") + ".00";

    setSections([
      ...sections,
      {
        id: newSectionNumber,
        title: "",
        items: [],
        vatRate: 0,
      },
    ]);
  };
  const deleteSection = (sectionId: string) => {
    if (sections.length <= 1 || sections[0].id === sectionId) {
      toast.warning("Je moet minimaal één sectie behouden");
      return;
    }

    if (
      confirm("Weet je zeker dat je deze sectie en alle items wilt verwijderen?")
    ) {
      setSections(sections.filter((section) => section.id !== sectionId));
    }
  };

  const addItem = (sectionId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: [
              ...section.items,
              {
                id: Date.now(),
                description: "",
                quantity: 0,
                price: 0,
                vatRate: 0,
              },
            ],
          };
        }
        return section;
      })
    );
  };

  const updateItem = (
    sectionId: string,
    itemId: number,
    field: keyof Item,
    value: string | number
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          };
        }
        return section;
      })
    );
  };

  const deleteItem = (sectionId: string, itemId: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== itemId),
          };
        }
        return section;
      })
    );
  };

  // Add calculation functions
  const calculateSubtotal = (items: Item[]) =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const calculateVAT = (items: Item[]) =>
    items.reduce((vatTotals, item) => {
      const itemSubtotal = item.quantity * item.price;
      const vatAmount = itemSubtotal * (item.vatRate / 100);

      if (!vatTotals[item.vatRate]) {
        vatTotals[item.vatRate] = 0;
      }
      vatTotals[item.vatRate] += vatAmount;
      return vatTotals;
    }, {} as { [key: number]: number });

  const calculateTotal = (items: Item[]) =>
    items.reduce((total, item) => {
      const itemSubtotal = item.quantity * item.price;
      const vatAmount = itemSubtotal * (item.vatRate / 100);
      return total + itemSubtotal + vatAmount;
    }, 0);

  // Add image upload handler for items
  const handleTableImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string,
    itemId: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          setSections((prevSections) =>
            prevSections.map((section) => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  items: section.items.map((item) =>
                    item.id === itemId
                      ? { ...item, imageUrl: e.target?.result as string }
                      : item
                  ),
                };
              }
              return section;
            })
          );
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-4 space-y-6 ${
        isGeneratingPdf ? "overflow-hidden pointer-events-none" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex-1">
          Bewerk Factuur #{projectDetails.invoiceNumber}
        </h1>
        <div className="flex flex-1 justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
            className="bg-red-500 hover:bg-red-400 text-white font-semibold"
          >
            Annuleren
          </Button>
          <Button
            onClick={handleGeneratePdf}
            disabled={isSaving || isGeneratingPdf}
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPdf ? "Genereren..." : "Genereer PDF"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold"
          >
            {isSaving ? "Opslaan..." : "Wijzigingen Opslaan"}
          </Button>
        </div>
      </div>

      {/* Project Details Form - now fully controlled */}
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Projectgegevens</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[0, 1].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                Header Afbeelding {index + 1}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              {projectDetails.headerImages?.[index] && (
                <div className="mt-2 relative">
                  <img
                    src={projectDetails.headerImages[index]}
                    alt={`Header ${index + 1}`}
                    className="h-20 object-contain"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Projectadres
            </label>
            <Input
              placeholder="Vossiusstraat 39-H, Amsterdam"
              value={projectDetails.projectAddress}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  projectAddress: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Klantnaam
            </label>
            <Input
              placeholder="Sanin Saracevic"
              value={projectDetails.clientName}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  clientName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <Input
              placeholder="dotnetguru@gmail.com"
              value={projectDetails.email}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefoon</label>
            <Input
              placeholder="+31638787552"
              value={projectDetails.phone}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Datum</label>
            <Input
              placeholder="12-01-2024"
              value={projectDetails.date}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Factuurnummer
            </label>
            <Input
              placeholder="621"
              value={projectDetails.invoiceNumber}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  invoiceNumber: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Projectomschrijving
            </label>
            <Input
              placeholder="Totaalrenovatie Vossiusstraat 39"
              value={projectDetails.projectDescription}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  projectDescription: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Geldigheid</label>
            <Input
              placeholder="14 dagen"
              value={projectDetails.validity}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  validity: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PDF Taal</label>
            <select
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={projectDetails.language || 'nl'}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  language: e.target.value as Language,
                }))
              }
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="block text-sm font-medium mb-3">Deelbetalingen</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bij opdracht (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={projectDetails.paymentOnOrder}
                onChange={(e) =>
                  setProjectDetails((prev) => ({
                    ...prev,
                    paymentOnOrder: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bij aanvang werkzaamheden (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={projectDetails.paymentAtStart}
                onChange={(e) =>
                  setProjectDetails((prev) => ({
                    ...prev,
                    paymentAtStart: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bij oplevering (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={projectDetails.paymentOnCompletion}
                onChange={(e) =>
                  setProjectDetails((prev) => ({
                    ...prev,
                    paymentOnCompletion: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={section.id} className="mb-6 bg-white rounded-lg shadow p-6">
          {/* <h3 className="text-lg font-bold mb-4">Sectie {section.id}</h3> */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold mb-4">Sectie {section.id}</h3>
            {index > 0 && (
              <button
                onClick={() => deleteSection(section.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Verwijder sectie"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mb-4">
            <Input
              placeholder="Sectie Titel"
              value={section.title}
              onChange={(e) =>
                setSections(
                  sections.map((s) =>
                    s.id === section.id ? { ...s, title: e.target.value } : s
                  )
                )
              }
            />
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">Omschrijving</th>
                <th className="text-right">Aantal</th>
                <th className="text-right">Prijs</th>
                <th className="text-right">BTW</th>
                <th className="text-right">Subtotaal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          section.id,
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      className="text-right"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          section.id,
                          item.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      className="text-right"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          section.id,
                          item.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={item.vatRate || 0}
                      onChange={(e) =>
                        updateItem(
                          section.id,
                          item.id,
                          "vatRate",
                          Number(e.target.value)
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value={0}>0%</option>
                      <option value={9}>9%</option>
                      <option value={21}>21%</option>
                    </select>
                  </td>
                  <td className="py-2 text-right">
                    €{(item.quantity * item.price).toFixed(2)}
                  </td>
                  {/* Image Upload */}
                  <td className="py-2 pl-2">
                    {item.imageUrl && (
                      <div className="relative inline-block">
                        <img
                          src={item.imageUrl}
                          alt="Uploaded"
                          className="h-10 w-10 object-cover rounded"
                        />
                        <button
                          onClick={() =>
                            updateItem(section.id, item.id, "imageUrl", "")
                          }
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {!item.imageUrl && (
                      <label
                        htmlFor={`image-upload-${item.id}`}
                        className="cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                      </label>
                    )}

                    <input
                      id={`image-upload-${item.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleTableImageUpload(e, section.id, item.id)
                      }
                      className="hidden"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => deleteItem(section.id, item.id)}
                      className="m-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-right font-medium py-2">
                  Subtotaal:
                </td>
                <td className="text-right py-2">
                  € {calculateSubtotal(section.items).toFixed(2)}
                </td>
                <td></td>
              </tr>

              {Object.entries(calculateVAT(section.items)).map(
                ([vatRate, amount]) => (
                  <tr key={vatRate}>
                    <td colSpan={4} className="text-right font-medium py-1">
                      BTW ({vatRate || 0}%):
                    </td>
                    <td className="text-right py-1">
                      € {isNaN(amount) ? "0.00" : amount.toFixed(2)}
                    </td>
                  </tr>
                )
              )}

              <tr>
                <td colSpan={4} className="text-right font-medium py-2">
                  Totaal incl. BTW:
                </td>
                <td className="text-right py-2">
                  € {calculateTotal(section.items).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addItem(section.id)}
            className="mb-4"
          >
            Item Toevoegen
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addSection}>
        Sectie Toevoegen
      </Button>

      {(isSaving || isGeneratingPdf) && (
        <LoadingOverlay
          message={isGeneratingPdf ? "PDF Genereren..." : "Factuur opslaan..."}
          isGeneratingPdf={isGeneratingPdf}
        />
      )}
      <div ref={reportTemplateRef} className="hidden">
        <ReportTemplate
          projectDetails={projectDetails}
          sections={sections.map((section) => ({
            ...section,
            calculations: {
              subtotal: calculateSubtotal(section.items),
              vatDetails: calculateVAT(section.items),
              total: calculateTotal(section.items),
            },
          }))}
        />
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
