import React, { useState, useEffect } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { apiService } from '../lib/api-service'
import { 
  FileText,
  CheckCircle,
  Calculator,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  Download,
  Eye,
  Edit3,
  Search,
  AlertCircle,
  Lightbulb,
  Shield,
  DollarSign,
  Settings
} from 'lucide-react'

const TenderTools = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('tools')

  const tabs = [
    { id: 'tools', name: 'Tools' },
    { id: 'templates', name: 'Templates' },
    { id: 'tips', name: 'Writing Tips' },
    { id: 'tracker', name: 'My Tenders' }
  ]

  const tools = [
    { 
      title: 'Tender Writing Guide', 
      desc: 'Step-by-step proposal writing assistance', 
      icon: FileText,
      color: '#16a34a',
      features: ['Compliance checker', 'Structure templates', 'Evaluation criteria']
    },
    { 
      title: 'Proposal Builder', 
      desc: 'Create winning proposals with templates', 
      icon: Edit3,
      color: '#16a34a',
      features: ['Executive summary', 'Technical sections', 'Team profiles']
    },
    { 
      title: 'Cost Calculator', 
      desc: 'Accurate pricing and bid calculations', 
      icon: Calculator,
      color: '#16a34a',
      features: ['Cost breakdown', 'Margin analysis', 'Risk assessment']
    },
    { 
      title: 'Compliance Checker', 
      desc: 'Ensure all requirements are met', 
      icon: CheckCircle,
      color: '#16a34a',
      features: ['Requirement tracker', 'Document checklist', 'Deadline alerts']
    },
    { 
      title: 'Team Manager', 
      desc: 'Organize team profiles and CVs', 
      icon: Users,
      color: '#16a34a',
      features: ['CV database', 'Skill matching', 'Team builder']
    },
    { 
      title: 'Strategy Planner', 
      desc: 'Develop winning tender strategies', 
      icon: Target,
      color: '#16a34a',
      features: ['Value propositions', 'Win themes', 'Differentiators']
    }
  ]

  const templates = [
    { 
      id: 1, 
      name: 'Executive Summary Template', 
      category: 'Proposal Sections',
      description: 'Professional executive summary structure',
      downloadCount: 1240
    },
    { 
      id: 2, 
      name: 'Technical Response Framework', 
      category: 'Technical Proposals',
      description: 'Comprehensive technical proposal template',
      downloadCount: 892
    },
    { 
      id: 3, 
      name: 'Team Presentation Builder', 
      category: 'Team Profiles',
      description: 'Showcase your team effectively',
      downloadCount: 756
    },
    { 
      id: 4, 
      name: 'Cost Breakdown Sheet', 
      category: 'Financial',
      description: 'Detailed pricing structure template',
      downloadCount: 634
    },
    { 
      id: 5, 
      name: 'Compliance Checklist', 
      category: 'Documentation',
      description: 'Ensure all requirements are covered',
      downloadCount: 543
    },
    { 
      id: 6, 
      name: 'Cover Letter Template', 
      category: 'Proposal Sections',
      description: 'Professional tender cover letter',
      downloadCount: 421
    }
  ]

  const writingTips = [
    {
      category: 'Planning & Preparation',
      icon: Target,
      color: '#16a34a',
      tips: [
        'Read the tender document thoroughly multiple times',
        'Create a compliance matrix for all requirements',
        'Research the client organization and their needs',
        'Assemble a qualified team early in the process',
        'Plan your timeline with buffer time for reviews'
      ]
    },
    {
      category: 'Proposal Structure',
      icon: FileText,
      color: '#16a34a',
      tips: [
        'Follow the exact format requested in the tender',
        'Use clear headings that match tender sections',
        'Write a compelling executive summary first',
        'Include relevant case studies and experience',
        'Provide detailed methodology and approach'
      ]
    },
    {
      category: 'Technical Excellence',
      icon: Award,
      color: '#16a34a',
      tips: [
        'Demonstrate deep understanding of requirements',
        'Provide innovative solutions that add value',
        'Include comprehensive risk management plans',
        'Show compliance with all specifications',
        'Present realistic timelines and milestones'
      ]
    },
    {
      category: 'Commercial Strategy',
      icon: DollarSign,
      color: '#16a34a',
      tips: [
        'Provide competitive but sustainable pricing',
        'Break down costs transparently',
        'Highlight value-for-money propositions',
        'Consider long-term partnership benefits',
        'Address all commercial terms clearly'
      ]
    },
    {
      category: 'Quality & Compliance',
      icon: Shield,
      color: '#16a34a',
      tips: [
        'Ensure all mandatory documents are included',
        'Meet all legal and regulatory requirements',
        'Include required certifications and licenses',
        'Verify all calculations and technical details',
        'Conduct thorough proofreading and reviews'
      ]
    },
    {
      category: 'Common Mistakes',
      icon: AlertCircle,
      color: '#16a34a',
      tips: [
        'Missing submission deadlines',
        'Failing to answer all evaluation criteria',
        'Providing generic responses without customization',
        'Underestimating costs or project timelines',
        'Not following specified formatting requirements'
      ]
    }
  ]

  const [myTenders, setMyTenders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMyTenders()
  }, [])

  const fetchMyTenders = async () => {
    try {
      setLoading(true)
      // Fetch user's tender applications
      const response = await apiService.get('/applications/my-applications')
      const applications = response.data.applications || []
      
      // Filter tender applications
      const tenderApplications = applications.filter(app => app.tender)
      
      // Transform to tender format
      const tenders = tenderApplications.map((app, index) => ({
        id: app.id,
        title: app.tender.title,
        organization: app.tender.organization,
        deadline: app.deadline || '2024-12-31',
        status: app.status === 'pending' ? 'In Progress' : 
                app.status === 'accepted' ? 'Submitted' : 
                app.status === 'rejected' ? 'Draft' : 'In Progress',
        value: app.tender.contract_value_min && app.tender.contract_value_max 
          ? `${app.tender.currency} ${(app.tender.contract_value_min / 1000000).toFixed(1)}M - ${app.tender.currency} ${(app.tender.contract_value_max / 1000000).toFixed(1)}M`
          : 'Amount not specified',
        progress: app.status === 'accepted' ? 100 : 
                 app.status === 'pending' ? 75 : 
                 app.status === 'rejected' ? 30 : 50
      }))
      
      setMyTenders(tenders)
    } catch (error) {
      console.error('Error fetching my tenders:', error)
      // Keep empty array as fallback
      setMyTenders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return '#ea580c'
      case 'Draft': return '#64748b'
      case 'Submitted': return '#16a34a'
      default: return '#64748b'
    }
  }

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: '16px 12px 90px 12px'
      }}>
        


        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: screenSize.isMobile ? '2px' : '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          overflow: 'auto'
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
                whiteSpace: 'nowrap',
                minHeight: 'auto'
              }}
            >
              {screenSize.isMobile ? (
                tab.id === 'writing-tips' ? 'Tips' : 
                tab.id === 'my-tenders' ? 'Tenders' : 
                tab.name
              ) : (
                tab.name
              )}
            </button>
          ))}
        </div>

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.title} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: `${tool.color}15`,
                      border: `2px solid ${tool.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} color={tool.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 2px 0'
                      }}>
                        {tool.title}
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: '#64748b',
                        margin: 0
                      }}>
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    {tool.features.map((feature, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: '#64748b',
                        marginBottom: '3px'
                      }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '2px',
                          backgroundColor: tool.color
                        }} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button style={{
                    width: '100%',
                    backgroundColor: tool.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1'
                    e.target.style.transform = 'translateY(0)'
                  }}>
                    Launch Tool
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {templates.map((template) => (
              <div key={template.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px 12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#16a34a'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0'
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <FileText size={16} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 1px 0'
                    }}>
                      {template.name}
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      color: '#16a34a',
                      backgroundColor: '#f0fdf4',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {template.category}
                    </span>
                  </div>
                </div>
                
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {template.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Download size={10} />
                    {template.downloadCount} downloads
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    flex: 1,
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#15803d'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#16a34a'
                  }}>
                    <Download size={10} />
                    Download
                  </button>
                  
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#16a34a'
                    e.target.style.color = '#16a34a'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.color = '#64748b'
                  }}>
                    <Eye size={10} />
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Writing Tips Tab */}
        {activeTab === 'tips' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            {writingTips.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.category} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: `${section.color}15`,
                      border: `2px solid ${section.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} color={section.color} />
                    </div>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: 0
                    }}>
                      {section.category}
                    </h3>
                  </div>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr',
                    gap: '6px'
                  }}>
                    {section.tips.map((tip, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        padding: '8px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: section.color,
                          marginTop: '5px',
                          flexShrink: 0
                        }} />
                        <span style={{
                          fontSize: '13px',
                          color: '#374151',
                          lineHeight: '1.4'
                        }}>
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* My Tenders Tab */}
        {activeTab === 'tracker' && (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {myTenders.map((tender) => {
              const daysLeft = getDaysUntilDeadline(tender.deadline)
              const isUrgent = daysLeft <= 7
              
              return (
                <div key={tender.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 2px 0'
                      }}>
                        {tender.title}
                      </h3>
                      <p style={{
                        fontSize: '11px',
                        color: '#64748b',
                        margin: '0 0 4px 0'
                      }}>
                        {tender.organization}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: '#64748b'
                      }}>
                        <span style={{
                          color: '#16a34a',
                          fontWeight: '600'
                        }}>
                          {tender.value}
                        </span>
                        <span>•</span>
                        <span style={{
                          color: isUrgent ? '#dc2626' : '#64748b',
                          fontWeight: isUrgent ? '600' : 'normal'
                        }}>
                          {Math.abs(daysLeft)} days {daysLeft < 0 ? 'overdue' : 'left'}
                        </span>
                      </div>
                    </div>
                    
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: (() => {
                        const color = getStatusColor(tender.status)
                        return `${color}15`
                      })(),
                      color: getStatusColor(tender.status),
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontWeight: '500'
                    }}>
                      {tender.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2px'
                    }}>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{tender.progress}% complete</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${tender.progress}%`,
                        height: '100%',
                        backgroundColor: getStatusColor(tender.status),
                        borderRadius: '2px',
                        transition: 'width 0.3s ease-in-out'
                      }} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{
                      flex: 1,
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#15803d'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#16a34a'
                    }}>
                      Continue Work
                    </button>
                    
                    <button style={{
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#16a34a'
                      e.target.style.color = '#16a34a'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.color = '#64748b'
                    }}>
                      <Eye size={10} />
                      View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TenderTools
