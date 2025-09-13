from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import PyPDF2
import re
import json
import os
from datetime import datetime
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer
from autocorrect import Speller
import textstat
from collections import Counter
import string

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)

app = Flask(__name__)
CORS(app)

class AdvancedPDFExtractor:
    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        self.linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        self.github_pattern = r'github\.com/[\w-]+'
        
        # Initialize text processing tools
        self.speller = Speller()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Common skills database
        self.skills_database = {
            'programming': ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin', 'typescript', 'rust', 'scala', 'r', 'matlab'],
            'web_development': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net'],
            'databases': ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'cassandra', 'elasticsearch'],
            'cloud': ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
            'data_science': ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'jupyter', 'r', 'matlab', 'spark', 'hadoop'],
            'mobile': ['ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic', 'cordova'],
            'design': ['photoshop', 'illustrator', 'figma', 'sketch', 'adobe xd', 'invision', 'canva'],
            'project_management': ['agile', 'scrum', 'kanban', 'jira', 'trello', 'asana', 'confluence', 'slack'],
            'business': ['excel', 'powerpoint', 'word', 'salesforce', 'hubspot', 'zendesk', 'tableau', 'power bi']
        }
        
    def clean_and_correct_text(self, text):
        """Clean and correct text using advanced NLP techniques"""
        if not text:
            return ""
        
        # Basic cleaning
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = re.sub(r'[^\w\s.,!?@-]', '', text)  # Remove special chars except basic punctuation
        text = text.strip()
        
        # Split into sentences for better processing
        sentences = sent_tokenize(text)
        corrected_sentences = []
        
        for sentence in sentences:
            if len(sentence.strip()) < 3:
                continue
                
            # Clean sentence
            sentence = sentence.strip()
            
            # Fix common OCR errors
            sentence = self.fix_ocr_errors(sentence)
            
            # Basic grammar fixes
            sentence = self.fix_basic_grammar(sentence)
            
            # Spell check (be careful not to over-correct names/technical terms)
            sentence = self.smart_spell_check(sentence)
            
            corrected_sentences.append(sentence)
        
        return ' '.join(corrected_sentences)
    
    def fix_ocr_errors(self, text):
        """Fix common OCR errors"""
        # Common OCR mistakes
        ocr_fixes = {
            r'\b0\b': 'O',  # Zero to O in names
            r'\b1\b': 'I',  # One to I in names
            r'\b5\b': 'S',  # Five to S in names
            r'\b8\b': 'B',  # Eight to B in names
            r'\b6\b': 'G',  # Six to G in names
            r'\b3\b': 'E',  # Three to E in names
        }
        
        for pattern, replacement in ocr_fixes.items():
            text = re.sub(pattern, replacement, text)
        
        return text
    
    def fix_basic_grammar(self, text):
        """Fix basic grammar issues"""
        # Fix common grammar mistakes
        grammar_fixes = [
            (r'\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)\b', r'\1 \2 \3'),  # Proper name spacing
            (r'\b([a-z]+)([A-Z][a-z]+)\b', r'\1 \2'),  # Add space before capital letters
            (r'\s+', ' '),  # Normalize spaces
            (r'\b([A-Z][a-z]+)\s*,\s*([A-Z][a-z]+)\b', r'\1, \2'),  # Fix comma spacing
        ]
        
        for pattern, replacement in grammar_fixes:
            text = re.sub(pattern, replacement, text)
        
        return text
    
    def smart_spell_check(self, text):
        """Smart spell checking that preserves names and technical terms"""
        words = word_tokenize(text)
        corrected_words = []
        
        for word in words:
            # Skip if it's a name (starts with capital and not at sentence start)
            if word[0].isupper() and len(word) > 2:
                corrected_words.append(word)
                continue
            
            # Skip if it's a technical term or skill
            if self.is_technical_term(word.lower()):
                corrected_words.append(word)
                continue
            
            # Skip if it's a number, email, or URL
            if re.match(r'^\d+$', word) or '@' in word or '.' in word:
                corrected_words.append(word)
                continue
            
            # Apply spell check to other words
            corrected_word = self.speller(word)
            corrected_words.append(corrected_word)
        
        return ' '.join(corrected_words)
    
    def is_technical_term(self, word):
        """Check if a word is a technical term that shouldn't be spell-checked"""
        word_lower = word.lower()
        
        # Check against skills database
        for category, skills in self.skills_database.items():
            if word_lower in skills:
                return True
        
        # Check for common technical patterns
        technical_patterns = [
            r'^[a-z]+\.js$',  # JavaScript frameworks
            r'^[a-z]+\.net$',  # .NET technologies
            r'^[a-z]+\.io$',   # .io domains
            r'^[a-z]+-js$',    # JavaScript libraries
            r'^[a-z]+-css$',   # CSS frameworks
            r'^[a-z]+-ui$',    # UI frameworks
        ]
        
        for pattern in technical_patterns:
            if re.match(pattern, word_lower):
                return True
        
        return False
    
    def extract_text_from_pdf(self, pdf_file):
        """Extract text from PDF using multiple methods for better accuracy"""
        text = ""
        
        # Method 1: pdfplumber (better for complex layouts)
        try:
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}")
        
        # Method 2: PyPDF2 (fallback)
        if not text.strip():
            try:
                pdf_file.seek(0)  # Reset file pointer
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            except Exception as e:
                print(f"PyPDF2 failed: {e}")
        
        return text.strip()
    
    def extract_contact_info(self, text):
        """Extract contact information from text"""
        contact_info = {}
        
        # Extract email
        email_match = re.search(self.email_pattern, text)
        if email_match:
            contact_info['email'] = email_match.group(0)
        
        # Extract phone
        phone_match = re.search(self.phone_pattern, text)
        if phone_match:
            contact_info['phone'] = phone_match.group(0)
        
        # Extract LinkedIn
        linkedin_match = re.search(self.linkedin_pattern, text, re.IGNORECASE)
        if linkedin_match:
            contact_info['linkedin'] = "https://" + linkedin_match.group(0)
        
        # Extract GitHub
        github_match = re.search(self.github_pattern, text, re.IGNORECASE)
        if github_match:
            contact_info['github'] = "https://" + github_match.group(0)
        
        return contact_info
    
    def extract_name(self, text):
        """Extract name from text with improved accuracy"""
        lines = text.split('\n')[:20]  # Check first 20 lines
        
        for line in lines:
            line = line.strip()
            if len(line) > 2 and len(line) < 50:
                # Skip common headers and contact info
                if any(header in line.lower() for header in ['resume', 'cv', 'curriculum', 'vitae', 'phone', 'email', 'address', '@', 'linkedin', 'github', 'www', 'http']):
                    continue
                
                # Skip lines with numbers (dates, phone numbers)
                if re.search(r'\d{4}|\d{3}-\d{3}-\d{4}|\+?\d{10,}', line):
                    continue
                
                # Check if it looks like a name
                if re.match(r'^[A-Za-z\s\.-]+$', line) and len(line.split()) >= 2 and len(line.split()) <= 4:
                    # Additional check: should not be all caps or all lowercase
                    if not (line.isupper() or line.islower()):
                        return line.title()
        
        return None
    
    def extract_title(self, text):
        """Extract job title with improved accuracy"""
        lines = text.split('\n')
        
        # Look for title patterns in the first few lines after name
        for i, line in enumerate(lines[:30]):
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
                r'(project|product|business)\s+\w+',
                r'(data\s+scientist|data\s+analyst)',
                r'(full\s+stack|front\s+end|back\s+end)',
                r'(devops|sre|site\s+reliability)',
                r'(qa|quality\s+assurance|testing)',
                r'(ui/ux|user\s+experience|user\s+interface)'
            ]
            
            for pattern in title_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    return match.group(0).title()
        
        return None
    
    def extract_skills(self, text):
        """Extract skills with improved accuracy"""
        found_skills = set()
        text_lower = text.lower()
        
        # Extract skills from database
        for category, skills in self.skills_database.items():
            for skill in skills:
                if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                    found_skills.add(skill.title())
        
        # Extract additional skills using NLP
        words = word_tokenize(text_lower)
        for word in words:
            word = word.strip(string.punctuation)
            if len(word) > 2 and word not in self.stop_words:
                # Check if it looks like a technical skill
                if self.is_technical_term(word) or self.is_likely_skill(word):
                    found_skills.add(word.title())
        
        return list(found_skills)[:15]  # Limit to 15 skills
    
    def is_likely_skill(self, word):
        """Check if a word is likely a technical skill"""
        # Common skill indicators
        skill_indicators = [
            r'^[a-z]+script$',  # JavaScript, TypeScript
            r'^[a-z]+\.js$',    # Node.js, React.js
            r'^[a-z]+\.net$',   # .NET
            r'^[a-z]+-ui$',     # UI frameworks
            r'^[a-z]+-css$',    # CSS frameworks
            r'^[a-z]+-js$',     # JavaScript libraries
        ]
        
        for pattern in skill_indicators:
            if re.match(pattern, word):
                return True
        
        return False
    
    def extract_experience(self, text):
        """Extract work experience with improved parsing"""
        experience = []
        
        # Look for experience section
        exp_section = self.extract_section(text, ['experience', 'work history', 'employment', 'professional experience', 'career'])
        
        if exp_section:
            # Clean up the section
            exp_section = self.clean_and_correct_text(exp_section)
            
            # Split by common separators
            entries = re.split(r'\n\s*[•\-\*]\s*|\n(?=\d{4}|\w+\s+\d{4})|\n(?=[A-Z][a-z]+\s+[A-Z])', exp_section)
            
            for entry in entries:
                entry = entry.strip()
                if len(entry) > 30:
                    exp_item = self.parse_experience_entry(entry)
                    if exp_item and exp_item.get('title'):
                        experience.append(exp_item)
        
        # If no experience section found, try to extract from full text
        if not experience:
            experience = self.extract_experience_from_full_text(text)
        
        return experience[:5]  # Limit to 5 most recent
    
    def extract_section(self, text, section_names):
        """Extract a specific section from text"""
        for section_name in section_names:
            pattern = rf'{section_name}\s*:?\s*\n(.*?)(?=\n\s*(?:{"|".join(["education", "skills", "projects", "awards", "certifications"])})\s*:?\s*\n|\n\s*[A-Z][A-Z\s]+\s*:|\Z)'
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
        return None
    
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
    
    def parse_experience_entry(self, entry):
        """Parse a single experience entry with improved accuracy"""
        # Clean up the entry
        entry = self.clean_and_correct_text(entry)
        
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
        description = self.clean_and_correct_text(description)
        if len(description) > 200:
            description = description[:200] + '...'
        
        return {
            'title': title or 'Position',
            'company': company or 'Company',
            'duration': duration or '',
            'description': description
        }
    
    def extract_education(self, text):
        """Extract education with improved parsing"""
        education = []
        
        # Look for education section
        edu_section = self.extract_section(text, ['education', 'academic', 'qualifications', 'degrees'])
        
        if edu_section:
            # Clean up the section
            edu_section = self.clean_and_correct_text(edu_section)
            
            # Split by common separators
            entries = re.split(r'\n\s*[•\-\*]\s*|\n(?=\d{4}|\w+\s+\d{4})|\n(?=[A-Z][a-z]+\s+[A-Z])', edu_section)
            
            for entry in entries:
                entry = entry.strip()
                if len(entry) > 10:
                    edu_item = self.parse_education_entry(entry)
                    if edu_item and edu_item.get('degree'):
                        education.append(edu_item)
        
        return education[:3]  # Limit to 3 most recent
    
    def parse_education_entry(self, entry):
        """Parse a single education entry with improved accuracy"""
        # Clean up the entry
        entry = self.clean_and_correct_text(entry)
        
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
        
        # Look for school/university
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
    
    def extract_all(self, pdf_file):
        """Extract all information from PDF with advanced processing"""
        try:
            # Extract text
            raw_text = self.extract_text_from_pdf(pdf_file)
            
            if not raw_text:
                return {
                    "success": False,
                    "error": "No text could be extracted from the PDF"
                }
            
            # Clean and correct text
            cleaned_text = self.clean_and_correct_text(raw_text)
            
            # Extract information
            contact_info = self.extract_contact_info(cleaned_text)
            name = self.extract_name(cleaned_text)
            title = self.extract_title(cleaned_text)
            skills = self.extract_skills(cleaned_text)
            experience = self.extract_experience(cleaned_text)
            education = self.extract_education(cleaned_text)
            
            return {
                "success": True,
                "name": name or "Unknown",
                "contact": contact_info,
                "title": title or "Professional",
                "skills": skills,
                "experience": experience,
                "education": education,
                "raw_text": raw_text[:1000] + "..." if len(raw_text) > 1000 else raw_text
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Initialize extractor
extractor = AdvancedPDFExtractor()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"service": "Advanced PDF Extractor", "status": "healthy"})

@app.route('/extract-pdf', methods=['POST'])
def extract_pdf_endpoint():
    if 'pdf' not in request.files:
        return jsonify({"success": False, "error": "No PDF file provided"}), 400
    
    pdf_file = request.files['pdf']
    
    if pdf_file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    
    if pdf_file:
        try:
            result = extractor.extract_all(pdf_file)
            return jsonify(result)
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
    
    return jsonify({"success": False, "error": "Something went wrong"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PYTHON_PORT', 8001))
    app.run(host='0.0.0.0', port=port, debug=True)

