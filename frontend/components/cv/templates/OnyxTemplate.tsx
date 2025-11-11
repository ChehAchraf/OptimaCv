import React from 'react';
import { CVData } from '@/types/cv';

interface OnyxTemplateProps {
  data: CVData;
}

export const OnyxTemplate: React.FC<OnyxTemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <div className="p-8 bg-white text-gray-800 font-sans">
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-5xl font-bold tracking-wider">{personalInfo.fullName}</h1>
        <p className="text-lg mt-2">
          {personalInfo.email} | {personalInfo.phoneNumber} | {personalInfo.linkedin} | {personalInfo.github}
          {personalInfo.portfolio && ` | ${personalInfo.portfolio}`}
        </p>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xl font-bold">{edu.school}</h3>
              <p className="italic">{edu.degree}</p>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{exp.company}</h3>
              <p className="italic font-semibold">{exp.role}</p>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
              <p className="mt-1">{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Projects</h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xl font-bold">{proj.name}</h3>
              {proj.url && <a href={proj.url} className="text-blue-600 hover:underline">{proj.url}</a>}
              <p className="mt-1">{proj.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Skills</h2>
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Hard Skills</h3>
              <ul className="list-disc list-inside">
                {skills.hard?.map((skill, index) => <li key={index}>{skill}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Soft Skills</h3>
              <ul className="list-disc list-inside">
                {skills.soft?.map((skill, index) => <li key={index}>{skill}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
