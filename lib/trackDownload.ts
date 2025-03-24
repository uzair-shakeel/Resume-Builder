/**
 * Records a document download in the database by updating the download tracking fields
 *
 * @param documentType Type of document (CV or CoverLetter)
 * @param documentId MongoDB ID of the document
 * @returns Promise that resolves to a success status
 */
export async function trackDocumentDownload(
  documentType: "CV" | "CoverLetter",
  documentId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch("/api/documents/track-download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentType,
        documentId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error tracking document download:", data.error);
      return {
        success: false,
        error: data.error || "Failed to track document download",
      };
    }

    return {
      success: true,
      message: data.message || "Document download tracked successfully",
    };
  } catch (error) {
    console.error("Error tracking document download:", error);
    return {
      success: false,
      error: "Network error while trying to track document download",
    };
  }
}

/**
 * Fetches document statistics (total counts and downloads)
 *
 * @returns Promise that resolves to document statistics
 */
export async function getDocumentStats(): Promise<{
  totalCVs: number;
  totalCoverLetters: number;
  downloads: {
    cvs: number;
    coverLetters: number;
  };
}> {
  try {
    const response = await fetch("/api/analytics/totals");

    if (!response.ok) {
      throw new Error("Failed to fetch document statistics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching document statistics:", error);
    throw error;
  }
}
