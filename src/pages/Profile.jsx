import React, { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import { User, Edit3, Upload, Download, Eye, MapPin, Calendar, Mail, Phone, Globe, Briefcase, GraduationCap, Award, FileText, Save, X } from 'lucide-react'

const Profile = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('personal')
  const [showEditModal, setShowEditModal] = useState(false)

  const tabs = [
    { id: 'personal', name: 'Personal' },
    { id: 'education', name: 'Education' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'experience', name: 'Experience' },
    { id: 'documents', name: 'Documents' }
  ]

  const [profileData, setProfileData] = useState({
    name: 'User Name',
    username: 'username',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'www.portfolio.com',
    bio: 'Passionate software developer with 5 years of experience building scalable web applications.',
    joinDate: 'Jan 2023',
    jobTitle: 'Senior Software Engineer at TechCorp Inc.',
    industry: 'Technology',
    yearsExperience: '5-10 years',
    employmentStatus: 'Employed',
    linkedinProfile: 'linkedin.com/in/username',
    githubProfile: 'github.com/username',
    otherProfiles: 'behance.com/username'
  })

  const [experience, setExperience] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      period: 'Jan 2022 - Present',
      type: 'Full-time',
      description: 'Leading frontend development team, building scalable React applications.'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      period: 'Jun 2020 - Dec 2021',
      type: 'Full-time',
      description: 'Developed user interfaces for web applications using React and TypeScript.'
    }
  ])

  const [education, setEducation] = useState([
    {
      id: 1,
      level: 'Bachelor\'s Degree (4-year)',
      program: 'Computer Science',
      school: 'University of California',
      location: 'Berkeley, CA',
      period: '2016 - 2020',
      gpa: '3.8/4.0'
    },
    {
      id: 2,
      level: 'Professional Degree (JD, MD, etc.)',
      program: 'Full Stack Web Development Bootcamp',
      school: 'Tech Academy',
      location: 'Online',
      period: '2020'
    }
  ])

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: 'March 2023',
      expiryDate: 'March 2026',
      credentialId: 'AWS-SAA-123456',
      type: 'Professional Certification',
      certificateFile: null
    },
    {
      id: 2,
      name: 'Google Analytics Certified',
      issuer: 'Google',
      issueDate: 'January 2023',
      expiryDate: 'January 2024',
      credentialId: 'GA-789012',
      type: 'Industry Certification',
      certificateFile: null
    },
    {
      id: 3,
      name: 'React Developer Certificate',
      issuer: 'freeCodeCamp',
      issueDate: 'December 2022',
      expiryDate: null,
      credentialId: 'FCC-RDC-345678',
      type: 'Course Certificate',
      certificateFile: null
    }
  ])

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Software Engineer Resume',
      type: 'Resume/CV',
      category: 'Job Application Documents',
      file: null,
      size: '245 KB',
      updated: 'Jan 15, 2024',
      status: 'Active',
      description: 'Updated resume for software engineering positions'
    },
    {
      id: 2,
      name: 'Generic Cover Letter',
      type: 'Cover Letter Templates',
      category: 'Job Application Documents',
      file: null,
      size: '128 KB',
      updated: 'Jan 10, 2024',
      status: 'Draft',
      description: 'Template for tech job applications'
    },
    {
      id: 3,
      name: 'Bachelor Degree Certificate',
      type: 'Diplomas/Degrees',
      category: 'Academic Documents',
      file: null,
      size: '892 KB',
      updated: 'Dec 28, 2023',
      status: 'Verified',
      description: 'Computer Science degree from University of California'
    }
  ])

  const [editData, setEditData] = useState({
    personal: profileData,
    experience: experience,
    education: education,
    certificates: certificates,
    documents: documents
  })

  const openEditModal = () => {
    setEditData({
      personal: {...profileData},
      experience: [...experience],
      education: [...education],
      certificates: [...certificates],
      documents: [...documents]
    })
    setShowEditModal(true)
  }

  const saveChanges = () => {
    setProfileData({...editData.personal})
    setExperience([...editData.experience])
    setEducation([...editData.education])
    setCertificates([...editData.certificates])
    setDocuments([...editData.documents])
    setShowEditModal(false)
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: '16px 12px 90px 12px'
      }}>
        
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px 12px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          position: 'relative'
        }}>
          {/* Edit Button */}
          <button
            onClick={openEditModal}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'white',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              fontWeight: '500',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#16a34a'
              e.target.style.color = '#16a34a'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.color = '#64748b'
            }}
          >
            <Edit3 size={14} />
            Edit Profile
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px', 
            marginBottom: '10px' 
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '22px',
                backgroundColor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                U
              </div>
              <button style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '16px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Upload size={8} color="#64748b" />
              </button>
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 1px 0'
              }}>
                {profileData.name}
              </h1>
              
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 2px 0'
              }}>
                @{profileData.username}
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#64748b',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <MapPin size={10} />
                  {profileData.location}
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Calendar size={10} />
                  Joined {profileData.joinDate}
                </div>
              </div>
            </div>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: '#374151',
            margin: '0 0 6px 0',
            lineHeight: '1.4'
          }}>
            {profileData.bio}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Mail size={10} />
              {profileData.email}
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Phone size={10} />
              {profileData.phone}
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Globe size={10} />
              {profileData.website}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Personal Tab */}
        {activeTab === 'personal' && (
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
              margin: '0 0 8px 0'
            }}>
              Personal Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Full Name
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.name}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Username
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    @{profileData.username}
                  </p>
                </div>
              </div>
              
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                  Bio
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                  padding: '3px 0',
                  lineHeight: '1.3'
                }}>
                  {profileData.bio}
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Email
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.email}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Phone
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.phone}
                  </p>
                </div>
              </div>
              
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                  Current Position
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                  padding: '3px 0'
                }}>
                  {profileData.jobTitle}
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '6px' 
              }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Industry
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.industry}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Experience
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.yearsExperience}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Status
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.employmentStatus}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    LinkedIn
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.linkedinProfile}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    GitHub
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.githubProfile}
                  </p>
                </div>
              </div>
              
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                  Other Profiles
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                  padding: '3px 0'
                }}>
                  {profileData.otherProfiles}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {education.map((edu) => (
              <div key={edu.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <GraduationCap size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {edu.program}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: '#16a34a',
                      margin: '0 0 2px 0',
                      fontWeight: '500'
                    }}>
                      {edu.level}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {edu.school} • {edu.location}
                    </p>
                  </div>

                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  <span>{edu.period}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {certificates.map((cert) => (
              <div key={cert.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Award size={16} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 1px 0'
                    }}>
                      {cert.name}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Issued by {cert.issuer}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: (() => {
                      if (!cert.expiryDate) return '#f0fdf4' // No expiry = active
                      const today = new Date()
                      const expiry = new Date(cert.expiryDate)
                      return expiry > today ? '#f0fdf4' : '#fef2f2' // Active or expired
                    })(),
                    color: (() => {
                      if (!cert.expiryDate) return '#16a34a' // No expiry = active
                      const today = new Date()
                      const expiry = new Date(cert.expiryDate)
                      return expiry > today ? '#16a34a' : '#ef4444' // Active or expired
                    })(),
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    {(() => {
                      if (!cert.expiryDate) return 'Active'
                      const today = new Date()
                      const expiry = new Date(cert.expiryDate)
                      return expiry > today ? 'Active' : 'Expired'
                    })()}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '6px'
                }}>
                  <span>Issued: {cert.issueDate}</span>
                  {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                  {!cert.expiryDate && <span>No Expiration</span>}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    fontWeight: '500'
                  }}>
                    {cert.type}
                  </span>
                  <span>ID: {cert.credentialId}</span>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Eye size={10} />
                    View Certificate
                  </button>
                  
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Download size={10} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Briefcase size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    {exp.type}
                  </span>
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  {exp.period}
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: '#374151',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <FileText size={16} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 1px 0'
                    }}>
                      {doc.name}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: '#16a34a',
                      margin: '0 0 1px 0',
                      fontWeight: '500'
                    }}>
                      {doc.category}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {doc.type}
                    </p>
                  </div>
                </div>
                
                {doc.description && (
                  <p style={{
                    fontSize: '13px',
                    color: '#374151',
                    margin: '0 0 6px 0',
                    lineHeight: '1.3'
                  }}>
                    {doc.description}
                  </p>
                )}
                
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  <span>Updated {doc.updated}</span>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Eye size={10} />
                    View Document
                  </button>
                  
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Download size={10} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPREHENSIVE EDIT MODAL */}
        {showEditModal && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000
              }}
              onClick={() => setShowEditModal(false)}
            />
            
            {/* Modal */}
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: screenSize.isDesktop ? '32px' : '24px',
              width: screenSize.isMobile ? '95%' : '90%',
              maxWidth: screenSize.isDesktop ? '900px' : '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 1001,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  Edit Profile
                </h2>
                
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#64748b" />
                </button>
              </div>
              
              {/* Personal Information Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0'
                }}>
                  Personal Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.personal.name}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, name: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={editData.personal.username}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, username: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Bio
                    </label>
                    <textarea
                      value={editData.personal.bio}
                      onChange={(e) => setEditData({
                        ...editData,
                        personal: {...editData.personal, bio: e.target.value}
                      })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  
                  <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editData.personal.email}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, email: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editData.personal.phone}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, phone: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>
                  
                                     <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Location
                       </label>
                       <input
                         type="text"
                         value={editData.personal.location}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, location: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Website
                       </label>
                       <input
                         type="url"
                         value={editData.personal.website}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, website: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                       Current Position
                     </label>
                     <input
                       type="text"
                       value={editData.personal.jobTitle}
                       placeholder="e.g. Senior Software Engineer at Google"
                       onChange={(e) => setEditData({
                         ...editData,
                         personal: {...editData.personal, jobTitle: e.target.value}
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                   </div>
                   
                   <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Industry
                       </label>
                       <select
                         value={editData.personal.industry}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, industry: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="Technology">Technology</option>
                         <option value="Healthcare">Healthcare</option>
                         <option value="Finance">Finance</option>
                         <option value="Education">Education</option>
                         <option value="Manufacturing">Manufacturing</option>
                         <option value="Retail">Retail</option>
                         <option value="Construction">Construction</option>
                         <option value="Transportation">Transportation</option>
                         <option value="Energy">Energy</option>
                         <option value="Media & Entertainment">Media & Entertainment</option>
                         <option value="Agriculture">Agriculture</option>
                         <option value="Real Estate">Real Estate</option>
                         <option value="Consulting">Consulting</option>
                         <option value="Government">Government</option>
                         <option value="Non-Profit">Non-Profit</option>
                         <option value="Other">Other</option>
                       </select>
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Years of Experience
                       </label>
                       <select
                         value={editData.personal.yearsExperience}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, yearsExperience: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="0-1 years">0-1 years</option>
                         <option value="1-3 years">1-3 years</option>
                         <option value="3-5 years">3-5 years</option>
                         <option value="5-10 years">5-10 years</option>
                         <option value="10+ years">10+ years</option>
                       </select>
                     </div>
                   </div>
                   
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                       Employment Status
                     </label>
                     <select
                       value={editData.personal.employmentStatus}
                       onChange={(e) => setEditData({
                         ...editData,
                         personal: {...editData.personal, employmentStatus: e.target.value}
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                     >
                       <option value="Employed">Employed</option>
                       <option value="Unemployed">Unemployed</option>
                       <option value="Freelancer">Freelancer</option>
                       <option value="Student">Student</option>
                       <option value="Self-Employed">Self-Employed</option>
                       <option value="Retired">Retired</option>
                     </select>
                   </div>
                   
                   <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         LinkedIn Profile
                       </label>
                       <input
                         type="url"
                         value={editData.personal.linkedinProfile}
                         placeholder="e.g. linkedin.com/in/username"
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, linkedinProfile: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         GitHub Profile
                       </label>
                       <input
                         type="url"
                         value={editData.personal.githubProfile}
                         placeholder="e.g. github.com/username"
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, githubProfile: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                       Other Professional Profiles
                     </label>
                     <input
                       type="text"
                       value={editData.personal.otherProfiles}
                       placeholder="e.g. behance.com/username, dribbble.com/username"
                       onChange={(e) => setEditData({
                         ...editData,
                         personal: {...editData.personal, otherProfiles: e.target.value}
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                   </div>
                </div>
              </div>

                             {/* Education Section */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Education
                  </h3>
                  <button
                    onClick={() => setEditData({
                      ...editData,
                                             education: [...editData.education, {
                         id: Date.now(),
                         level: 'High School Diploma/Certificate',
                         program: '',
                         school: '',
                         location: '',
                         period: '',
                         gpa: ''
                       }]
                    })}
                    style={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Education
                  </button>
                </div>
                
                {editData.education.map((edu, index) => (
                  <div key={edu.id} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}>
                                         <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Education Level
                         </label>
                         <select
                           value={edu.level}
                           onChange={(e) => {
                             const newEdu = [...editData.education]
                             newEdu[index] = {...edu, level: e.target.value}
                             setEditData({...editData, education: newEdu})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="High School Diploma/Certificate">High School Diploma/Certificate</option>
                           <option value="Associate Degree (2-year)">Associate Degree (2-year)</option>
                           <option value="Bachelor's Degree (4-year)">Bachelor's Degree (4-year)</option>
                           <option value="Master's Degree">Master's Degree</option>
                           <option value="Doctoral Degree (PhD)">Doctoral Degree (PhD)</option>
                           <option value="Professional Degree (JD, MD, etc.)">Professional Degree (JD, MD, etc.)</option>
                         </select>
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Program/Major
                         </label>
                         <input
                           type="text"
                           value={edu.program}
                           placeholder="e.g. Computer Science, Business Administration"
                           onChange={(e) => {
                             const newEdu = [...editData.education]
                             newEdu[index] = {...edu, program: e.target.value}
                             setEditData({...editData, education: newEdu})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                    
                    <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                                                 }}>
                           Institution
                         </label>
                                                 <input
                           type="text"
                           value={edu.school}
                           placeholder="e.g. Harvard University, MIT, Stanford"
                           onChange={(e) => {
                             const newEdu = [...editData.education]
                             newEdu[index] = {...edu, school: e.target.value}
                             setEditData({...editData, education: newEdu})
                           }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, location: e.target.value}
                            setEditData({...editData, education: newEdu})
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>
                    
                    <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Period
                        </label>
                        <input
                          type="text"
                          value={edu.period}
                          placeholder="e.g. 2016 - 2020"
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, period: e.target.value}
                            setEditData({...editData, education: newEdu})
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          GPA (optional)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          placeholder="e.g. 3.8/4.0"
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, gpa: e.target.value}
                            setEditData({...editData, education: newEdu})
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>
                    
                    
                    
                    <button
                      onClick={() => setEditData({
                        ...editData,
                        education: editData.education.filter((_, i) => i !== index)
                      })}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                             </div>

               {/* Certificates Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Certificates
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       certificates: [...editData.certificates, {
                         id: Date.now(),
                         name: '',
                         issuer: '',
                         issueDate: '',
                         expiryDate: '',
                         credentialId: '',
                         type: 'Professional Certification',
                         certificateFile: null
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '6px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer'
                     }}
                   >
                     + Add Certificate
                   </button>
                 </div>
                 
                 {editData.certificates.map((cert, index) => (
                   <div key={cert.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Certificate Name
                       </label>
                       <input
                         type="text"
                         value={cert.name}
                         placeholder="e.g. AWS Certified Solutions Architect"
                         onChange={(e) => {
                           const newCerts = [...editData.certificates]
                           newCerts[index] = {...cert, name: e.target.value}
                           setEditData({...editData, certificates: newCerts})
                         }}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Issuing Organization
                         </label>
                         <input
                           type="text"
                           value={cert.issuer}
                           placeholder="e.g. Amazon Web Services, Google"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, issuer: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Credential ID
                         </label>
                         <input
                           type="text"
                           value={cert.credentialId}
                           placeholder="e.g. AWS-SAA-123456"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, credentialId: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                     
                     <div style={{ 
                       display: 'grid', 
                       gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr', 
                       gap: '12px', 
                       marginBottom: '12px' 
                     }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Issue Date
                         </label>
                         <input
                           type="text"
                           value={cert.issueDate}
                           placeholder="e.g. March 2023"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, issueDate: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Expiry Date (optional)
                         </label>
                         <input
                           type="text"
                           value={cert.expiryDate || ''}
                           placeholder="e.g. March 2026 or leave blank"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, expiryDate: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Type
                         </label>
                         <select
                           value={cert.type}
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, type: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Professional Certification">Professional Certification</option>
                           <option value="Industry Certification">Industry Certification</option>
                           <option value="Course Certificate">Course Certificate</option>
                           <option value="Training Certificate">Training Certificate</option>
                           <option value="License">License</option>
                           <option value="Achievement Badge">Achievement Badge</option>
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Certificate File
                       </label>
                       <button
                         type="button"
                         style={{
                           backgroundColor: 'white',
                           color: '#64748b',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           padding: '8px 12px',
                           fontSize: '14px',
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '6px'
                         }}
                       >
                         <Upload size={14} />
                         Choose File
                       </button>
                       <input
                         type="file"
                         accept=".pdf,.jpg,.jpeg,.png"
                         style={{ display: 'none' }}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         certificates: editData.certificates.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>

               {/* Experience Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Experience
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       experience: [...editData.experience, {
                         id: Date.now(),
                         title: '',
                         company: '',
                         location: '',
                         period: '',
                         type: 'Full-time',
                         description: ''
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '6px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer'
                     }}
                   >
                     + Add Experience
                   </button>
                 </div>
                 
                 {editData.experience.map((exp, index) => (
                   <div key={exp.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Job Title
                         </label>
                         <input
                           type="text"
                           value={exp.title}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, title: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Company
                         </label>
                         <input
                           type="text"
                           value={exp.company}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, company: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                     
                     <div style={{ 
                       display: 'grid', 
                       gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr', 
                       gap: '12px', 
                       marginBottom: '12px' 
                     }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Location
                         </label>
                         <input
                           type="text"
                           value={exp.location}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, location: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Period
                         </label>
                         <input
                           type="text"
                           value={exp.period}
                           placeholder="e.g. Jan 2022 - Present"
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, period: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Type
                         </label>
                         <select
                           value={exp.type}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, type: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Full-time">Full-time</option>
                           <option value="Part-time">Part-time</option>
                           <option value="Contract">Contract</option>
                           <option value="Internship">Internship</option>
                           <option value="Freelance">Freelance</option>
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Description
                       </label>
                       <textarea
                         value={exp.description}
                         onChange={(e) => {
                           const newExp = [...editData.experience]
                           newExp[index] = {...exp, description: e.target.value}
                           setEditData({...editData, experience: newExp})
                         }}
                         rows={2}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none',
                           resize: 'vertical'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         experience: editData.experience.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>

               {/* Documents Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Documents
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       documents: [...editData.documents, {
                         id: Date.now(),
                         name: '',
                         type: 'Resume/CV',
                         category: 'Job Application Documents',
                         file: null,
                         size: '',
                         updated: new Date().toLocaleDateString(),
                         status: 'Draft',
                         description: ''
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '6px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer'
                     }}
                   >
                     + Add Document
                   </button>
                 </div>
                 
                 {editData.documents.map((doc, index) => (
                   <div key={doc.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Document Name
                       </label>
                       <input
                         type="text"
                         value={doc.name}
                         placeholder="e.g. Software Engineer Resume"
                         onChange={(e) => {
                           const newDocs = [...editData.documents]
                           newDocs[index] = {...doc, name: e.target.value}
                           setEditData({...editData, documents: newDocs})
                         }}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Category
                         </label>
                         <select
                           value={doc.category}
                           onChange={(e) => {
                             const newDocs = [...editData.documents]
                             newDocs[index] = {...doc, category: e.target.value, type: 'Resume/CV'}
                             setEditData({...editData, documents: newDocs})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Job Application Documents">Job Application Documents</option>
                           <option value="Academic Documents">Academic Documents</option>
                           <option value="Professional Credentials">Professional Credentials</option>
                           <option value="International Documents">International Documents</option>
                           <option value="Specialized Documents">Specialized Documents</option>
                         </select>
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Document Type
                         </label>
                         <select
                           value={doc.type}
                           onChange={(e) => {
                             const newDocs = [...editData.documents]
                             newDocs[index] = {...doc, type: e.target.value}
                             setEditData({...editData, documents: newDocs})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           {/* Job Application Documents */}
                           {doc.category === 'Job Application Documents' && (
                             <>
                               <option value="Resume/CV">Resume/CV</option>
                               <option value="Cover Letter Templates">Cover Letter Templates</option>
                               <option value="Portfolio">Portfolio</option>
                               <option value="References List">References List</option>
                               <option value="Recommendation Letters">Recommendation Letters</option>
                             </>
                           )}
                           
                           {/* Academic Documents */}
                           {doc.category === 'Academic Documents' && (
                             <>
                               <option value="Transcripts">Transcripts</option>
                               <option value="Diplomas/Degrees">Diplomas/Degrees</option>
                               <option value="Academic Certificates">Academic Certificates</option>
                               <option value="Research Papers">Research Papers</option>
                             </>
                           )}
                           
                           {/* Professional Credentials */}
                           {doc.category === 'Professional Credentials' && (
                             <>
                               <option value="Licenses">Licenses</option>
                               <option value="Training Certificates">Training Certificates</option>
                               <option value="Skills Assessments">Skills Assessments</option>
                             </>
                           )}
                           
                           {/* International Documents */}
                           {doc.category === 'International Documents' && (
                             <>
                               <option value="Passport">Passport</option>
                               <option value="Visa Documents">Visa Documents</option>
                               <option value="Language Certificates">Language Certificates</option>
                               <option value="Background Checks">Background Checks</option>
                             </>
                           )}
                           
                           {/* Specialized Documents */}
                           {doc.category === 'Specialized Documents' && (
                             <>
                               <option value="Project Documentation">Project Documentation</option>
                               <option value="Publications">Publications</option>
                               <option value="Patents">Patents</option>
                               <option value="Awards & Recognition">Awards & Recognition</option>
                               <option value="Professional Membership">Professional Membership</option>
                             </>
                           )}
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Description
                       </label>
                       <textarea
                         value={doc.description}
                         placeholder="Brief description of the document"
                         onChange={(e) => {
                           const newDocs = [...editData.documents]
                           newDocs[index] = {...doc, description: e.target.value}
                           setEditData({...editData, documents: newDocs})
                         }}
                         rows={2}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none',
                           resize: 'vertical'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Upload File
                       </label>
                       <button
                         type="button"
                         style={{
                           backgroundColor: 'white',
                           color: '#64748b',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           padding: '8px 12px',
                           fontSize: '14px',
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '6px'
                         }}
                       >
                         <Upload size={14} />
                         Choose File
                       </button>
                       <input
                         type="file"
                         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                         style={{ display: 'none' }}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         documents: editData.documents.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>
               
               {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '6px',
                justifyContent: 'flex-end',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '20px'
              }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={16} />
                  Save All Changes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
