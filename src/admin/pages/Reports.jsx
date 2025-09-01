import React from 'react'
import { Download, Eye, CheckCircle, FileText, Users } from 'lucide-react'

const Reports = () => {
  // Simple responsive detection
  const screenSize = {
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: screenSize.isMobile ? 'column' : 'row',
          alignItems: screenSize.isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 8px 0',
              fontFamily: 'var(--font-poppins)',
              letterSpacing: '-0.025em'
            }}>
              Reports & Insights
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500'
            }}>
              Comprehensive reports and performance insights for Merit platform.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(22, 163, 74, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.25)'
            }}>
              <Download size={16} />
              Export PDF
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)'
            }}>
              <Eye size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* User Growth Report */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-4px)'
          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 4px 0'
              }}>
                User Growth Report
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Monthly user registration trends
              </p>
            </div>
            <Users size={24} color="#3b82f6" />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              15,847
            </span>
            <span style={{
              fontSize: '14px',
              color: '#16a34a',
              fontWeight: '600'
            }}>
              +12.5%
            </span>
          </div>
          <button style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9'
            e.target.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8fafc'
            e.target.style.color = '#64748b'
          }}>
            View Full Report
          </button>
        </div>

        {/* Content Performance Report */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-4px)'
          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 4px 0'
              }}>
                Content Performance
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Jobs, Tenders & Opportunities metrics
              </p>
            </div>
            <FileText size={24} color="#16a34a" />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              6,285
            </span>
            <span style={{
              fontSize: '14px',
              color: '#16a34a',
              fontWeight: '600'
            }}>
              +8.3%
            </span>
          </div>
          <button style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9'
            e.target.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8fafc'
            e.target.style.color = '#64748b'
          }}>
            View Full Report
          </button>
        </div>

        {/* Application Success Report */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-4px)'
          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 4px 0'
              }}>
                Application Success
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Success rates and outcomes
              </p>
            </div>
            <CheckCircle size={24} color="#8b5cf6" />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              12,847
            </span>
            <span style={{
              fontSize: '14px',
              color: '#16a34a',
              fontWeight: '600'
            }}>
              +15.2%
            </span>
          </div>
          <button style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9'
            e.target.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8fafc'
            e.target.style.color = '#64748b'
          }}>
            View Full Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reports
