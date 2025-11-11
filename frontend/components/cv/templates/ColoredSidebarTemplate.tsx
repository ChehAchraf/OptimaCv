import React from 'react';
import { CVData } from '@/types/cv';

interface ColoredSidebarTemplateProps {
  data: CVData;
  primaryColor?: string;
}

export const ColoredSidebarTemplate: React.FC<ColoredSidebarTemplateProps> = ({ 
  data, 
  primaryColor 
}) => {
  const { personalInfo, education, experience, projects, skills } = data;
  const finalColor = primaryColor || data.preferences?.primaryColor || '#3B82F6';

  const getContrastColor = (hexColor: string) => {
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
  };

  const textColor = getContrastColor(finalColor);

  const contactLinks = [
    { url: personalInfo.email ? `mailto:${personalInfo.email}` : '', label: personalInfo.email },
    { url: personalInfo.phoneNumber ? `tel:${personalInfo.phoneNumber}` : '', label: personalInfo.phoneNumber },
    { url: personalInfo.linkedin || '', label: 'LinkedIn' },
    { url: personalInfo.github || '', label: 'GitHub' },
  ].filter(link => link.url && link.label);

  return (
    <div className="bg-white font-sans flex print:min-h-0 colored-sidebar-template" style={{ height: '297mm', width: '210mm', maxWidth: '210mm' }}>
      {/* Left Sidebar */}
      <div 
        className="w-1/4 p-4 colored-sidebar-left" 
        style={{ backgroundColor: finalColor, color: textColor }}
      >
        {/* Profile Photo */}
        <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-4 border-white shadow-lg">
          {personalInfo.profilePhoto ? (
            <img 
              src={personalInfo.profilePhoto} 
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
              style={{ 
                width: '112px', 
                height: '112px', 
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('flex', 'items-center', 'justify-center', 'bg-white', 'bg-opacity-20');
                  parent.innerHTML = `<div class="text-xl font-medium" style="color: ${textColor}">${(personalInfo.fullName.charAt(0) || 'Photo')}</div>`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-medium" style={{ color: textColor }}>
              {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'Photo'}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide">CONTACT</h2>
          <div className="space-y-3">
            {contactLinks.map((link, index) => (
              <a href={link.url} key={index} className="flex items-center space-x-2 text-xs hover:opacity-80" style={{ color: textColor }}>
                <span className="break-all leading-tight">{link.label}</span>
              </a>
            ))}
            {personalInfo.location && (
              <div className="flex items-center space-x-2 text-xs">
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        {skills.languages && skills.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide">LANGUAGES</h2>
            <div className="space-y-2">
              {skills.languages.map((lang, index) => (
                <div key={index} className="text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs opacity-80">{lang.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {skills.certifications && skills.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide">CERTIFICATIONS</h2>
            <div className="space-y-1">
              {skills.certifications.map((cert, index) => (
                <div key={index} className="text-xs">• {cert}</div>
              ))}
            </div>
          </div>
        )}

        {/* Centres d'intérêt */}
        {skills.interests && skills.interests.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide">Centres d'intérêt</h2>
            <div className="space-y-1">
              {skills.interests.map((interest, index) => (
                <div key={index} className="text-xs">• {interest}</div>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {skills.soft && skills.soft.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide">Soft Skills</h2>
            <div className="space-y-1">
              {skills.soft.map((skill, index) => (
                <div key={index} className="text-xs">• {skill}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6 colored-sidebar-content">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{personalInfo.fullName}</h1>
          {personalInfo.title && (
            <h2 className="text-lg text-gray-600 uppercase tracking-wide font-light mb-3">{personalInfo.title}</h2>
          )}
          {personalInfo.summary && (
            <div className="border-l-4 pl-4 italic text-gray-700 text-sm" style={{ borderColor: finalColor }}>
              {personalInfo.summary}
            </div>
          )}
        </header>

        {/* Experience - moved to top */}
        {experience && experience.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wide"
              style={{ color: finalColor }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4 border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{exp.role}</h3>
                    <p className="text-sm font-medium" style={{ color: finalColor }}>{exp.company}</p>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wide"
              style={{ color: finalColor }}
            >
              EDUCATION
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-3 border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-xs text-gray-600">{edu.school}</p>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wide"
              style={{ color: finalColor }}
            >
              PROJECTS
            </h2>
            {projects.map((proj, index) => (
              <div key={index} className="mb-3 border-l-2 border-gray-200 pl-4">
                <h3 className="text-sm font-semibold text-gray-800">{proj.name}</h3>
                {proj.url && (
                  <p className="text-xs mb-1" style={{ color: finalColor }}>{proj.url}</p>
                )}
                <p className="text-gray-700 text-xs">{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills */}
        {skills.hard && skills.hard.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold mb-4 uppercase tracking-wide"
              style={{ color: finalColor }}
            >
              TECHNICAL SKILLS
            </h2>
            <div className="grid grid-cols-2 gap-1">
              {skills.hard.map((skill, index) => (
                <div key={index} className="text-xs text-gray-700 flex items-center">
                  <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: finalColor }}></span>
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};