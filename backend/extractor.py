try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract

def extract_text_from_image(filepath):
    """
    This function will handle the core OCR processing.
    It takes a filepath to an image and returns the extracted text.
    """
    try:
        text = pytesseract.image_to_string(Image.open(filepath))
        return text
    except FileNotFoundError:
        return "Error: The file was not found at the specified path."
    except Exception as e:
        return f"An error occurred during OCR processing: {str(e)}"