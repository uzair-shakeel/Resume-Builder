/**
 * Utility functions for recording analytics events
 */

/**
 * Records an analytics event
 * @param documentType "CV" or "CoverLetter"
 * @param documentId The ID of the document
 * @param userId The ID of the user (required since we removed session authentication)
 * @param action The action performed (download, view, create, edit)
 * @param metadata Optional additional data
 * @returns Promise that resolves to the API response
 */
export async function recordAnalyticsEvent(
  documentType: "CV" | "CoverLetter",
  documentId: string,
  userId: string,
  action: "download" | "view" | "create" | "edit",
  metadata: Record<string, any> = {}
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch("/api/analytics/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentType,
        documentId,
        userId,
        action,
        metadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error recording analytics event:", data.error);
      return {
        success: false,
        error:
          data.error || "An error occurred while recording the analytics event",
      };
    }

    return {
      success: true,
      message: data.message || "Analytics event recorded successfully",
    };
  } catch (error) {
    console.error("Error recording analytics event:", error);
    return {
      success: false,
      error: "Failed to record analytics event due to a network error",
    };
  }
}

/**
 * Records a download event for a CV or Cover Letter
 * @param documentType "CV" or "CoverLetter"
 * @param documentId The ID of the document
 * @param userId The ID of the user
 * @param format The format of the download (e.g., "pdf", "docx")
 * @returns Promise that resolves to the API response
 */
export async function recordDownload(
  documentType: "CV" | "CoverLetter",
  documentId: string,
  userId: string,
  format: string = "pdf"
): Promise<{ success: boolean; message?: string; error?: string }> {
  return recordAnalyticsEvent(documentType, documentId, userId, "download", {
    format,
  });
}

/**
 * Fetches analytics counts for CVs and Cover Letters
 * @returns Promise that resolves to analytics counts
 */
export async function getAnalyticsCounts(): Promise<{
  totalCVs: number;
  totalCoverLetters: number;
  downloads: {
    cvs: number;
    coverLetters: number;
    uniqueCVsDownloaded: number;
    uniqueCoverLettersDownloaded: number;
  };
}> {
  try {
    const response = await fetch("/api/analytics/counts");

    if (!response.ok) {
      throw new Error("Failed to fetch analytics counts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics counts:", error);
    throw error;
  }
}
