import React from 'react'

const AdminModalContent = ({ selectedItem }) => {
  return (
    <>
      {/* Content - EXACT admin structure */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        {selectedItem.type === 'course' && (
                  <div>
                    {/* Course Profile Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      marginBottom: '24px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <img 
                        src={selectedItem.thumbnail || selectedItem.thumbnail_url} 
                        alt={selectedItem.title}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '2px solid #f8f9fa'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#64748b',
                          margin: '0 0 4px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {selectedItem.type === 'video' ? 'Video Course' : selectedItem.type === 'book' ? 'E-Book' : 'Business Plan'}
                        </h3>
                        <h2 style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#1a1a1a',
                          margin: '0 0 8px 0'
                        }}>
                          {selectedItem.title}
                        </h2>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                          fontSize: '14px',
                          color: '#64748b'
                        }}>
                          <span>{selectedItem.instructor || selectedItem.author}</span>
                          <span>•</span>
                          <span>{typeof selectedItem.category === 'string' ? selectedItem.category : selectedItem.category?.name || selectedItem.category?.title || 'Unknown'}</span>
                          <span>•</span>
                          <span>{typeof selectedItem.level === 'string' ? selectedItem.level : selectedItem.level?.name || selectedItem.level?.title || 'Unknown'}</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginTop: '8px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ color: '#f59e0b', fontSize: '16px' }}>★</span>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedItem.rating || '4.5'}</span>
                          </div>
                          <span style={{ fontSize: '14px', color: '#64748b' }}>
                            {selectedItem.students || '0'} students enrolled
                          </span>
                          <span style={{ fontSize: '14px', color: '#64748b' }}>
                            {selectedItem.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Overview */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Course Overview
                      </h3>
                      <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#374151',
                        margin: 0
                      }}>
                        {selectedItem.description || 'No description available.'}
                      </p>
                    </div>

                    {/* Chapters/Content Structure */}
                    {selectedItem.chapters && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Course Content
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {selectedItem.chapters.map((chapter, index) => (
                            <li key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              marginBottom: '8px',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              color: '#374151'
                            }}>
                              <span style={{
                                backgroundColor: '#16a34a',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '2px'
                              }}>
                                {index + 1}
                              </span>
                              {chapter}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    {selectedItem.learningOutcomes && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          What You'll Learn
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {selectedItem.learningOutcomes.map((outcome, index) => (
                            <li key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              marginBottom: '8px',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              color: '#374151'
                            }}>
                              <span style={{
                                color: '#16a34a',
                                fontSize: '16px',
                                lineHeight: '1',
                                marginTop: '2px'
                              }}>✓</span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {selectedItem.prerequisites && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Prerequisites
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {selectedItem.prerequisites.map((prerequisite, index) => (
                            <li key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              marginBottom: '8px',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              color: '#374151'
                            }}>
                              <span style={{
                                color: '#f59e0b',
                                fontSize: '16px',
                                lineHeight: '1',
                                marginTop: '2px'
                              }}>•</span>
                              {prerequisite}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Insights (for books) */}
                    {selectedItem.keyInsights && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Key Insights
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {selectedItem.keyInsights.map((insight, index) => (
                            <li key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              marginBottom: '8px',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              color: '#374151'
                            }}>
                              <span style={{
                                color: '#16a34a',
                                fontSize: '16px',
                                lineHeight: '1',
                                marginTop: '2px'
                              }}>•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Target Audience (for books) */}
                    {selectedItem.targetAudience && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Target Audience
                        </h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {selectedItem.targetAudience.map((audience, index) => (
                            <span key={index} style={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sections (for business plans) */}
                    {selectedItem.sections && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Business Plan Sections
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {selectedItem.sections.map((section, index) => (
                            <li key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              marginBottom: '8px',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              color: '#374151'
                            }}>
                              <span style={{
                                backgroundColor: '#16a34a',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '2px'
                              }}>
                                {index + 1}
                              </span>
                              {section}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Financial Projections (for business plans) */}
                    {selectedItem.financialProjections && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Financial Projections
                        </h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {selectedItem.financialProjections.map((projection, index) => (
                            <span key={index} style={{
                              backgroundColor: '#f0fdf4',
                              color: '#166534',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              {projection}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Market Research (for business plans) */}
                    {selectedItem.marketResearch && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Market Research Included
                        </h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {selectedItem.marketResearch.map((research, index) => (
                            <span key={index} style={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              {research}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {selectedItem.resources && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Included Resources
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0
                        }}>
                          {selectedItem.resources.map((resource, index) => (
                            <li key={index} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              marginBottom: '8px',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              color: '#374151'
                            }}>
                              <span style={{
                                color: '#16a34a',
                                fontSize: '16px',
                                lineHeight: '1',
                                marginTop: '2px'
                              }}>•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
        )}
      </div>
    </>
  )
}

export default AdminModalContent
