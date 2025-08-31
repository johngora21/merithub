import React, { useState } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { 
  BookOpen, 
  Play, 
  FileText,
  Star,
  Clock,
  Users,
  Search,
  SlidersHorizontal,
  Bookmark,
  Download,
  Eye,
  DollarSign,
  X,
  Check
} from 'lucide-react'

const Courses = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('videos')
  const [savedItems, setSavedItems] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    videos: {
      category: [],
      level: [],
      language: [],
      price: [],
      format: []
    },
    books: {
      category: [],
      format: [],
      language: [],
      authorType: []
    },
    businessPlans: {
      industrySector: [],
      businessType: [],
      stage: []
    }
  })

  const tabs = [
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'business-plans', label: 'Business Plans', icon: FileText }
  ]

  const videos = [
    {
      id: '1',
      title: 'Complete React Development Course',
      instructor: 'Sarah Wilson',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
      duration: '12 hours',
      lessons: 45,
      students: 2847,
      rating: 4.9,
      isPro: false,
      level: 'Beginner',
      description: 'Learn React from scratch with hands-on projects and real-world applications.',
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: '2',
      title: 'Digital Marketing Mastery',
      instructor: 'Michael Chen',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
      duration: '8 hours',
      lessons: 28,
      students: 1923,
      rating: 4.7,
      isPro: true,
      level: 'Intermediate',
      description: 'Master digital marketing strategies, SEO, social media, and analytics.',
      tags: ['Marketing', 'SEO', 'Social Media']
    },
    {
      id: '3',
      title: 'Python for Data Science',
      instructor: 'Dr. Emily Rodriguez',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=240&fit=crop',
      duration: '15 hours',
      lessons: 52,
      students: 3456,
      rating: 4.8,
      isPro: true,
      level: 'Advanced',
      description: 'Comprehensive Python course focused on data analysis and machine learning.',
      tags: ['Python', 'Data Science', 'Machine Learning']
    }
  ]

  const books = [
    {
      id: '1',
      title: 'The Lean Startup Methodology',
      author: 'Eric Ries',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=240&fit=crop',
      pages: 336,
      category: 'Business',
      rating: 4.6,
      isPro: false,
      format: 'PDF',
      description: 'Learn how to build a sustainable business through continuous innovation.',
      tags: ['Startup', 'Business', 'Innovation']
    },
    {
      id: '2',
      title: 'Design Thinking for Innovation',
      author: 'Tim Brown',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
      pages: 264,
      category: 'Design',
      rating: 4.5,
      isPro: true,
      format: 'EPUB',
      description: 'Master the design thinking process to drive innovation in your organization.',
      tags: ['Design', 'Innovation', 'Strategy']
    },
    {
      id: '3',
      title: 'Financial Management Essentials',
      author: 'Robert Johnson',
      cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=240&fit=crop',
      pages: 428,
      category: 'Finance',
      rating: 4.7,
      isPro: true,
      format: 'PDF',
      description: 'Complete guide to financial planning, budgeting, and investment strategies.',
      tags: ['Finance', 'Budgeting', 'Investment']
    }
  ]

  const businessPlans = [
    {
      id: '1',
      title: 'Technology Startup Business Plan Template',
      category: 'Technology',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
      pages: 45,
      sections: 12,
      downloads: 1247,
      isPro: false,
      format: 'DOCX',
      description: 'Comprehensive business plan template specifically designed for tech startups.',
      tags: ['Startup', 'Technology', 'Template']
    },
    {
      id: '2',
      title: 'Restaurant Business Plan Guide',
      category: 'Food & Beverage',
      preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop',
      pages: 38,
      sections: 10,
      downloads: 892,
      isPro: true,
      format: 'PDF + DOCX',
      description: 'Complete business plan template for restaurant and food service businesses.',
      tags: ['Restaurant', 'Food Service', 'Business Plan']
    },
    {
      id: '3',
      title: 'E-commerce Business Plan Template',
      category: 'E-commerce',
      preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=240&fit=crop',
      pages: 52,
      sections: 15,
      downloads: 2134,
      isPro: true,
      format: 'DOCX + Excel',
      description: 'Professional business plan template for online retail and e-commerce ventures.',
      tags: ['E-commerce', 'Online Business', 'Retail']
    }
  ]

  const filterOptions = {
    videos: {
      category: ['Business', 'Technology', 'Marketing', 'Finance', 'Design', 'Health', 'Education', 'Personal Development', 'Leadership', 'Entrepreneurship', 'Data Science', 'Programming', 'Photography', 'Music', 'Art'],
      level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      language: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Hindi', 'Portuguese'],
      price: ['Free', 'Paid'],
      format: ['Course', 'Tutorial', 'Webinar', 'Documentary', 'Interview', 'Workshop']
    },
    books: {
      category: ['Business', 'Technology', 'Self-Help', 'Biography', 'Finance', 'Marketing', 'Leadership', 'Health', 'Education', 'Fiction', 'Non-Fiction', 'History', 'Science', 'Philosophy'],
      format: ['PDF', 'EPUB', 'MOBI', 'Audiobook', 'Physical'],
      language: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Hindi', 'Portuguese'],
      authorType: ['Bestselling Author', 'Industry Expert', 'Academic', 'Entrepreneur']
    },
    businessPlans: {
      industrySector: ['Technology', 'Healthcare', 'Retail', 'Food & Beverage', 'Manufacturing', 'Consulting', 'Real Estate', 'Education', 'Entertainment', 'Agriculture', 'Transportation', 'Energy'],
      businessType: ['Startup', 'Small Business', 'Enterprise', 'Non-Profit', 'Franchise', 'E-commerce', 'Service-Based', 'Product-Based'],
      stage: ['Idea Stage', 'Startup', 'Growth', 'Expansion', 'Established']
    }
  }

  const toggleSave = (itemId) => {
    const newSaved = new Set(savedItems)
    if (newSaved.has(itemId)) {
      newSaved.delete(itemId)
    } else {
      newSaved.add(itemId)
    }
    setSavedItems(newSaved)
  }

  const toggleFilter = (category, value) => {
    const tabKey = activeTab === 'business-plans' ? 'businessPlans' : activeTab
    setFilters(prev => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [category]: prev[tabKey][category].includes(value)
          ? prev[tabKey][category].filter(item => item !== value)
          : [...prev[tabKey][category], value]
      }
    }))
  }

  const clearAllFilters = () => {
    const tabKey = activeTab === 'business-plans' ? 'businessPlans' : activeTab
    const defaultFilters = {
      videos: {
        category: [],
        level: [],
        language: [],
        price: [],
        format: []
      },
      books: {
        category: [],
        format: [],
        language: [],
        authorType: []
      },
      businessPlans: {
        industrySector: [],
        businessType: [],
        stage: []
      }
    }
    
    setFilters(prev => ({
      ...prev,
      [tabKey]: defaultFilters[tabKey]
    }))
  }

  const getActiveFilterCount = () => {
    const tabKey = activeTab === 'business-plans' ? 'businessPlans' : activeTab
    const currentFilters = filters[tabKey]
    if (!currentFilters) return 0
    let count = 0
    Object.values(currentFilters).forEach(filterArray => {
      count += filterArray.length
    })
    return count
  }

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            color={i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb'}
            fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
          />
        ))}
        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>
          ({rating})
        </span>
      </div>
    )
  }

  const renderVideoCard = (video) => (
    <div key={video.id} style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0',
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
      {/* Thumbnail */}
      <div style={{ position: 'relative' }}>
        <img 
          src={video.thumbnail} 
          alt={video.title}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px'
        }}>
          <button
            onClick={() => toggleSave(video.id)}
            style={{
              background: savedItems.has(video.id) ? 'rgba(22, 163, 74, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Bookmark 
              size={16} 
              color={savedItems.has(video.id) ? 'white' : '#64748b'}
              fill={savedItems.has(video.id) ? 'white' : 'none'}
            />
          </button>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
                        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '11px',
            color: '#16a34a',
            backgroundColor: '#f0fdf4',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {video.level}
          </span>
          <span style={{
            fontSize: '11px',
            color: 'white',
            backgroundColor: video.isPro ? '#3b82f6' : '#16a34a',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {video.isPro ? 'PRO' : 'FREE'}
          </span>
            </div>

        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '0 0 4px 0',
          lineHeight: '1.4'
        }}>
          {video.title}
        </h3>

        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: '0 0 12px 0'
        }}>
          by {video.instructor}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Play size={12} />
            {video.lessons} lessons
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Users size={12} />
            {video.students.toLocaleString()}
          </div>
        </div>

        {renderStars(video.rating)}

                <div style={{ marginTop: '12px' }}>
          <button style={{
            width: '100%',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#15803d'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#16a34a'
          }}>
            <Download size={14} />
            Download
            </button>
          </div>
      </div>
    </div>
  )

  const renderBookCard = (book) => (
    <div key={book.id} style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0',
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
      {/* Cover */}
      <div style={{ position: 'relative' }}>
        <img 
          src={book.cover} 
          alt={book.title}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px'
        }}>
          <button
            onClick={() => toggleSave(book.id)}
            style={{
              background: savedItems.has(book.id) ? 'rgba(22, 163, 74, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Bookmark 
              size={16} 
              color={savedItems.has(book.id) ? 'white' : '#64748b'}
              fill={savedItems.has(book.id) ? 'white' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
                        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '11px',
            color: '#7c3aed',
            backgroundColor: '#f3e8ff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {book.format}
          </span>
          <span style={{
            fontSize: '11px',
            color: 'white',
            backgroundColor: book.isPro ? '#3b82f6' : '#16a34a',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {book.isPro ? 'PRO' : 'FREE'}
          </span>
                </div>

        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '0 0 4px 0',
          lineHeight: '1.4'
        }}>
          {book.title}
        </h3>

        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: '0 0 12px 0'
        }}>
          by {book.author}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <BookOpen size={12} />
            {book.pages} pages
              </div>
          <div>{book.category}</div>
              </div>

        {renderStars(book.rating)}

        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '12px' 
        }}>
          <button style={{
            flex: 1,
            backgroundColor: 'white',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <Eye size={12} />
            Preview
          </button>
          <button style={{
            flex: 1,
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <Download size={12} />
            Download
          </button>
            </div>
      </div>
        </div>
  )

  const renderBusinessPlanCard = (plan) => (
    <div key={plan.id} style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0',
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
      {/* Preview */}
      <div style={{ position: 'relative' }}>
        <img 
          src={plan.preview} 
          alt={plan.title}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px'
        }}>
          <button
            onClick={() => toggleSave(plan.id)}
            style={{
              background: savedItems.has(plan.id) ? 'rgba(22, 163, 74, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Bookmark 
              size={16} 
              color={savedItems.has(plan.id) ? 'white' : '#64748b'}
              fill={savedItems.has(plan.id) ? 'white' : 'none'}
            />
                  </button>
                </div>
              </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
                        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '11px',
            color: '#dc2626',
            backgroundColor: '#fee2e2',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {plan.format}
                  </span>
          <span style={{
            fontSize: '11px',
            color: 'white',
            backgroundColor: plan.isPro ? '#3b82f6' : '#16a34a',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {plan.isPro ? 'PRO' : 'FREE'}
                  </span>
                </div>

        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '0 0 4px 0',
          lineHeight: '1.4'
        }}>
          {plan.title}
                </h3>

        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: '0 0 12px 0'
        }}>
          {plan.category}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <FileText size={12} />
            {plan.pages} pages
                  </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Users size={12} />
            {plan.downloads} downloads
                  </div>
                </div>

        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '12px' 
        }}>
          <button style={{
            flex: 1,
            backgroundColor: 'white',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <Eye size={12} />
                    Preview
                  </button>
          <button style={{
            flex: 1,
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <Download size={12} />
            Download
          </button>
        </div>
                </div>
              </div>
  )

  const getCurrentData = () => {
    switch (activeTab) {
      case 'videos':
        return videos
      case 'books':
        return books
      case 'business-plans':
        return businessPlans
      default:
        return videos
    }
  }

  const renderCurrentContent = () => {
    const data = getCurrentData()
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile 
          ? '1fr' 
          : screenSize.isTablet 
            ? 'repeat(2, 1fr)' 
            : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: getGridGap(screenSize)
      }}>
        {data.map((item) => {
          switch (activeTab) {
            case 'videos':
              return renderVideoCard(item)
            case 'books':
              return renderBookCard(item)
            case 'business-plans':
              return renderBusinessPlanCard(item)
            default:
              return renderVideoCard(item)
          }
        })}
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '16px 12px 90px 12px' }}>
        
        {/* Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            gap: '2px'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: isActive ? '#16a34a' : 'transparent',
                    color: isActive ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#f8f9fa'
                      e.target.style.color = '#1a1a1a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = '#64748b'
                    }
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
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
              placeholder="Search courses, books, business plans..."
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
          <button
            onClick={() => setShowFilters(true)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa'
              e.target.style.borderColor = '#16a34a'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#e2e8f0'
            }}
          >
            <SlidersHorizontal size={20} color="#64748b" />
            {getActiveFilterCount() > 0 && (
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#16a34a',
                color: 'white',
                borderRadius: '10px',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getActiveFilterCount()}
              </div>
            )}
          </button>
        </div>

        {/* Content */}
        {renderCurrentContent()}

        {/* Filter Modal */}
        {showFilters && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: screenSize.isMobile ? 'flex-end' : 'center',
            justifyContent: screenSize.isMobile ? 'stretch' : 'center',
            transition: 'all 0.3s ease-in-out'
          }}
          onClick={() => setShowFilters(false)}>
            <div style={{
              backgroundColor: 'white',
              width: screenSize.isMobile ? '100%' : 'min(800px, 90vw)',
              maxHeight: screenSize.isMobile ? '80vh' : '85vh',
              borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
              padding: screenSize.isDesktop ? '32px' : '20px',
              overflowY: 'auto',
              transform: showFilters ? 'translateY(0)' : (screenSize.isMobile ? 'translateY(100%)' : 'scale(0.9)'),
              opacity: showFilters ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  {activeTab === 'videos' ? 'Video' : activeTab === 'books' ? 'Book' : 'Business Plan'} Filters
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={clearAllFilters}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    <X size={24} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Dynamic Filter Categories based on active tab */}
              <div style={{ 
                display: screenSize.isDesktop ? 'grid' : 'flex',
                gridTemplateColumns: screenSize.isDesktop ? 'repeat(2, 1fr)' : 'none',
                flexDirection: screenSize.isDesktop ? 'initial' : 'column',
                gap: screenSize.isDesktop ? '32px' : '24px'
              }}>
                {Object.entries(filterOptions[activeTab === 'business-plans' ? 'businessPlans' : activeTab]).map(([categoryKey, options]) => {
                  const tabKey = activeTab === 'business-plans' ? 'businessPlans' : activeTab
                  return (
                  <div key={categoryKey}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      {categoryKey === 'industrySector' ? 'Industry Sector' :
                       categoryKey === 'businessType' ? 'Business Type' :
                       categoryKey === 'authorType' ? 'Author Type' :
                       categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)', 
                      gap: '8px' 
                    }}>
                      {options.map((option) => (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '8px 0'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: '2px solid #e2e8f0',
                            backgroundColor: filters[tabKey][categoryKey].includes(option) ? '#16a34a' : 'transparent',
                            borderColor: filters[tabKey][categoryKey].includes(option) ? '#16a34a' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease-in-out',
                            flexShrink: 0
                          }}
                          onClick={() => toggleFilter(categoryKey, option)}>
                            {filters[tabKey][categoryKey].includes(option) && (
                              <Check size={12} color="white" />
                            )}
                          </div>
                          <span style={{
                            fontSize: '14px',
                            color: '#1a1a1a',
                            fontWeight: '500'
                          }}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )})}
              </div>

              {/* Apply Button */}
              <div style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    width: screenSize.isMobile ? '100%' : 'auto',
                    minWidth: screenSize.isMobile ? 'auto' : '200px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: screenSize.isMobile ? '16px' : '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    alignSelf: screenSize.isMobile ? 'stretch' : 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#15803d'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#16a34a'
                  }}
                >
                  Apply Filters ({getActiveFilterCount()})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
