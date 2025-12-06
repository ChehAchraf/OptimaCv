import React from 'react';
import { CVFullProfile } from '@/types/cv-builder';
import { cn } from '@/lib/utils';
import { HiMail, HiPhone, HiLocationMarker, HiGlobeAlt, HiCode } from 'react-icons/hi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface TemplateProps {
    data: CVFullProfile;
    isPremium?: boolean;
}

export const TemplateTech: React.FC<TemplateProps> = ({ data, isPremium }) => {
    const { personal_details, experience, education, projects, skills, languages, certifications, interests } = data;

    // Helper for skill level percentage
    const getSkillLevel = (level: string) => {
        // Since we don't have level per skill in current data structure (it's array of strings),
        // we might not simple render bars. 
        // IF the data structure supports it later, we use it. 
        // For now, if skills are just strings, we display them tags.
        // HACK: Use random widths for demo visualization if strictly required, but better to just list them nicely.
        // Requirement said: "rating bars".
        // Checking schema: CVSkill is { category: string, skills: string[] }.
        // No rating per skill. I will stick to tags for now to avoid fake data.
        return 100;
    };

    return (
        <div className={cn("w-full h-full flex bg-white text-gray-800 font-sans", !isPremium && "opacity-90")} id="cv-template">
            {/* Left Sidebar (Dark) */}
            <aside className="w-[35%] bg-slate-900 text-white min-h-full p-8 flex flex-col gap-8">
                <div className="text-center">
                    {personal_details.picture_url && (
                        <div className="mb-6 relative inline-block">
                            <img
                                src={personal_details.picture_url}
                                alt={personal_details.full_name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mx-auto"
                            />
                        </div>
                    )}
                    <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-6">Contact</h2>
                    <div className="space-y-4 text-sm text-gray-300 text-left">
                        {personal_details.email && (
                            <div className="flex items-center gap-3">
                                <HiMail className="text-teal-500 shrink-0" />
                                <span className="break-all">{personal_details.email}</span>
                            </div>
                        )}
                        {personal_details.phone && (
                            <div className="flex items-center gap-3">
                                <HiPhone className="text-teal-500 shrink-0" />
                                <span>{personal_details.phone}</span>
                            </div>
                        )}
                        {personal_details.location && (
                            <div className="flex items-center gap-3">
                                <HiLocationMarker className="text-teal-500 shrink-0" />
                                <span>{personal_details.location}</span>
                            </div>
                        )}
                        {personal_details.linkedin_url && (
                            <div className="flex items-center gap-3">
                                <FaLinkedin className="text-teal-500 shrink-0" />
                                <a href={personal_details.linkedin_url} className="hover:text-teal-400 truncate">LinkedIn</a>
                            </div>
                        )}
                        {personal_details.github_url && (
                            <div className="flex items-center gap-3">
                                <FaGithub className="text-teal-500 shrink-0" />
                                <a href={personal_details.github_url} className="hover:text-teal-400 truncate">GitHub</a>
                            </div>
                        )}
                        {personal_details.portfolio_url && (
                            <div className="flex items-center gap-3">
                                <HiGlobeAlt className="text-teal-500 shrink-0" />
                                <a href={personal_details.portfolio_url} className="hover:text-teal-400 truncate">Portfolio</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Education in Sidebar */}
                {education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4 border-b border-gray-700 pb-2">Education</h2>
                        <div className="space-y-5">
                            {education.map((edu, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-white text-sm">{edu.institution}</h3>
                                    <div className="text-teal-400 text-xs mt-1">{edu.degree}</div>
                                    <div className="text-gray-400 text-xs italic">{edu.start_date} - {edu.end_date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4 border-b border-gray-700 pb-2">Languages</h2>
                        <ul className="space-y-3">
                            {languages.map((lang, idx) => (
                                <li key={idx} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{lang.language}</span>
                                        <span className="text-gray-400 text-xs">{lang.proficiency}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-teal-500"
                                            style={{ width: lang.proficiency.toLowerCase().includes('native') ? '100%' : lang.proficiency.toLowerCase().includes('fluent') ? '90%' : '70%' }}
                                        ></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-slate-800 uppercase tracking-tight mb-2">{personal_details.full_name}</h1>
                    <p className="text-2xl text-teal-600 font-medium">{personal_details.job_title}</p>
                </header>

                {personal_details.summary && (
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 uppercase border-l-4 border-teal-500 pl-3 mb-3">About Me</h2>
                        <p className="text-gray-600 leading-relaxed">{personal_details.summary}</p>
                    </section>
                )}

                {/* Skills as Tags for Tech Look */}
                {skills.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 uppercase border-l-4 border-teal-500 pl-3 mb-4">Tech Stack</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {skills.map((group, idx) => (
                                <div key={idx}>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{group.category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {group.skills.map((skill, sIdx) => (
                                            <span key={sIdx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-sm font-medium border border-slate-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 uppercase border-l-4 border-teal-500 pl-3 mb-6">Experience</h2>
                        <div className="space-y-8 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                            {experience.map((exp, idx) => (
                                <div key={idx} className="pl-8 relative">
                                    <div className="absolute left-0 top-1.5 w-5 h-5 bg-teal-500 rounded-full border-4 border-white shadow-sm z-10"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xl font-bold text-slate-800">{exp.position}</h3>
                                        <span className="text-sm text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded">
                                            {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                                        </span>
                                    </div>
                                    <div className="text-slate-500 font-medium mb-2">{exp.company}</div>
                                    <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 uppercase border-l-4 border-teal-500 pl-3 mb-6">Featured Projects</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {projects.map((proj, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                                        <HiCode className="text-teal-500" />
                                        {proj.name}
                                    </h3>
                                    <p className="text-gray-600 text-xs mb-3 h-10 overflow-hidden line-clamp-2">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                                            <span key={tIdx} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};
