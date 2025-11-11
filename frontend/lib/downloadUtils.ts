export const downloadCVAsHTML = (htmlContent: string, fileName: string) => {
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
      .modern-black-template { display: flex; height: 100vh; }
      .modern-black-sidebar { width: 33%; background: #1f2937; color: white; padding: 1.5rem; }
      .modern-black-content { flex: 1; padding: 2rem; }
      .colored-sidebar-template { display: flex; height: 100vh; }
      .colored-sidebar-left { width: 25%; padding: 1.5rem; }
      .colored-sidebar-content { flex: 1; padding: 2rem; }
      .minimal-template { max-width: 100%; padding: 1.5rem; }
    }
    body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; }
    h1 { font-size: 24px; margin-bottom: 10px; }
    h2 { font-size: 18px; margin-bottom: 8px; border-bottom: 2px solid #000; }
    h3 { font-size: 14px; margin-bottom: 5px; }
    p { margin-bottom: 5px; }
    .flex { display: flex; }
    .space-between { justify-content: space-between; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .text-sm { font-size: 12px; }
    .text-lg { font-size: 16px; }
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .text-gray-600 { color: #6b7280; }
    .text-gray-700 { color: #374151; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCVAsPDF = (element: HTMLElement, fileName: string) => {
  // Enhanced PDF download with better styling
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }
  
  const htmlContent = element.innerHTML;
  const documentContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${fileName}</title>
  <meta charset="UTF-8">
  <style>
    @page { 
      margin: 0.5in; 
      size: A4; 
    }
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.3; 
      color: #000; 
      margin: 0;
      font-size: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* Template specific styles */
    .modern-black-template { 
      display: flex; 
      min-height: 100vh; 
      font-size: 11px;
    }
    .modern-black-sidebar { 
      width: 33%; 
      background: #1f2937 !important; 
      color: white !important; 
      padding: 1rem;
      box-sizing: border-box;
    }
    .modern-black-content { 
      flex: 1; 
      padding: 1.5rem;
      box-sizing: border-box;
    }
    
    .colored-sidebar-template { 
      display: flex; 
      min-height: 100vh;
      font-size: 11px;
    }
    .colored-sidebar-left { 
      width: 33%; 
      padding: 1rem;
      box-sizing: border-box;
    }
    .colored-sidebar-content { 
      flex: 1; 
      padding: 1.5rem;
      box-sizing: border-box;
    }
    
    .minimal-template { 
      max-width: 100%; 
      padding: 1rem;
      font-size: 11px;
    }
    
    /* Typography */
    h1 { font-size: 18px; margin-bottom: 8px; line-height: 1.2; }
    h2 { font-size: 14px; margin-bottom: 6px; line-height: 1.2; }
    h3 { font-size: 12px; margin-bottom: 4px; line-height: 1.2; }
    p { font-size: 10px; margin-bottom: 4px; line-height: 1.3; }
    .text-xs { font-size: 9px; }
    .text-sm { font-size: 10px; }
    .text-lg { font-size: 13px; }
    
    /* Image handling - Better print support */
    img { 
      max-width: 80px !important; 
      height: 80px !important; 
      object-fit: cover !important;
      border-radius: 50% !important;
      display: block !important;
    }
    
    /* Profile photo containers */
    .w-20.h-20.rounded-full,
    .w-20.h-20.rounded-full img {
      border-radius: 50% !important;
      width: 80px !important;
      height: 80px !important;
      object-fit: cover !important;
      overflow: hidden !important;
    }
    
    .w-24.h-24.rounded-full img,
    .w-32.h-32.rounded-full img {
      border-radius: 50% !important;
      width: 80px !important;
      height: 80px !important;
      object-fit: cover !important;
    }
    
    /* Ensure circular containers maintain shape */
    .rounded-full {
      border-radius: 50% !important;
      overflow: hidden !important;
    }
    
    /* Standard resume sizing */
    .colored-sidebar-template {
      width: 210mm !important;
      height: 297mm !important;
      max-width: 210mm !important;
      margin: 0 !important;
    }
    
    .colored-sidebar-left {
      width: 25% !important;
    }
    
    /* Ensure colors print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.onload = function() {
      // Small delay to ensure styles are applied
      setTimeout(function() {
        window.print();
        setTimeout(function() {
          window.close();
        }, 1000);
      }, 500);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(documentContent);
  printWindow.document.close();
};

export const downloadCVAsWord = (htmlContent: string, fileName: string) => {
  const preHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${fileName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
    h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; }
    h2 { font-size: 14pt; font-weight: bold; margin-bottom: 8pt; border-bottom: 1pt solid black; padding-bottom: 2pt; }
    h3 { font-size: 12pt; font-weight: bold; margin-bottom: 4pt; }
    p { margin-bottom: 6pt; }
    .section { margin-bottom: 16pt; }
    .contact-info { margin-bottom: 8pt; }
    .experience-item { margin-bottom: 12pt; }
    .sidebar { background-color: #f0f0f0; padding: 12pt; margin-bottom: 12pt; }
  </style>
</head>
<body>`;
  
  const postHtml = "</body></html>";
  
  // Clean the HTML content for Word compatibility
  const cleanedContent = htmlContent
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/<svg[^>]*>.*?<\/svg>/g, '')
    .replace(/<img[^>]*>/g, '');
  
  const fullHtml = preHtml + cleanedContent + postHtml;
  
  const blob = new Blob([fullHtml], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};