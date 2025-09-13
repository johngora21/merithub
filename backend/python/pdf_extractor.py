from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import PyPDF2
import re
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

class PDFExtractor:
    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        self.linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        self.github_pattern = r'github\.com/[\w-]+'
        
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF using multiple methods for better accuracy"""
        text = ""
        
        # Method 1: pdfplumber (better for complex layouts)
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}")
        
        # Method 2: PyPDF2 (fallback)
        if not text.strip():
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n"
            except Exception as e:
                print(f"PyPDF2 failed: {e}")
        
        return text.strip()
    
    def extract_contact_info(self, text):
        """Extract contact information from text"""
        contact_info = {}
        
        # Extract email
        emails = re.findall(self.email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Extract phone
        phones = re.findall(self.phone_pattern, text)
        if phones:
            phone = ''.join(phones[0])
            contact_info['phone'] = phone
        
        # Extract LinkedIn
        linkedin = re.search(self.linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            contact_info['linkedin'] = linkedin.group()
        
        # Extract GitHub
        github = re.search(self.github_pattern, text, re.IGNORECASE)
        if github:
            contact_info['github'] = github.group()
        
        return contact_info
    
    def extract_name(self, text):
        """Extract name from text (usually at the top)"""
        lines = text.split('\n')[:15]  # Check first 15 lines
        
        for line in lines:
            line = line.strip()
            if len(line) > 2 and len(line) < 50:  # Reasonable name length
                # Skip common headers and contact info
                if any(header in line.lower() for header in ['resume', 'cv', 'curriculum', 'vitae', 'phone', 'email', 'address', '@', 'linkedin', 'github', 'www', 'http']):
                    continue
                # Skip lines with numbers (dates, phone numbers)
                if re.search(r'\d{4}|\d{3}-\d{3}-\d{4}|\+?\d{10,}', line):
                    continue
                # Check if it looks like a name (has letters and possibly spaces, hyphens, periods)
                if re.match(r'^[A-Za-z\s\.-]+$', line) and len(line.split()) >= 2 and len(line.split()) <= 4:
                    # Additional check: should not be all caps or all lowercase
                    if not (line.isupper() or line.islower()):
                        return line.title()
        
        return None
    
    def extract_title(self, text):
        """Extract job title or profession"""
        lines = text.split('\n')
        
        # Look for title patterns in the first few lines after name
        for i, line in enumerate(lines[:25]):
            line = line.strip()
            if not line:
                continue
                
            # Skip if it looks like contact info
            if any(contact in line.lower() for contact in ['@', 'phone', 'email', 'linkedin', 'github', 'www']):
                continue
                
            # Skip if it's just a name
            if re.match(r'^[A-Za-z\s\.-]+$', line) and len(line.split()) <= 4:
                continue
                
            # Look for job title patterns
            title_patterns = [
                r'(software\s+engineer|developer|programmer)',
                r'(senior|lead|principal)\s+\w+',
                r'(manager|director|coordinator)',
                r'(analyst|consultant|specialist)',
                r'(architect|designer|administrator)',
                r'(executive|officer|representative)',
                r'(intern|trainee|associate)',
                r'(project|product|business)\s+\w+'
            ]
            
            for pattern in title_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    return match.group(0).title()
        
        return None
    
    def extract_skills(self, text):
        """Extract skills from text"""
        # Common technical skills
        skill_keywords = [
            'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
            'html', 'css', 'sql', 'mongodb', 'mysql', 'postgresql', 'redis',
            'aws', 'azure', 'docker', 'kubernetes', 'git', 'github', 'gitlab',
            'agile', 'scrum', 'kanban', 'jira', 'confluence', 'figma', 'sketch',
            'photoshop', 'illustrator', 'indesign', 'wordpress', 'drupal',
            'machine learning', 'ai', 'data science', 'analytics', 'tableau',
            'power bi', 'excel', 'vba', 'c++', 'c#', '.net', 'php', 'ruby',
            'swift', 'kotlin', 'flutter', 'react native', 'xamarin'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))  # Remove duplicates
    
    def extract_experience(self, text):
        """Extract work experience from text"""
        experience = []
        
        # Look for experience section
        exp_section = self.extract_section(text, ['experience', 'work history', 'employment', 'professional experience', 'career'])
        
        if exp_section:
            # Clean up the section
            exp_section = re.sub(r'\s+', ' ', exp_section)  # Normalize whitespace
            
            # Split by bullet points, dashes, or new lines with dates
            entries = re.split(r'\n\s*[•\-\*]\s*|\n(?=\d{4}|\w+\s+\d{4})|\n(?=[A-Z][a-z]+\s+[A-Z])', exp_section)
            
            for entry in entries:
                entry = entry.strip()
                if len(entry) > 30:  # Reasonable entry length
                    exp_item = self.parse_experience_entry(entry)
                    if exp_item and exp_item.get('title'):
                        experience.append(exp_item)
        
        # If no experience section found, try to extract from full text
        if not experience:
            experience = self.extract_experience_from_full_text(text)
        
        return experience[:5]  # Limit to 5 most recent
    
    def extract_experience_from_full_text(self, text):
        """Extract experience from full text when no clear section exists"""
        experience = []
        lines = text.split('\n')
        
        # Look for patterns that indicate work experience
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
                
            # Look for company names followed by job titles
            if re.search(r'[A-Z][a-z]+\s+[A-Z][a-z]+', line) and any(word in line.lower() for word in ['engineer', 'developer', 'manager', 'analyst', 'consultant', 'intern']):
                # Try to get the next few lines for context
                context_lines = []
                for j in range(i, min(i + 5, len(lines))):
                    if lines[j].strip():
                        context_lines.append(lines[j].strip())
                
                context = ' '.join(context_lines)
                exp_item = self.parse_experience_entry(context)
                if exp_item and exp_item.get('title'):
                    experience.append(exp_item)
        
        return experience[:3]  # Limit to 3 most recent
    
    def extract_education(self, text):
        """Extract education from text"""
        education = []
        
        # Look for education section
        edu_section = self.extract_section(text, ['education', 'academic', 'qualifications', 'degrees'])
        
        if edu_section:
            entries = re.split(r'\n\s*\n', edu_section)
            
            for entry in entries:
                if len(entry.strip()) > 10:
                    edu_item = self.parse_education_entry(entry)
                    if edu_item:
                        education.append(edu_item)
        
        return education[:3]  # Limit to 3 most recent
    
    def extract_section(self, text, section_names):
        """Extract a specific section from text"""
        text_lower = text.lower()
        
        for section_name in section_names:
            pattern = rf'{section_name}[:\s]*\n(.*?)(?=\n\w+[:\s]*\n|\n[A-Z][A-Z\s]+:|\Z)'
            match = re.search(pattern, text_lower, re.DOTALL | re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def parse_experience_entry(self, entry):
        """Parse a single experience entry"""
        # Clean up the entry
        entry = re.sub(r'\s+', ' ', entry.strip())
        
        # Look for job title patterns
        title_patterns = [
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+-\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        ]
        
        title = None
        company = None
        
        for pattern in title_patterns:
            match = re.search(pattern, entry)
            if match:
                potential_title = match.group(1)
                potential_company = match.group(2)
                
                # Check if it looks like a job title
                if any(word in potential_title.lower() for word in ['engineer', 'developer', 'manager', 'analyst', 'consultant', 'intern', 'specialist', 'coordinator']):
                    title = potential_title
                    company = potential_company
                    break
        
        # If no pattern matched, try to extract from the beginning
        if not title:
            words = entry.split()
            if len(words) >= 2:
                # Look for common job title words
                for i, word in enumerate(words):
                    if word.lower() in ['engineer', 'developer', 'manager', 'analyst', 'consultant', 'intern']:
                        title = ' '.join(words[:i+1])
                        if i+1 < len(words):
                            company = ' '.join(words[i+1:i+3])  # Next 1-2 words as company
                        break
        
        # Extract duration/date
        duration = None
        date_patterns = [
            r'\d{4}\s*[-–]\s*\d{4}',
            r'\d{4}\s*[-–]\s*present',
            r'\d{4}\s*[-–]\s*now',
            r'jan\s+\d{4}|feb\s+\d{4}|mar\s+\d{4}|apr\s+\d{4}|may\s+\d{4}|jun\s+\d{4}',
            r'jul\s+\d{4}|aug\s+\d{4}|sep\s+\d{4}|oct\s+\d{4}|nov\s+\d{4}|dec\s+\d{4}'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, entry, re.IGNORECASE)
            if match:
                duration = match.group(0)
                break
        
        # Extract description (remove title, company, and dates)
        description = entry
        if title:
            description = description.replace(title, '', 1)
        if company:
            description = description.replace(company, '', 1)
        if duration:
            description = description.replace(duration, '', 1)
        
        # Clean up description
        description = re.sub(r'\s+', ' ', description.strip())
        if len(description) > 200:
            description = description[:200] + '...'
        
        return {
            'title': title or 'Position',
            'company': company or 'Company',
            'duration': duration or '',
            'description': description
        }
    
    def parse_education_entry(self, entry):
        """Parse a single education entry"""
        # Clean up the entry
        entry = re.sub(r'\s+', ' ', entry.strip())
        
        # Look for degree patterns
        degree_patterns = [
            r'(bachelor\s+of\s+\w+|b\.?a\.?|b\.?s\.?|b\.?e\.?|b\.?tech)',
            r'(master\s+of\s+\w+|m\.?a\.?|m\.?s\.?|m\.?e\.?|m\.?tech|mba)',
            r'(phd|ph\.?d\.?|doctorate|doctor)',
            r'(diploma|certificate|certification)',
            r'(associate|a\.?a\.?|a\.?s\.?)'
        ]
        
        degree = None
        for pattern in degree_patterns:
            match = re.search(pattern, entry, re.IGNORECASE)
            if match:
                degree = match.group(0).title()
                break
        
        if not degree:
            degree = 'Degree'
        
        # Look for school/university (usually after degree)
        school = None
        school_patterns = [
            r'(university\s+of\s+\w+|university)',
            r'(college\s+of\s+\w+|college)',
            r'(institute\s+of\s+\w+|institute)',
            r'([A-Z][a-z]+\s+university)',
            r'([A-Z][a-z]+\s+college)',
            r'([A-Z][a-z]+\s+institute)'
        ]
        
        for pattern in school_patterns:
            match = re.search(pattern, entry, re.IGNORECASE)
            if match:
                school = match.group(0).title()
                break
        
        if not school:
            # Try to extract any capitalized words that might be school name
            words = entry.split()
            for i, word in enumerate(words):
                if word.istitle() and len(word) > 3:
                    school = word
                    if i + 1 < len(words) and words[i + 1].istitle():
                        school += ' ' + words[i + 1]
                    break
        
        if not school:
            school = 'Institution'
        
        # Look for year
        year = None
        year_match = re.search(r'\d{4}', entry)
        if year_match:
            year = year_match.group(0)
        
        return {
            'degree': degree,
            'school': school,
            'year': year or ''
        }
    
    def extract_all(self, pdf_path):
        """Extract all information from PDF"""
        try:
            # Extract text
            text = self.extract_text_from_pdf(pdf_path)
            
            if not text:
                return {'error': 'Could not extract text from PDF'}
            
            # Extract information
            contact_info = self.extract_contact_info(text)
            name = self.extract_name(text)
            title = self.extract_title(text)
            skills = self.extract_skills(text)
            experience = self.extract_experience(text)
            education = self.extract_education(text)
            
            return {
                'success': True,
                'name': name,
                'title': title,
                'contact': contact_info,
                'skills': skills,
                'experience': experience,
                'education': education,
                'raw_text': text[:1000] + '...' if len(text) > 1000 else text  # First 1000 chars for debugging
            }
            
        except Exception as e:
            return {'error': f'Error processing PDF: {str(e)}'}

# Initialize extractor
extractor = PDFExtractor()

@app.route('/extract-pdf', methods=['POST'])
def extract_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        file = request.files['pdf']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400
        
        # Save uploaded file temporarily
        temp_path = f'/tmp/{file.filename}'
        file.save(temp_path)
        
        try:
            # Extract data
            result = extractor.extract_all(temp_path)
            
            # Clean up temp file
            os.remove(temp_path)
            
            return jsonify(result)
            
        except Exception as e:
            # Clean up temp file on error
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e
            
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'PDF Extractor'})

if __name__ == '__main__':
    print("Starting PDF Extractor Service...")
    print("Available endpoints:")
    print("- POST /extract-pdf")
    print("- GET /health")
    app.run(host='0.0.0.0', port=8001, debug=True)
