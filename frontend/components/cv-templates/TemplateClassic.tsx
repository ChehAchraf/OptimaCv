import React from 'react';
import { CVFullProfile } from '@/types/cv-builder';

interface TemplateProps {
    data: CVFullProfile;
}

export const TemplateClassic: React.FC<TemplateProps> = ({ data }) => {
    const { personal_details, experience, education, projects, skills } = data;

    return (
        <div className="w-full h-full bg-white text-gray-900 p-10 font-serif" id="cv-template">
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8 flex flex-col items-center">
                {personal_details.picture_url && (
                    <img
                        src={personal_details.picture_url}
                        alt={personal_details.full_name}
                        className="w-28 h-28 rounded-full object-cover border-2 border-gray-800 mb-4 shadow-sm"
                    />
                )}
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-1">{personal_details.full_name}</h1>
                {personal_details.job_title && (
                    <div className="text-xl text-gray-700 italic mb-2">{personal_details.job_title}</div>
                )}
                <div className="text-sm flex justify-center gap-4 flex-wrap text-gray-700">
                    {personal_details.email && <span>{personal_details.email}</span>}
                    {personal_details.phone && <span>• {personal_details.phone}</span>}
                    {personal_details.location && <span>• {personal_details.location}</span>}
                    {personal_details.linkedin_url && <span>• LinkedIn</span>}
                </div>
            </div>

            {personal_details.summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-justify">{personal_details.summary}</p>
                </section>
            )}

            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Experience</h2>
                    <div className="space-y-5">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between font-bold">
                                    <span>{exp.company}, {exp.location}</span>
                                    <span>{exp.start_date} – {exp.current ? 'Present' : exp.end_date}</span>
                                </div>
                                <div className="italic mb-2">{exp.position}</div>
                                <p className="text-sm whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between font-bold">
                                    <span>{edu.institution}</span>
                                    <span>{edu.start_date} – {edu.current ? 'Present' : edu.end_date}</span>
                                </div>
                                <div>{edu.degree} in {edu.field_of_study}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="font-bold">{proj.name}</div>
                                <p className="text-sm">{proj.description}</p>
                                <div className="text-xs italic mt-1">Tech: {proj.technologies.join(', ')}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Skills</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {skills.map((skillGroup, idx) => (
                            <div key={idx}>
                                <span className="font-bold text-sm">{skillGroup.category}: </span>
                                <span className="text-sm">{skillGroup.skills.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
