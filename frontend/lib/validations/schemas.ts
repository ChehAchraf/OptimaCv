import { z } from 'zod';


export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim();

export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        'Password must contain at least one special character'
    );

export const phoneSchema = z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s()-]{10,}$/, 'Please enter a valid phone number');

export const urlSchema = z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''));

export const nameSchema = z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim();



export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

export const registerSchema = z
    .object({
        fullName: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and conditions',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const resetPasswordSchema = z.object({
    email: emailSchema,
});

export const newPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// ============================================
// Profile Schemas
// ============================================

export const profileUpdateSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional(),
    bio: z
        .string()
        .max(500, 'Bio must be less than 500 characters')
        .optional(),
    website: urlSchema.optional(),
    location: z
        .string()
        .max(100, 'Location must be less than 100 characters')
        .optional(),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must be different from current password',
        path: ['newPassword'],
    });


export const personalInfoSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    location: z.string().min(1, 'Location is required').trim(),
    linkedin: urlSchema.optional(),
    portfolio: urlSchema.optional(),
    summary: z
        .string()
        .min(50, 'Summary should be at least 50 characters')
        .max(500, 'Summary must be less than 500 characters')
        .trim(),
});

export const experienceSchema = z.object({
    company: z.string().min(1, 'Company name is required').trim(),
    position: z.string().min(1, 'Position is required').trim(),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z
        .string()
        .min(20, 'Description should be at least 20 characters')
        .max(1000, 'Description must be less than 1000 characters')
        .trim(),
});

export const educationSchema = z.object({
    institution: z.string().min(1, 'Institution name is required').trim(),
    degree: z.string().min(1, 'Degree is required').trim(),
    field: z.string().min(1, 'Field of study is required').trim(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    gpa: z
        .string()
        .regex(/^[0-4]\.\d{1,2}$/, 'GPA must be in format X.XX (0.00-4.00)')
        .optional(),
});

export const skillSchema = z.object({
    name: z.string().min(1, 'Skill name is required').trim(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    category: z.enum(['technical', 'soft', 'language', 'tool']).optional(),
});

export const certificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required').trim(),
    issuer: z.string().min(1, 'Issuer is required').trim(),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
    credentialUrl: urlSchema.optional(),
});

export const fileUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'File size must be less than 10MB',
        })
        .refine(
            (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
            {
                message: 'Only PDF, JPEG, and PNG files are allowed',
            }
        ),
});

export const cvUploadSchema = z.object({
    cv_pdf: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'CV file must be less than 10MB',
        })
        .refine((file) => file.type === 'application/pdf', {
            message: 'CV must be a PDF file',
        }),
    job_description: z
        .string()
        .min(50, 'Job description should be at least 50 characters')
        .max(5000, 'Job description must be less than 5000 characters')
        .trim(),
});

export const cvPayloadSchema = z.object({
    cv_pdf: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'CV file must be less than 10MB',
        })
        .refine((file) => file.type === 'application/pdf', {
            message: 'CV must be a PDF file',
        }),
    job_description: z
        .string()
        .optional()
        .or(z.literal('')),
    cv_image: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'Image file must be less than 10MB',
        })
        .refine(
            (file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
            {
                message: 'Image must be PNG, JPEG, or WebP format',
            }
        )
        .optional(),
});

export const cvPersonalDetailSchema = z.object({
    full_name: nameSchema,
    job_title: z.string().optional(),
    email: emailSchema,
    phone: phoneSchema,
    location: z.string().optional(),
    linkedin_url: urlSchema.optional(),
    github_url: urlSchema.optional(),
    portfolio_url: urlSchema.optional(),
    summary: z.string().optional(),
    picture_url: z.string().optional(),
});

// CV Builder specific schemas
export const cvExperienceSchema = z.object({
    company: z.string().min(1, 'Company name is required').trim(),
    position: z.string().min(1, 'Position is required').trim(),
    location: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    current: z.boolean(),
    description: z
        .string()
        .min(20, 'Description should be at least 20 characters')
        .max(1000, 'Description must be less than 1000 characters')
        .trim(),
});

