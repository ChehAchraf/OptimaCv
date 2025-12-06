'use client';

import { useState, useCallback } from 'react';
import { CVFullProfile, CVExperience, CVEducation, CVProject, CVSkill } from '@/types/cv-builder';
import {
    cvPersonalDetailSchema,
    cvEducationSchema,
    cvExperienceSchema,
    cvProjectSchema,
    cvSkillSchema,
    cvLanguageSchema,
    cvCertificationSchema,
    cvInterestSchema,
    validateData
} from '@/lib/validations';

const initialCVData: CVFullProfile = {
    personal_details: {
        full_name: '',
        email: '',
        phone: '',
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
    interests: [],

};

export const useCVBuilderState = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [cvData, setCvData] = useState<CVFullProfile>(initialCVData);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Steps configuration
    const steps = [
        "Personal Info",    // 1
        "Technologies",     // 2 (Skills)
        "Projects",         // 3
        "Experience",       // 4
        "Education",        // Keeping as essential
        "Languages",        // 5
        "Certifications",   // 6
        "Interests",        // 7
        "Preview & Download"
    ];

    const updatePersonalDetails = useCallback((key: string, value: any) => {
        setCvData(prev => ({
            ...prev,
            personal_details: { ...prev.personal_details, [key]: value }
        }));
        if (validationError) setValidationError(null);
    }, [validationError]);

    const updateSection = useCallback(<K extends keyof CVFullProfile>(section: K, value: CVFullProfile[K]) => {
        setCvData(prev => ({ ...prev, [section]: value }));
        if (validationError) setValidationError(null);
    }, [validationError]);

    const validateCurrentStep = useCallback((): boolean => {
        setValidationError(null);

        switch (currentStep) {
            case 1: // Personal Info
                const personalResult = validateData(cvPersonalDetailSchema, cvData.personal_details);
                if (!personalResult.success) {
                    const firstError = Object.values(personalResult.errors)[0]?.[0];
                    setValidationError(firstError || 'Please fill in all required fields correctly');
                    return false;
                }
                break;

            case 2: // Skills (Technologies)
                if (cvData.skills.length === 0) {
                    setValidationError('Please add at least one skill category');
                    return false;
                }
                for (let i = 0; i < cvData.skills.length; i++) {
                    const skillResult = validateData(cvSkillSchema, cvData.skills[i]);
                    if (!skillResult.success) {
                        const firstError = Object.values(skillResult.errors)[0]?.[0];
                        setValidationError(`Skill category ${i + 1}: ${firstError}`);
                        return false;
                    }
                }
                break;

            case 3: // Projects
                if (cvData.projects.length > 0) {
                    for (let i = 0; i < cvData.projects.length; i++) {
                        const projResult = validateData(cvProjectSchema, cvData.projects[i]);
                        if (!projResult.success) {
                            const firstError = Object.values(projResult.errors)[0]?.[0];
                            setValidationError(`Project ${i + 1}: ${firstError}`);
                            return false;
                        }
                    }
                }
                break;

            case 4: // Experience
                if (cvData.experience.length > 0) {
                    for (let i = 0; i < cvData.experience.length; i++) {
                        const expResult = validateData(cvExperienceSchema, cvData.experience[i]);
                        if (!expResult.success) {
                            const firstError = Object.values(expResult.errors)[0]?.[0];
                            setValidationError(`Experience ${i + 1}: ${firstError}`);
                            return false;
                        }
                    }
                }
                break;

            case 5: // Education
                if (cvData.education.length > 0) {
                    for (let i = 0; i < cvData.education.length; i++) {
                        const eduResult = validateData(cvEducationSchema, cvData.education[i]);
                        if (!eduResult.success) {
                            const firstError = Object.values(eduResult.errors)[0]?.[0];
                            setValidationError(`Education ${i + 1}: ${firstError}`);
                            return false;
                        }
                    }
                }
                // Removed mandatory check for education to align with potentially not being explicitly requested, but kept validation if present.
                break;

            case 6: // Languages
                if (cvData.languages.length === 0) {
                    setValidationError('Please add at least one language');
                    return false;
                }
                for (let i = 0; i < cvData.languages.length; i++) {
                    const langResult = validateData(cvLanguageSchema, cvData.languages[i]);
                    if (!langResult.success) {
                        const firstError = Object.values(langResult.errors)[0]?.[0];
                        setValidationError(`Language ${i + 1}: ${firstError}`);
                        return false;
                    }
                }
                break;

            case 7: // Certifications (Optional)
                if (cvData.certifications.length > 0) {
                    for (let i = 0; i < cvData.certifications.length; i++) {
                        const certResult = validateData(cvCertificationSchema, cvData.certifications[i]);
                        if (!certResult.success) {
                            const firstError = Object.values(certResult.errors)[0]?.[0];
                            setValidationError(`Certification ${i + 1}: ${firstError}`);
                            return false;
                        }
                    }
                }
                break;

            case 8: // Interests (Optional)
                if (cvData.interests.length > 0) {
                    for (let i = 0; i < cvData.interests.length; i++) {
                        const interestResult = validateData(cvInterestSchema, cvData.interests[i]);
                        if (!interestResult.success) {
                            const firstError = Object.values(interestResult.errors)[0]?.[0];
                            setValidationError(`Interest ${i + 1}: ${firstError}`);
                            return false;
                        }
                    }
                }
                break;
        }

        return true;
    }, [currentStep, cvData]);

    const nextStep = useCallback(() => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    }, [validateCurrentStep, steps.length]);

    const prevStep = useCallback(() => {
        setValidationError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    const goToStep = useCallback((step: number) => {
        if (step < currentStep || validateCurrentStep()) {
            setCurrentStep(step);
        }
    }, [currentStep, validateCurrentStep]);

    return {
        currentStep,
        steps,
        cvData,
        validationError,
        updatePersonalDetails,
        updateSection,
        nextStep,
        prevStep,
        goToStep
    };
};
