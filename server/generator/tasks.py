import logging
from celery import shared_task
from .services.generate_document_service import GenerateDocumentService

from .services.ai_service import AIService

logger = logging.getLogger(__name__)

@shared_task
def generate_document_task(context):
    logger.info(f"Starting resume generation task for {context.get('full_name')}")
    try:
        service = GenerateDocumentService()
        filename = service.generate(context=context)
        logger.info(f"Successfully generated resume for {context.get('full_name')}")
        return filename
    except Exception as e:
        logger.error(f"Failed to generate resume: {str(e)}", exc_info=True)
        raise e

@shared_task
def analyze_resume_task(resume_data, job_description, target_role):
    logger.info(f"Starting AI resume analysis for role: {target_role}")
    try:
        ai_service = AIService()
        ats_result = ai_service.evaluate_ats(resume_data, job_description)
        skills_result = ai_service.recommend_skills(target_role, job_description)
        
        return {
            'ats_score': ats_result.get('ats_score', 0),
            'keyword_match': ats_result.get('keyword_match', []),
            'missing_keywords': ats_result.get('missing_keywords', []),
            'suggestions': ats_result.get('suggestions', []),
            'recommended_skills': skills_result.get('recommended_skills', []),
            'skills_reasoning': skills_result.get('reasoning', '')
        }
    except Exception as e:
        logger.error(f"AI analysis failed: {str(e)}", exc_info=True)
        raise e

@shared_task
def paraphrase_bullet_task(bullet_point, target_role, job_description):
    try:
        ai_service = AIService()
        return ai_service.paraphrase_bullet(bullet_point, target_role, job_description)
    except Exception as e:
        logger.error(f"Paraphrase task failed: {str(e)}", exc_info=True)
        raise e

@shared_task
def recommend_job_description_task(job_title, target_role, job_description):
    try:
        ai_service = AIService()
        return ai_service.recommend_job_description(job_title, target_role, job_description)
    except Exception as e:
        logger.error(f"Job description recommendation failed: {str(e)}", exc_info=True)
        raise e