export const cvEducationSchema = z.object({
    institution: z.string().min(1, 'Institution name is required').trim(),
    degree: z.string().min(1, 'Degree is required').trim(),
    field_of_study: z.string().min(1, 'Field of study is required').trim(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    current: z.boolean(),
    description: z.string().optional(),
});

export const cvProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').trim(),
    description: z
        .string()
        .min(20, 'Description should be at least 20 characters')
        .max(500, 'Description must be less than 500 characters')
        .trim(),
    technologies: z.array(z.string()).min(1, 'At least one technology is required'),
    link: urlSchema.optional(),
});

export const cvSkillSchema = z.object({
    category: z.string().min(1, 'Category is required').trim(),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

export const cvLanguageSchema = z.object({
    language: z.string().min(1, 'Language is required').trim(),
    proficiency: z.string().min(1, 'Proficiency is required').trim(),
});

export const cvCertificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required').trim(),
    issuer: z.string().min(1, 'Issuer is required').trim(),
    date: z.string().min(1, 'Date is required'),
    link: urlSchema.optional(),
});

export const cvInterestSchema = z.object({
    name: z.string().min(1, 'Interest is required').trim(),
    keywords: z.array(z.string()).optional(),
});

export const companyRankPayloadSchema = z.object({
    files: z
        .array(z.instanceof(File))
        .min(1, 'At least one CV file is required')
        .max(50, 'Maximum 50 CV files allowed')
        .refine(
            (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
            {
                message: 'Each CV file must be less than 10MB',
            }
        )
        .refine(
            (files) => files.every((file) => file.type === 'application/pdf'),
            {
                message: 'All CV files must be PDF format',
            }
        ),
    jobDescription: z
        .string()
        .min(50, 'Job description should be at least 50 characters')
        .max(5000, 'Job description must be less than 5000 characters')
        .trim(),
});

export const paymentMethodSchema = z.object({
    cardNumber: z
        .string()
        .regex(/^\d{16}$/, 'Card number must be 16 digits')
        .transform((val) => val.replace(/\s/g, '')),
    cardHolder: nameSchema,
    expiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    billingAddress: z.string().min(1, 'Billing address is required').trim(),
    zipCode: z.string().min(1, 'ZIP code is required').trim(),
});

export const contactFormSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(200, 'Subject must be less than 200 characters')
        .trim(),
    message: z
        .string()
        .min(10, 'Message should be at least 10 characters')
        .max(1000, 'Message must be less than 1000 characters')
        .trim(),
});

export const searchQuerySchema = z.object({
    query: z.string().min(1, 'Search query is required').max(200).trim(),
    filters: z
        .object({
            category: z.string().optional(),
            dateRange: z
                .object({
                    from: z.string().optional(),
                    to: z.string().optional(),
                })
                .optional(),
            sortBy: z.enum(['relevance', 'date', 'name']).optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        })
        .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type CVUploadInput = z.infer<typeof cvUploadSchema>;
export type CVPayloadInput = z.infer<typeof cvPayloadSchema>;
export type CVPersonalDetailInput = z.infer<typeof cvPersonalDetailSchema>;
export type CVExperienceInput = z.infer<typeof cvExperienceSchema>;
export type CVEducationInput = z.infer<typeof cvEducationSchema>;
export type CVProjectInput = z.infer<typeof cvProjectSchema>;
export type CVSkillInput = z.infer<typeof cvSkillSchema>;
export type CVLanguageInput = z.infer<typeof cvLanguageSchema>;
export type CVCertificationInput = z.infer<typeof cvCertificationSchema>;
export type CVInterestInput = z.infer<typeof cvInterestSchema>;
export type CompanyRankPayloadInput = z.infer<typeof companyRankPayloadSchema>;
export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
