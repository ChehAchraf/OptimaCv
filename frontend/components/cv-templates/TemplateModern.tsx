import React from 'react';
import { CVFullProfile } from '@/types/cv-builder';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

interface TemplateProps {
    data: CVFullProfile;
}

export const TemplateModern: React.FC<TemplateProps> = ({ data }) => {
    const { personal_details, experience, education, projects, skills } = data;

    return (
        <div className="w-full h-full bg-white text-gray-800 p-8 font-sans" id="cv-template">
            <header className="border-b-2 border-blue-600 pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wider">{personal_details.full_name}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    {personal_details.email && (
                        <div className="flex items-center gap-1">
                            <HiMail className="text-blue-600" />
                            <span>{personal_details.email}</span>
                        </div>
                    )}
                    {personal_details.phone && (
                        <div className="flex items-center gap-1">
                            <HiPhone className="text-blue-600" />
                            <span>{personal_details.phone}</span>
                        </div>
                    )}
                    {personal_details.location && (
                        <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-blue-600" />
                            <span>{personal_details.location}</span>
                        </div>
                    )}
                    {personal_details.linkedin_url && (
                        <div className="flex items-center gap-1">
                            <FaLinkedin className="text-blue-600" />
                            <a href={personal_details.linkedin_url} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                        </div>
                    )}
                    {personal_details.github_url && (
                        <div className="flex items-center gap-1">
                            <FaGithub className="text-blue-600" />
                            <a href={personal_details.github_url} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                        </div>
                    )}
                    {personal_details.portfolio_url && (
                        <div className="flex items-center gap-1">
                            <FaGlobe className="text-blue-600" />
                            <a href={personal_details.portfolio_url} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
                        </div>
                    )}
                </div>
                {personal_details.summary && (
                    <p className="mt-4 text-gray-700 leading-relaxed">{personal_details.summary}</p>
                )}
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 space-y-8">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Skills</h2>
                            <div className="space-y-4">
                                {skills.map((skillGroup, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-semibold text-gray-800 text-sm">{skillGroup.category}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {skillGroup.skills.map((skill, sIdx) => (
                                                <span key={sIdx} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-bold text-gray-800">{edu.institution}</h3>
                                        <p className="text-sm text-gray-600">{edu.degree} in {edu.field_of_study}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column (Experience & Projects) */}
                <div className="col-span-2 space-y-8">
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                                            <span className="text-sm text-gray-500 font-medium">
                                                {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                                            </span>
                                        </div>
                                        <div className="text-blue-600 font-medium text-sm mb-2">{exp.company} | {exp.location}</div>
                                        <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View Project</a>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {proj.technologies.map((tech, tIdx) => (
                                                <span key={tIdx} className="text-xs text-gray-500 italic">#{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
