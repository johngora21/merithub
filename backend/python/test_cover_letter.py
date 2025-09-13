#!/usr/bin/env python3
"""
Test script for AI Cover Letter Generator
"""

import requests
import json

def test_cover_letter_generation():
    """Test the cover letter generation service"""
    
    # Test data
    test_data = {
        "extracted_data": {
            "name": "John Doe",
            "skills": ["Python", "JavaScript", "React", "Node.js"],
            "experience": [
                {
                    "title": "Software Engineer",
                    "company": "Tech Corp",
                    "duration": "2020-2023"
                }
            ],
            "education": [
                {
                    "degree": "Bachelor of Science in Computer Science",
                    "school": "University of Technology",
                    "year": "2020"
                }
            ]
        },
        "job_title": "Senior Software Engineer",
        "company_name": "Google",
        "job_description": "We are looking for a senior software engineer with experience in Python and React."
    }
    
    try:
        # Test health endpoint
        print("Testing health endpoint...")
        health_response = requests.get("http://localhost:8002/health")
        print(f"Health check: {health_response.status_code}")
        print(f"Response: {health_response.json()}")
        print()
        
        # Test cover letter generation
        print("Testing cover letter generation...")
        response = requests.post(
            "http://localhost:8002/generate-cover-letter",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Success!")
            print(f"Generated cover letter:\n")
            print("=" * 50)
            print(result['cover_letter'])
            print("=" * 50)
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the service. Make sure it's running on port 8002.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_cover_letter_generation()
