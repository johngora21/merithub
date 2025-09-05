import React, { useEffect, useState } from 'react'
import { ArrowLeft, Users, MapPin, Mail, Phone, Calendar, Download, Search, Filter, Check, X, MessageSquare } from 'lucide-react'
import { apiService } from '../../lib/api-service'

// Helper function to determine education level hierarchy
const getEducationLevel = (level) => {
  if (!level) return 0;
  
  const levelLower = level.toLowerCase();
  
  // PhD/Doctorate level
  if (levelLower.includes('phd') || levelLower.includes('doctorate') || levelLower.includes('doctor')) return 7;
  
  // Master's level
  if (levelLower.includes('master') || levelLower.includes('ms') || levelLower.includes('ma') || 
      levelLower.includes('mba') || levelLower.includes('mfa') || levelLower.includes('m.ed')) return 6;
  
  // Bachelor's level
  if (levelLower.includes('bachelor') || levelLower.includes('bs') || levelLower.includes('ba') || 
      levelLower.includes('bsc') || levelLower.includes('b.eng') || levelLower.includes('b.com')) return 5;
  
  // Associate's level
  if (levelLower.includes('associate') || levelLower.includes('aa') || levelLower.includes('as')) return 4;
  
  // Diploma level
  if (levelLower.includes('diploma') || levelLower.includes('certificate')) return 3;
  
  // High School level
  if (levelLower.includes('high school') || levelLower.includes('secondary') || 
      levelLower.includes('hsc') || levelLower.includes('a level')) return 2;
  
  // Ordinary Level
  if (levelLower.includes('ordinary level') || levelLower.includes('o level')) return 1.5;
  
  // Other/Unknown
  return 1;
};

// Helper function to get highest education level for display
const getHighestEducation = (education) => {
  if (!Array.isArray(education) || education.length === 0) return 'Not specified';
  
  const highestEducation = education.reduce((highest, current) => {
    const currentLevel = getEducationLevel(current.level || '');
    const highestLevel = getEducationLevel(highest.level || '');
    return currentLevel > highestLevel ? current : highest;
  }, education[0]);
  
  // Return the actual education level from database
  return highestEducation.level || 'Not specified';
};

// Helper function to get institution name for highest education
const getHighestEducationInstitution = (education) => {
  if (!Array.isArray(education) || education.length === 0) return 'Not specified';
  
  const highestEducation = education.reduce((highest, current) => {
    const currentLevel = getEducationLevel(current.level || '');
    const highestLevel = getEducationLevel(highest.level || '');
    return currentLevel > highestLevel ? current : highest;
  }, education[0]);
  
  // Return the institution name from database
  return highestEducation.institution || highestEducation.school || highestEducation.university || 'Not specified';
};

