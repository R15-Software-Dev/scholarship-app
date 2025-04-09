import JSZip from "jszip";
async function fetchAndDownloadFafsaPDF(): Promise<void> {
  const studentId = "google_113247439743075864879";

  try {
    const response = await fetch(`/admin/get/fafsa/${studentId}`, {
      method: "GET",
      headers: {
        'Accept': 'application/pdf' // Ensure we request PDF explicitly
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`FAFSA PDF not found for student ${studentId}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check content type
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/pdf')) {
      throw new Error(`Invalid content type received: ${contentType}. Expected application/pdf`);
    }

    // Get filename from Content-Disposition or use fallback
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `${studentId}_fafsaSubmission.pdf`;
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="(.+)"/);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    }

    const pdfBlob = await response.blob();

    // Verify blob has content
    if (pdfBlob.size === 0) {
      throw new Error('Received empty PDF file');
    }

    // Create ZIP
    const zip = new JSZip();
    zip.file(filename, pdfBlob, { binary: true });

    const zipBlob = await zip.generateAsync({
      type: "blob",
      mimeType: "application/zip" // Explicitly set ZIP MIME type
    });

    // Verify zip blob has content
    if (zipBlob.size === 0) {
      throw new Error('Generated empty ZIP file');
    }

    const zipUrl = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${studentId}_fafsaSubmission.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(zipUrl);

  } catch (error) {
    console.error(`Error processing file for ${studentId}:`, error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('test-button') as HTMLButtonElement;
  const input = document.getElementById('input') as HTMLInputElement;

  if (!button || !input) {
    console.error('Required DOM elements not found');
    return;
  }

  input.value = "google_113247439743075864879";
  input.readOnly = true;

  button.addEventListener('click', async () => {
    try {
      button.disabled = true;
      button.textContent = 'Downloading...';
      await fetchAndDownloadFafsaPDF();
    } catch (error) {
      alert('Failed to process file: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      button.disabled = false;
      button.textContent = 'Download PDF';
    }
  });
});