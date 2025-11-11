import React from 'react';
import { CVData } from '@/types/cv';

interface SapphireTemplateProps {
  data: CVData;
}

export const SapphireTemplate: React.FC<SapphireTemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <div className="p-8 bg-blue-50 text-gray-800 font-serif">
      <header className="text-left mb-8">
        <h1 className="text-4xl font-bold text-blue-800">{personalInfo.fullName}</h1>
        <div className="flex justify-start space-x-4 mt-2 text-blue-600">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phoneNumber}</span>
          <span>{personalInfo.linkedin}</span>
          <span>{personalInfo.github}</span>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold">{edu.school}</h3>
                <p className="italic text-sm">{edu.degree}</p>
                <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4">Skills</h2>
            <h3 className="font-semibold mb-2">Hard Skills</h3>
            <ul className="list-disc list-inside text-sm mb-4">
              {skills.hard.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
            <h3 className="font-semibold mb-2">Soft Skills</h3>
            <ul className="list-disc list-inside text-sm">
              {skills.soft.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
          </section>
        </div>

        <div className="col-span-2">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-bold">{exp.company} - <span className="font-semibold italic">{exp.role}</span></h3>
                <p className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</p>
                <p className="mt-1 text-sm">{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-lg font-bold">{proj.name}</h3>
                {proj.url && <a href={proj.url} className="text-blue-600 hover:underline text-sm">{proj.url}</a>}
                <p className="mt-1 text-sm">{proj.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};
