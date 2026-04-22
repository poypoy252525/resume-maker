from celery import shared_task
from .services.generate_document_service import GenerateDocumentService

@shared_task
def generate_document_task(resume_id):
    service = GenerateDocumentService()
    service.generate()
