import pytest
import json
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_generate_from_info_endpoint():
    """Test the /generate-from-info/ endpoint with basic CV data"""
    
    # Sample CV data matching the frontend structure
    test_data = {
        "cv_data": {
            "personalInfo": {
                "fullName": "John Doe",
                "email": "john.doe@example.com",
                "phoneNumber": "+1234567890",
                "linkedin": "https://linkedin.com/in/johndoe",
                "github": "https://github.com/johndoe",
                "title": "Software Engineer",
                "summary": "Experienced software engineer with 5 years of experience."
            },
            "education": [
                {
                    "school": "University of Technology",
                    "degree": "Bachelor of Computer Science",
                    "startDate": "2015",
                    "endDate": "2019"
                }
            ],
            "experience": [
                {
                    "company": "Tech Corp",
                    "role": "Senior Developer",
                    "startDate": "2020",
                    "endDate": "2024",
                    "description": "Developed web applications using React and Node.js"
                }
            ],
            "projects": [
                {
                    "name": "E-commerce Platform",
                    "description": "Built a full-stack e-commerce solution",
                    "url": "https://github.com/johndoe/ecommerce"
                }
            ],
            "skills": {
                "hard": ["JavaScript", "Python", "React", "Node.js"],
                "soft": ["Team Leadership", "Problem Solving"],
                "languages": [
                    {"name": "English", "level": "Native"},
                    {"name": "French", "level": "Intermediate"}
                ],
                "certifications": ["AWS Certified Developer"]
            }
        },
        "job_description": "We are looking for a full-stack developer with React and Node.js experience.",
        "template": "modern-black"
    }
    
    response = client.post("/api/v1/analysis/generate-from-info/", json=test_data)
    
    # Check that the request succeeds
    assert response.status_code == 200
    
    # Parse the response
    result = response.json()
    
    # Verify the response structure
    assert "organized_data" in result
    assert "ai_summary" in result
    assert "strengths" in result
    assert "weaknesses" in result
    
    # Check that organized_data has the expected structure
    organized = result["organized_data"]
    assert "personalInfo" in organized
    assert "education" in organized
    assert "experience" in organized
    assert "projects" in organized
    assert "skills" in organized
    
    # Verify personal info is preserved/enhanced
    personal_info = organized["personalInfo"]
    assert personal_info["fullName"] == "John Doe" or len(personal_info["fullName"]) > 0
    assert personal_info["email"] == "john.doe@example.com" or "@" in personal_info["email"]
    
    print("✅ Test passed: /generate-from-info/ endpoint works correctly")


def test_generate_from_info_minimal_data():
    """Test the endpoint with minimal required data"""
    
    minimal_data = {
        "cv_data": {
            "personalInfo": {
                "fullName": "Jane Smith",
                "email": "jane@example.com"
            },
            "education": [],
            "experience": [],
            "projects": [],
            "skills": {
                "hard": [],
                "soft": []
            }
        }
    }
    
    response = client.post("/api/v1/analysis/generate-from-info/", json=minimal_data)
    
    # Should still succeed with minimal data
    assert response.status_code == 200
    
    result = response.json()
    assert "organized_data" in result
    
    print("✅ Test passed: Minimal data handling works correctly")


def test_generate_from_info_invalid_data():
    """Test the endpoint with invalid data"""
    
    invalid_data = {
        "cv_data": {
            "personalInfo": {
                "fullName": "Test User"
                # Missing required email field
            }
        }
    }
    
    response = client.post("/api/v1/analysis/generate-from-info/", json=invalid_data)
    
    # Should return a validation error
    assert response.status_code == 422  # Validation error
    
    print("✅ Test passed: Invalid data properly rejected")


if __name__ == "__main__":
    print("Running backend API tests...")
    
    try:
        test_generate_from_info_endpoint()
        test_generate_from_info_minimal_data()
        test_generate_from_info_invalid_data()
        print("\n🎉 All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        raise