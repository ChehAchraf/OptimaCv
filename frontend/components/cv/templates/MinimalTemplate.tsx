import React from 'react';
import { CVData } from '@/types/cv';

interface MinimalTemplateProps {
  data: CVData;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, skills, sectionOrder } = data;

  const contactLinks = [
    { url: personalInfo.email ? `mailto:${personalInfo.email}` : '', label: personalInfo.email },
    { url: personalInfo.phoneNumber ? `tel:${personalInfo.phoneNumber}` : '', label: personalInfo.phoneNumber },
    { url: personalInfo.linkedin || '', label: 'LinkedIn' },
    { url: personalInfo.github || '', label: 'GitHub' },
  ].filter(link => link.url && link.label);


  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-gray-800 print:p-6 minimal-template">
      {/* Header */}
      <header className="text-center border-b border-gray-300 pb-6 mb-8">
        {/* Profile Photo */}
        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-gray-200 shadow-sm">
          {personalInfo.profilePhoto ? (
            <img 
              src={personalInfo.profilePhoto} 
              alt={personalInfo.fullName}
              className="w-full h-full object-cover rounded-full"
              style={{ 
                width: '96px', 
                height: '96px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100');
                  parent.innerHTML = '<div class="text-gray-600 text-sm font-medium">' + (personalInfo.fullName.charAt(0) || 'Photo') + '</div>';
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'Photo'}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-light text-gray-800 mb-2">{personalInfo.fullName}</h1>
        {personalInfo.title && (
          <h2 className="text-lg text-gray-600 uppercase tracking-widest font-light mb-4">{personalInfo.title}</h2>
        )}
        
        {/* Contact Info in Header */}
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          {contactLinks.map((link, index) => (
            <a href={link.url} key={index} className="flex items-center space-x-2 hover:underline">
              <span>{link.label}</span>
            </a>
          ))}
          {personalInfo.location && (
            <div className="flex items-center space-x-2">
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Sections */}
      {(sectionOrder || []).map((section, index) => {
        if (!section.enabled) return null;

        switch (section.id) {
          case 'summary':
            return (
              personalInfo.summary && (
                <section className="mb-8" key={index}>
                  <h2 className="text-xl font-light text-gray-800 border-b border-gray-200 pb-2 mb-4">Summary</h2>
                  <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
                </section>
              )
            );
          case 'experience':
            return (
              experience && experience.length > 0 && (
                <section className="mb-8" key={index}>
                  <h2 className="text-xl font-light text-gray-800 border-b border-gray-200 pb-2 mb-6">Experience</h2>
                  {experience.map((exp, expIndex) => (
                    <div key={expIndex} className="mb-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{exp.role}</h3>
                          <p className="text-gray-600 italic">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-100">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </section>
              )
            );
          case 'education':
            return (
              education && education.length > 0 && (
                <section className="mb-8" key={index}>
                  <h2 className="text-xl font-light text-gray-800 border-b border-gray-200 pb-2 mb-6">Education</h2>
                  {education.map((edu, eduIndex) => (
                    <div key={eduIndex} className="mb-4">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                          <p className="text-gray-600 italic">{edu.school}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )
            );
          case 'skills':
            return (
              skills && (
              <section className="mb-8" key={index}>
                <h2 className="text-xl font-light text-gray-800 border-b border-gray-200 pb-2 mb-4">Skills</h2>
                <div className="space-y-6">
                  {skills.hard && skills.hard.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Technical Skills</h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 columns-2">
                        {skills.hard.map((skill, skillIndex) => (
                          <li key={skillIndex}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {skills.soft && skills.soft.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Soft Skills</h3>
                      <p className="text-sm text-gray-700">
                        {skills.soft.join(', ')}
                      </p>
                    </div>
                  )}
                  {skills.languages && skills.languages.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Languages</h3>
                      {skills.languages.map((lang, langIndex) => (
                        <div key={langIndex} className="flex justify-between text-sm">
                          <span className="text-gray-700">{lang.name}</span>
                          <span className="text-gray-500">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {skills.certifications && skills.certifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Certifications</h3>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {skills.certifications.map((cert, certIndex) => (
                          <li key={certIndex}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
              )
            );
          case 'projects':
            return (
              projects && projects.length > 0 && (
                <section className="mb-8" key={index}>
                  <h2 className="text-xl font-light text-gray-800 border-b border-gray-200 pb-2 mb-6">Projects</h2>
                  {projects.map((proj, projIndex) => (
                    <div key={projIndex} className="mb-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-gray-800">{proj.name}</h3>
                        {proj.url && (
                          <a href={proj.url} className="text-blue-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                            {proj.url}
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">{proj.description}</p>
                    </div>
                  ))}
                </section>
              )
            );
          default:
            return null;
        }
      })}
    </div>
  );
};