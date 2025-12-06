import React from 'react';
import { CVFullProfile } from '@/types/cv-builder';
import { cn } from '@/lib/utils';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';

interface TemplateProps {
    data: CVFullProfile;
    isPremium?: boolean;
}

export const TemplateExecutive: React.FC<TemplateProps> = ({ data, isPremium }) => {
    const { personal_details, experience, education, projects, skills, languages, certifications, interests } = data;

    return (
        <div className={cn("w-full h-full bg-white text-gray-900 p-10 font-serif", !isPremium && "opacity-90")} id="cv-template">
            {/* Header */}
            <header className="border-b-2 border-gray-800 pb-8 mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2 uppercase">{personal_details.full_name}</h1>
                <p className="text-xl text-gray-600 mb-4 font-sans">{personal_details.job_title}</p>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 font-sans">
                    {personal_details.email && (
                        <div className="flex items-center gap-1">
                            <HiMail className="text-gray-500" />
                            <span>{personal_details.email}</span>
                        </div>
                    )}
                    {personal_details.phone && (
                        <div className="flex items-center gap-1">
                            <HiPhone className="text-gray-500" />
                            <span>{personal_details.phone}</span>
                        </div>
                    )}
                    {personal_details.location && (
                        <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-gray-500" />
                            <span>{personal_details.location}</span>
                        </div>
                    )}
                    {personal_details.linkedin_url && (
                        <div className="flex items-center gap-1">
                            <FaLinkedin className="text-gray-500" />
                            <a href={personal_details.linkedin_url} className="hover:underline">LinkedIn</a>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-3 gap-10">
                {/* Main Content (Left, 66%) */}
                <div className="col-span-2 space-y-8">
                    {personal_details.summary && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-3">Professional Summary</h2>
                            <p className="text-justify leading-relaxed text-gray-800 font-sans text-sm">{personal_details.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">Professional Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2 border-gray-200">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                                            <span className="text-sm font-sans text-gray-500 font-medium">
                                                {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                                            </span>
                                        </div>
                                        <div className="text-gray-700 italic mb-2 font-sans">{exp.company} | {exp.location}</div>
                                        <p className="text-sm leading-relaxed text-gray-800 font-sans whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">Key Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                        </div>
                                        <p className="text-sm text-gray-800 mt-1 font-sans">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar (Right, 33%) */}
                <div className="col-span-1 space-y-8 bg-gray-50 p-6 rounded-sm h-fit">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Core Competencies</h2>
                            <div className="space-y-4 font-sans text-sm">
                                {skills.map((group, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-semibold text-gray-700 mb-1">{group.category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {group.skills.map(skill => (
                                                <span key={skill} className="bg-white border border-gray-200 px-2 py-1 text-xs text-gray-600 rounded-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Education</h2>
                            <div className="space-y-3 font-sans">
                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <div className="font-bold text-sm text-gray-900">{edu.institution}</div>
                                        <div className="text-xs text-gray-700">{edu.degree}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{edu.field_of_study}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{edu.start_date} - {edu.end_date}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications && certifications.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Certifications</h2>
                            <div className="space-y-3 font-sans text-sm">
                                {certifications.map((cert, idx) => (
                                    <div key={idx}>
                                        <div className="font-medium text-gray-900">{cert.name}</div>
                                        <div className="text-xs text-gray-600">{cert.issuer}</div>
                                        <div className="text-xs text-gray-400">{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {languages && languages.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Languages</h2>
                            <ul className="space-y-2 font-sans text-sm">
                                {languages.map((lang, idx) => (
                                    <li key={idx} className="flex justify-between">
                                        <span className="text-gray-800">{lang.language}</span>
                                        <span className="text-gray-500 text-xs">{lang.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
            {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10"></div>
                </div>
            )}
        </div>
    );
};
