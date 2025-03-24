import { trackDocumentDownload } from "./trackDownload";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Generates a PDF from an HTML element and triggers download with tracking
 *
 * @param elementId ID of the HTML element to convert to PDF
 * @param filename Name of the PDF file to download
 * @param documentType Type of document (CV or CoverLetter)
 * @param documentId MongoDB ID of the document
 * @returns Promise that resolves when the PDF has been generated and download initiated
 */
export async function downloadAsPDF(
  elementId: string,
  filename: string,
  documentType: "CV" | "CoverLetter",
  documentId: string
): Promise<boolean> {
  try {
    // Get the HTML Element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`);
      return false;
    }

    // First, track the download BEFORE generating the PDF
    // This ensures tracking happens even if PDF generation takes time
    console.log(`Tracking download for ${documentType} with ID: ${documentId}`);
    const trackResult = await trackDocumentDownload(documentType, documentId);

    if (!trackResult.success) {
      console.warn("Failed to track document download:", trackResult.error);
      // Continue with the download even if tracking failed
    }

    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      allowTaint: true,
    });

    // Calculate PDF dimensions (A4 format)
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the ratio to maintain aspect ratio
    const canvasRatio = canvas.height / canvas.width;
    const pdfRatio = pdfHeight / pdfWidth;

    let finalWidth, finalHeight;

    if (canvasRatio > pdfRatio) {
      // Canvas is taller than PDF
      finalHeight = pdfHeight;
      finalWidth = (canvas.width * pdfHeight) / canvas.height;
    } else {
      // Canvas is wider than PDF
      finalWidth = pdfWidth;
      finalHeight = (canvas.height * pdfWidth) / canvas.width;
    }

    // Center the image on the page
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

    // Save the PDF
    pdf.save(`${filename}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}

/**
 * Creates a snapshot of the current document state (for preview thumbnails)
 *
 * @param elementId ID of the HTML element to convert to image
 * @returns Promise that resolves to a data URL of the image
 */
export async function createDocumentSnapshot(
  elementId: string
): Promise<string | null> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      return null;
    }

    const canvas = await html2canvas(element, {
      scale: 0.25, // Lower scale for thumbnails
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    return canvas.toDataURL("image/jpeg", 0.5); // Use JPEG with 50% quality for smaller size
  } catch (error) {
    console.error("Error creating document snapshot:", error);
    return null;
  }
}