const ApplicantsList = ({ selectedItem, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showFilters, setShowFilters] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [contactType, setContactType] = useState('email')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')

  const [applicantsData, setApplicantsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusOptions = ['All Status', 'Under Review', 'Shortlisted', 'Rejected', 'Hired', 'Withdrawn']

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review':
        return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }
      case 'Shortlisted':
        return { backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#93c5fd' }
      case 'Rejected':
        return { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }
      case 'Hired':
        return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#86efac' }
      case 'Withdrawn':
        return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }
    }
  }

  const filteredApplicants = applicantsData.filter(applicant => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        applicant.name.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query) ||
        applicant.location.toLowerCase().includes(query) ||
        applicant.skills.some(skill => skill.toLowerCase().includes(query))
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter && statusFilter !== 'All Status' && applicant.status !== statusFilter) {
      return false
    }

    return true
  })

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await apiService.put(`/admin/applications/${applicationId}/status`, { status: newStatus.toLowerCase().replace(' ', '-') })
      setApplicantsData(prev => prev.map(a => a.applicationId === applicationId ? { ...a, status: newStatus } : a))
    } catch (e) {
      alert('Failed to update status')
      console.error(e)
    }
  }
  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setLoading(true)
        setError('')
        const type = selectedItem.__type || 'jobs'
        const normalized = type === 'jobs' ? 'job' : (type === 'tenders' ? 'tender' : 'opportunity')
        const resp = await apiService.get(`/admin/applications/applicants?type=${normalized}&id=${selectedItem.id}`)
        const payload = resp?.data || resp || {}
        setApplicantsData(Array.isArray(payload.applicants) ? payload.applicants : [])
      } catch (e) {
        console.error('Failed to load applicants', e)
        setError(e?.message || 'Failed to load applicants')
      } finally {
        setLoading(false)
      }
    }
    loadApplicants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.id])

  const handleContact = (applicant) => {
    setSelectedApplicant(applicant)
    setShowContactModal(true)
    setContactSubject(`Regarding your application for ${selectedItem.title}`)
    setContactMessage(`Dear ${applicant.name},\n\nThank you for your interest in the ${selectedItem.title} position at ${selectedItem.company}.\n\n`)
  }

  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant)
    setShowProfileModal(true)
  }

  const handleSendMessage = () => {
    // In a real app, this would send the email/SMS
    console.log('Sending message:', {
      to: selectedApplicant.email,
      type: contactType,
      subject: contactSubject,
      message: contactMessage
    })
    alert(`Message sent to ${selectedApplicant.name} via ${contactType}`)
    setShowContactModal(false)
    setSelectedApplicant(null)
    setContactMessage('')
    setContactSubject('')
  }

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <ArrowLeft size={20} color="#64748b" />
            </button>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 4px 0'
              }}>
                Applicants for {selectedItem.title}
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                margin: 0
              }}>
                {selectedItem.company} • {filteredApplicants.length} applicants
              </p>
            </div>
          </div>
          <button style={{
            backgroundColor: '#ea580c',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Download size={16} />
            Export List
          </button>
        </div>

        {/* Job Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div>
            <label style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
              marginBottom: '4px',
              display: 'block'
            }}>
              Position
            </label>
            <p style={{
              fontSize: '14px',
              color: '#0f172a',
              margin: 0,
              fontWeight: '600'
            }}>
              {selectedItem.title}
            </p>
          </div>
          <div>
            <label style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
              marginBottom: '4px',
              display: 'block'
            }}>
              Company
            </label>
            <p style={{
              fontSize: '14px',
              color: '#0f172a',
              margin: 0,
              fontWeight: '600'
            }}>
              {selectedItem.company}
            </p>
          </div>
          <div>
            <label style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
              marginBottom: '4px',
              display: 'block'
            }}>
              Location
            </label>
            <p style={{
              fontSize: '14px',
              color: '#0f172a',
              margin: 0,
              fontWeight: '600'
            }}>
              {selectedItem.location}
            </p>
          </div>
          <div>
            <label style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
              marginBottom: '4px',
              display: 'block'
            }}>
              Posted
            </label>
            <p style={{
              fontSize: '14px',
              color: '#0f172a',
              margin: 0,
              fontWeight: '600'
            }}>
              {selectedItem.postedTime}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{
            flex: 1,
            minWidth: '300px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}>
              <Search size={16} color="#64748b" />
            </div>
            <input
              type="text"
              placeholder="Search applicants by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 16px 12px 40px',
                fontSize: '14px',
                color: '#1a1a1a',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '160px'
            }}>
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applicants List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0f172a',
          margin: '0 0 20px 0'
        }}>
          Applicants ({filteredApplicants.length})
        </h2>

        {filteredApplicants.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b'
          }}>
            <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>No applicants found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {filteredApplicants.map((applicant) => (
              <div key={applicant.id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none'
                e.target.style.transform = 'translateY(0)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <img
                      src={applicant.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'}
                      alt={applicant.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '24px',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 4px 0'
                      }}>
                        {applicant.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={14} />
                          {applicant.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} />
                          {applicant.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          Applied {applicant.appliedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid',
                      ...getStatusColor(applicant.status)
                    }}>
                      {applicant.status}
                    </span>
                    <div style={{
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: '2px'
                      }}>
                        Profile
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {applicant.profileCompletion}%
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ flex: 1 }}>
                    {/* Experience and Job Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Highest Education:</span>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                          {getHighestEducation(applicant.education)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {getHighestEducationInstitution(applicant.education)}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Current Role:</span>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{applicant.currentJobTitle}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Industry:</span>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{applicant.industry}</div>
                      </div>
                    </div>

                    {/* Bio */}
                    {applicant.bio && (
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Bio:</span>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#0f172a', 
                          marginTop: '4px',
                          lineHeight: '1.4',
                          maxHeight: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {applicant.bio}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Skills:</span>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {applicant.skills.slice(0, 6).map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Unknown'}
                          </span>
                        ))}
                        {applicant.skills.length > 6 && (
                          <span style={{
                            color: '#64748b',
                            fontSize: '12px',
                            padding: '4px 8px'
                          }}>
                            +{applicant.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <button 
                      onClick={() => handleViewProfile(applicant)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleContact(applicant)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                      <MessageSquare size={12} />
                      Contact
                    </button>
                    {applicant.status === 'Under Review' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(applicant.id, 'Shortlisted')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                          <Check size={12} />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(applicant.id, 'Rejected')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                          <X size={12} />
                          Reject
                        </button>
                      </>
                    )}
                    {applicant.status === 'Shortlisted' && (
                      <button 
                        onClick={() => handleStatusChange(applicant.id, 'Hired')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#0891b2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                        <Check size={12} />
                        Hire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedApplicant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowContactModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '24px 24px 0 24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0
                }}>
                  Contact {selectedApplicant.name}
                </h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#64748b'
                  }}>
                  <X size={20} />
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <img
                  src={selectedApplicant.avatar}
                  alt={selectedApplicant.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 2px 0'
                  }}>
                    {selectedApplicant.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {selectedApplicant.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Contact Type Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0f172a',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Contact Method
                </label>
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => setContactType('email')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: contactType === 'email' ? '#ea580c' : 'white',
                      color: contactType === 'email' ? 'white' : '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                    <Mail size={16} />
                    Email
                  </button>
                  <button
                    onClick={() => setContactType('sms')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: contactType === 'sms' ? '#ea580c' : 'white',
                      color: contactType === 'sms' ? 'white' : '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                    <MessageSquare size={16} />
                    SMS
                  </button>
                </div>
              </div>

              {/* Subject (Email only) */}
              {contactType === 'email' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0f172a',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="Enter subject..."
                  />
                </div>
              )}

              {/* Message */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0f172a',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Message
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder={`Enter your ${contactType === 'email' ? 'email' : 'SMS'} message...`}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowContactModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ea580c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                  <MessageSquare size={16} />
                  Send {contactType === 'email' ? 'Email' : 'SMS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedApplicant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowProfileModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '24px 24px 0 24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0
                }}>
                  {selectedApplicant.name}'s Profile
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#64748b'
                  }}>
                  <X size={20} />
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <img
                  src={selectedApplicant.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'}
                  alt={selectedApplicant.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 4px 0'
                  }}>
                    {selectedApplicant.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: '0 0 4px 0'
                  }}>
                    {selectedApplicant.email}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {selectedApplicant.location} • {getHighestEducation(selectedApplicant.education)}
                  </p>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}>
                    Profile Completion
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    {selectedApplicant.profileCompletion}%
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Basic Information */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 12px 0'
                }}>
                  Basic Information
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Full Name</span>
                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                      {selectedApplicant.name || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Username</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      @{selectedApplicant.username || 'user'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Email</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.email || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Phone</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.phone || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Employment Status</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.employmentStatus || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Industry</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.industry || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Nationality</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.nationality || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Country of Residence</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.countryOfResidence || selectedApplicant.country || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Date of Birth</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.dateOfBirth || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Gender</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.gender || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Disability Status</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.disabilityStatus || 'No disability'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Languages</span>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>
                      {selectedApplicant.languages || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedApplicant.bio && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Bio
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#0f172a',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedApplicant.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Skills
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {selectedApplicant.skills.map((skill, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {selectedApplicant.education && selectedApplicant.education.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Education
                  </h4>
                  
                  {/* All Education Levels in Descending Order */}
                  {(() => {
                    const education = selectedApplicant.education || [];
                    if (education.length === 0) return null;
                    
                    // Sort education by level in descending order (highest first)
                    const sortedEducation = [...education].sort((a, b) => {
                      const levelA = getEducationLevel(a.level || '');
                      const levelB = getEducationLevel(b.level || '');
                      return levelB - levelA;
                    });
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {sortedEducation.map((edu, index) => (
                          <div key={index} style={{
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {/* Education Level Title */}
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#0f172a',
                              marginBottom: '8px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {edu.level || 'Not specified'}
                            </div>
                            
                            {/* Program/Major */}
                            {(edu.program || edu.major || edu.field || edu.subject) && (
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '4px'
                              }}>
                                {edu.program || edu.major || edu.field || edu.subject}
                              </div>
                            )}
                            
                            {/* Institution and Location */}
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '4px'
                            }}>
                              {edu.institution || edu.school || edu.university || 'Not specified'}
                              {(edu.location || edu.region) && (
                                <span style={{ color: '#6b7280', fontWeight: '400' }}>
                                  {' • '}{edu.location || edu.region}
                                </span>
                              )}
                            </div>
                            
                            {/* Year Range */}
                            {(edu.year || edu.graduation_year || edu.end_year || edu.start_year) && (
                              <div style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                marginBottom: '4px'
                              }}>
                                {edu.start_year || edu.year || 'N/A'}-{edu.end_year || edu.graduation_year || edu.year || 'N/A'}
                              </div>
                            )}
                            
                            {/* GPA/Grade */}
                            {(edu.gpa || edu.grade) && (
                              <div style={{
                                fontSize: '13px',
                                color: '#059669',
                                fontWeight: '500'
                              }}>
                                GPA: {edu.gpa || edu.grade}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Work Experience */}
              {selectedApplicant.workExperience && selectedApplicant.workExperience.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Work Experience
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {selectedApplicant.workExperience.map((exp, index) => (
                      <div key={index} style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0f172a',
                          marginBottom: '4px'
                        }}>
                          {exp.title || exp.position || 'Work Experience'}
                        </div>
                        {exp.company && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                            {exp.company}
                          </div>
                        )}
                        {exp.industry && (
                          <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '2px', fontWeight: '500' }}>
                            Industry: {exp.industry}
                          </div>
                        )}
                        {exp.duration && (
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {exp.duration}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApplicant.coverLetter && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Cover Letter
                  </h4>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#0f172a',
                      lineHeight: '1.6',
                      margin: 0,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* User Documents */}
              {selectedApplicant.userDocuments && selectedApplicant.userDocuments.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Documents
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedApplicant.userDocuments.map((doc, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#0f172a',
                            marginBottom: '4px'
                          }}>
                            {doc.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b'
                          }}>
                            {doc.type} • {doc.size}
                          </div>
                        </div>
                        {doc.url && (
                          <a
                            href={`/api/admin/download/${selectedApplicant.id}/${doc.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {selectedApplicant.certificates && selectedApplicant.certificates.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Certificates
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {selectedApplicant.certificates.map((cert, index) => (
                      <div key={index} style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ flex: 1 }}>
                          {/* Certificate Name */}
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#0f172a',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {cert.name || cert.title || 'Certificate'}
                          </div>
                          
                          {/* Issued by */}
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '4px'
                          }}>
                            Issued by: {cert.issuer || cert.organization || 'Not specified'}
                          </div>
                          
                          {/* Issue and Expiry Dates */}
                          <div style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            display: 'flex',
                            gap: '12px'
                          }}>
                            {cert.issueDate && <span>Issued: {cert.issueDate}</span>}
                            {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                          </div>
                          
                          {/* File Type and Size */}
                          {(cert.type || cert.size) && (
                            <div style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              marginTop: '4px'
                            }}>
                              {cert.type && `${cert.type}`}
                              {cert.type && cert.size && ' • '}
                              {cert.size && `${cert.size}`}
                            </div>
                          )}
                        </div>
                        
                        {/* Download Button */}
                        {cert.url && (
                          <div style={{ marginLeft: '16px' }}>
                            <a
                              href={`/api/admin/download/${selectedApplicant.id}/${cert.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '8px 16px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                            >
                              <Download size={14} />
                              Download
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Documents */}
              {selectedApplicant.applicationDocuments && selectedApplicant.applicationDocuments.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Application Documents
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedApplicant.applicationDocuments.map((doc, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#0f172a',
                            marginBottom: '4px'
                          }}>
                            {doc.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b'
                          }}>
                            {doc.type} • {doc.size}
                          </div>
                        </div>
                        {doc.url && (
                          <a
                            href={`/api/admin/download/${selectedApplicant.id}/${doc.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Links */}
              {selectedApplicant.profileLinks && selectedApplicant.profileLinks.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Profile Links
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedApplicant.profileLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '14px',
                          color: '#3b82f6',
                          textDecoration: 'none',
                          padding: '8px 12px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {link.name}
                      </a>
                    ))}
                    {selectedApplicant.linkedinUrl && (
                      <a
                        href={selectedApplicant.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '14px',
                          color: '#3b82f6',
                          textDecoration: 'none',
                          padding: '8px 12px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantsList
