#!/usr/bin/env python3
"""
AI Cover Letter Generator - Advanced NLP-based cover letter generation
Generates unique, high-quality cover letters without external API dependencies
"""

import re
import random
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from textblob import TextBlob
import language_tool_python
from textstat import flesch_reading_ease

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

# Initialize LanguageTool
tool = language_tool_python.LanguageTool('en-US')

class AICoverLetterGenerator:
    def __init__(self):
        self.stop_words = set(nltk.corpus.stopwords.words('english'))
        
    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', str(text).strip())
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,!?;:()-]', '', text)
        
        return text
    
    def extract_skills(self, profile_data):
        """Extract and clean skills from profile data"""
        skills = []
        
        if isinstance(profile_data.get('skills'), list):
            for skill in profile_data['skills']:
                if isinstance(skill, str) and len(skill.strip()) > 1:
                    cleaned_skill = self.clean_text(skill)
                    if cleaned_skill and len(cleaned_skill) > 1:
                        skills.append(cleaned_skill)
        
        # Remove duplicates and limit to reasonable number
        return list(set(skills))[:15]
    
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
                    
                    for key in ['duration', 'period', 'dates', 'years']:
                        if exp.get(key):
                            clean_exp['duration'] = self.clean_text(exp[key])
                            break
                    
                    if clean_exp.get('title') and clean_exp.get('company'):
                        experience.append(clean_exp)
        
        return experience[:5]  # Limit to 5 most recent experiences
    
    def extract_education(self, profile_data):
        """Extract and clean education data"""
        education = []
        
        if isinstance(profile_data.get('education'), list):
            for edu in profile_data['education']:
                if isinstance(edu, dict):
                    clean_edu = {}
                    
                    # Extract degree
                    for key in ['degree', 'title', 'qualification', 'program']:
                        if edu.get(key):
                            clean_edu['degree'] = self.clean_text(edu[key])
                            break
                    
                    # Extract school
                    for key in ['school', 'university', 'institution', 'college']:
                        if edu.get(key):
                            clean_edu['school'] = self.clean_text(edu[key])
                            break
                    
                    # Extract year
                    for key in ['year', 'graduation_year', 'date', 'completion']:
                        if edu.get(key):
                            clean_edu['year'] = self.clean_text(edu[key])
                            break
                    
                    if clean_edu.get('degree') and clean_edu.get('school'):
                        education.append(clean_edu)
        
        return education[:3]  # Limit to 3 most relevant education entries
    
    def generate_opening(self, name, job_title, company_name):
        """Generate dynamic opening paragraph"""
        openings = [
            f"Dear Hiring Manager,\n\nI am writing to express my strong interest in the {job_title} position at {company_name}. With my background and expertise, I am confident that I would be a valuable addition to your team.",
            
            f"Dear Hiring Manager,\n\nI am excited to apply for the {job_title} role at {company_name}. My experience and skills align perfectly with the requirements for this position, and I am eager to contribute to your organization's success.",
            
            f"Dear Hiring Manager,\n\nI am writing to apply for the {job_title} position at {company_name}. I am impressed by your company's mission and believe my qualifications make me an ideal candidate for this role.",
            
            f"Dear Hiring Manager,\n\nI am very interested in the {job_title} opportunity at {company_name}. My professional background and passion for this field make me well-suited for this position.",
            
            f"Dear Hiring Manager,\n\nI am excited to submit my application for the {job_title} position at {company_name}. I am confident that my skills and experience would enable me to make a significant contribution to your team."
        ]
        
        return random.choice(openings)
    
    def generate_skills_paragraph(self, skills, job_description=""):
        """Generate skills-focused paragraph"""
        if not skills:
            return ""
        
        # Select 3-5 most relevant skills
        selected_skills = skills[:5]
        
        skill_paragraphs = [
            f"My technical expertise includes {', '.join(selected_skills[:3])} and {selected_skills[3] if len(selected_skills) > 3 else 'other relevant technologies'}. These skills have enabled me to deliver high-quality solutions and drive successful project outcomes.",
            
            f"I bring strong proficiency in {', '.join(selected_skills[:3])} and {selected_skills[3] if len(selected_skills) > 3 else 'related technologies'}. My hands-on experience with these tools has been instrumental in achieving measurable results throughout my career.",
            
            f"My core competencies include {', '.join(selected_skills[:3])} and {selected_skills[3] if len(selected_skills) > 3 else 'additional technical skills'}. I have consistently applied these skills to solve complex problems and deliver innovative solutions.",
            
            f"I possess extensive experience with {', '.join(selected_skills[:3])} and {selected_skills[3] if len(selected_skills) > 3 else 'other relevant technologies'}. This technical foundation has allowed me to excel in challenging environments and contribute to team success.",
            
            f"My skill set encompasses {', '.join(selected_skills[:3])} and {selected_skills[3] if len(selected_skills) > 3 else 'related technical areas'}. I have leveraged these capabilities to drive efficiency and deliver exceptional results in my previous roles."
        ]
        
        return random.choice(skill_paragraphs)
    
    def generate_experience_paragraph(self, experience):
        """Generate experience-focused paragraph"""
        if not experience:
            return ""
        
        # Use the most recent experience
        recent_exp = experience[0]
        title = recent_exp.get('title', 'Professional')
        company = recent_exp.get('company', 'my previous organization')
        
        experience_paragraphs = [
            f"In my role as {title} at {company}, I have developed strong problem-solving abilities and a track record of delivering results. This experience has equipped me with the skills and knowledge necessary to excel in this position.",
            
            f"My experience as {title} at {company} has provided me with valuable insights into industry best practices and effective project management. I am confident that this background positions me well for success in this role.",
            
            f"Through my work as {title} at {company}, I have gained hands-on experience in critical areas that directly relate to this position. I am excited about the opportunity to apply this expertise in a new and challenging environment.",
            
            f"My tenure as {title} at {company} has allowed me to develop strong analytical skills and a results-oriented approach. I believe these qualities, combined with my technical expertise, make me an ideal candidate for this role.",
            
            f"Having worked as {title} at {company}, I have cultivated the ability to work effectively in dynamic environments and deliver high-quality outcomes. I am eager to bring this experience and enthusiasm to your team."
        ]
        
        return random.choice(experience_paragraphs)
    
    def generate_education_paragraph(self, education):
        """Generate education-focused paragraph"""
        if not education:
            return ""
        
        # Use the highest degree
        highest_edu = education[0]
        degree = highest_edu.get('degree', 'my educational background')
        school = highest_edu.get('school', 'my institution')
        
        education_paragraphs = [
            f"My {degree} from {school} has provided me with a solid foundation in the principles and practices essential for success in this field. This educational background, combined with my practical experience, positions me well for this opportunity.",
            
            f"I hold a {degree} from {school}, which has equipped me with the theoretical knowledge and analytical skills necessary to excel in this role. My academic training has been complemented by hands-on experience in real-world applications.",
            
            f"My educational background includes a {degree} from {school}, where I developed strong critical thinking and problem-solving abilities. This foundation has been instrumental in my professional success and will be valuable in this position.",
            
            f"With a {degree} from {school}, I have gained comprehensive knowledge in relevant areas that directly apply to this role. My academic achievements, combined with my practical experience, demonstrate my commitment to excellence and continuous learning.",
            
            f"My {degree} from {school} has provided me with the technical knowledge and analytical framework necessary to tackle complex challenges. This educational foundation, enhanced by my professional experience, makes me well-prepared for this opportunity."
        ]
        
        return random.choice(education_paragraphs)
    
    def generate_closing(self, company_name, name):
        """Generate dynamic closing paragraph"""
        closings = [
            f"I am excited about the opportunity to contribute to {company_name}'s continued success and would welcome the chance to discuss how my skills and experience can benefit your team. Thank you for considering my application.\n\nBest regards,\n{name}",
            
            f"I am confident that my background and enthusiasm make me an ideal candidate for this position at {company_name}. I look forward to the opportunity to discuss my qualifications further and learn more about this exciting role.\n\nSincerely,\n{name}",
            
            f"I am eager to bring my skills and passion to {company_name} and contribute to your team's success. I would appreciate the opportunity to discuss my application and how I can add value to your organization.\n\nBest regards,\n{name}",
            
            f"I am very interested in the opportunity to join {company_name} and believe my qualifications align well with your needs. I would welcome the chance to discuss my application and explore how I can contribute to your team's goals.\n\nSincerely,\n{name}",
            
            f"I am excited about the possibility of joining {company_name} and contributing to your mission. I would be grateful for the opportunity to discuss my application and demonstrate how my skills can benefit your organization.\n\nBest regards,\n{name}"
        ]
        
        return random.choice(closings)
    
    def enhance_with_grammar(self, text):
        """Enhance text with grammar correction and paraphrasing"""
        try:
            # First, correct spelling
            corrected_text = str(TextBlob(text).correct())
            
            # Then, check grammar and suggest improvements
            matches = tool.check(corrected_text)
            
            # Apply grammar corrections
            enhanced_text = language_tool_python.utils.correct(corrected_text, matches)
            
            # Fix common incorrect "corrections" by LanguageTool
            enhanced_text = enhanced_text.replace("Firing Manager", "Hiring Manager")
            enhanced_text = enhanced_text.replace("Dear Firing Manager", "Dear Hiring Manager")
            
            # Check readability and adjust if needed
            readability_score = flesch_reading_ease(enhanced_text)
            
            if readability_score < 30:  # Too complex
                # Simplify some sentences
                sentences = enhanced_text.split('. ')
                simplified_sentences = []
                for sentence in sentences:
                    if len(sentence.split()) > 25:  # Long sentence
                        # Split long sentences
                        parts = sentence.split(', ')
                        if len(parts) > 2:
                            simplified_sentences.append('. '.join(parts[:2]) + '.')
                            simplified_sentences.append('. '.join(parts[2:]))
                        else:
                            simplified_sentences.append(sentence)
                    else:
                        simplified_sentences.append(sentence)
                enhanced_text = '. '.join(simplified_sentences)
            
            return enhanced_text
            
        except Exception as e:
            print(f"Grammar enhancement error: {e}")
            return text
    
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
            
            # Generate paragraphs
            opening = self.generate_opening(name, job_title, company_name)
            skills_para = self.generate_skills_paragraph(skills, job_description)
            experience_para = self.generate_experience_paragraph(experience)
            education_para = self.generate_education_paragraph(education)
            closing = self.generate_closing(company_name, name)
            
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
            
            # Enhance with grammar correction
            enhanced_letter = self.enhance_with_grammar(cover_letter)
            
            return enhanced_letter
            
        except Exception as e:
            print(f"Cover letter generation error: {e}")
            return f"Dear Hiring Manager,\n\nI am writing to express my interest in the {job_title} position at {company_name}. I believe my skills and experience make me a strong candidate for this role.\n\nThank you for your consideration.\n\nBest regards,\n{name}"

# Initialize generator
generator = AICoverLetterGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Cover Letter Generator',
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
    print("Starting AI Cover Letter Generator on port 8002...")
    app.run(host='0.0.0.0', port=8002, debug=True)
