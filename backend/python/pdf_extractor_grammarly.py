#!/usr/bin/env python3
"""
Advanced PDF Extractor with Grammarly Integration
Extracts structured data from CV/Resume PDFs with proper grammar correction
"""

import re
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import pdfplumber
import spacy
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

class PDFExtractorWithGrammarly:
    def __init__(self):
        self.grammarly_api_key = os.getenv('GRAMMARLY_API_KEY')
        self.grammarly_base_url = "https://api.grammarly.com/v1"
        
        # Common skills database
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
            'Research', 'Data Analysis', 'Statistics', 'Mathematics'
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
            r'(nurse|doctor|physician|medical)',
            r'(consultant|advisor|analyst)',
            r'(manager|director|executive|ceo|cto|cfo)',
            r'(researcher|scientist|engineer)',
            r'(technician|specialist|coordinator)'
        ]

    def clean_text_advanced(self, text):
        """Advanced text cleaning with better structure preservation"""
        if not text:
            return ""
        
        # Remove excessive whitespace and normalize
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common PDF artifacts
        artifacts = [
            r'P\.O\.\s*BOX\s*\d+',
            r'DAR\s+ES\s+SALAAM',
            r'ABOUT\s+ME',
            r'WORK\s+EXPERIENCE',
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
            r'HTTP[^\s]+'
        ]
        
        for pattern in artifacts:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        # Fix common OCR errors
        text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # Add space between camelCase
        text = re.sub(r'([A-Z])([A-Z][a-z])', r'\1 \2', text)  # Add space between ALLCAPS and TitleCase
        
        # Remove multiple punctuation
        text = re.sub(r'[.,!?]{2,}', '.', text)
        text = re.sub(r'[,]{2,}', ',', text)
        
        # Clean up sentence endings
        text = re.sub(r'\s*[,.]\s*', '. ', text)
        text = re.sub(r'\.\s*\.', '.', text)
        
        return text.strip()

    def correct_grammar_with_grammarly(self, text):
        """Correct grammar using Grammarly API"""
        if not self.grammarly_api_key or not text.strip():
            return text
        
        try:
            headers = {
                'Authorization': f'Bearer {self.grammarly_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'text': text,
                'language': 'en-US',
                'style': 'general'
            }
            
            response = requests.post(
                f"{self.grammarly_base_url}/check",
                headers=headers,
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('corrected_text', text)
            else:
                print(f"Grammarly API error: {response.status_code}")
                return text
                
        except Exception as e:
            print(f"Grammarly API error: {e}")
            return text

    def extract_name(self, text):
        """Extract name with improved accuracy"""
        lines = text.split('\n')[:15]
        
        for line in lines:
            line = line.strip()
            if len(line) < 3 or len(line) > 50:
                continue
                
            # Skip common headers and contact info
            skip_patterns = [
                'resume', 'cv', 'curriculum', 'vitae', 'phone', 'email', 'address',
                '@', 'linkedin', 'github', 'www', 'http', 'experience', 'education',
                'skills', 'about', 'contact', 'profile', 'objective', 'summary'
            ]
            
            if any(pattern in line.lower() for pattern in skip_patterns):
                continue
            
            # Skip lines with numbers (dates, phone numbers)
            if re.search(r'\d{4}|\d{3}-\d{3}-\d{4}|\+\d{10,}', line):
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
        
        for i, line in enumerate(lines[:25]):
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
        
        # Split text into sections
        sections = re.split(r'\n\s*\n', text)
        
        for section in sections:
            section = section.strip()
            if not section or len(section) < 20:
                continue
                
            # Look for experience patterns
            exp_patterns = [
                r'([A-Za-z\s&]+)\s*[-–]\s*([A-Za-z\s&]+)\s*[-–]\s*([A-Za-z\s&]+)\s*\(([^)]+)\)',
                r'([A-Za-z\s&]+)\s*at\s*([A-Za-z\s&]+)\s*\(([^)]+)\)',
                r'([A-Za-z\s&]+)\s*[-–]\s*([A-Za-z\s&]+)\s*\(([^)]+)\)'
            ]
            
            for pattern in exp_patterns:
                match = re.search(pattern, section, re.IGNORECASE)
                if match:
                    groups = match.groups()
                    if len(groups) >= 3:
                        exp_entry = {
                            'title': groups[0].strip(),
                            'company': groups[1].strip() if len(groups) > 1 else '',
                            'duration': groups[-1].strip(),
                            'description': self.clean_text_advanced(section)
                        }
                        experience.append(exp_entry)
                        break
        
        return experience[:5]  # Return top 5 experiences

    def extract_education(self, text):
        """Extract education information"""
        education = []
        
        # Education patterns
        edu_patterns = [
            r'([A-Za-z\s]+)\s*[-–]\s*([A-Za-z\s]+)\s*[-–]\s*([A-Za-z\s]+)\s*\(([^)]+)\)',
            r'([A-Za-z\s]+)\s*at\s*([A-Za-z\s]+)\s*\(([^)]+)\)',
            r'([A-Za-z\s]+)\s*[-–]\s*([A-Za-z\s]+)\s*\(([^)]+)\)'
        ]
        
        for pattern in edu_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                groups = match.groups()
                if len(groups) >= 3:
                    edu_entry = {
                        'degree': groups[0].strip(),
                        'school': groups[1].strip() if len(groups) > 1 else '',
                        'year': groups[-1].strip()
                    }
                    education.append(edu_entry)
        
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
            
            # Correct grammar for key fields
            if name:
                name = self.correct_grammar_with_grammarly(name)
            if title:
                title = self.correct_grammar_with_grammarly(title)
            
            # Correct grammar for experience descriptions
            for exp in experience:
                if exp.get('description'):
                    exp['description'] = self.correct_grammar_with_grammarly(exp['description'])
            
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
extractor = PDFExtractorWithGrammarly()

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
        "service": "PDF Extractor with Grammarly",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Starting PDF Extractor with Grammarly Service...")
    print("Available endpoints:")
    print("- POST /extract-pdf")
    print("- GET /health")
    app.run(host='0.0.0.0', port=8001, debug=True)

