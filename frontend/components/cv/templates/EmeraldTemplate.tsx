import React from 'react';
import { CVData } from '@/types/cv';

interface EmeraldTemplateProps {
  data: CVData;
}

export const EmeraldTemplate: React.FC<EmeraldTemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <div className="p-8 bg-green-50 text-gray-800 font-mono">
      <header className="relative text-center mb-8">
        <div className="p-4 bg-green-800 text-white">
          <h1 className="text-4xl font-bold">{personalInfo.fullName}</h1>
        </div>
        <div className="flex justify-center space-x-4 mt-4 text-green-700">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phoneNumber}</span>
          <span>{personalInfo.linkedin}</span>
          <span>{personalInfo.github}</span>
        </div>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-green-800 uppercase tracking-widest border-b-2 border-green-200 pb-2 mb-4">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xl font-bold">{edu.school}</h3>
              <p className="italic">{edu.degree}</p>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-green-800 uppercase tracking-widest border-b-2 border-green-200 pb-2 mb-4">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{exp.company}</h3>
              <p className="italic font-semibold">{exp.role}</p>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
              <p className="mt-1 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-green-800 uppercase tracking-widest border-b-2 border-green-200 pb-2 mb-4">Projects</h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xl font-bold">{proj.name}</h3>
              {proj.url && <a href={proj.url} className="text-green-600 hover:underline">{proj.url}</a>}
              <p className="mt-1">{proj.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-green-800 uppercase tracking-widest border-b-2 border-green-200 pb-2 mb-4">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Hard Skills</h3>
              <ul className="list-none">
                {skills.hard.map((skill, index) => <li key={index} className="bg-green-100 p-1 mb-1 rounded">{skill}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Soft Skills</h3>
              <ul className="list-none">
                {skills.soft.map((skill, index) => <li key={index} className="bg-green-100 p-1 mb-1 rounded">{skill}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
