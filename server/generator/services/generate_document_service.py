from docxtpl import DocxTemplate
from django.conf import settings
import os
import subprocess
import logging

logger = logging.getLogger(__name__)

class GenerateDocumentService:
    
    
    def generate(self, context=None):
        if context is None:
            context = DUMMY_RESUME_CONTEXT
            
        template_path = os.path.join(settings.BASE_DIR, 'generator/templates/generator/Resume.docx')
        doc = DocxTemplate(template_path)
        doc.render(context)
        
        output_dir = os.path.join(settings.BASE_DIR, 'generator/static/resumes')
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Create a safe filename from full_name or use a default
        full_name_slug = context.get('full_name', 'resume').lower().replace(' ', '_')
        output_path = os.path.join(output_dir, f'{full_name_slug}.docx')
        doc.save(output_path)
        logger.info(f"Generated DOCX: {output_path}")
        
        # Convert to PDF
        logger.info(f"Converting {output_path} to PDF")
        self.convert_to_pdf(output_path, output_dir)
        return full_name_slug
        
    def convert_to_pdf(self, docx_path, output_dir):
        logger.info(f"Converting {docx_path} to PDF...")
        try:
            # On Windows, you might need to provide the full path to soffice.exe
            # but on Docker/Linux, 'libreoffice' or 'soffice' is usually enough.
            cmd = ['libreoffice', '--headless', '--convert-to', 'pdf', docx_path, '--outdir', output_dir]
            
            # Check if we are on Windows and try 'soffice' if 'libreoffice' fails
            if os.name == 'nt':
                try:
                    subprocess.run(cmd, check=True, capture_output=True)
                except FileNotFoundError:
                    cmd[0] = 'soffice' # Often the command on Windows
                    subprocess.run(cmd, check=True, capture_output=True)
            else:
                subprocess.run(cmd, check=True, capture_output=True)
                
            logger.info(f"Generated PDF in: {output_dir}")
        except Exception as e:
            logger.error(f"PDF conversion failed: {e}")
        
    
DUMMY_RESUME_CONTEXT = {
    "full_name": "Alexander Thorne",
    "email": "alex.thorne@example.com",
    "phone_number": "+1 (555) 010-8899",
    "location": "Springfield, OR",
    "has_skill": True,
    "skill_description": "Python, Django, AWS, Kubernetes, React, PostgreSQL, System Design, Team Leadership.",
    "has_experience": True,
    "experiences": [
        {
            "company_name": "CloudNexus Solutions",
            "location": "Remote",
            "job_title": "Senior Software Architect",
            "date_from": "Jan 2020",
            "date_to": "Present",
            "bullet_points": [
                "Led the migration of legacy monolithic systems to a serverless microservices architecture.",
                "Designed high-throughput data processing pipelines handling 10M+ events/day.",
                "Mentored a team of 15+ engineers and implemented TDD best practices."
            ]
        },
        {
            "company_name": "InnovateSoft Corp",
            "location": "San Francisco, CA",
            "job_title": "Full Stack Developer",
            "date_from": "June 2015",
            "date_to": "Dec 2019",
            "bullet_points": [
                "Developed real-time analytics dashboards using Django and React.",
                "Optimized database performance reducing query times by 40%.",
                "Integrated multiple third-party APIs for payment and CRM."
            ]
        }
    ],
    "has_education": True,
    "educations": [
        {
            "school": "Stanford University",
            "location": "Stanford, CA",
            "school_type": "Master of Science in Computer Science",
            "date_from": "Sept 2013",
            "date_to": "June 2015",
            "has_content": True,
            "content": "Specialized in Distributed Systems and Artificial Intelligence. Graduated with 4.0 GPA."
        },
        {
            "school": "MIT",
            "location": "Cambridge, MA",
            "school_type": "Bachelor of Science in Software Engineering",
            "date_from": "Sept 2009",
            "date_to": "May 2013",
            "has_content": False,
            "content": ""
        }
    ]
}
