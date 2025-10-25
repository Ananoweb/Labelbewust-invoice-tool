// @ts-nocheck

"use client";

import { useEffect, useRef } from "react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Trash2, Download, Upload, Save, X } from "lucide-react";
import jsPDF from "jspdf";
import ReportTemplate from "./ReportTemplate";
import { generateInvoicePDF } from "@/lib/pdfGeneratorWithPageBreaks";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

import dynamic from "next/dynamic";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { getDocs, query, orderBy } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ReactDOMServer from "react-dom/server";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

interface Item {
  id: number;
  description: string;
  quantity: number;
  price: number;
  vatRate: number; // Add VAT rate per item
  imageUrl?: string; // Add imageUrl property
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
  richTextContent: EditorState;
  richTextHTML?: string;
}

interface ProjectDetailsFormProps {
  projectDetails: ProjectDetails;
  setProjectDetails: React.Dispatch<React.SetStateAction<ProjectDetails>>;
}
export interface CalculationResult {
  subtotal: number;
  vatDetails: Record<number, number>;
  total: number;
}

// interface SavedInvoice {
//   id: string;
//   projectDetails: {
//     clientName: string;
//     invoiceNumber: string;
//     date: string;
//   };
// }
interface SavedInvoice {
  id: string;
  projectDetails: ProjectDetails;
  sections: Section[];
}

