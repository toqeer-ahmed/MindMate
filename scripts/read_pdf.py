import sys
import PyPDF2

def extract_text_from_pdf(pdf_path, output_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully wrote to {output_path}")
    except Exception as e:
        print(str(e))

if __name__ == "__main__":
    if len(sys.argv) > 2:
        extract_text_from_pdf(sys.argv[1], sys.argv[2])
    else:
        print("Please provide input and output file paths.")
