#!/usr/bin/env python3
"""
Robust PDF Extractor with Advanced Text Processing
Extracts structured data from CV/Resume PDFs with intelligent text cleaning
"""

import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import pdfplumber
import spacy
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

class RobustPDFExtractor:
    def __init__(self):
        # Comprehensive skills database
        self.COMMON_SKILLS = [
            'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
            'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
            'HTML', 'CSS', 'Bootstrap', 'jQuery', 'TypeScript', 'SASS', 'LESS',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
            'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
            'Linux', 'Windows', 'macOS', 'Ubuntu', 'CentOS',
            'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Scikit-learn',
            'Project Management', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
            'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Analytical Thinking',
            'Microsoft Office', 'Excel', 'PowerPoint', 'Word', 'Outlook',
            'Sales', 'Marketing', 'Customer Service', 'Business Development',
            'Finance', 'Accounting', 'Budgeting', 'Financial Analysis',
            'Healthcare', 'Medicine', 'Nursing', 'Pharmacy', 'Laboratory',
            'Education', 'Teaching', 'Training', 'Curriculum Development',
            'Engineering', 'Mechanical', 'Electrical', 'Civil', 'Software',
            'Design', 'UI/UX', 'Graphic Design', 'Photoshop', 'Illustrator',
            'Writing', 'Content Creation', 'Technical Writing', 'Copywriting',
            'Research', 'Data Analysis', 'Statistics', 'Mathematics',
            'Powerpoint', 'Excel', 'Word', 'Office', 'Microsoft',
            'Laboratory', 'Science', 'Research', 'Analysis', 'Testing',
            'Management', 'Leadership', 'Team', 'Project', 'Business',
            'Patient', 'Medical', 'Healthcare', 'Hospital', 'Clinical',
            'Teaching', 'Education', 'Training', 'Learning', 'Development'
        ]
        
        # Job title patterns
        self.JOB_TITLE_PATTERNS = [
            r'(software\s+engineer|developer|programmer)',
            r'(senior|lead|principal|staff)\s+(engineer|developer|programmer)',
            r'(full\s+stack|front\s+end|back\s+end|web)\s+(developer|engineer)',
            r'(data\s+scientist|analyst|engineer)',
            r'(product\s+manager|project\s+manager)',
            r'(designer|ui/ux|graphic)',
            r'(marketing|sales|business)\s+(manager|director|specialist)',
            r'(hr|human\s+resources|recruiter)',
            r'(accountant|financial|finance)',
            r'(teacher|instructor|professor|educator)',
            r'(nurse|doctor|physician|medical|laboratory|scientist)',
            r'(consultant|advisor|analyst)',
            r'(manager|director|executive|ceo|cto|cfo)',
            r'(researcher|scientist|engineer)',
            r'(technician|specialist|coordinator)'
        ]

    def clean_text_advanced(self, text):
        """Advanced text cleaning with intelligent structure preservation"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common PDF artifacts and headers
        artifacts = [
            r'P\.O\.\s*BOX\s*\d+',
            r'DAR\s+ES\s+SALAAM',
            r'ABOUT\s+ME',
            r'WORK\s+EXPERIENCE',
            r'EXPERIENCE',
            r'EDUCATION',
            r'SKILLS',
            r'CERTIFICATIONS',
            r'AWARDS',
            r'PROJECTS',
            r'REFERENCES',
            r'CONTACT\s+INFORMATION',
            r'PHONE\s*:?\s*\d+',
            r'EMAIL\s*:?\s*[^\s]+@[^\s]+',
            r'LINKEDIN\s*:?\s*[^\s]+',
            r'GITHUB\s*:?\s*[^\s]+',
            r'WWW\.[^\s]+',
            r'HTTP[^\s]+',
            r'REGIONAL\s+REFERRAL\s+HOSPITAL',
            r'MWANANYAMALA',
            r'MUHIMBILI\s+NATIONAL\s+HOSPITAL',
            r'KAMANGA\s+MEDICS\s+HOSPITAL',
            r'RONA\s+CONSULTANTS'
        ]
        
        for pattern in artifacts:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        # Fix common OCR errors and formatting
        text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # Add space between camelCase
        text = re.sub(r'([A-Z])([A-Z][a-z])', r'\1 \2', text)  # Add space between ALLCAPS and TitleCase
        
        # Clean up punctuation
        text = re.sub(r'[.,!?]{2,}', '.', text)
        text = re.sub(r'[,]{2,}', ',', text)
        text = re.sub(r'\s*[,.]\s*', '. ', text)
        text = re.sub(r'\.\s*\.', '.', text)
        
        # Remove standalone single characters and numbers
        text = re.sub(r'\b[a-zA-Z]\b', '', text)
        text = re.sub(r'\b\d+\b', '', text)
        
        # Clean up multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    def extract_name(self, text):
        """Extract name with improved accuracy"""
        lines = text.split('\n')[:20]
        
        for line in lines:
            line = line.strip()
            if len(line) < 3 or len(line) > 50:
                continue
                
            # Skip common headers and contact info
            skip_patterns = [
                'resume', 'cv', 'curriculum', 'vitae', 'phone', 'email', 'address',
                '@', 'linkedin', 'github', 'www', 'http', 'experience', 'education',
                'skills', 'about', 'contact', 'profile', 'objective', 'summary',
                'work', 'professional', 'career', 'background'
            ]
            
            if any(pattern in line.lower() for pattern in skip_patterns):
                continue
            
            # Skip lines with numbers (dates, phone numbers)
            if re.search(r'\d{4}|\d{3}-\d{3}-\d{4}|\+\d{10,}', line):
                continue
            
            # Skip lines that are clearly job titles
            if any(re.search(pattern, line, re.IGNORECASE) for pattern in self.JOB_TITLE_PATTERNS):
                continue
            
            # Check if it looks like a name (2-4 words, proper case)
            words = line.split()
            if 2 <= len(words) <= 4:
                if all(word[0].isupper() and word[1:].islower() for word in words if len(word) > 1):
                    return line
        
        return ""

    def extract_title(self, text):
        """Extract job title with improved accuracy"""
        lines = text.split('\n')
        
        for i, line in enumerate(lines[:30]):
            line = line.strip()
            if not line or len(line) < 5:
                continue
                
            # Skip contact info
            if any(contact in line.lower() for contact in ['@', 'phone', 'email', 'linkedin', 'github']):
                continue
                
            # Skip if it's just a name
            if re.match(r'^[A-Za-z\s\.-]+$', line) and len(line.split()) <= 4:
                continue
                
            # Check for job title patterns
            for pattern in self.JOB_TITLE_PATTERNS:
                if re.search(pattern, line, re.IGNORECASE):
                    return line.title()
        
        return ""

    def extract_contact_info(self, text):
        """Extract contact information"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        linkedin_pattern = r'linkedin\.com/in/[A-Za-z0-9-]+'
        github_pattern = r'github\.com/[A-Za-z0-9-]+'
        
        email = re.search(email_pattern, text)
        phone = re.search(phone_pattern, text)
        linkedin = re.search(linkedin_pattern, text)
        github = re.search(github_pattern, text)
        
        return {
            'email': email.group() if email else '',
            'phone': phone.group() if phone else '',
            'linkedin': linkedin.group() if linkedin else '',
            'github': github.group() if github else ''
        }

    def extract_skills(self, text):
        """Extract skills with improved matching"""
        skills = []
        text_lower = text.lower()
        
        for skill in self.COMMON_SKILLS:
            if skill.lower() in text_lower:
                skills.append(skill)
        
        # Remove duplicates and return top skills
        return list(set(skills))[:15]

    def extract_experience(self, text):
        """Extract work experience with better parsing"""
        experience = []
        
        # Split text into sentences for better processing
        sentences = re.split(r'[.!?]+', text)
        
        current_exp = None
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence or len(sentence) < 10:
                continue
            
            # Look for job title patterns
            for pattern in self.JOB_TITLE_PATTERNS:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    # This looks like a job title, start a new experience entry
                    if current_exp:
                        experience.append(current_exp)
                    
                    current_exp = {
                        'title': sentence.strip(),
                        'company': '',
                        'duration': '',
                        'description': ''
                    }
                    break
            
            # If we have a current experience, add this sentence as description
            if current_exp and not any(re.search(pattern, sentence, re.IGNORECASE) for pattern in self.JOB_TITLE_PATTERNS):
                if current_exp['description']:
                    current_exp['description'] += ' ' + sentence
                else:
                    current_exp['description'] = sentence
        
        # Add the last experience if it exists
        if current_exp:
            experience.append(current_exp)
        
        # Clean up descriptions
        for exp in experience:
            if exp.get('description'):
                exp['description'] = self.clean_text_advanced(exp['description'])
                # Limit description length
                if len(exp['description']) > 200:
                    exp['description'] = exp['description'][:200] + '...'
        
        return experience[:5]  # Return top 5 experiences

    def extract_education(self, text):
        """Extract education information"""
        education = []
        
        # Education degree patterns
        degree_patterns = [
            r'(Bachelor|B\.A\.|B\.S\.|B\.Sc\.|B\.Eng\.|B\.Tech\.)',
            r'(Master|M\.A\.|M\.S\.|M\.Sc\.|M\.Eng\.|M\.Tech\.|MBA)',
            r'(PhD|Ph\.D\.|Doctorate|Doctor)',
            r'(Diploma|Certificate|Certification)',
            r'(Associate|A\.A\.|A\.S\.)'
        ]
        
        # Look for education sections
        edu_section = re.search(r'(education|academic|qualification|degree)', text, re.IGNORECASE)
        if edu_section:
            # Extract text after education section
            edu_text = text[edu_section.end():]
            # Take first 500 characters
            edu_text = edu_text[:500]
            
            # Look for degree patterns
            for pattern in degree_patterns:
                matches = re.finditer(pattern, edu_text, re.IGNORECASE)
                for match in matches:
                    # Extract context around the match
                    start = max(0, match.start() - 50)
                    end = min(len(edu_text), match.end() + 100)
                    context = edu_text[start:end]
                    
                    # Clean up the context
                    context = self.clean_text_advanced(context)
                    
                    if context:
                        education.append({
                            'degree': match.group(),
                            'school': '',
                            'year': '',
                            'description': context
                        })
        
        return education[:3]  # Return top 3 education entries

    def extract_from_pdf(self, pdf_file):
        """Main extraction method"""
        try:
            # Extract text using pdfplumber
            with pdfplumber.open(pdf_file) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            if not text.strip():
                return {"error": "No text found in PDF"}
            
            # Clean the text
            cleaned_text = self.clean_text_advanced(text)
            
            # Extract structured data
            name = self.extract_name(cleaned_text)
            title = self.extract_title(cleaned_text)
            contact = self.extract_contact_info(cleaned_text)
            skills = self.extract_skills(cleaned_text)
            experience = self.extract_experience(cleaned_text)
            education = self.extract_education(cleaned_text)
            
            return {
                "success": True,
                "data": {
                    "name": name,
                    "title": title,
                    "contact": contact,
                    "skills": skills,
                    "experience": experience,
                    "education": education,
                    "raw_text": cleaned_text[:1000] + "..." if len(cleaned_text) > 1000 else cleaned_text
                }
            }
            
        except Exception as e:
            return {"error": f"Extraction failed: {str(e)}"}

# Initialize extractor
extractor = RobustPDFExtractor()

@app.route('/extract-pdf', methods=['POST'])
def extract_pdf():
    """Extract data from uploaded PDF"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400
        
        # Save file temporarily
        temp_path = f"/tmp/{file.filename}"
        file.save(temp_path)
        
        try:
            # Extract data
            result = extractor.extract_from_pdf(temp_path)
            return jsonify(result)
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Robust PDF Extractor",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Starting Robust PDF Extractor Service...")
    print("Available endpoints:")
    print("- POST /extract-pdf")
    print("- GET /health")
    app.run(host='0.0.0.0', port=8001, debug=True)

