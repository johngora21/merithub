import { Bell, User, Bookmark, ArrowLeft, Plus, X, ChevronDown, Briefcase, FileText, GraduationCap, Upload, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Header = ({ setSidebarOpen, isDesktop, isSidebarRoute }) => {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    type: 'job',
    title: '',
    description: '',
    company: '',
    location: '',
    workType: '',
    salary: '',
    jobType: '',
    experience: '',
    industry: '',
    customIndustry: '',
    skills: '',
    benefits: '',
    deadline: '',
    value: '',
    organization: '',
    requirements: '',
    applicationUrl: '',
    contactEmail: '',
    documents: []
  })
  
  const handleNotificationsClick = () => {
    navigate('/notifications')
  }

  const handleBookmarksClick = () => {
    navigate('/bookmarks')
  }

  const handleBackClick = () => {
    navigate('/jobs') // Navigate back to main Jobs page
  }

  const handleCreateClick = () => {
    setShowCreateModal(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting:', formData)
    // Here you would normally send the data to your API
    setShowCreateModal(false)
    // Reset form
    setFormData({
      type: 'job',
      title: '',
      description: '',
      company: '',
      location: '',
      workType: '',
      salary: '',
      jobType: '',
      experience: '',
      industry: '',
      customIndustry: '',
      skills: '',
      benefits: '',
      deadline: '',
      value: '',
      organization: '',
      requirements: '',
      applicationUrl: '',
      contactEmail: '',
      documents: []
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...fileArray]
    }))
  }

  const removeDocument = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
  }

  const typeOptions = [
    { value: 'job', label: 'Job', icon: Briefcase, color: '#16a34a' },
    { value: 'tender', label: 'Tender', icon: FileText, color: '#dc2626' },
    { value: 'opportunity', label: 'Opportunity', icon: GraduationCap, color: '#3b82f6' }
  ]

  return (
    <header style={{
      position: 'relative',
      height: isDesktop ? '60px' : '40px',
      backgroundColor: 'transparent',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: isDesktop ? '32px' : '16px',
      paddingRight: isDesktop ? '32px' : '16px',
      justifyContent: isDesktop ? 'flex-end' : 'space-between',
      marginTop: isDesktop ? '8px' : '4px',
      marginBottom: '0px'
    }}>
      {/* Left Side - Back Arrow (Sidebar routes) or User Menu (Main routes on Mobile) */}
      {!isDesktop && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={isSidebarRoute ? handleBackClick : () => setSidebarOpen(true)}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              padding: '8px',
              borderRadius: '20px',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {isSidebarRoute ? (
              <ArrowLeft size={20} color="#262626" />
            ) : (
              <User size={24} color="#262626" />
            )}
          </button>
        </div>
      )}

      {/* Right Side - Create, Bookmarks and Notifications (hidden on sidebar routes for clean look) */}
      {!isSidebarRoute && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isDesktop ? '12px' : '8px'
        }}>
          {/* Create Button */}
          <button
            onClick={handleCreateClick}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isDesktop ? '8px 12px' : '8px 10px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#15803d'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#16a34a'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Post
          </button>
          
          <button
            onClick={handleBookmarksClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: isDesktop ? '10px' : '8px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <Bookmark size={22} color="#262626" />
          </button>
          
          <button
            onClick={handleNotificationsClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: isDesktop ? '10px' : '8px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <Bell size={24} color="#262626" />
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              backgroundColor: '#ed4956',
              borderRadius: '3px'
            }} />
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
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
        onClick={() => setShowCreateModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                Create New Post
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit}>
              {/* Type Selection Dropdown */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Post Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={`Enter ${formData.type} title...`}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Dynamic Fields Based on Type */}
              {formData.type === 'job' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter company name..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Job Type *
                      </label>
                      <select
                        required
                        value={formData.jobType}
                        onChange={(e) => handleInputChange('jobType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select job type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Work Type *
                      </label>
                      <select
                        required
                        value={formData.workType}
                        onChange={(e) => handleInputChange('workType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select work type</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Experience (Years) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="50"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 3"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Industry *
                    </label>
                    <select
                      required
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Media">Media</option>
                      <option value="Government">Government</option>
                      <option value="Non-profit">Non-profit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Custom Industry Input - shown when "Other" is selected */}
                  {formData.industry === 'Other' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Specify Industry *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customIndustry}
                        onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                        placeholder="e.g., Agriculture, Mining, Aerospace..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Salary Range
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="e.g., $80,000 - $120,000"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Skills Required *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="e.g., React, Node.js, TypeScript (comma separated)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Benefits
                    </label>
                    <input
                      type="text"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      placeholder="e.g., Health Insurance, Remote Work, 401k (comma separated)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Application URL
                    </label>
                    <input
                      type="url"
                      value={formData.applicationUrl}
                      onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                      placeholder="https://company.com/careers/apply"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </>
              )}

              {formData.type === 'tender' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      placeholder="e.g., City of San Francisco, State Department..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Tender Value
                      </label>
                      <input
                        type="text"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        placeholder="e.g., $2.5M - $5.2M"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Submission Deadline *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Requirements & Qualifications *
                    </label>
                    <textarea
                      required
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="List key requirements, qualifications, and criteria..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Application URL
                      </label>
                      <input
                        type="url"
                        value={formData.applicationUrl}
                        onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                        placeholder="https://procurement.gov/tender/123"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="procurement@organization.gov"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.type === 'opportunity' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      placeholder="e.g., Google, NASA, United Nations..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Opportunity Type *
                      </label>
                      <select
                        required
                        value={formData.jobType}
                        onChange={(e) => handleInputChange('jobType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select type</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Fellowship">Fellowship</option>
                        <option value="Internship">Internship</option>
                        <option value="Grant">Grant</option>
                        <option value="Competition">Competition</option>
                        <option value="Program">Program</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Eligibility & Requirements *
                    </label>
                    <textarea
                      required
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="Describe eligibility criteria, requirements, and qualifications..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Benefits & Value
                    </label>
                    <input
                      type="text"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      placeholder="e.g., $50,000 scholarship, Mentorship, Research opportunity"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Application URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.applicationUrl}
                      onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                      placeholder="https://organization.com/apply"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="opportunities@organization.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </>
              )}

              {/* Common Fields */}
              {/* Location field - conditional for jobs based on work type */}
              {((formData.type === 'job' && formData.workType && formData.workType !== 'Remote') || 
                (formData.type !== 'job')) && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Location{formData.type === 'job' ? ' *' : ''}
                  </label>
                  <input
                    type="text"
                    required={formData.type === 'job'}
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={
                      formData.type === 'job' 
                        ? "e.g., New York, NY" 
                        : "Enter location..."
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={`Describe the ${formData.type} requirements and details...`}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Document Upload Section */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Supporting Documents
                  {formData.type === 'tender' && ' (Recommended)'}
                </label>
                
                {/* Upload Area */}
                <div
                  onClick={() => document.getElementById('file-upload').click()}
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s ease-in-out',
                    marginBottom: formData.documents.length > 0 ? '12px' : '0'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.borderColor = '#16a34a'
                    e.currentTarget.style.backgroundColor = '#f0fdf4'
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    handleFileUpload(e.dataTransfer.files)
                  }}
                >
                  <Upload size={24} color="#6b7280" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    PDF, DOC, DOCX, XLS, XLSX (Max 10MB each)
                  </div>
                </div>

                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  style={{ display: 'none' }}
                />

                {/* Uploaded Documents List */}
                {formData.documents.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {formData.documents.map(doc => (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          marginBottom: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <FileText size={16} color="#6b7280" style={{ marginRight: '8px' }} />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                              {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={14} color="#dc2626" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Post {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
