import React from 'react';
import { CVData } from '@/types/cv';

interface ModernBlackTemplateProps {
  data: CVData;
}

export const ModernBlackTemplate: React.FC<ModernBlackTemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, skills } = data;

  const getIconForUrl = (url: string) => {
    if (url.includes('linkedin.com')) return '💼';
    if (url.includes('github.com')) return '🔗';
    if (url.includes('mailto:')) return '📧';
    if (url.includes('tel:')) return '📞';
    if (url.includes('portfolio') || url.includes('behance') || url.includes('dribbble')) return '🎨';
    return '🌐';
  };

  const contactLinks = [
    { url: personalInfo.email ? `mailto:${personalInfo.email}` : '', label: personalInfo.email, icon: '@' },
    { url: personalInfo.phoneNumber ? `tel:${personalInfo.phoneNumber}` : '', label: personalInfo.phoneNumber, icon: '☎' },
    { url: personalInfo.linkedin || '', label: personalInfo.linkedin?.replace('https://', ''), icon: 'in' },
    { url: personalInfo.github || '', label: personalInfo.github?.replace('https://', ''), icon: 'git' },
    { url: personalInfo.portfolio || '', label: personalInfo.portfolio?.replace('https://', ''), icon: '⚡' },
    { url: personalInfo.portfolio || '', label: personalInfo.portfolio?.replace('https://', ''), icon: '🌐' },
  ].filter(link => link.url && link.label);

  return (
    <div className="min-h-screen bg-white text-black font-sans flex print:min-h-0 modern-black-template">
      {/* Left Column - Photo and Contact */}
      <div className="w-1/3 bg-gray-900 text-white p-6 flex flex-col items-center modern-black-sidebar">
        {/* Profile Photo */}
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden border-2 border-white shadow-lg">
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
                  parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-400');
                  parent.innerHTML = '<div class="text-white text-sm font-medium">' + (personalInfo.fullName.charAt(0) || 'Photo') + '</div>';
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'Photo'}
            </div>
          )}
        </div>

        {/* Name and Title */}
        <h1 className="text-lg font-bold text-center mb-2">{personalInfo.fullName}</h1>
        {personalInfo.title && (
          <p className="text-sm text-gray-300 text-center mb-4">{personalInfo.title}</p>
        )}

        {/* Contact Information */}
        <div className="w-full">
          <h2 className="text-sm font-semibold mb-3 border-b border-gray-600 pb-1">CONTACT</h2>
          <div className="space-y-1">
            {contactLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <span className="text-sm">{link.icon}</span>
                <span className="break-all">{link.label}</span>
              </div>
            ))}
            {personalInfo.location && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-sm">📍</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        {skills.languages && skills.languages.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="text-sm font-semibold mb-3 border-b border-gray-600 pb-1">LANGUAGES</h2>
            <div className="space-y-1">
              {skills.languages.map((lang, index) => (
                <div key={index} className="text-xs">
                  <div className="flex justify-between">
                    <span>{lang.name}</span>
                    <span className="text-gray-300">{lang.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {skills.soft && skills.soft.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="text-sm font-semibold mb-3 border-b border-gray-600 pb-1">SOFT SKILLS</h2>
            <div className="space-y-1">
              {skills.soft.map((skill, index) => (
                <div key={index} className="text-xs">• {skill}</div>
              ))}
            </div>
          </div>
        )}

        {/* Centres d'intérêt */}
        {skills.interests && skills.interests.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="text-sm font-semibold mb-3 border-b border-gray-600 pb-1">CENTRES D'INTÉRÊT</h2>
            <div className="space-y-1">
              {skills.interests.map((interest, index) => (
                <div key={index} className="text-xs">• {interest}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      <div className="flex-1 p-8 modern-black-content">
        {/* Experience - moved to top */}
        {experience && experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">WORK EXPERIENCE</h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-sm font-semibold">{exp.role}</h3>
                    <p className="text-gray-600 font-medium text-xs">{exp.company}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Professional Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">PROFILE</h2>
            <p className="text-gray-700 leading-relaxed text-xs">{personalInfo.summary}</p>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">EDUCATION</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{edu.degree}</h3>
                    <p className="text-gray-600 text-xs">{edu.school}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.hard && skills.hard.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">COMPETENCES TECHNIQUES</h2>
            <div className="grid grid-cols-2 gap-1">
              {skills.hard.map((skill, index) => (
                <div key={index} className="text-xs">• {skill}</div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">PROJECTS</h2>
            {projects.map((proj, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold text-sm">{proj.name}</h3>
                {proj.url && (
                  <p className="text-blue-600 text-xs">{proj.url}</p>
                )}
                <p className="text-gray-700 text-xs">{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {skills.certifications && skills.certifications.length > 0 && (
          <section>
            <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">CERTIFICATIONS</h2>
            <div className="space-y-1">
              {skills.certifications.map((cert, index) => (
                <div key={index} className="text-sm">• {cert}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};