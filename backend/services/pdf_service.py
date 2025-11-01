import fitz

class PDFService:
    def parse_text(self, file_bytes: bytes) -> str:
        """
        Parses text from PDF bytes.
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
            raise ValueError(f"An error occurred during PDF parsing: {e}")


pdf_service = PDFService()