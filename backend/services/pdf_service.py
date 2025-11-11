"""Simple PDF parsing utilities.

This module contains a small wrapper around PyMuPDF (fitz) used to extract
plain text from uploaded CV PDFs. It intentionally raises clear ValueError
exceptions for common failure modes so the API layer can return helpful
messages to users.

Usage:
- call `pdf_service.parse_text(file_bytes)` where `file_bytes` comes from the
  uploaded file (e.g., FastAPI's UploadFile.read()).
"""

import fitz


class PDFService:
    """Wrapper around PyMuPDF for extracting text from PDF bytes.

    Public methods:
    - parse_text(file_bytes) -> str: extracts and returns the concatenated
      text of all pages. Raises ValueError on empty or unreadable PDFs.
    """

    def parse_text(self, file_bytes: bytes) -> str:
        """
        Parses text from PDF bytes and returns a single string with all page
        text concatenated.

        Raises:
        - ValueError: when the file is empty, unreadable, or parsing fails.
        """
        try:
            full_text = ""
            with fitz.open(stream=file_bytes, filetype="pdf") as doc:
                for page in doc:
                    full_text += page.get_text()
            
            if not full_text.strip():
                raise ValueError("CV PDF is empty or unreadable.")
                
            return full_text
        except fitz.EmptyFileError:
            raise ValueError("The uploaded PDF file is empty.")
        except Exception as e:
            # Wrap lower-level exceptions so callers receive a consistent type
            raise ValueError(f"An error occurred during PDF parsing: {e}")


pdf_service = PDFService()