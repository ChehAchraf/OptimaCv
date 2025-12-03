import React from 'react';
import { CVFullProfile } from '@/types/cv-builder';

interface TemplateProps {
    data: CVFullProfile;
}

export const TemplateMinimal: React.FC<TemplateProps> = ({ data }) => {
    const { personal_details, experience, education, projects, skills } = data;

    return (
        <div className="w-full h-full bg-white text-gray-800 p-12 font-mono text-sm" id="cv-template">
            <header className="mb-12">
                <h1 className="text-2xl font-bold mb-2">{personal_details.full_name}</h1>
                <div className="text-gray-500 space-y-1">
                    <p>{personal_details.email}</p>
                    <p>{personal_details.phone}</p>
                    <p>{personal_details.location}</p>
                    {personal_details.linkedin_url && <p>{personal_details.linkedin_url}</p>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4 space-y-10">
                    {skills.length > 0 && (
                        <section>
                            <h3 className="font-bold text-gray-400 uppercase mb-4 tracking-widest text-xs">Skills</h3>
                            <div className="space-y-4">
                                {skills.map((group, idx) => (
                                    <div key={idx}>
                                        <div className="font-bold mb-1">{group.category}</div>
                                        <div className="text-gray-600">{group.skills.join(', ')}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h3 className="font-bold text-gray-400 uppercase mb-4 tracking-widest text-xs">Education</h3>
                            <div className="space-y-4">
                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <div className="font-bold">{edu.institution}</div>
                                        <div className="text-gray-600">{edu.degree}</div>
                                        <div className="text-gray-400 text-xs mt-1">{edu.start_date} - {edu.current ? 'Now' : edu.end_date}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-8 space-y-10">
                    {personal_details.summary && (
                        <section>
                            <h3 className="font-bold text-gray-400 uppercase mb-4 tracking-widest text-xs">About</h3>
                            <p className="leading-relaxed text-gray-700">{personal_details.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <h3 className="font-bold text-gray-400 uppercase mb-4 tracking-widest text-xs">Experience</h3>
                            <div className="space-y-8">
                                {experience.map((exp, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="font-bold text-lg">{exp.position}</h4>
                                            <span className="text-xs text-gray-400">{exp.start_date} - {exp.current ? 'Now' : exp.end_date}</span>
                                        </div>
                                        <div className="text-gray-500 mb-3">{exp.company}</div>
                                        <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <h3 className="font-bold text-gray-400 uppercase mb-4 tracking-widest text-xs">Projects</h3>
                            <div className="space-y-6">
                                {projects.map((proj, idx) => (
                                    <div key={idx}>
                                        <div className="font-bold mb-1">{proj.name}</div>
                                        <p className="text-gray-700 mb-2">{proj.description}</p>
                                        <div className="text-xs text-gray-400">{proj.technologies.join(' · ')}</div>
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