export function calculateSectionTotals(items: Item[]): CalculationResult {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const vatDetails = items.reduce((vatTotals, item) => {
    const itemSubtotal = item.quantity * item.price;
    const vatAmount = itemSubtotal * (item.vatRate / 100);

    if (!vatTotals[item.vatRate]) {
      vatTotals[item.vatRate] = 0;
    }
    vatTotals[item.vatRate] += vatAmount;
    return vatTotals;
  }, {} as Record<number, number>);

  const total = Object.values(vatDetails).reduce(
    (sum, vat) => sum + vat,
    subtotal
  );

  return { subtotal, vatDetails, total };
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  projectDetails,
  setProjectDetails,
}) => {
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

          setProjectDetails({
            ...projectDetails,
            headerImages: newImages,
          });
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(projectDetails.headerImages || [])];
    newImages[index] = "";
    setProjectDetails({
      ...projectDetails,
      headerImages: newImages,
    });
  };

  // Safeguard against premature state updates
  const handleEditorChange = (editorState: EditorState) => {
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      richTextContent: editorState,
    }));
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Project Details</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[0, 1].map((index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">
              Header Image {index + 1}
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
            Project Address
          </label>
          <Input
            value={projectDetails.projectAddress}
            onChange={(e) =>
              setProjectDetails({
                ...projectDetails,
                projectAddress: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client Name</label>
          <Input
            value={projectDetails.clientName}
            onChange={(e) =>
              setProjectDetails({
                ...projectDetails,
                clientName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            value={projectDetails.email}
            onChange={(e) =>
              setProjectDetails({ ...projectDetails, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            value={projectDetails.phone}
            onChange={(e) =>
              setProjectDetails({ ...projectDetails, phone: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            value={projectDetails.date}
            onChange={(e) =>
              setProjectDetails({ ...projectDetails, date: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Invoice Number
          </label>
          <Input
            value={projectDetails.invoiceNumber}
            onChange={(e) =>
              setProjectDetails({
                ...projectDetails,
                invoiceNumber: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Description
          </label>
          <Input
            value={projectDetails.projectDescription}
            onChange={(e) =>
              setProjectDetails({
                ...projectDetails,
                projectDescription: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Validity</label>
          <Input
            value={projectDetails.validity}
            onChange={(e) =>
              setProjectDetails({ ...projectDetails, validity: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className=" block text-sm font-medium mb-1">
          Werkzaamheden opgenomen in deze offerte
        </h3>
        <Editor
          editorState={projectDetails.richTextContent}
          onEditorStateChange={handleEditorChange}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "list",
              "textAlign",
              "link",
              "history",
            ],
            inline: {
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            list: { options: ["unordered", "ordered"] },
            textAlign: { options: ["left", "center", "right"] },
            link: { options: ["link"] },
          }}
          editorClassName="border p-2 rounded"
          wrapperClassName="border rounded"
          toolbarClassName="border-b"
        />
      </div>
    </div>
  );
};

// At the bottom of InvoiceGenerator.tsx
export { ProjectDetailsForm };

export default function InvoiceGenerator() {
  const reportTemplateRef = useRef(null);
  const detachedDivRef = useRef<HTMLDivElement | null>(null);

  // Add these new state variables
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Add this state to your component
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const LoadingOverlay = ({
    message,
    isGeneratingPdf,
  }: {
    message: string;
    isGeneratingPdf?: boolean;
  }) => {
    useEffect(() => {
      if (isGeneratingPdf) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";

        return () => {
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
        className={`fixed inset-0 z-50 flex items-center justify-center ${isGeneratingPdf ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
          }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium">{message}</p>
          {isGeneratingPdf && (
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments...
            </p>
          )}
        </div>
      </div>
    );
  };

  const deleteInvoice = async (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteDoc(doc(db, "invoices", invoiceId));
        fetchSavedInvoices(); // Refresh the list
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    const toastId = toast.loading("Generating PDF...", {
      position: "top-right",
    });

    try {
      // Use new PDF generator with smart page breaks
      const doc = await generateInvoicePDF(
        {
          ...projectDetails,
          richTextHTML: convertRichTextToHTML(),
        },
        calculatedSections
      );

      // Save the PDF
      doc.save(
        `${projectDetails.projectAddress}-${projectDetails.invoiceNumber}.pdf`
      );

      toast.update(toastId, {
        render: `PDF generated for ${projectDetails.clientName}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to generate PDF: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  const fetchSavedInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const q = query(
        collection(db, "invoices"),
        orderBy("projectDetails.date", "desc")
      );
      const querySnapshot = await getDocs(q);

      const invoices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        projectDetails: doc.data().projectDetails,
        sections: doc.data().sections,
      }));

      setSavedInvoices(invoices);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load saved invoices");
    } finally {
      setLoading(false);
    }
  };

  // Add this useEffect to load invoices when sidebar opens
  useEffect(() => {
    if (isSidebarOpen) {
      fetchSavedInvoices();
    }
  }, [isSidebarOpen]);

  // Add this function to load a specific invoice
  const loadInvoice = async (invoiceId: string) => {
    // Implement your logic to load the invoice data
    console.log("Loading invoice:", invoiceId);
    setIsSidebarOpen(false);
  };

  const saveToFirebase = async () => {
    try {
      setIsSaving(true);

      // console.log("Saving to Firebase with following data:");
      // console.log("Project Details:", projectDetails);
      // console.log("Sections:", sections);
      // console.log("Calculated Sections:", calculatedSections);
      // console.log("Rich Text HTML:", convertRichTextToHTML());

      // 1. Process header images (store as Base64 if not already a URL)
      const processedHeaderImages = (projectDetails.headerImages || [])
        .map((image) => {
          if (!image) return null;
          if (image.startsWith("http")) return image; // Keep existing URLs

          // Check if Base64 image is too large for Firestore (1MB limit)
          // if (image.length > 900000) {
          //   // ~900KB to be safe
          //   console.warn("Header image too large for Firestore, skipping");
          //   return null;
          // }
          if (image.length > 900000) {
            // ~900KB to be safe
            const msg = "Header image too large for Firestore, skipping";
            console.warn(msg);
            toast.warning(msg, { autoClose: 3000, position: "top-center" });
            return null;
          }
          return image; // Store as Base64
        })
        .filter((img) => img !== null);

      // 2. Process item images
      const sectionsWithProcessedImages = calculatedSections.map((section) => {
        const itemsWithProcessedImages = section.items.map((item) => {
          if (!item.imageUrl) return item;
          if (item.imageUrl.startsWith("http")) return item;

          // Check image size
          // if (item.imageUrl.length > 900000) {
          //   console.warn(
          //     `Item image too large for Firestore (item ${item.id}), skipping`
          //   );
          //   return { ...item, imageUrl: "" };
          // }
          if (item.imageUrl.length > 900000) {
            const warningMessage = `Image in item ${item.id} was too large and removed`;
            console.warn(warningMessage);
            toast.warning(warningMessage, {
              autoClose: 5000,
              position: "top-center",
            });
            return { ...item, imageUrl: "" };
          }
          return item; // Keep Base64 string
        });

        return { ...section, items: itemsWithProcessedImages };
      });

      // 3. Prepare final data
      const invoiceData = {
        projectDetails: {
          ...projectDetails,
          headerImages: processedHeaderImages,
          richTextHTML: convertRichTextToHTML(),
          richTextContent: null,
          createdAt: serverTimestamp(),
        },
        sections: sectionsWithProcessedImages,
        totals: calculatedSections.reduce(
          (acc, section) => {
            acc.subtotal += section.calculations.subtotal;
            acc.total += section.calculations.total;
            Object.entries(section.calculations.vatDetails).forEach(
              ([rate, amount]) => {
                const vatRate = Number(rate);
                if (!acc.vatDetails[vatRate]) {
                  acc.vatDetails[vatRate] = 0;
                }
                acc.vatDetails[vatRate] += amount;
              }
            );
            return acc;
          },
          {
            subtotal: 0,
            total: 0,
            vatDetails: {} as Record<number, number>,
          }
        ),
      };

      // 4. Save to Firestore
      const docRef = await addDoc(collection(db, "invoices"), invoiceData);
      console.log("Invoice saved with ID: ", docRef.id);
      // toast.success("Invoice saved successfully!");
      toast.success("Invoice saved successfully!", {
        autoClose: 1000,
        onClose: () => router.push(`/invoices/${docRef.id}`),
      });
    } catch (error) {
      console.error("Error saving invoice:", error);
      // toast.error("Failed to save invoice. Please try again.");
      toast.error(`Failed to save invoice: ${error.message}`, {
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Pdf Generate
  // const handleGeneratePdf = () => {
  //   // Ensure we're in a browser environment
  //   if (typeof window !== "undefined" && detachedDivRef.current) {
  //     const doc = new jsPDF({
  //       format: "a4",
  //       unit: "px",
  //       orientation: "p",
  //     });

  //     // Create the div if it doesn't exist
  //     const tempDiv = detachedDivRef.current || document.createElement("div");
  //     document.body.appendChild(tempDiv);

  //     doc.html(tempDiv, {
  //       width: 595,
  //       // @ts-expect-error - html2canvas options
  //       height: 842,
  //       html2canvas: {
  //         scale: 0.75,
  //         useCORS: true,
  //       },
  //       async callback(doc) {
  //         await doc.save(
  //           `${projectDetails.projectAddress}-${projectDetails.invoiceNumber}.pdf`
  //         );
  //         // Remove the detached div
  //         document.body.removeChild(tempDiv);
  //       },
  //     });
  //   }
  // };
  // const handleGeneratePdf = async () => {
  //   setIsGeneratingPdf(true);
  //   const toastId = toast.loading("Generating PDF...", {
  //     position: "top-right",
  //   });

  //   try {
  //     if (typeof window !== "undefined" && detachedDivRef.current) {
  //       const tempDiv = document.createElement("div");
  //       document.body.appendChild(tempDiv);

  //       const doc = new jsPDF({
  //         format: "a4",
  //         unit: "px",
  //         orientation: "p",
  //       });

  //       tempDiv.innerHTML = ReactDOMServer.renderToString(
  //         <ReportTemplate
  //           projectDetails={{
  //             ...projectDetails,
  //             richTextHTML: convertRichTextToHTML(),
  //           }}
  //           sections={calculatedSections}
  //         />
  //       );

  //       await new Promise<void>((resolve) => {
  //         doc.html(tempDiv, {
  //           width: 595,
  //           height: 842,
  //           html2canvas: {
  //             scale: 0.75,
  //             useCORS: true,
  //           },
  //           async callback(doc) {
  //             try {
  //               await doc.save(
  //                 `${projectDetails.projectAddress}-${projectDetails.invoiceNumber}.pdf`
  //               );
  //               document.body.removeChild(tempDiv);
  //               toast.update(toastId, {
  //                 render: `PDF generated for ${projectDetails.clientName}`,
  //                 type: "success",
  //                 isLoading: false,
  //                 autoClose: 3000,
  //               });
  //             } catch (error) {
  //               toast.update(toastId, {
  //                 render: `Failed to save PDF: ${error.message}`,
  //                 type: "error",
  //                 isLoading: false,
  //                 autoClose: 5000,
  //               });
  //             } finally {
  //               resolve();
  //             }
  //           },
  //         });
  //       });
  //     }
  //   } catch (error) {
  //     toast.update(toastId, {
  //       render: `Failed to generate PDF: ${error.message}`,
  //       type: "error",
  //       isLoading: false,
  //       autoClose: 5000,
  //     });
  //   } finally {
  //     setIsGeneratingPdf(false);
  //   }
  // };

  // Initialize the ref in useEffect to avoid server-side rendering issues
  useEffect(() => {
    detachedDivRef.current = document.createElement("div");
  }, []);

  const [sections, setSections] = useState<Section[]>([
    {
      id: "0.00",
      title: "Voor het werk geldende voorwaarden uav 2012",
      items: [],
      vatRate: 0,
    },
  ]);

  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectAddress: "Vossiusstraat 39-H, Amsterdam",
    clientName: "Sanin Saracevic",
    email: "dotnetguru@gmail.com",
    phone: "+31638787552",
    date: "12-01-2024",
    invoiceNumber: "621",
    projectDescription: "Totaal renovatie Vossiusstraat 39",
    validity: "14 dagen",
    headerImages: [],
    richTextContent: EditorState.createEmpty(),
  });

  const convertRichTextToHTML = () => {
    return stateToHTML(projectDetails.richTextContent.getCurrentContent());
  };

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
    // Prevent deleting the first section
    if (sectionId === "0.00") return;

    if (
      confirm("Are you sure you want to delete this section and all its items?")
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

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    }
  };

  const calculatedSections = sections.map((section) => ({
    ...section,
    calculations: calculateSectionTotals(section.items),
  }));

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <ProjectDetailsForm
        projectDetails={projectDetails}
        setProjectDetails={setProjectDetails}
      />

      {sections.map((section) => {
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

        return (
          <div key={section.id} className="mb-6 bg-white rounded-lg shadow p-6">
            {/* <h3 className="text-lg font-bold mb-4">Section {section.id}</h3> */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold mb-4">Section {section.id}</h3>
              {section.id !== "0.00" && (
                <button
                  onClick={() => deleteSection(section.id)}
                  className="transition-all duration-200 ease-in-out transform hover:scale-110 text-red-500 hover:text-red-600 p-1"
                  title="Delete section"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="mb-4">
              <Input
                placeholder="Section Title"
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
                  <th className="text-left">Description</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">VAT</th>
                  <th className="text-right">Subtotal</th>
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
                    {/* vat start */}
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
                    {/* vat end */}
                    <td className="py-2 text-right">
                      €{(item.quantity * item.price).toFixed(2)}
                    </td>
                    {/* Image Upload */}
                    <td className="py-2 pl-2">
                      {/* Conditionally render the image if item.imageUrl exists */}
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
                            } // Clear the image
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {/* Upload button - only show if no image is uploaded */}
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
                    {/* Delete button */}
                    <td className="py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(section.id, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right font-medium py-2">
                    Subtotal:
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
                        VAT ({vatRate || 0}%):
                      </td>
                      <td className="text-right py-1">
                        € {isNaN(amount) ? "0.00" : amount.toFixed(2)}
                      </td>
                    </tr>
                  )
                )}

                <tr>
                  <td colSpan={4} className="text-right font-medium py-2">
                    Total incl. VAT:
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
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        );
      })}

      {/* sidebar new  */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                {/* Add loading overlay inside sidebar only */}
                {loading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                      <p className="text-sm font-medium">Loading invoices...</p>
                    </div>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold">Saved Invoices</h2>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-6">
                    {/* {loading && (
                      <div className="text-center py-4">Loading...</div>
                    )} */}

                    {error && <div className="text-red-500 py-4">{error}</div>}

                    {!loading && !error && (
                      <div className="space-y-3">
                        {savedInvoices.length === 0 ? (
                          <p className="text-gray-500">
                            No saved invoices found
                          </p>
                        ) : (
                          // In your saved invoices list
                          savedInvoices.map((invoice) => (
                            <div
                              key={invoice.id}
                              className="group relative p-4 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="space-y-1">
                                <h3 className="font-medium">
                                  {invoice.projectDetails.clientName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  #{invoice.projectDetails.invoiceNumber} •{" "}
                                  {invoice.projectDetails.date}
                                </p>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generatePdfForInvoice(invoice);
                                  }}
                                  className="p-1.5 text-xs bg-green-200 text-green-600 hover:bg-green-100 font-bold rounded-lg flex items-center"
                                  title="Export PDF"
                                  disabled={isGeneratingPdf}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  {isGeneratingPdf ? "Generating..." : "PDF"}
                                </button>
                                <Link
                                  href={`/invoices/${invoice.id}`}
                                  className="p-1.5 text-xs bg-blue-200 text-blue-600 font-bold hover:bg-blue-100 rounded-lg"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteInvoice(invoice.id);
                                  }}
                                  className="p-1.5 text-xs bg-red-200 text-red-600 hover:bg-red-100 font-bold rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>

        {/* {console.log(
          "Exporting with data:",
          projectDetails,
          sections,
          calculatedSections
        )} */}
        <Button
          variant="default"
          onClick={handleGeneratePdf}
          className="bg-blue-500 hover:bg-blue-400 text-white"
          disabled={isSaving || isGeneratingPdf}
        >
          <Download className="h-4 w-4 mr-2" />
          {isGeneratingPdf ? "Generating..." : "Export PDF"}
        </Button>

        {/* <FirebaseTest /> */}
        <Button
          variant="default"
          onClick={saveToFirebase}
          className="bg-blue-500 hover:bg-blue-400 text-white"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save to Database"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsSidebarOpen(true)}
          className="ml-4"
        >
          View Saved Invoices
        </Button>
      </div>

      {(isSaving || isGeneratingPdf) && (
        <LoadingOverlay
          message={
            isGeneratingPdf ? "Generating PDF..." : "Saving to database..."
          }
          isGeneratingPdf={isGeneratingPdf}
        />
      )}
      <div ref={reportTemplateRef} className="hidden">
        <ReportTemplate
          // projectDetails={projectDetails}
          projectDetails={{
            ...projectDetails,
            richTextHTML: convertRichTextToHTML(),
          }}
          sections={calculatedSections}
        />
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
