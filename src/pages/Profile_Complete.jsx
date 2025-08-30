import React, { useState } from 'react'
import { User, Edit3, Upload, Download, Eye, MapPin, Calendar, Mail, Phone, Globe, Briefcase, GraduationCap, Award, FileText, Save, X } from 'lucide-react'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [showEditModal, setShowEditModal] = useState(false)

  const tabs = [
    { id: 'personal', name: 'Personal' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
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
    joinDate: 'Jan 2023'
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
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California',
      location: 'Berkeley, CA',
      period: '2016 - 2020',
      gpa: '3.8/4.0'
    },
    {
      id: 2,
      degree: 'Full Stack Web Development Bootcamp',
      school: 'Tech Academy',
      location: 'Online',
      period: '2020',
      certificate: true
    }
  ])

  const documents = [
    {
      id: 1,
      name: 'Resume - Software Engineer',
      type: 'CV',
      size: '245 KB',
      updated: 'Jan 15, 2024',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Cover Letter Template',
      type: 'Cover Letter',
      size: '128 KB',
      updated: 'Jan 10, 2024',
      status: 'Draft'
    },
    {
      id: 3,
      name: 'Portfolio Certificate',
      type: 'Certificate',
      size: '892 KB',
      updated: 'Dec 28, 2023',
      status: 'Verified'
    }
  ]

  const [editData, setEditData] = useState({
    personal: profileData,
    experience: experience,
    education: education
  })

  const openEditModal = () => {
    setEditData({
      personal: {...profileData},
      experience: [...experience],
      education: [...education]
    })
    setShowEditModal(true)
  }

  const saveChanges = () => {
    setProfileData({...editData.personal})
    setExperience([...editData.experience])
    setEducation([...editData.education])
    setShowEditModal(false)
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '16px 12px 90px 12px' }}>
        
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
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
              top: '16px',
              right: '16px',
              backgroundColor: 'white',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '40px',
                backgroundColor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '600',
                color: 'white'
              }}>
                U
              </div>
              <button style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: 'white',
                border: '2px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Upload size={12} color="#64748b" />
              </button>
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 4px 0'
              }}>
                {profileData.name}
              </h1>
              
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 8px 0'
              }}>
                @{profileData.username}
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12px',
                color: '#64748b',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  {profileData.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  Joined {profileData.joinDate}
                </div>
              </div>
            </div>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: '#374151',
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            {profileData.bio}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} />
              {profileData.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} />
              {profileData.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={12} />
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
              margin: '0 0 16px 0'
            }}>
              Personal Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Full Name
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '8px 0'
                  }}>
                    {profileData.name}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Username
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '8px 0'
                  }}>
                    @{profileData.username}
                  </p>
                </div>
              </div>
              
              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  Bio
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                  padding: '8px 0',
                  lineHeight: '1.5'
                }}>
                  {profileData.bio}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Email
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '8px 0'
                  }}>
                    {profileData.email}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Phone
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '8px 0'
                  }}>
                    {profileData.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Briefcase size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
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

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {education.map((edu) => (
              <div key={edu.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <GraduationCap size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {edu.degree}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {edu.school} • {edu.location}
                    </p>
                  </div>
                  {edu.certificate && (
                    <span style={{
                      fontSize: '11px',
                      backgroundColor: '#dbeafe',
                      color: '#3b82f6',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontWeight: '500'
                    }}>
                      Certificate
                    </span>
                  )}
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

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
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
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                    <span>Updated {doc.updated}</span>
                    <span style={{
                      fontSize: '11px',
                      backgroundColor: doc.status === 'Active' ? '#f0fdf4' : 
                                     doc.status === 'Verified' ? '#dbeafe' : '#fef3c7',
                      color: doc.status === 'Active' ? '#16a34a' : 
                             doc.status === 'Verified' ? '#3b82f6' : '#f59e0b',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    cursor: 'pointer'
                  }}>
                    <Eye size={12} />
                  </button>
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    cursor: 'pointer'
                  }}>
                    <Download size={12} />
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
              padding: '24px',
              width: '95%',
              maxWidth: '700px',
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                </div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                        degree: '',
                        school: '',
                        location: '',
                        period: '',
                        gpa: '',
                        certificate: false
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
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...editData.education]
                          newEdu[index] = {...edu, degree: e.target.value}
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
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          School
                        </label>
                        <input
                          type="text"
                          value={edu.school}
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
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={edu.certificate}
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, certificate: e.target.checked}
                            setEditData({...editData, education: newEdu})
                          }}
                        />
                        Certificate/Diploma
                      </label>
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
              
              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
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
