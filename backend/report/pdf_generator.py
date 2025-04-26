# PDF report generation using ReportLab
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

def generate_pdf_report(summary, filename='business_report.pdf'):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 50, "Startup Planning Session Report")
    c.setFont("Helvetica", 12)
    text_object = c.beginText(40, height - 90)
    for line in summary.split('\n'):
        text_object.textLine(line)
    c.drawText(text_object)
    c.save()
    buffer.seek(0)
    with open(filename, 'wb') as f:
        f.write(buffer.read())
    return filename
