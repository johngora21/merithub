import React, { useState } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { Calendar, MapPin, DollarSign, Clock, Search, Eye, FileText, ExternalLink } from 'lucide-react'

const MyApplications = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'all', name: 'All', count: 12 },
    { id: 'pending', name: 'Pending', count: 5 },
    { id: 'interview', name: 'Interview', count: 3 },
    { id: 'accepted', name: 'Accepted', count: 2 },
    { id: 'rejected', name: 'Rejected', count: 2 }
  ]

  const applications = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      type: 'Job',
      status: 'Interview',
      appliedDate: 'Jan 15',
      location: 'San Francisco, CA',
      salary: '$120K - $160K',
      nextAction: 'Technical Interview on Jan 25'
    },
    {
      id: 2,
      title: 'Google Summer of Code',
      company: 'Google',
      type: 'Opportunity',
      status: 'Pending',
      appliedDate: 'Jan 12',
      location: 'Remote',
      salary: '$6K stipend',
      nextAction: 'Results expected by Feb 1'
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      type: 'Job',
      status: 'Accepted',
      appliedDate: 'Jan 10',
      location: 'New York, NY',
      salary: '$95K - $115K',
      nextAction: 'Start date: Feb 15'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#fef3c7', text: '#f59e0b' }
      case 'Interview': return { bg: '#dbeafe', text: '#3b82f6' }
      case 'Accepted': return { bg: '#f0fdf4', text: '#16a34a' }
      case 'Rejected': return { bg: '#fee2e2', text: '#ef4444' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || app.status.toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: screenSize.isDesktop 
          ? '24px 32px 24px 32px' 
          : screenSize.isTablet
            ? '20px 20px 20px 20px'
            : '16px 12px 90px 12px'
      }}>
        
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div style={{
            flex: 1,
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
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px 10px 40px',
                fontSize: '16px',
                color: '#1a1a1a',
                outline: 'none',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#16a34a'
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              }}
            />
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
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
          gap: getGridGap(screenSize)
        }}>
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const statusColors = getStatusColor(application.status)
              return (
                <div key={application.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: 0
                        }}>
                          {application.title}
                        </h3>
                        <span style={{
                          fontSize: '11px',
                          backgroundColor: application.type === 'Job' ? '#dbeafe' : '#fef3c7',
                          color: application.type === 'Job' ? '#3b82f6' : '#f59e0b',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {application.type}
                        </span>
                      </div>
                      
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: '0 0 8px 0'
                      }}>
                        {application.company}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {application.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={12} />
                          {application.salary}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          Applied {application.appliedDate}
                        </div>
                      </div>
                    </div>
                    
                    <span style={{
                      fontSize: '11px',
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} color="#16a34a" />
                      <span style={{
                        fontSize: '12px',
                        color: '#16a34a',
                        fontWeight: '500'
                      }}>
                        {application.nextAction}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button style={{
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        <Eye size={12} />
                      </button>
                      <button style={{
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        <FileText size={12} />
                      </button>
                      <button style={{
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                📋
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>
                No applications found
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyApplications