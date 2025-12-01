import { z } from 'zod';

// ============================================
// CV Analysis Schemas
// ============================================

export const cvPayloadSchema = z.object({
    cv_pdf: z.instanceof(File, { message: 'CV PDF file is required' })
        .refine((file) => file.type === 'application/pdf', {
            message: 'File must be a PDF',
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'File size must be less than 10MB',
        }),
    job_description: z.string()
        .min(50, { message: 'Job description must be at least 50 characters' })
        .max(10000, { message: 'Job description must not exceed 10,000 characters' }),
    cv_image: z.instanceof(File)
        .refine((file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type), {
            message: 'Image must be PNG, JPEG, or WebP',
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'Image size must be less than 5MB',
        })
        .optional(),
});

export type CVPayload = z.infer<typeof cvPayloadSchema>;

// ============================================
// Company Rank Schemas
// ============================================

export const companyRankPayloadSchema = z.object({
    jobDescription: z.string()
        .min(50, { message: 'Job description must be at least 50 characters' })
        .max(10000, { message: 'Job description must not exceed 10,000 characters' }),
    files: z.array(z.instanceof(File))
        .min(1, { message: 'At least one CV file is required' })
        .max(50, { message: 'Maximum 50 files allowed' })
        .refine(
            (files) => files.every((file) => file.type === 'application/pdf'),
            { message: 'All files must be PDF format' }
        )
        .refine(
            (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
            { message: 'Each file must be less than 10MB' }
        ),
});

export type CompanyRankPayload = z.infer<typeof companyRankPayloadSchema>;

// ============================================
// CV Builder Schemas
// ============================================

export const cvPersonalDetailSchema = z.object({
    full_name: z.string()
        .min(2, { message: 'Full name must be at least 2 characters' })
        .max(100, { message: 'Full name must not exceed 100 characters' }),
    email: z.string()
        .email({ message: 'Invalid email address' }),
    phone: z.string()
        .min(10, { message: 'Phone number must be at least 10 characters' })
        .max(20, { message: 'Phone number must not exceed 20 characters' })
        .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, {
            message: 'Invalid phone number format',
        }),
    linkedin_url: z.string()
        .url({ message: 'Invalid LinkedIn URL' })
        .optional()
        .or(z.literal('')),
    github_url: z.string()
        .url({ message: 'Invalid GitHub URL' })
        .optional()
        .or(z.literal('')),
    portfolio_url: z.string()
        .url({ message: 'Invalid portfolio URL' })
        .optional()
        .or(z.literal('')),
    summary: z.string()
        .max(500, { message: 'Summary must not exceed 500 characters' })
        .optional()
        .or(z.literal('')),
    location: z.string()
        .max(100, { message: 'Location must not exceed 100 characters' })
        .optional()
        .or(z.literal('')),
});

export type CVPersonalDetail = z.infer<typeof cvPersonalDetailSchema>;

export const cvEducationSchema = z.object({
    institution: z.string()
        .min(2, { message: 'Institution name must be at least 2 characters' })
        .max(200, { message: 'Institution name must not exceed 200 characters' }),
    degree: z.string()
        .min(2, { message: 'Degree must be at least 2 characters' })
        .max(100, { message: 'Degree must not exceed 100 characters' }),
    field_of_study: z.string()
        .min(2, { message: 'Field of study must be at least 2 characters' })
        .max(100, { message: 'Field of study must not exceed 100 characters' }),
    start_date: z.string()
        .regex(/^\d{4}-\d{2}$/, { message: 'Start date must be in YYYY-MM format' }),
    end_date: z.string()
        .regex(/^\d{4}-\d{2}$/, { message: 'End date must be in YYYY-MM format' })
        .optional()
        .or(z.literal('')),
    current: z.boolean(),
    description: z.string()
        .max(500, { message: 'Description must not exceed 500 characters' })
        .optional()
        .or(z.literal('')),
}).refine(
    (data) => {
        if (!data.current && data.end_date) {
            return data.end_date >= data.start_date;
        }
        return true;
    },
    {
        message: 'End date must be after start date',
        path: ['end_date'],
    }
);

export type CVEducation = z.infer<typeof cvEducationSchema>;

