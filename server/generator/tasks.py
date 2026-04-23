import logging
from celery import shared_task
from .services.generate_document_service import GenerateDocumentService

logger = logging.getLogger(__name__)

@shared_task
def generate_document_task(context):
    logger.info(f"Starting resume generation task for {context.get('full_name')}")
    try:
        service = GenerateDocumentService()
        service.generate(context=context)
        logger.info(f"Successfully generated resume for {context.get('full_name')}")
    except Exception as e:
        logger.error(f"Failed to generate resume: {str(e)}", exc_info=True)
