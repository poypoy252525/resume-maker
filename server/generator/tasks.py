import logging
import concurrent.futures
from celery import shared_task
from .services.generate_document_service import GenerateDocumentService

from .services.ai_service import AIService

logger = logging.getLogger(__name__)

@shared_task
def generate_document_task(context, user_id=None):
    logger.info(f"Starting resume generation task for {context.get('full_name')}")
    try:
        service = GenerateDocumentService()
        filename = service.generate(context=context)
        logger.info(f"Successfully generated resume for {context.get('full_name')}")
        
        if user_id:
            try:
                from django.contrib.auth import get_user_model
                from .models import Activity
                User = get_user_model()
                user = User.objects.get(id=user_id)
                Activity.objects.create(
                    user=user,
                    activity_type='download',
                    label=f"Downloaded {context.get('full_name', 'Resume')}",
                    sub="Generated download files"
                )
            except Exception as e:
                logger.error(f"Failed to create download activity: {str(e)}", exc_info=True)
                
        return filename
    except Exception as e:
        logger.error(f"Failed to generate resume: {str(e)}", exc_info=True)
        raise e

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={'max_retries': 3},
    retry_jitter=True
)
def analyze_resume_task(self, resume_data, job_description, target_role, user_id=None):
    logger.info(f"Starting AI resume analysis for role: {target_role} (attempt {self.request.retries + 1})")
    try:
        ai_service = AIService()
        
        # Parallelize the independent AI queries to run concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_ats = executor.submit(ai_service.evaluate_ats, resume_data, job_description)
            future_skills = executor.submit(ai_service.recommend_skills, target_role, job_description)
            future_review = executor.submit(ai_service.review_resume, resume_data, job_description, target_role)
            
            ats_result = future_ats.result()
            skills_result = future_skills.result()
            review_result = future_review.result()
        
        result = {
            'ats_score': ats_result.get('ats_score', 0),
            'keyword_match': ats_result.get('keyword_match', []),
            'missing_keywords': ats_result.get('missing_keywords', []),
            'suggestions': ats_result.get('suggestions', []),
            'recommended_skills': skills_result.get('recommended_skills', []),
            'skills_reasoning': skills_result.get('reasoning', ''),
            'review': review_result
        }
        
        if user_id:
            try:
                from django.contrib.auth import get_user_model
                from .models import Activity
                User = get_user_model()
                user = User.objects.get(id=user_id)
                Activity.objects.create(
                    user=user,
                    activity_type='ai_review',
                    label=f"Reviewed {resume_data.get('full_name', 'Resume')}",
                    sub=f"ATS Score: {result['ats_score']}/100"
                )
            except Exception as e:
                logger.error(f"Failed to create AI review activity: {str(e)}", exc_info=True)
                
        return result
    except Exception as e:
        logger.error(f"AI analysis failed on attempt {self.request.retries + 1}: {str(e)}", exc_info=True)
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

@shared_task
def recommend_skills_task(target_role, job_description):
    try:
        ai_service = AIService()
        return ai_service.recommend_skills(target_role, job_description)
    except Exception as e:
        logger.error(f"Skills recommendation failed: {str(e)}", exc_info=True)
        raise e

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={'max_retries': 3},
    retry_jitter=True
)
def tailor_resume_task(self, resume_data, target_role, job_description, user_id=None):
    logger.info(f"Starting AI resume tailoring for role: {target_role} (attempt {self.request.retries + 1})")
    try:
        ai_service = AIService()
        result = ai_service.tailor_resume(resume_data, target_role, job_description)
        
        if user_id:
            try:
                from django.contrib.auth import get_user_model
                from .models import Activity
                User = get_user_model()
                user = User.objects.get(id=user_id)
                Activity.objects.create(
                    user=user,
                    activity_type='ai_tailor',
                    label=f"Tailored {resume_data.get('full_name', 'Resume')}",
                    sub=f"Role: {target_role}"
                )
            except Exception as e:
                logger.error(f"Failed to create AI tailor activity: {str(e)}", exc_info=True)
                
        return result
    except Exception as e:
        logger.error(f"AI tailoring failed on attempt {self.request.retries + 1}: {str(e)}", exc_info=True)
        raise e

