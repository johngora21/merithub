import React, { useState, useEffect } from 'react'
import { FileText, Download, Upload, Edit3, Eye, Plus, Save, X } from 'lucide-react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { apiService, resolveAssetUrl } from '../lib/api-service'
import { professionalTemplates } from '../data/templates'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const CareerTools = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('cv-builder')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [templateFilter, setTemplateFilter] = useState('all')
  const [resumeJson, setResumeJson] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [templateData, setTemplateData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [previewDocument, setPreviewDocument] = useState(null)

  const tabs = [
    { id: 'cv-builder', name: 'CV Builder' },
    { id: 'templates', name: 'Templates' },
    { id: 'my-documents', name: 'My Documents' }
  ]

  const [cvTemplates, setCvTemplates] = useState([])
  const [myDocuments, setMyDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  // Built-in professional templates catalog
  const MiniResumePreview = ({ template, dense = false, fullHeight = false }) => {
    const baseText = {
      color: '#0f172a',
      fontFamily: template.variant === 'serif' ? 'Georgia, Times, serif' : 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal'
    }
    const small = dense ? { name: 12, section: 10, body: 9 } : { name: 17, section: 13, body: 11 }
    const sectionTitleStyle = { fontSize: `${small.section}px`, fontWeight: template.variant === 'serif' ? 700 : 700, color: template.accent, margin: '10px 0 6px 0', letterSpacing: template.variant === 'serif' ? '0.1px' : '0.3px' }
    const bodyText = { fontSize: `${small.body}px`, color: '#334155', lineHeight: 1.6, margin: 0, letterSpacing: template.variant === 'serif' ? '0px' : '0.1px', wordBreak: 'break-word' }
    const accent = template.accentStyle || 'top'
    const header = template.headerStyle || 'bar' // bar | full
    const pageCount = 1
    const variant = template.variant || 'default'

    // Realistic sample catalog (used only to enrich sparse sections, no 'Additional' text)
    const SAMPLE_CATALOG = {
      Technology: {
        projects: ['Feature flag rollout service', 'Zero-downtime deployment pipeline', 'Service-level objectives dashboard'],
        certifications: ['Google Cloud Professional Cloud Developer'],
        awards: ['Quarterly Engineering Excellence Award'],
        publications: []
      },
      Product: {
        projects: ['North-star metric framework', 'Customer journey mapping program', 'Win/loss analysis initiative'],
        certifications: ['Scrum Product Owner (CSPO)'],
        awards: ['Product of the Quarter'],
        publications: []
      },
      Research: {
        projects: ['Clinical NLP pretraining study', 'Bias assessment in EHR models'],
        certifications: [],
        awards: ['Best Poster (AMIA)'],
        publications: ['Kapoor P. (2021) Transfer learning in EHR. AMIA.']
      },
      Academia: {
        projects: ['Curriculum redesign for advanced analytics'],
        certifications: [],
        awards: ["Dean's Teaching Award"],
        publications: ['Wei C. (2023) Privacy-aware MMM. JMR.']
      },
      Finance: {
        projects: ['Rolling 13-week cashflow model', 'Cohort LTV analysis'],
        certifications: ['FMVA®'],
        awards: [],
        publications: []
      },
      Operations: {
        projects: ['Lean transformation roadmap', 'Supplier performance dashboard'],
        certifications: ['Lean Six Sigma Black Belt'],
        awards: ['Operations Excellence Award'],
        publications: []
      },
      Data: {
        projects: ['Data quality framework', 'Customer churn model v2'],
        certifications: ['dbt Analytics Engineer'],
        awards: [],
        publications: []
      },
      Design: {
        projects: ['Accessibility audit and remediation', 'Design token system v2'],
        certifications: [],
        awards: ['AIGA Recognition'],
        publications: []
      },
      Sales: {
        projects: ['ABM motion for strategic accounts'],
        certifications: ['MEDDIC Masterclass'],
        awards: ["President's Club"],
        publications: []
      },
      HR: {
        projects: ['Competency framework rollout'],
        certifications: ['SHRM-CP'],
        awards: [],
        publications: []
      },
      Healthcare: {
        projects: ['Sepsis early warning protocol'],
        certifications: ['PALS'],
        awards: [],
        publications: []
      },
      Education: {
        projects: ['STEM curriculum modernization'],
        certifications: ['State Teaching Certification'],
        awards: ['Teacher of the Year'],
        publications: []
      },
      Legal: {
        projects: ['E-discovery playbook'],
        certifications: [],
        awards: [],
        publications: ['Reed M. (2022) Arbitration update. GA Bar.']
      },
      Engineering: {
        projects: ['Seismic retrofit guidelines'],
        certifications: ['PE (Professional Engineer)'],
        awards: [],
        publications: []
      },
      Marketing: {
        projects: ['Two-tier demand gen engine'],
        certifications: ['Google Ads Certification'],
        awards: ['Effie Bronze'],
        publications: []
      },
      Security: {
        projects: ['Vulnerability management program'],
        certifications: ['OSCP'],
        awards: [],
        publications: []
      },
      Hospitality: {
        projects: ['Seasonal menu optimization'],
        certifications: ['ServSafe Manager'],
        awards: ["Local Chef's Choice"],
        publications: []
      },
      Aviation: {
        projects: ['Fuel efficiency SOP'],
        certifications: ['ATPL'],
        awards: [],
        publications: []
      },
      Media: {
        projects: ['Data journalism toolkit'],
        certifications: [],
        awards: ['Investigative Reporting Shortlist'],
        publications: []
      },
      General: {
        projects: ['OKR rollout'],
        certifications: ['First Aid/CPR'],
        awards: ['Employee of the Quarter'],
        publications: []
      }
    }

    const category = template.category || 'General'
    const cat = SAMPLE_CATALOG[category] || SAMPLE_CATALOG.General

    const enrich = (list, samples, target) => {
      const base = Array.isArray(list) ? [...list] : []
      for (let i = 0; i < samples.length && base.length < target; i++) {
        if (!base.includes(samples[i])) base.push(samples[i])
      }
      return base
    }

    const projectsList = enrich(template.content.projects, cat.projects || [], 3)
    const certsList = enrich(template.content.certifications, cat.certifications || [], 2)
    const awardsList = enrich(template.content.awards, cat.awards || [], 2)
    const pubsList = enrich(template.content.publications, cat.publications || [], 2)
    const educationList = Array.isArray(template.content.education) ? template.content.education : []

    const pageStyle = {
      border: accent === 'border' ? `2px solid ${template.accent}` : '1px solid #e5e7eb',
      borderRadius: variant === 'boxed' ? '10px' : '6px',
      overflow: 'hidden',
      backgroundColor: 'white',
      height: fullHeight ? 'auto' : (dense ? 560 : 900),
      minHeight: fullHeight ? 'auto' : (dense ? 560 : 900),
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }
    const topBarHeight = header === 'bar' && accent === 'top' ? (dense ? 10 : 14) : 0
    const fullHeaderHeight = header === 'full' ? (dense ? 90 : 200) : 0
    const contentPadding = dense ? '10px 12px' : '18px 22px'
    const divider = <div style={{ height: 1, backgroundColor: '#e5e7eb', margin: dense ? '8px 0' : '12px 0' }} />

    const SideAccent = ({ side }) => (
      <div style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: variant === 'sidebar' ? (dense ? 96 : 140) : (dense ? 8 : 12), backgroundColor: template.accent, opacity: 1 }} />
    )

    const MultiPageIndicator = () => (
      pageCount > 1 ? (
        <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Page 1 of {pageCount}</div>
          {[...Array(pageCount)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: i === 0 ? template.accent : '#e5e7eb' }} />
          ))}
        </div>
      ) : null
    )

    const renderBullets = (bullets) => {
      if (variant === 'icons') {
        return (bullets || []).slice(0, 6).map((b, bi) => (
          <p key={bi} style={{ ...bodyText, color: '#475569' }}>▪ {b}</p>
        ))
      }
      if (variant === 'timeline') {
        return (bullets || []).slice(0, 6).map((b, bi) => (
          <p key={bi} style={{ ...bodyText, color: '#475569', position: 'relative', paddingLeft: 14 }}>
            <span style={{ position: 'absolute', left: 0, top: 8, width: 8, height: 8, borderRadius: '50%', backgroundColor: template.accent }} />
            {b}
          </p>
        ))
      }
      return (bullets || []).slice(0, 6).map((b, bi) => (
        <p key={bi} style={{ ...bodyText, color: '#475569' }}>• {b}</p>
      ))
    }

    const Section = ({ title, children }) => (
      variant === 'banded'
        ? (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #eef2f7', borderRadius: 8, padding: dense ? 8 : 12, marginBottom: dense ? 8 : 12 }}>
            <div style={{ ...sectionTitleStyle, margin: 0, marginBottom: 8 }}>{title}</div>
            {children}
          </div>
        ) : (
          <>
            <div style={sectionTitleStyle}>{title}</div>
            {children}
          </>
        )
    )

    if (template.layout === 'two-column') {
      return (
        <div style={pageStyle}>
          {header === 'full' && (
            <div style={{ backgroundColor: template.accent, color: 'white', padding: contentPadding, height: fullHeaderHeight, display: 'flex', alignItems: 'center', gap: 14 }}>
              {template.content.profilePhoto && (
                <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 46 : 72, height: dense ? 46 : 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)' }} />
              )}
              <div>
                <div style={{ fontSize: header === 'full' ? (dense ? 16 : 22) : small.name, fontWeight: 800 }}>{template.content.name}</div>
                <div style={{ fontSize: dense ? 10 : 13 }}>{template.content.title}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  {(template.content.contact || []).slice(0, 3).map((c, i) => (
                    <span key={i} style={{ fontSize: dense ? 9 : 11 }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {topBarHeight > 0 && <div style={{ height: topBarHeight, backgroundColor: template.accent }} />}
          {(accent === 'left') && <SideAccent side="left" />}
          {(accent === 'right') && <SideAccent side="right" />}
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ width: variant === 'sidebar' ? '28%' : '32%', borderRight: '1px solid #e5e7eb', padding: contentPadding }}>
              {!fullHeaderHeight && template.content.profilePhoto && (
                <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 40 : 64, height: dense ? 40 : 64, borderRadius: '50%', objectFit: 'cover', marginBottom: dense ? 8 : 12 }} />
              )}
              {!fullHeaderHeight && (
                <>
                  <div style={{ ...baseText, fontSize: `${small.name}px`, fontWeight: 800, marginBottom: dense ? '4px' : '6px' }}>{template.content.name}</div>
                  <div style={{ ...bodyText, color: '#64748b', marginBottom: dense ? '8px' : '10px' }}>{template.content.title}</div>
                </>
              )}
              <Section title="Profile"><p style={bodyText}>{template.content.profile}</p></Section>
              <Section title="Skills">
                {(template.content.skills || []).slice(0, 20).map((s, si) => (
                  <p key={si} style={bodyText}>• {typeof s === 'string' ? s : (s.name || s.title || 'Skill')}</p>
                ))}
              </Section>
              <Section title="Contact">{(template.content.contact || []).slice(0, 5).map((c, i) => (<p key={i} style={bodyText}>{c}</p>))}</Section>
            </div>
            <div style={{ flex: 1, padding: contentPadding, overflow: 'hidden', position: 'relative' }}>
              {variant === 'timeline' && (
                <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, backgroundColor: '#e5e7eb' }} />
              )}
              <Section title="Experience">
                {(template.content.experience || []).slice(0, 6).map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: dense ? 8 : 10, position: 'relative', paddingLeft: variant === 'timeline' ? 18 : 0 }}>
                    {variant === 'timeline' && <span style={{ position: 'absolute', left: 2, top: 6, width: 10, height: 10, borderRadius: '50%', backgroundColor: template.accent }} />}
                    <p style={bodyText}><strong>{exp.role}</strong> — {exp.company} ({exp.dates})</p>
                    {renderBullets(exp.bullets)}
                  </div>
                ))}
              </Section>
              {projectsList.length > 0 && (
                <Section title="Projects">
                  {projectsList.slice(0, 6).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
                </Section>
              )}
              {certsList.length > 0 && (
                <Section title="Certifications">
                  {certsList.slice(0, 6).map((c, ci) => (<p key={ci} style={bodyText}>• {typeof c === 'string' ? c : (c.name || c.title || 'Certification')}</p>))}
                </Section>
              )}
              {awardsList.length > 0 && (
                <Section title="Awards">
                  {awardsList.slice(0, 6).map((a, ai) => (<p key={ai} style={bodyText}>• {typeof a === 'string' ? a : (a.name || a.title || 'Award')}</p>))}
                </Section>
              )}
              {pubsList.length > 0 && (
                <Section title="Publications">
                  {pubsList.slice(0, 6).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
                </Section>
              )}
              <Section title="Education">
                {educationList.slice(0, 6).map((ed, ei) => (<p key={ei} style={bodyText}>• {ed.degree}{ed.school ? ` — ${ed.school}` : ''}</p>))}
              </Section>
            </div>
          </div>
          <MultiPageIndicator />
        </div>
      )
    }

    // split-page layout
    if (template.layout === 'split-page') {
      return (
        <div style={pageStyle}>
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Left Panel - Profile Details */}
            <div style={{ 
              width: '35%', 
              backgroundColor: template.accent, 
              color: 'white', 
              padding: contentPadding,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              {/* Profile Photo */}
              {template.content.profilePhoto && (
                <div style={{ textAlign: 'center', marginBottom: dense ? 16 : 20 }}>
                  <img 
                    src={template.content.profilePhoto} 
                    alt="profile" 
                    style={{ 
                      width: dense ? 60 : 80, 
                      height: dense ? 60 : 80, 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }} 
                  />
                </div>
              )}
              
              {/* Name and Title */}
              <div style={{ textAlign: 'center', marginBottom: dense ? 16 : 20 }}>
                <h1 style={{ 
                  fontSize: dense ? 18 : 24, 
                  fontWeight: 800, 
                  margin: '0 0 8px 0',
                  color: 'white'
                }}>
                  {template.content.name}
                </h1>
                <h2 style={{ 
                  fontSize: dense ? 12 : 16, 
                  fontWeight: 400, 
                  margin: 0,
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  {template.content.title}
                </h2>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: dense ? 16 : 20 }}>
                <h3 style={{ 
                  fontSize: dense ? 12 : 14, 
                  fontWeight: 700, 
                  margin: '0 0 8px 0',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Contact
                </h3>
                {(template.content.contact || []).map((c, i) => (
                  <p key={i} style={{ 
                    fontSize: dense ? 10 : 12, 
                    margin: '4px 0', 
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.4
                  }}>
                    {c}
                  </p>
                ))}
              </div>

              {/* Profile Summary */}
              {template.content.profile && (
                <div style={{ marginBottom: dense ? 16 : 20 }}>
                  <h3 style={{ 
                    fontSize: dense ? 12 : 14, 
                    fontWeight: 700, 
                    margin: '0 0 8px 0',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Profile
                  </h3>
                  <p style={{ 
                    fontSize: dense ? 10 : 12, 
                    margin: 0, 
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.5
                  }}>
                    {template.content.profile}
                  </p>
                </div>
              )}

              {/* Skills */}
              <div style={{ marginBottom: dense ? 16 : 20 }}>
                <h3 style={{ 
                  fontSize: dense ? 12 : 14, 
                  fontWeight: 700, 
                  margin: '0 0 8px 0',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Skills
                </h3>
                {(template.content.skills || []).slice(0, 15).map((s, si) => (
                  <p key={si} style={{ 
                    fontSize: dense ? 10 : 12, 
                    margin: '3px 0', 
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.3
                  }}>
                    • {typeof s === 'string' ? s : (s.name || s.title || 'Skill')}
                  </p>
                ))}
              </div>

              {/* Languages */}
              {template.content.languages && template.content.languages.length > 0 && (
                <div style={{ marginBottom: dense ? 16 : 20 }}>
                  <h3 style={{ 
                    fontSize: dense ? 12 : 14, 
                    fontWeight: 700, 
                    margin: '0 0 8px 0',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Languages
                  </h3>
                  {template.content.languages.map((lang, li) => (
                    <p key={li} style={{ 
                      fontSize: dense ? 10 : 12, 
                      margin: '3px 0', 
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.3
                    }}>
                      • {lang}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel - Main Content with Different Styles */}
            <div style={{ 
              flex: 1, 
              padding: contentPadding,
              backgroundColor: 'white',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Modern Style - split-right-modern */}
              {template.variant === 'split-right-modern' && (
                <>
                  {/* Experience with modern cards */}
                  <Section title="Experience">
                    {(template.content.experience || []).slice(0, 4).map((exp, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: dense ? 16 : 20,
                        padding: dense ? 12 : 16,
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${template.accent}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: dense ? 6 : 8
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 13 : 15, 
                              fontWeight: 700, 
                              margin: '0 0 4px 0',
                              color: '#1e293b'
                            }}>
                              {exp.role}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 11 : 13, 
                              margin: '0 0 6px 0',
                              color: template.accent,
                              fontWeight: 600
                            }}>
                              {exp.company}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 10 : 12, 
                            color: '#64748b',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            backgroundColor: '#e2e8f0',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {exp.dates}
                          </span>
                        </div>
                        {renderBullets(exp.bullets)}
                      </div>
                    ))}
                  </Section>

                  {/* Education with modern style */}
                  <Section title="Education">
                    {educationList.slice(0, 3).map((ed, ei) => (
                      <div key={ei} style={{ 
                        marginBottom: dense ? 12 : 16,
                        padding: dense ? 10 : 14,
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                        border: `1px solid #e2e8f0`
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start'
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 12 : 14, 
                              fontWeight: 700, 
                              margin: '0 0 4px 0',
                              color: '#1e293b'
                            }}>
                              {ed.degree}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 10 : 12, 
                              margin: 0,
                              color: '#64748b',
                              fontWeight: 600
                            }}>
                              {ed.school}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 9 : 11, 
                            color: '#64748b',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12
                          }}>
                            {ed.dates}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Section>
                </>
              )}

              {/* Elegant Style - split-right-elegant */}
              {template.variant === 'split-right-elegant' && (
                <>
                  {/* Experience with elegant styling */}
                  <Section title="Experience">
                    {(template.content.experience || []).slice(0, 4).map((exp, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: dense ? 18 : 24,
                        paddingBottom: dense ? 16 : 20,
                        borderBottom: '1px solid #e5e7eb',
                        position: 'relative'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: dense ? 6 : 8
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 13 : 15, 
                              fontWeight: 600, 
                              margin: '0 0 4px 0',
                              color: '#1f2937',
                              letterSpacing: '0.025em'
                            }}>
                              {exp.role}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 11 : 13, 
                              margin: '0 0 6px 0',
                              color: template.accent,
                              fontWeight: 500,
                              fontStyle: 'italic'
                            }}>
                              {exp.company}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 10 : 12, 
                            color: '#6b7280',
                            fontWeight: 400,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            fontStyle: 'italic'
                          }}>
                            {exp.dates}
                          </span>
                        </div>
                        {renderBullets(exp.bullets)}
                      </div>
                    ))}
                  </Section>

                  {/* Education with elegant styling */}
                  <Section title="Education">
                    {educationList.slice(0, 3).map((ed, ei) => (
                      <div key={ei} style={{ 
                        marginBottom: dense ? 14 : 18,
                        paddingLeft: dense ? 16 : 20,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 6,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: template.accent
                        }} />
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start'
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 12 : 14, 
                              fontWeight: 600, 
                              margin: '0 0 4px 0',
                              color: '#1f2937',
                              letterSpacing: '0.025em'
                            }}>
                              {ed.degree}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 10 : 12, 
                              margin: 0,
                              color: '#6b7280',
                              fontWeight: 400,
                              fontStyle: 'italic'
                            }}>
                              {ed.school}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 9 : 11, 
                            color: '#9ca3af',
                            fontWeight: 400,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            fontStyle: 'italic'
                          }}>
                            {ed.dates}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Section>
                </>
              )}

              {/* Creative Style - split-right-creative */}
              {template.variant === 'split-right-creative' && (
                <>
                  {/* Experience with creative styling */}
                  <Section title="Experience">
                    {(template.content.experience || []).slice(0, 4).map((exp, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: dense ? 16 : 20,
                        padding: dense ? 14 : 18,
                        backgroundColor: '#fefefe',
                        borderRadius: '12px',
                        border: `2px solid ${template.accent}20`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${template.accent}, ${template.accent}80)`
                        }} />
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: dense ? 6 : 8
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 13 : 15, 
                              fontWeight: 700, 
                              margin: '0 0 4px 0',
                              color: '#1e293b'
                            }}>
                              {exp.role}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 11 : 13, 
                              margin: '0 0 6px 0',
                              color: template.accent,
                              fontWeight: 600
                            }}>
                              {exp.company}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 10 : 12, 
                            color: '#64748b',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            backgroundColor: `${template.accent}15`,
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}>
                            {exp.dates}
                          </span>
                        </div>
                        {renderBullets(exp.bullets)}
                      </div>
                    ))}
                  </Section>

                  {/* Education with creative styling */}
                  <Section title="Education">
                    {educationList.slice(0, 3).map((ed, ei) => (
                      <div key={ei} style={{ 
                        marginBottom: dense ? 12 : 16,
                        padding: dense ? 12 : 16,
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: `1px solid ${template.accent}30`,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          backgroundColor: template.accent,
                          borderRadius: '0 2px 2px 0'
                        }} />
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          paddingLeft: dense ? 12 : 16
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 12 : 14, 
                              fontWeight: 700, 
                              margin: '0 0 4px 0',
                              color: '#1e293b'
                            }}>
                              {ed.degree}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 10 : 12, 
                              margin: 0,
                              color: '#64748b',
                              fontWeight: 600
                            }}>
                              {ed.school}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 9 : 11, 
                            color: '#64748b',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12
                          }}>
                            {ed.dates}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Section>
                </>
              )}

              {/* Professional Style - split-right-professional */}
              {template.variant === 'split-right-professional' && (
                <>
                  {/* Experience with professional styling */}
                  <Section title="Experience">
                    {(template.content.experience || []).slice(0, 4).map((exp, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: dense ? 16 : 20,
                        padding: dense ? 12 : 16,
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: dense ? 6 : 8,
                          paddingBottom: dense ? 8 : 10,
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 13 : 15, 
                              fontWeight: 700, 
                              margin: '0 0 4px 0',
                              color: '#111827'
                            }}>
                              {exp.role}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 11 : 13, 
                              margin: '0 0 6px 0',
                              color: template.accent,
                              fontWeight: 600
                            }}>
                              {exp.company}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 10 : 12, 
                            color: '#6b7280',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            backgroundColor: '#f9fafb',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {exp.dates}
                          </span>
                        </div>
                        {renderBullets(exp.bullets)}
                      </div>
                    ))}
                  </Section>

                  {/* Education with professional styling */}
                  <Section title="Education">
                    {educationList.slice(0, 3).map((ed, ei) => (
                      <div key={ei} style={{ 
                        marginBottom: dense ? 12 : 16,
                        padding: dense ? 10 : 14,
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        backgroundColor: '#fafafa'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start'
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 12 : 14, 
                              fontWeight: 700, 
                              margin: '0 0 4px 0',
                              color: '#111827'
                            }}>
                              {ed.degree}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 10 : 12, 
                              margin: 0,
                              color: '#6b7280',
                              fontWeight: 500
                            }}>
                              {ed.school}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 9 : 11, 
                            color: '#9ca3af',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12
                          }}>
                            {ed.dates}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Section>
                </>
              )}

              {/* Vibrant Style - split-right-vibrant */}
              {template.variant === 'split-right-vibrant' && (
                <>
                  {/* Experience with vibrant styling */}
                  <Section title="Experience">
                    {(template.content.experience || []).slice(0, 4).map((exp, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: dense ? 18 : 24,
                        padding: dense ? 16 : 20,
                        backgroundColor: '#fefefe',
                        borderRadius: '16px',
                        border: `3px solid ${template.accent}30`,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '6px',
                          background: `linear-gradient(90deg, ${template.accent}, ${template.accent}60, ${template.accent})`
                        }} />
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: dense ? 8 : 10
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 14 : 16, 
                              fontWeight: 800, 
                              margin: '0 0 6px 0',
                              color: '#1e293b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {exp.role}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 12 : 14, 
                              margin: '0 0 8px 0',
                              color: template.accent,
                              fontWeight: 700
                            }}>
                              {exp.company}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 11 : 13, 
                            color: '#64748b',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            backgroundColor: `${template.accent}20`,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: `2px solid ${template.accent}40`
                          }}>
                            {exp.dates}
                          </span>
                        </div>
                        {renderBullets(exp.bullets)}
                      </div>
                    ))}
                  </Section>

                  {/* Education with vibrant styling */}
                  <Section title="Education">
                    {educationList.slice(0, 3).map((ed, ei) => (
                      <div key={ei} style={{ 
                        marginBottom: dense ? 14 : 18,
                        padding: dense ? 14 : 18,
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: `2px solid ${template.accent}40`,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '6px',
                          background: `linear-gradient(180deg, ${template.accent}, ${template.accent}60)`,
                          borderRadius: '0 3px 3px 0'
                        }} />
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          paddingLeft: dense ? 16 : 20
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 13 : 15, 
                              fontWeight: 800, 
                              margin: '0 0 6px 0',
                              color: '#1e293b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {ed.degree}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 11 : 13, 
                              margin: 0,
                              color: '#64748b',
                              fontWeight: 700
                            }}>
                              {ed.school}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 10 : 12, 
                            color: '#64748b',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            marginLeft: 12,
                            backgroundColor: `${template.accent}20`,
                            padding: '4px 8px',
                            borderRadius: '12px'
                          }}>
                            {ed.dates}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Section>
                </>
              )}

              {/* Default Style - split-left (original) */}
              {template.variant === 'split-left' && (
                <>
                  {/* Experience */}
                  <Section title="Experience">
                    {(template.content.experience || []).slice(0, 6).map((exp, idx) => (
                      <div key={idx} style={{ marginBottom: dense ? 12 : 16 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: dense ? 4 : 6
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 12 : 14, 
                              fontWeight: 700, 
                              margin: '0 0 2px 0',
                              color: '#1e293b'
                            }}>
                              {exp.role}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 10 : 12, 
                              margin: '0 0 4px 0',
                              color: '#64748b',
                              fontWeight: 600
                            }}>
                              {exp.company}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 9 : 11, 
                            color: '#64748b',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12
                          }}>
                            {exp.dates}
                          </span>
                        </div>
                        {renderBullets(exp.bullets)}
                      </div>
                    ))}
                  </Section>

                  {/* Education */}
                  <Section title="Education">
                    {educationList.slice(0, 4).map((ed, ei) => (
                      <div key={ei} style={{ marginBottom: dense ? 8 : 10 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start'
                        }}>
                          <div>
                            <h4 style={{ 
                              fontSize: dense ? 12 : 14, 
                              fontWeight: 700, 
                              margin: '0 0 2px 0',
                              color: '#1e293b'
                            }}>
                              {ed.degree}
                            </h4>
                            <p style={{ 
                              fontSize: dense ? 10 : 12, 
                              margin: 0,
                              color: '#64748b',
                              fontWeight: 600
                            }}>
                              {ed.school}
                            </p>
                          </div>
                          <span style={{ 
                            fontSize: dense ? 9 : 11, 
                            color: '#64748b',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            marginLeft: 12
                          }}>
                            {ed.dates}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Section>
                </>
              )}

              {/* Projects */}
              {projectsList.length > 0 && (
                <Section title="Projects">
                  {projectsList.slice(0, 4).map((p, pi) => (
                    <p key={pi} style={{ 
                      ...bodyText, 
                      marginBottom: dense ? 6 : 8,
                      fontSize: dense ? 10 : 12
                    }}>
                      • {p}
                    </p>
                  ))}
                </Section>
              )}

              {/* Certifications */}
              {certsList.length > 0 && (
                <Section title="Certifications">
                  {certsList.slice(0, 4).map((c, ci) => (
                    <p key={ci} style={{ 
                      ...bodyText, 
                      marginBottom: dense ? 6 : 8,
                      fontSize: dense ? 10 : 12
                    }}>
                      • {typeof c === 'string' ? c : (c.name || c.title || 'Certification')}
                    </p>
                  ))}
                </Section>
              )}

              {/* Awards */}
              {awardsList.length > 0 && (
                <Section title="Awards">
                  {awardsList.slice(0, 4).map((a, ai) => (
                    <p key={ai} style={{ 
                      ...bodyText, 
                      marginBottom: dense ? 6 : 8,
                      fontSize: dense ? 10 : 12
                    }}>
                      • {typeof a === 'string' ? a : (a.name || a.title || 'Award')}
                    </p>
                  ))}
                </Section>
              )}
            </div>
          </div>
          <MultiPageIndicator />
        </div>
      )
    }

    // single-column
    return (
      <div style={pageStyle}>
        {header === 'full' && (
          <div style={{ backgroundColor: template.accent, color: 'white', padding: contentPadding, height: fullHeaderHeight, display: 'flex', alignItems: 'center', gap: 14 }}>
            {template.content.profilePhoto && (
              <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 46 : 72, height: dense ? 46 : 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)' }} />
            )}
            <div>
              <div style={{ fontSize: header === 'full' ? (dense ? 16 : 22) : small.name, fontWeight: 800 }}>{template.content.name}</div>
              <div style={{ fontSize: dense ? 10 : 13 }}>{template.content.title}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                {(template.content.contact || []).slice(0, 3).map((c, i) => (
                  <span key={i} style={{ fontSize: dense ? 9 : 11 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {topBarHeight > 0 && <div style={{ height: topBarHeight, backgroundColor: template.accent }} />}
        {(accent === 'left') && <SideAccent side="left" />}
        {(accent === 'right') && <SideAccent side="right" />}
        <div style={{ padding: contentPadding, overflow: 'hidden', flex: 1 }}>
          {!fullHeaderHeight && (
            <div style={{ display: 'flex', alignItems: 'center', gap: dense ? 10 : 14, marginBottom: dense ? 8 : 12 }}>
              {template.content.profilePhoto && (
                <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 40 : 64, height: dense ? 40 : 64, borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <div style={{ ...baseText, fontSize: `${small.name}px`, fontWeight: 800, marginBottom: '2px' }}>{template.content.name}</div>
                <div style={{ ...bodyText, color: '#64748b' }}>{template.content.title}</div>
              </div>
            </div>
          )}

          <Section title="Profile"><p style={bodyText}>{template.content.profile}</p></Section>

          <Section title="Experience">
            {(template.content.experience || []).slice(0, 8).map((exp, idx) => (
              <div key={idx} style={{ marginBottom: dense ? 8 : 10, position: 'relative', paddingLeft: variant === 'timeline' ? 18 : 0 }}>
                {variant === 'timeline' && <span style={{ position: 'absolute', left: 2, top: 6, width: 10, height: 10, borderRadius: '50%', backgroundColor: template.accent }} />}
                <p style={bodyText}><strong>{exp.role}</strong> — {exp.company} ({exp.dates})</p>
                {renderBullets(exp.bullets)}
              </div>
            ))}
          </Section>

          <Section title="Skills">
            {(template.content.skills || []).slice(0, 24).map((s, si) => (
              <p key={si} style={bodyText}>• {typeof s === 'string' ? s : (s.name || s.title || 'Skill')}</p>
            ))}
          </Section>

          {projectsList.length > 0 && (
            <Section title="Projects">
              {projectsList.slice(0, 8).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
            </Section>
          )}
          {pubsList.length > 0 && (
            <Section title="Publications">
              {pubsList.slice(0, 10).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
            </Section>
          )}
          {awardsList.length > 0 && (
            <Section title="Awards">
              {awardsList.slice(0, 10).map((a, ai) => (<p key={ai} style={bodyText}>• {typeof a === 'string' ? a : (a.name || a.title || 'Award')}</p>))}
            </Section>
          )}
          {certsList.length > 0 && (
            <Section title="Certifications">
              {certsList.slice(0, 10).map((c, ci) => (<p key={ci} style={bodyText}>• {typeof c === 'string' ? c : (c.name || c.title || 'Certification')}</p>))}
            </Section>
          )}
          <Section title="Education">
            {educationList.slice(0, 8).map((ed, ei) => (<p key={ei} style={bodyText}>• {ed.degree}{ed.school ? ` — ${ed.school}` : ''}</p>))}
          </Section>
          {template.content.languages && (
            <Section title="Languages">
              <p style={bodyText}>{template.content.languages.join(', ')}</p>
            </Section>
          )}
        </div>
        <MultiPageIndicator />
      </div>
    )
  }

  useEffect(() => {
    fetchCareerData()
    fetchUserProfile()
  }, [])

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...')
      const response = await apiService.get('/auth/profile')
      const profile = response.data?.user || response.user
      console.log('User profile response:', response)
      console.log('User profile data:', profile)
      console.log('Profile image field:', profile?.profile_image)
      console.log('Profile image URL:', profile?.profile_image)
      if (profile) {
        setUserProfile(profile)
        console.log('User profile set successfully')
      } else {
        console.log('No profile data found in response')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Advanced data mapping algorithm
  const mapUserDataToTemplate = (template, userData) => {
    console.log('Mapping user data to template:', { userData, template: template.name })
    if (!userData) {
      console.log('No user data available, using template defaults')
      return template
    }

    const mappedContent = {
      ...template.content,
      // Basic info mapping
      name: userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}`.trim()
        : template.content.name,
      title: userData.current_job_title || template.content.title,
      profilePhoto: (() => {
        const profileImg = userData.profile_image || userData.profileImage
        console.log('Profile image mapping:', { 
          userData_profile_image: userData.profile_image, 
          userData_profileImage: userData.profileImage, 
          template_profilePhoto: template.content.profilePhoto,
          final: profileImg || template.content.profilePhoto
        })
        
        // Use the API service's resolveAssetUrl function to convert relative paths to full URLs
        return resolveAssetUrl(profileImg) || template.content.profilePhoto
      })(),
      
      // Contact info mapping
      contact: [
        userData.email || '',
        userData.location || userData.country || '',
        userData.linkedin_url || userData.profile_link1_url || ''
      ].filter(Boolean),
      
      // Profile summary mapping
      profile: userData.bio || template.content.profile,
      
      // Skills mapping
      skills: userData.skills && Array.isArray(userData.skills) 
        ? userData.skills.map(skill => typeof skill === 'string' ? skill : skill.name || skill.title || 'Skill')
        : template.content.skills,
      
      // Experience mapping
      experience: userData.experience && Array.isArray(userData.experience) && userData.experience.length > 0
        ? userData.experience.map(exp => ({
            role: exp.job_title || exp.position || exp.title || 'Position',
            company: exp.company_name || exp.organization || 'Company',
            dates: formatDateRange(exp.start_date, exp.end_date, exp.current),
            bullets: exp.responsibilities && Array.isArray(exp.responsibilities) 
              ? exp.responsibilities 
              : exp.description 
                ? [exp.description]
                : ['Key responsibilities and achievements']
          }))
        : template.content.experience,
      
      // Education mapping
      education: userData.education && Array.isArray(userData.education) && userData.education.length > 0
        ? userData.education.map(edu => ({
            degree: edu.degree || edu.qualification || 'Degree',
            school: edu.institution || edu.school || edu.university || 'Institution',
            dates: formatDateRange(edu.start_date, edu.end_date, edu.current)
          }))
        : template.content.education,
      
      // Certifications mapping
      certifications: userData.certificates && Array.isArray(userData.certificates) && userData.certificates.length > 0
        ? userData.certificates.map(cert => typeof cert === 'string' ? cert : (cert.name || cert.title || cert.certification || 'Certification'))
        : template.content.certifications,
      
      // Languages mapping
      languages: userData.languages 
        ? userData.languages.split(',').map(lang => lang.trim()).filter(Boolean)
        : template.content.languages,
      
      // Keep original template data for sections not in user profile
      projects: template.content.projects || [],
      publications: template.content.publications || [],
      awards: template.content.awards || []
    }

    return {
      ...template,
      content: mappedContent
    }
  }

  // Helper function to format date ranges
  const formatDateRange = (startDate, endDate, isCurrent) => {
    if (!startDate) return 'Present'
    
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    
    const start = formatDate(startDate)
    const end = isCurrent ? 'Present' : formatDate(endDate)
    
    return end ? `${start} – ${end}` : start
  }

  // Start editing a template with user data
  const startEditingTemplate = (template) => {
    console.log('Starting template edit with user profile:', userProfile)
    const mappedTemplate = mapUserDataToTemplate(template, userProfile)
    console.log('Mapped template content:', mappedTemplate.content)
    setEditingTemplate(template)
    setTemplateData(mappedTemplate.content)
    setActiveTab('cv-builder')
  }

  // Handle profile image upload
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    try {
      setSaving(true)
      
      // Create a FileReader to convert image to base64 for immediate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        console.log('Profile image converted to base64:', imageUrl)
        
        // Update the template data with the new image URL
        setTemplateData({
          ...templateData,
          profilePhoto: imageUrl
        })
        console.log('Profile image updated in template data')
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Error processing profile image:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Save edited template data
  const saveTemplateData = async () => {
    if (!editingTemplate || !templateData) return
    
    setSaving(true)
    try {
      console.log('Saving template data:', templateData)
      
      // Create a new document entry
      const newDocument = {
        id: Date.now(), // Simple ID generation
        name: `${templateData.name || 'My'} ${editingTemplate.type === 'CV' ? 'CV' : 'Resume'}`,
        type: editingTemplate.type,
        category: editingTemplate.category,
        templateId: editingTemplate.id,
        templateData: templateData,
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: 'Complete'
      }
      
      console.log('Saving document with template ID:', editingTemplate.id)
      console.log('Document structure:', newDocument)
      
      // Add to local myDocuments state
      setMyDocuments(prev => [newDocument, ...prev])
      
      // Also save to localStorage as backup
      const existingLocalDocs = JSON.parse(localStorage.getItem('myDocuments') || '[]')
      const updatedLocalDocs = [newDocument, ...existingLocalDocs]
      localStorage.setItem('myDocuments', JSON.stringify(updatedLocalDocs))
      
      // Save to backend via profile update
      try {
        // Get current user profile to append new document
        const profileResponse = await apiService.get('/auth/profile')
        const currentUser = profileResponse.data.user || {}
        const existingDocuments = Array.isArray(currentUser.documents) ? currentUser.documents : []
        
        // Add new document to existing documents
        const updatedDocuments = [newDocument, ...existingDocuments]
        
        // Update user profile with new documents array
        await apiService.put('/auth/profile', {
          documents: updatedDocuments
        })
        console.log('Document saved to backend successfully')
        
        // Clear localStorage since we successfully saved to backend
        localStorage.removeItem('myDocuments')
        
        // Refresh the documents list to show the updated data
        await fetchCareerData()
      } catch (backendError) {
        console.warn('Backend save failed, but document saved locally:', backendError)
        // Continue even if backend save fails
      }
      
      alert('Document saved successfully! You can find it in "My Documents" tab.')
      setEditingTemplate(null)
      setTemplateData(null)
      setActiveTab('my-documents') // Switch to My Documents tab
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Download document as PDF (simple approach using existing component)
  const downloadDocument = async (doc) => {
    try {
      // Find the original template that was used to create this document
      const originalTemplate = professionalTemplates.find(template => template.id === doc.templateId)
      
      if (!originalTemplate) {
        console.error('Original template not found for document:', doc)
        alert('Original template not found. Cannot download this document.')
        return
      }
      
      // Create a temporary template object for rendering using the original template structure
      const templateForDownload = {
        ...originalTemplate,
        content: doc.templateData
      }
      
      // Create a temporary container to render the CV/Resume
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '0'
      tempContainer.style.width = '210mm'
      tempContainer.style.backgroundColor = 'white'
      tempContainer.style.padding = '0'
      tempContainer.style.margin = '0'
      
      // Add to DOM temporarily
      document.body.appendChild(tempContainer)
      
      // Create a React element using MiniResumePreview
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(tempContainer)
      
      // Render the exact MiniResumePreview component
      root.render(React.createElement(MiniResumePreview, { 
        template: templateForDownload, 
        fullHeight: true 
      }))
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Clean up
      root.unmount()
      document.body.removeChild(tempContainer)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Download the PDF
      pdf.save(`${doc.name.replace(/\s+/g, '_')}.pdf`)
      
      console.log('PDF downloaded successfully')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error downloading PDF. Please try again.')
    }
  }

  // Preview saved document
  const previewSavedDocument = (doc) => {
    console.log('Previewing document:', doc)
    console.log('Looking for template ID:', doc.templateId)
    
    // Find the original template that was used to create this document
    const originalTemplate = professionalTemplates.find(template => template.id === doc.templateId)
    
    console.log('Found original template:', originalTemplate)
    
    if (!originalTemplate) {
      console.error('Original template not found for document:', doc)
      alert('Original template not found. Cannot preview this document.')
      return
    }
    
    // Create a template object for preview using the original template structure
    const templateForPreview = {
      ...originalTemplate,
      content: doc.templateData,
      name: doc.name,
      category: doc.category,
      type: doc.type
    }
    
    console.log('Template for preview:', templateForPreview)
    setPreviewDocument(templateForPreview)
  }

  const fetchCareerData = async () => {
    try {
      setLoading(true)
      // Fetch CV templates from user's documents
      const documentsResponse = await apiService.get('/auth/profile')
      const user = documentsResponse.data.user || {}
      const userDocuments = user.documents || []
      
      // Filter documents by type
      const cvDocs = userDocuments.filter(doc => doc.type === 'CV' || doc.type === 'Resume')
      const coverLetterDocs = userDocuments.filter(doc => doc.type === 'Cover Letter')
      const portfolioDocs = userDocuments.filter(doc => doc.type === 'Portfolio')
      
      // Transform to template format
      const templates = [
        ...cvDocs.map((doc, index) => ({
          id: `cv-${index}`,
          name: doc.name || 'CV Template',
          category: 'Business'
        })),
        ...coverLetterDocs.map((doc, index) => ({
          id: `cover-${index}`,
          name: doc.name || 'Cover Letter Template',
          category: 'Business'
        })),
        ...portfolioDocs.map((doc, index) => ({
          id: `portfolio-${index}`,
          name: doc.name || 'Portfolio Template',
          category: 'Creative'
        }))
      ]
      
      setCvTemplates(templates)
      
      // Load documents from backend first, then localStorage as fallback
      let documentsToShow = userDocuments.map((doc, index) => ({
        id: doc.id || index + 1,
        name: doc.name || 'Document',
        type: doc.type || 'Document',
        category: doc.category || 'General',
        templateId: doc.templateId || doc.template_id,
        templateData: doc.templateData || doc.template_data,
        created: doc.created || (doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'),
        updated: doc.updated || (doc.updated_at ? new Date(doc.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'),
        status: doc.status || 'Complete'
      }))
      
      // If no documents from backend, try localStorage
      if (documentsToShow.length === 0) {
        const localDocs = JSON.parse(localStorage.getItem('myDocuments') || '[]')
        documentsToShow = localDocs
      }
      
      setMyDocuments(documentsToShow)
    } catch (error) {
      console.error('Error fetching career data:', error)
      // Try localStorage as fallback
      const localDocs = JSON.parse(localStorage.getItem('myDocuments') || '[]')
      setCvTemplates([])
      setMyDocuments(localDocs)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: screenSize.isDesktop 
          ? '24px 32px 24px 32px' 
          : screenSize.isTablet
            ? '20px 20px 20px 20px'
            : '16px 12px 90px 12px'
      }}>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: screenSize.isMobile ? '2px' : '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: screenSize.isMobile ? '6px 8px' : '8px 12px',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: screenSize.isMobile ? '12px' : '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minHeight: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {screenSize.isMobile ? (
                tab.id === 'my-documents' ? 'Documents' : tab.name
              ) : (
                tab.name
              )}
            </button>
          ))}
        </div>



        {/* CV Builder Tab */}
        {activeTab === 'cv-builder' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: getGridGap(screenSize) 
          }}>
            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 12px 0'
              }}>
                Create Your CV
              </h3>
              {selectedTemplate && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Mini preview swatch */}
                    <div style={{ width: '36px', height: '48px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb', position: 'relative' }}>
                      <div style={{ height: '6px', backgroundColor: selectedTemplate.accent, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '6px', right: '6px', height: '4px', backgroundColor: '#e5e7eb' }} />
                      <div style={{ position: 'absolute', top: '20px', left: '6px', width: '60%', height: '4px', backgroundColor: '#e5e7eb' }} />
                      <div style={{ position: 'absolute', top: '28px', left: '6px', right: '6px', height: '3px', backgroundColor: '#e5e7eb' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{selectedTemplate.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedTemplate.category} • {selectedTemplate.layout.replace('-', ' ')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPreviewTemplate(selectedTemplate)}
                      style={{
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => startEditingTemplate(selectedTemplate)}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Start editing
                    </button>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <Plus size={16} />
                  Create New
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <Upload size={16} />
                  Upload CV
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
              gap: getGridGap(screenSize)
            }}>
            {[
              { title: 'CV Tips', desc: 'Writing guidance', icon: FileText },
              { title: 'Cover Letters', desc: 'Letter templates', icon: Edit3 },
              { title: 'Portfolio', desc: 'Showcase work', icon: Eye }
            ].map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.title} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#16a34a'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#f0f0f0'
                  e.target.style.transform = 'translateY(0)'
                }}
                >
                  <Icon size={20} color="#16a34a" />
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {tool.title}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
              )
            })}
            </div>

            {/* Template Editor Interface */}
            {editingTemplate && templateData && (
          <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                marginTop: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                    Editing: {editingTemplate.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={saveTemplateData}
                      disabled={saving}
                      style={{ 
                        backgroundColor: saving ? '#94a3b8' : '#16a34a', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        padding: '10px 16px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save CV'}
                    </button>
                    <button 
                      onClick={() => { setEditingTemplate(null); setTemplateData(null); }}
                      style={{ 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                  borderRadius: '8px',
                        padding: '10px 16px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 400px', gap: '24px' }}>
                  {/* Live Preview */}
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Live Preview</h4>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', maxHeight: '600px', overflowY: 'auto' }}>
                      <MiniResumePreview template={{...editingTemplate, content: templateData}} fullHeight={true} />
                    </div>
                  </div>

                  {/* Editor Form */}
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Edit Content</h4>
                    
                    {!userProfile && (
                      <div style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
                        <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                          ⚠️ No user profile data found. Please complete your profile first to auto-populate this template.
                        </p>
                      </div>
                    )}
                    
                    {/* Basic Info Editor */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Full Name</label>
                      <input
                        type="text"
                        value={templateData.name || ''}
                        onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Job Title</label>
                      <input
                        type="text"
                        value={templateData.title || ''}
                        onChange={(e) => setTemplateData({...templateData, title: e.target.value})}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>

                    {/* Profile Picture Section */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Profile Picture</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {templateData.profilePhoto ? (
                          <img 
                            src={templateData.profilePhoto} 
                            alt="Profile" 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              borderRadius: '50%', 
                              objectFit: 'cover',
                              border: '2px solid #e5e7eb'
                            }} 
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              borderRadius: '50%', 
                              backgroundColor: '#f3f4f6',
                              border: '2px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '500'
                            }}
                          >
                            No Image
                </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            style={{ display: 'none' }}
                            id="profile-image-upload"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            style={{
                              display: 'inline-block',
                    backgroundColor: '#16a34a',
                    color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              border: 'none'
                            }}
                          >
                            {templateData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                          </label>
                          {userProfile?.profile_image && !templateData.profilePhoto && (
                            <button
                              onClick={() => {
                                const fullUrl = resolveAssetUrl(userProfile.profile_image)
                                setTemplateData({...templateData, profilePhoto: fullUrl})
                              }}
                              style={{
                                marginLeft: '8px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: 'none'
                              }}
                            >
                              Use Profile Photo
                            </button>
                          )}
                          {templateData.profilePhoto && (
                            <button
                              onClick={() => setTemplateData({...templateData, profilePhoto: ''})}
                              style={{
                                marginLeft: '8px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: 'none'
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Profile Summary</label>
                      <textarea
                        value={templateData.profile || ''}
                        onChange={(e) => setTemplateData({...templateData, profile: e.target.value})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Skills (one per line)</label>
                      <textarea
                        value={Array.isArray(templateData.skills) ? templateData.skills.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, skills: e.target.value.split('\n').filter(s => s.trim())})}
                        rows={4}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Contact Info (one per line)</label>
                      <textarea
                        value={Array.isArray(templateData.contact) ? templateData.contact.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, contact: e.target.value.split('\n').filter(c => c.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Languages (one per line)</label>
                      <textarea
                        value={Array.isArray(templateData.languages) ? templateData.languages.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, languages: e.target.value.split('\n').filter(l => l.trim())})}
                        rows={2}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    {/* Experience Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Experience</h5>
                      {Array.isArray(templateData.experience) && templateData.experience.map((exp, expIndex) => (
                        <div key={expIndex} style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Job Title</label>
                              <input
                                type="text"
                                value={exp.role || ''}
                                onChange={(e) => {
                                  const newExp = [...templateData.experience]
                                  newExp[expIndex] = {...newExp[expIndex], role: e.target.value}
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Company</label>
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => {
                                  const newExp = [...templateData.experience]
                                  newExp[expIndex] = {...newExp[expIndex], company: e.target.value}
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Dates</label>
                              <input
                                type="text"
                                value={exp.dates || ''}
                                onChange={(e) => {
                                  const newExp = [...templateData.experience]
                                  newExp[expIndex] = {...newExp[expIndex], dates: e.target.value}
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'end' }}>
                              <button
                                onClick={() => {
                                  const newExp = templateData.experience.filter((_, i) => i !== expIndex)
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Responsibilities (one per line)</label>
                            <textarea
                              value={Array.isArray(exp.bullets) ? exp.bullets.join('\n') : ''}
                              onChange={(e) => {
                                const newExp = [...templateData.experience]
                                newExp[expIndex] = {...newExp[expIndex], bullets: e.target.value.split('\n').filter(b => b.trim())}
                                setTemplateData({...templateData, experience: newExp})
                              }}
                              rows={3}
                              style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newExp = [...(templateData.experience || []), { role: '', company: '', dates: '', bullets: [] }]
                          setTemplateData({...templateData, experience: newExp})
                        }}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Experience
                      </button>
                    </div>

                    {/* Education Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Education</h5>
                      {Array.isArray(templateData.education) && templateData.education.map((edu, eduIndex) => (
                        <div key={eduIndex} style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Degree</label>
                              <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={(e) => {
                                  const newEdu = [...templateData.education]
                                  newEdu[eduIndex] = {...newEdu[eduIndex], degree: e.target.value}
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>School</label>
                              <input
                                type="text"
                                value={edu.school || ''}
                                onChange={(e) => {
                                  const newEdu = [...templateData.education]
                                  newEdu[eduIndex] = {...newEdu[eduIndex], school: e.target.value}
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Dates</label>
                              <input
                                type="text"
                                value={edu.dates || ''}
                                onChange={(e) => {
                                  const newEdu = [...templateData.education]
                                  newEdu[eduIndex] = {...newEdu[eduIndex], dates: e.target.value}
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  const newEdu = templateData.education.filter((_, i) => i !== eduIndex)
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newEdu = [...(templateData.education || []), { degree: '', school: '', dates: '' }]
                          setTemplateData({...templateData, education: newEdu})
                        }}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Education
                      </button>
                    </div>

                    {/* Projects Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Projects</h5>
                      <textarea
                        value={Array.isArray(templateData.projects) ? templateData.projects.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, projects: e.target.value.split('\n').filter(p => p.trim())})}
                        rows={4}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter projects, one per line..."
                      />
                    </div>

                    {/* Certifications Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Certifications</h5>
                      <textarea
                        value={Array.isArray(templateData.certifications) ? templateData.certifications.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, certifications: e.target.value.split('\n').filter(c => c.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter certifications, one per line..."
                      />
                    </div>

                    {/* Awards Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Awards</h5>
                      <textarea
                        value={Array.isArray(templateData.awards) ? templateData.awards.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, awards: e.target.value.split('\n').filter(a => a.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter awards, one per line..."
                      />
                    </div>

                    {/* Publications Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Publications</h5>
                      <textarea
                        value={Array.isArray(templateData.publications) ? templateData.publications.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, publications: e.target.value.split('\n').filter(p => p.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter publications, one per line..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'resume', label: 'Resumes' },
                { id: 'cv', label: 'CVs' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTemplateFilter(f.id)}
                  style={{
                    backgroundColor: templateFilter === f.id ? '#16a34a' : 'white',
                    color: templateFilter === f.id ? 'white' : '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >{f.label}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`, gap: getGridGap(screenSize) }}>
              {professionalTemplates
                .filter((t) => templateFilter === 'all' ? true : t.type === templateFilter)
                .map((template) => (
                <div key={template.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', transition: 'all 0.2s ease-in-out' }}>
                  <MiniResumePreview template={template} dense />
                  {/* Meta and actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{template.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{template.category} • {template.layout.replace('-', ' ')} • {template.type.toUpperCase()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => { setSelectedTemplate(template); setActiveTab('cv-builder') }}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                      >Use</button>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        style={{ backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer' }}
                      >
                    <Eye size={12} />
                  </button>
                    </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* My Documents Tab */}
        {activeTab === 'my-documents' && (
          <div>
            {myDocuments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <FileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  No Documents Yet
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 20px 0'
                }}>
                  Create and save your first CV or resume to see it here
                </p>
                <button
                  onClick={() => setActiveTab('templates')}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Browse Templates
                </button>
              </div>
            ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
            gap: getGridGap(screenSize)
          }}>
            {myDocuments.map((doc) => (
              <div key={doc.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#16a34a'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#f0f0f0'
                e.target.style.transform = 'translateY(0)'
              }}
              >
                <FileText size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 4px 0'
                  }}>
                    {doc.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {doc.type}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {doc.updated}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: doc.status === 'Complete' ? '#16a34a' : '#f59e0b',
                      backgroundColor: doc.status === 'Complete' ? '#f0fdf4' : '#fef3c7',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => previewSavedDocument(doc)}
                    style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8fafc'
                      e.target.style.borderColor = '#16a34a'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                    title="Preview Document"
                  >
                    <Eye size={12} />
                  </button>
                  <button 
                    onClick={() => downloadDocument(doc)}
                    style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8fafc'
                      e.target.style.borderColor = '#16a34a'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                    title="Download Document"
                  >
                    <Download size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        )}
      </div>
      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: screenSize.isMobile ? '92%' : '90%', maxWidth: '1000px', maxHeight: '95vh', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{previewTemplate.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{previewTemplate.category} • {previewTemplate.layout.replace('-', ' ')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { startEditingTemplate(previewTemplate); setPreviewTemplate(null) }} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Use template</button>
                <button onClick={() => setPreviewTemplate(null)} style={{ backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Close</button>
              </div>
            </div>
            <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white' }}>
                <MiniResumePreview template={previewTemplate} fullHeight={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Document Preview Modal */}
      {previewDocument && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: screenSize.isMobile ? '92%' : '90%', maxWidth: '1000px', maxHeight: '95vh', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{previewDocument.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{previewDocument.category} • {previewDocument.type}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadDocument({ 
                    name: previewDocument.name, 
                    templateData: previewDocument.content,
                    templateId: previewDocument.id
                  })}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => setPreviewDocument(null)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <X size={14} />
                  Close
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <MiniResumePreview 
                template={previewDocument} 
                fullHeight={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CareerTools