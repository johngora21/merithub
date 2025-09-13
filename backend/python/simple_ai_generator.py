#!/usr/bin/env python3
"""
Simple AI Cover Letter Generator - No external dependencies
Generates unique, high-quality cover letters using basic Python
"""

import re
import random
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class SimpleAIGenerator:
    def __init__(self):
        self.opening_templates = [
            "Dear Hiring Manager,\n\nI am writing to express my strong interest in the {job_title} position at {company_name}. With my background and expertise, I am confident that I would be a valuable addition to your team.",
            
            "Dear Hiring Manager,\n\nI am excited to apply for the {job_title} role at {company_name}. My experience and skills align perfectly with the requirements for this position, and I am eager to contribute to your organization's success.",
            
            "Dear Hiring Manager,\n\nI am writing to apply for the {job_title} position at {company_name}. I am impressed by your company's mission and believe my qualifications make me an ideal candidate for this role.",
            
            "Dear Hiring Manager,\n\nI am very interested in the {job_title} opportunity at {company_name}. My professional background and passion for this field make me well-suited for this position.",
            
            "Dear Hiring Manager,\n\nI am excited to submit my application for the {job_title} position at {company_name}. I am confident that my skills and experience would enable me to make a significant contribution to your team."
        ]
        
        self.skills_templates = [
            "My technical expertise includes {skills} and other relevant technologies. These skills have enabled me to deliver high-quality solutions and drive successful project outcomes.",
            
            "I bring strong proficiency in {skills} and related technologies. My hands-on experience with these tools has been instrumental in achieving measurable results throughout my career.",
            
            "My core competencies include {skills} and additional technical skills. I have consistently applied these skills to solve complex problems and deliver innovative solutions.",
            
            "I possess extensive experience with {skills} and other relevant technologies. This technical foundation has allowed me to excel in challenging environments and contribute to team success.",
            
            "My skill set encompasses {skills} and related technical areas. I have leveraged these capabilities to drive efficiency and deliver exceptional results in my previous roles."
        ]
        
        self.experience_templates = [
            "In my role as {title} at {company}, I have developed strong problem-solving abilities and a track record of delivering results. This experience has equipped me with the skills and knowledge necessary to excel in this position.",
            
            "My experience as {title} at {company} has provided me with valuable insights into industry best practices and effective project management. I am confident that this background positions me well for success in this role.",
            
            "Through my work as {title} at {company}, I have gained hands-on experience in critical areas that directly relate to this position. I am excited about the opportunity to apply this expertise in a new and challenging environment.",
            
            "My tenure as {title} at {company} has allowed me to develop strong analytical skills and a results-oriented approach. I believe these qualities, combined with my technical expertise, make me an ideal candidate for this role.",
            
            "Having worked as {title} at {company}, I have cultivated the ability to work effectively in dynamic environments and deliver high-quality outcomes. I am eager to bring this experience and enthusiasm to your team."
        ]
        
        self.education_templates = [
            "My {degree} from {school} has provided me with a solid foundation in the principles and practices essential for success in this field. This educational background, combined with my practical experience, positions me well for this opportunity.",
            
            "I hold a {degree} from {school}, which has equipped me with the theoretical knowledge and analytical skills necessary to excel in this role. My academic training has been complemented by hands-on experience in real-world applications.",
            
            "My educational background includes a {degree} from {school}, where I developed strong critical thinking and problem-solving abilities. This foundation has been instrumental in my professional success and will be valuable in this position.",
            
            "With a {degree} from {school}, I have gained comprehensive knowledge in relevant areas that directly apply to this role. My academic achievements, combined with my practical experience, demonstrate my commitment to excellence and continuous learning.",
            
            "My {degree} from {school} has provided me with the technical knowledge and analytical framework necessary to tackle complex challenges. This educational foundation, enhanced by my professional experience, makes me well-prepared for this opportunity."
        ]
        
        self.closing_templates = [
            "I am excited about the opportunity to contribute to {company_name}'s continued success and would welcome the chance to discuss how my skills and experience can benefit your team. Thank you for considering my application.\n\nBest regards,\n{name}",
            
            "I am confident that my background and enthusiasm make me an ideal candidate for this position at {company_name}. I look forward to the opportunity to discuss my qualifications further and learn more about this exciting role.\n\nSincerely,\n{name}",
            
            "I am eager to bring my skills and passion to {company_name} and contribute to your team's success. I would appreciate the opportunity to discuss my application and how I can add value to your organization.\n\nBest regards,\n{name}",
            
            "I am very interested in the opportunity to join {company_name} and believe my qualifications align well with your needs. I would welcome the chance to discuss my application and explore how I can contribute to your team's goals.\n\nSincerely,\n{name}",
            
            "I am excited about the possibility of joining {company_name} and contributing to your mission. I would be grateful for the opportunity to discuss my application and demonstrate how my skills can benefit your organization.\n\nBest regards,\n{name}"
        ]
    
    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', str(text).strip())
    
    def extract_skills(self, profile_data):
        """Extract and clean skills from profile data"""
        skills = []
        if isinstance(profile_data.get('skills'), list):
            for skill in profile_data['skills']:
                if isinstance(skill, str) and len(skill.strip()) > 1:
                    cleaned_skill = self.clean_text(skill)
                    if cleaned_skill and len(cleaned_skill) > 1:
                        skills.append(cleaned_skill)
        return list(set(skills))[:8]  # Limit to 8 skills
    
    def extract_experience(self, profile_data):
        """Extract and clean experience data"""
        experience = []
        if isinstance(profile_data.get('experience'), list):
            for exp in profile_data['experience']:
                if isinstance(exp, dict):
                    clean_exp = {}
                    for key in ['title', 'position', 'role', 'job_title']:
                        if exp.get(key):
                            clean_exp['title'] = self.clean_text(exp[key])
                            break
                    for key in ['company', 'employer', 'organization']:
                        if exp.get(key):
                            clean_exp['company'] = self.clean_text(exp[key])
                            break
                    if clean_exp.get('title') and clean_exp.get('company'):
                        experience.append(clean_exp)
        return experience[:3]  # Limit to 3 experiences
    
    def extract_education(self, profile_data):
        """Extract and clean education data"""
        education = []
        if isinstance(profile_data.get('education'), list):
            for edu in profile_data['education']:
                if isinstance(edu, dict):
                    clean_edu = {}
                    for key in ['degree', 'title', 'qualification', 'program']:
                        if edu.get(key):
                            clean_edu['degree'] = self.clean_text(edu[key])
                            break
                    for key in ['school', 'university', 'institution', 'college']:
                        if edu.get(key):
                            clean_edu['school'] = self.clean_text(edu[key])
                            break
                    if clean_edu.get('degree') and clean_edu.get('school'):
                        education.append(clean_edu)
        return education[:2]  # Limit to 2 education entries
    
    def generate_cover_letter(self, profile_data, job_title, company_name, job_description=""):
        """Generate complete cover letter"""
        try:
            # Extract and clean data
            name = self.clean_text(profile_data.get('name', 'Candidate'))
            skills = self.extract_skills(profile_data)
            experience = self.extract_experience(profile_data)
            education = self.extract_education(profile_data)
            
            # Validate job title and company name
            job_title = self.clean_text(job_title) if job_title else "the position"
            company_name = self.clean_text(company_name) if company_name else "your organization"
            
            # Generate opening
            opening = random.choice(self.opening_templates).format(
                job_title=job_title,
                company_name=company_name
            )
            
            # Generate skills paragraph
            skills_para = ""
            if skills:
                skills_text = ', '.join(skills[:5])  # Use first 5 skills
                skills_para = random.choice(self.skills_templates).format(skills=skills_text)
            
            # Generate experience paragraph
            experience_para = ""
            if experience:
                recent_exp = experience[0]
                experience_para = random.choice(self.experience_templates).format(
                    title=recent_exp.get('title', 'Professional'),
                    company=recent_exp.get('company', 'my previous organization')
                )
            
            # Generate education paragraph
            education_para = ""
            if education:
                highest_edu = education[0]
                education_para = random.choice(self.education_templates).format(
                    degree=highest_edu.get('degree', 'my educational background'),
                    school=highest_edu.get('school', 'my institution')
                )
            
            # Generate closing
            closing = random.choice(self.closing_templates).format(
                company_name=company_name,
                name=name
            )
            
            # Combine paragraphs
            paragraphs = [opening]
            
            if skills_para:
                paragraphs.append(skills_para)
            
            if experience_para:
                paragraphs.append(experience_para)
            
            if education_para:
                paragraphs.append(education_para)
            
            paragraphs.append(closing)
            
            # Join paragraphs
            cover_letter = '\n\n'.join(paragraphs)
            
            return cover_letter
            
        except Exception as e:
            print(f"Cover letter generation error: {e}")
            return f"Dear Hiring Manager,\n\nI am writing to express my interest in the {job_title} position at {company_name}. I believe my skills and experience make me a strong candidate for this role.\n\nThank you for your consideration.\n\nBest regards,\n{name}"

# Initialize generator
generator = SimpleAIGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Simple AI Cover Letter Generator',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/generate-cover-letter', methods=['POST'])
def generate_cover_letter():
    """Generate cover letter from profile data"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Extract required fields
        profile_data = data.get('extracted_data', {})
        job_title = data.get('job_title', '')
        company_name = data.get('company_name', '')
        job_description = data.get('job_description', '')
        
        # Validate required fields
        if not profile_data:
            return jsonify({
                'success': False,
                'error': 'Profile data is required'
            }), 400
        
        if not job_title:
            return jsonify({
                'success': False,
                'error': 'Job title is required'
            }), 400
        
        if not company_name:
            return jsonify({
                'success': False,
                'error': 'Company name is required'
            }), 400
        
        # Generate cover letter
        cover_letter = generator.generate_cover_letter(
            profile_data=profile_data,
            job_title=job_title,
            company_name=company_name,
            job_description=job_description
        )
        
        return jsonify({
            'success': True,
            'cover_letter': cover_letter,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error generating cover letter: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to generate cover letter: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Simple AI Cover Letter Generator on port 8002...")
    app.run(host='0.0.0.0', port=8002, debug=True)
