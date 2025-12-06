import React from 'react';
import { CVFullProfile } from '@/types/cv-builder';
import { cn } from '@/lib/utils';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';

interface TemplateProps {
    data: CVFullProfile;
    isPremium?: boolean;
}

export const TemplateGlobal: React.FC<TemplateProps> = ({ data, isPremium }) => {
    const { personal_details, experience, education, projects, skills, languages, certifications, interests } = data;

    // Academic/Global style: centered header, very clean serif or neutra sans, high density.
    // LTR/RTL symmetry relies on flex-start/flex-end automatic behavior.

    return (
        <div className={cn("w-full h-full bg-white text-gray-900 p-12 font-sans", !isPremium && "opacity-90")} id="cv-template">
            {/* Header: Centered */}
            <header className="text-center border-b-2 border-gray-900 pb-6 mb-8">
                <h1 className="text-4xl font-serif font-bold tracking-wide uppercase mb-2">{personal_details.full_name}</h1>
                <p className="text-lg text-gray-600 font-medium mb-4">{personal_details.job_title}</p>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
                    {personal_details.email && <span>{personal_details.email}</span>}
                    {personal_details.email && personal_details.phone && <span className="text-gray-300">•</span>}
                    {personal_details.phone && <span>{personal_details.phone}</span>}
                    {personal_details.phone && personal_details.location && <span className="text-gray-300">•</span>}
                    {personal_details.location && <span>{personal_details.location}</span>}
                    {personal_details.location && personal_details.linkedin_url && <span className="text-gray-300">•</span>}
                    {personal_details.linkedin_url && (
                        <a href={personal_details.linkedin_url} className="hover:underline text-blue-800">LinkedIn</a>
                    )}
                </div>
            </header>

            <div className="space-y-8">
                {/* Summary */}
                {personal_details.summary && (
                    <section>
                        <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Professional Summary</h2>
                        <p className="text-justify leading-relaxed text-gray-800">{personal_details.summary}</p>
                    </section>
                )}

                {/* Main Two Columns */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left/Main Column (Experience) */}
                    <div className="col-span-8 space-y-8">
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Experience</h2>
                                <div className="space-y-6">
                                    {experience.map((exp, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-baseline font-bold text-gray-900 text-lg">
                                                <h3>{exp.position}</h3>
                                                <span className="text-sm font-normal text-gray-600">
                                                    {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                                                </span>
                                            </div>
                                            <div className="text-gray-700 italic font-medium mb-2">{exp.company}, {exp.location}</div>
                                            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {projects.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Key Projects</h2>
                                <div className="space-y-4">
                                    {projects.map((proj, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                            </div>
                                            <p className="text-sm text-gray-800 mt-1">{proj.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">Tools: {proj.technologies.join(', ')}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right/Side Column (Education, Skills, Certs) */}
                    <div className="col-span-4 space-y-8">
                        {education.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Education</h2>
                                <div className="space-y-4">
                                    {education.map((edu, idx) => (
                                        <div key={idx}>
                                            <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                            <div className="text-gray-800">{edu.degree}</div>
                                            <div className="text-gray-600 text-sm">{edu.field_of_study}</div>
                                            <div className="text-gray-500 text-xs mt-1">{edu.start_date} - {edu.end_date}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {skills.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Skills</h2>
                                <div className="space-y-3">
                                    {skills.map((group, idx) => (
                                        <div key={idx}>
                                            <h3 className="font-bold text-sm text-gray-700 mb-1">{group.category}</h3>
                                            <div className="text-sm text-gray-600 leading-snug">
                                                {group.skills.join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {languages && languages.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Languages</h2>
                                <div className="space-y-2">
                                    {languages.map((lang, idx) => (
                                        <div key={idx} className="flex justify-between text-sm items-center border-b border-dotted border-gray-200 pb-1 last:border-0">
                                            <span className="font-medium text-gray-800">{lang.language}</span>
                                            <span className="text-gray-500 italic">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {certifications && certifications.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Certifications</h2>
                                <ul className="space-y-3">
                                    {certifications.map((cert, idx) => (
                                        <li key={idx} className="text-sm">
                                            <div className="font-bold text-gray-800">{cert.name}</div>
                                            <div className="text-gray-600">{cert.issuer}, {cert.date}</div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {interests && interests.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold uppercase border-b border-gray-300 mb-4 pb-1">Interests</h2>
                                <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-700">
                                    {interests.map((interest, idx) => (
                                        <span key={idx}>
                                            {interest.name}{idx < interests.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