export const cvExperienceSchema = z.object({
    company: z.string()
        .min(2, { message: 'Company name must be at least 2 characters' })
        .max(200, { message: 'Company name must not exceed 200 characters' }),
    position: z.string()
        .min(2, { message: 'Position must be at least 2 characters' })
        .max(100, { message: 'Position must not exceed 100 characters' }),
    location: z.string()
        .max(100, { message: 'Location must not exceed 100 characters' })
        .optional()
        .or(z.literal('')),
    start_date: z.string()
        .regex(/^\d{4}-\d{2}$/, { message: 'Start date must be in YYYY-MM format' }),
    end_date: z.string()
        .regex(/^\d{4}-\d{2}$/, { message: 'End date must be in YYYY-MM format' })
        .optional()
        .or(z.literal('')),
    current: z.boolean(),
    description: z.string()
        .min(10, { message: 'Description must be at least 10 characters' })
        .max(1000, { message: 'Description must not exceed 1000 characters' }),
}).refine(
    (data) => {
        if (!data.current && data.end_date) {
            return data.end_date >= data.start_date;
        }
        return true;
    },
    {
        message: 'End date must be after start date',
        path: ['end_date'],
    }
);

export type CVExperience = z.infer<typeof cvExperienceSchema>;

export const cvProjectSchema = z.object({
    name: z.string()
        .min(2, { message: 'Project name must be at least 2 characters' })
        .max(100, { message: 'Project name must not exceed 100 characters' }),
    description: z.string()
        .min(10, { message: 'Description must be at least 10 characters' })
        .max(500, { message: 'Description must not exceed 500 characters' }),
    technologies: z.array(z.string())
        .min(1, { message: 'At least one technology is required' })
        .max(20, { message: 'Maximum 20 technologies allowed' }),
    link: z.string()
        .url({ message: 'Invalid project URL' })
        .optional()
        .or(z.literal('')),
});

export type CVProject = z.infer<typeof cvProjectSchema>;

export const cvSkillSchema = z.object({
    category: z.string()
        .min(2, { message: 'Category must be at least 2 characters' })
        .max(50, { message: 'Category must not exceed 50 characters' }),
    skills: z.array(z.string())
        .min(1, { message: 'At least one skill is required' })
        .max(30, { message: 'Maximum 30 skills per category' }),
});

export type CVSkill = z.infer<typeof cvSkillSchema>;

export const cvFullProfileSchema = z.object({
    personal_details: cvPersonalDetailSchema,
    education: z.array(cvEducationSchema)
        .min(1, { message: 'At least one education entry is required' }),
    experience: z.array(cvExperienceSchema)
        .min(0, { message: 'Experience entries are optional' }),
    projects: z.array(cvProjectSchema)
        .min(0, { message: 'Project entries are optional' }),
    skills: z.array(cvSkillSchema)
        .min(1, { message: 'At least one skill category is required' }),
});

export type CVFullProfile = z.infer<typeof cvFullProfileSchema>;

// ============================================
// CV Build Payload Schema
// ============================================

export const cvBuildPayloadSchema = z.object({
    full_name: z.string()
        .min(2, { message: 'Full name must be at least 2 characters' })
        .max(100, { message: 'Full name must not exceed 100 characters' }),
    email: z.string()
        .email({ message: 'Invalid email address' }),
    phone: z.string()
        .min(10, { message: 'Phone number must be at least 10 characters' })
        .max(20, { message: 'Phone number must not exceed 20 characters' }),
    raw_description: z.string()
        .min(50, { message: 'Description must be at least 50 characters' })
        .max(5000, { message: 'Description must not exceed 5000 characters' }),
    certificates: z.array(z.string())
        .max(20, { message: 'Maximum 20 certificates allowed' }),
    education: z.array(z.any()),
    experience: z.array(z.any()),
});

export type CVBuildPayload = z.infer<typeof cvBuildPayloadSchema>;

// ============================================
// Authentication Schemas
// ============================================

export const loginSchema = z.object({
    email: z.string()
        .email({ message: 'Invalid email address' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.string()
        .email({ message: 'Invalid email address' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type RegisterPayload = z.infer<typeof registerSchema>;

// ============================================
// Form Data Schemas
// ============================================

export const formDataSchema = z.object({
    fullName: z.string()
        .min(2, { message: 'Full name must be at least 2 characters' })
        .max(100, { message: 'Full name must not exceed 100 characters' }),
    email: z.string()
        .email({ message: 'Invalid email address' }),
    phone: z.string()
        .min(10, { message: 'Phone number must be at least 10 characters' })
        .max(20, { message: 'Phone number must not exceed 20 characters' }),
    rawDescription: z.string()
        .min(50, { message: 'Description must be at least 50 characters' })
        .max(5000, { message: 'Description must not exceed 5000 characters' }),
    certificates: z.array(z.string())
        .max(20, { message: 'Maximum 20 certificates allowed' }),
    tempCert: z.string().optional(),
});

export type FormData = z.infer<typeof formDataSchema>;
