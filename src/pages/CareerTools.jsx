import React, { useState } from 'react'
import { FileText, Download, Upload, Edit3, Eye, Plus } from 'lucide-react'

const CareerTools = () => {
  const [activeTab, setActiveTab] = useState('cv-builder')

  const tabs = [
    { id: 'cv-builder', name: 'CV Builder' },
    { id: 'templates', name: 'Templates' },
    { id: 'my-documents', name: 'My Documents' }
  ]

  const cvTemplates = [
    { id: 1, name: 'Professional Modern', category: 'Business' },
    { id: 2, name: 'Creative Designer', category: 'Creative' },
    { id: 3, name: 'Tech Professional', category: 'Technology' },
    { id: 4, name: 'Academic Researcher', category: 'Academic' }
  ]

  const myDocuments = [
    { id: 1, name: 'Software Engineer Resume', type: 'CV', updated: 'Jan 15', status: 'Complete' },
    { id: 2, name: 'Cover Letter Template', type: 'Cover Letter', updated: 'Jan 10', status: 'Draft' },
    { id: 3, name: 'Portfolio Summary', type: 'Portfolio', updated: 'Jan 8', status: 'Complete' }
  ]

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '16px 12px 90px 12px' }}>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
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
                padding: '8px 12px',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>



        {/* CV Builder Tab */}
        {activeTab === 'cv-builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cvTemplates.map((template) => (
              <div key={template.id} style={{
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
                <div style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={20} color="#64748b" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 2px 0'
                  }}>
                    {template.name}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    color: '#16a34a',
                    backgroundColor: '#f0fdf4',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    {template.category}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Use
                  </button>
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Documents Tab */}
        {activeTab === 'my-documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
      </div>
    </div>
  )
}

export default CareerTools