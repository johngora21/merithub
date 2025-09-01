import React, { useState } from 'react'
import { ArrowLeft, Users, MapPin, Mail, Phone, Calendar, Download, Search, Filter, Check, X, MessageSquare } from 'lucide-react'

const ApplicantsList = ({ selectedItem, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showFilters, setShowFilters] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [contactType, setContactType] = useState('email')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')

  // Sample applicants data
  const applicantsData = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+254 700 123 456',
      location: 'Nairobi, Kenya',
      appliedDate: '2024-01-15',
      status: 'Under Review',
      experience: '5+ years',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      profileCompletion: 95,
      avatar: 'https://via.placeholder.com/40x40/3b82f6/ffffff?text=JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+254 700 234 567',
      location: 'Mombasa, Kenya',
      appliedDate: '2024-01-14',
      status: 'Shortlisted',
      experience: '3-5 years',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      profileCompletion: 87,
      avatar: 'https://via.placeholder.com/40x40/16a34a/ffffff?text=SJ'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+254 700 345 678',
      location: 'Kisumu, Kenya',
      appliedDate: '2024-01-13',
      status: 'Rejected',
      experience: '1-3 years',
      skills: ['JavaScript', 'React', 'CSS', 'HTML'],
      profileCompletion: 72,
      avatar: 'https://via.placeholder.com/40x40/8b5cf6/ffffff?text=MC'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+254 700 456 789',
      location: 'Eldoret, Kenya',
      appliedDate: '2024-01-12',
      status: 'Hired',
      experience: '7+ years',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes'],
      profileCompletion: 98,
      avatar: 'https://via.placeholder.com/40x40/ea580c/ffffff?text=ED'
    }
  ]

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

  const handleStatusChange = (applicantId, newStatus) => {
    // In a real app, this would update the database
    console.log(`Changing status of applicant ${applicantId} to ${newStatus}`)
    // For demo purposes, we'll just show an alert
    alert(`Status changed to ${newStatus}`)
  }

  const handleContact = (applicant) => {
    setSelectedApplicant(applicant)
    setShowContactModal(true)
    setContactSubject(`Regarding your application for ${selectedItem.title}`)
    setContactMessage(`Dear ${applicant.name},\n\nThank you for your interest in the ${selectedItem.title} position at ${selectedItem.company}.\n\n`)
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
                      src={applicant.avatar}
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
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '8px'
                    }}>
                      Experience: {applicant.experience}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {applicant.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                      {applicant.skills.length > 4 && (
                        <span style={{
                          color: '#64748b',
                          fontSize: '12px',
                          padding: '4px 8px'
                        }}>
                          +{applicant.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <button style={{
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
    </div>
  )
}

export default ApplicantsList
