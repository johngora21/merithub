import React, { useState, useEffect } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { apiService } from '../lib/api-service'

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
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
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

  const [courses, setCourses] = useState({ videos: [], books: [], businessPlans: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const transformCourseData = (apiCourse) => {
    const baseCourse = {
      id: apiCourse.id.toString(),
      title: apiCourse.title,
      description: apiCourse.description,
      tags: apiCourse.tags || [],
      isPro: apiCourse.is_pro || false,
      rating: apiCourse.rating || 4.5,
      students: apiCourse.students_count || 0,
      postedTime: apiCourse.created_at ? new Date(apiCourse.created_at).toLocaleDateString() : 'Recently'
    }

    // Transform based on course type
    if (apiCourse.type === 'video') {
      return {
        ...baseCourse,
        instructor: apiCourse.instructor || 'Unknown Instructor',
        thumbnail: apiCourse.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
        duration: apiCourse.duration || 'Not specified',
        lessons: apiCourse.lessons_count || 0,
        level: apiCourse.level || 'Beginner',
        curriculum: apiCourse.curriculum || [],
        prerequisites: apiCourse.prerequisites || [],
        whatYouWillLearn: apiCourse.learning_outcomes || []
      }
    } else if (apiCourse.type === 'book') {
      return {
        ...baseCourse,
        author: apiCourse.author || 'Unknown Author',
        cover: apiCourse.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=240&fit=crop',
        pages: apiCourse.pages || 0,
        format: apiCourse.format || 'PDF',
        language: apiCourse.language || 'English',
        chapters: apiCourse.chapters || [],
        keyTopics: apiCourse.key_topics || [],
        targetAudience: apiCourse.target_audience || []
      }
    } else if (apiCourse.type === 'business-plan') {
      return {
        ...baseCourse,
        category: apiCourse.category || 'Business',
        preview: apiCourse.preview_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
        pages: apiCourse.pages || 0,
        sections: apiCourse.sections_count || 0,
        downloads: apiCourse.downloads_count || 0,
        format: apiCourse.format || 'DOCX',
        planSections: apiCourse.plan_sections || [],
        includes: apiCourse.includes || []
      }
    }

    return baseCourse
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/courses')
      const apiCourses = response.data.courses || []
      
      // Transform and categorize courses
      const transformedCourses = {
        videos: apiCourses.filter(course => course.type === 'video').map(transformCourseData),
        books: apiCourses.filter(course => course.type === 'book').map(transformCourseData),
        businessPlans: apiCourses.filter(course => course.type === 'business-plan').map(transformCourseData)
      }
      
      setCourses(transformedCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      // Keep existing static data as fallback
    } finally {
      setLoading(false)
    }
  }

  // Static courses data as fallback
  const staticVideos = []
  const staticBooks = []
  const staticBusinessPlans = []



  const filterOptions = {
    videos: {
      category: ['Business', 'Technology', 'Marketing', 'Finance', 'Design', 'Health', 'Education', 'Personal Development', 'Leadership', 'Entrepreneurship', 'Data Science', 'Programming', 'Photography', 'Music', 'Art'],
      level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      language: ['English', 'Swahili', 'Arabic', 'French', 'Spanish', 'Portuguese', 'Italian', 'Dutch'],
      price: ['Free', 'Paid'],
      format: ['Course', 'Tutorial', 'Webinar', 'Documentary', 'Interview', 'Workshop']
    },
    books: {
      category: ['Business', 'Technology', 'Self-Help', 'Biography', 'Finance', 'Marketing', 'Leadership', 'Health', 'Education', 'Fiction', 'Non-Fiction', 'History', 'Science', 'Philosophy'],
      format: ['PDF', 'EPUB', 'MOBI', 'Audiobook', 'Physical'],
      language: ['English', 'Swahili', 'Arabic', 'French', 'Spanish', 'Portuguese', 'Italian', 'Dutch'],
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

  const handleCardClick = (item, type) => {
    setSelectedItem({ ...item, type })
    setShowDetails(true)
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
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onClick={() => handleCardClick(video, 'video')}
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
            onClick={(e) => {
              e.stopPropagation()
              toggleSave(video.id)
            }}
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

                <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '12px' 
        }}>
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{
            flex: 1,
            backgroundColor: 'white',
            color: '#16a34a',
            border: '1px solid #16a34a',
            padding: '8px 12px',
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
            e.target.style.backgroundColor = '#16a34a'
            e.target.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white'
            e.target.style.color = '#16a34a'
          }}>
            <Play size={14} />
            Watch
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{
            flex: 1,
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
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
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onClick={() => handleCardClick(book, 'book')}
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
            onClick={(e) => {
              e.stopPropagation()
              toggleSave(book.id)
            }}
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
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{
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
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{
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
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onClick={() => handleCardClick(plan, 'business-plan')}
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
            onClick={(e) => {
              e.stopPropagation()
              toggleSave(plan.id)
            }}
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
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{
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
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{
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
    const currentCourses = courses.videos.length > 0 || courses.books.length > 0 || courses.businessPlans.length > 0 ? courses : { videos: staticVideos, books: staticBooks, businessPlans: staticBusinessPlans }
    
    switch (activeTab) {
      case 'videos':
        return currentCourses.videos
      case 'books':
        return currentCourses.books
      case 'business-plans':
        return currentCourses.businessPlans
      default:
        return currentCourses.videos
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
          padding: screenSize.isMobile ? '2px' : '4px',
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
                    gap: screenSize.isMobile ? '4px' : '6px',
                    padding: screenSize.isMobile ? '6px 8px' : '8px 12px',
                    backgroundColor: isActive ? '#16a34a' : 'transparent',
                    color: isActive ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: screenSize.isMobile ? '12px' : '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    minHeight: 'auto',
                    whiteSpace: 'nowrap'
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
                  <Icon size={screenSize.isMobile ? 12 : 14} />
                  {screenSize.isMobile ? (
                    tab.id === 'business-plans' ? 'Business Plans' : tab.label
                  ) : (
                    tab.label
                  )}
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

        {/* Details Modal */}
        {showDetails && selectedItem && (
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
          onClick={() => setShowDetails(false)}>
            <div style={{
              backgroundColor: 'white',
              width: screenSize.isMobile ? '100%' : 'min(600px, 90vw)',
              maxHeight: screenSize.isMobile ? '80vh' : '85vh',
              borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
              overflowY: 'auto',
              transform: showDetails ? 'translateY(0)' : (screenSize.isMobile ? 'translateY(100%)' : 'scale(0.9)'),
              opacity: showDetails ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}>
              
              {/* Header Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={selectedItem.thumbnail || selectedItem.cover || selectedItem.preview} 
                  alt={selectedItem.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px'
                }}>
                  <button
                    onClick={() => setShowDetails(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={20} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: screenSize.isMobile ? '16px 12px' : '24px' }}>
                {/* Type and Status */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: selectedItem.type === 'video' ? '#16a34a' : selectedItem.type === 'book' ? '#7c3aed' : '#dc2626',
                    backgroundColor: selectedItem.type === 'video' ? '#f0fdf4' : selectedItem.type === 'book' ? '#f3e8ff' : '#fee2e2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {selectedItem.type === 'business-plan' ? 'Business Plan' : selectedItem.type}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'white',
                    backgroundColor: selectedItem.isPro ? '#3b82f6' : '#16a34a',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    {selectedItem.isPro ? 'PRO' : 'FREE'}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {selectedItem.title}
                </h2>

                {/* Author/Instructor */}
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: '0 0 16px 0'
                }}>
                  {selectedItem.type === 'video' ? `by ${selectedItem.instructor}` : 
                   selectedItem.type === 'book' ? `by ${selectedItem.author}` : 
                   selectedItem.category}
                </p>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  {selectedItem.type === 'video' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {selectedItem.duration}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Play size={14} />
                        {selectedItem.lessons} lessons
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} />
                        {selectedItem.students?.toLocaleString()} students
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'book' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={14} />
                        {selectedItem.pages} pages
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={14} />
                        {selectedItem.format}
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'business-plan' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={14} />
                        {selectedItem.pages} pages
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} />
                        {selectedItem.downloads} downloads
                      </div>
                    </>
                  )}
                </div>

                {/* Rating */}
                {selectedItem.rating && (
                  <div style={{ marginBottom: '20px' }}>
                    {renderStars(selectedItem.rating)}
                  </div>
                )}

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0'
                  }}>
                    Overview
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedItem.description}
                  </p>
                </div>

                {/* Curriculum for Videos */}
                {selectedItem.type === 'video' && selectedItem.curriculum && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Course Curriculum
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedItem.curriculum.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: index === selectedItem.curriculum.length - 1 ? '0' : '8px',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#16a34a',
                            fontWeight: '600',
                            marginRight: '8px',
                            minWidth: '20px'
                          }}>
                            {index + 1}.
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What You'll Learn for Videos */}
                {selectedItem.type === 'video' && selectedItem.whatYouLearn && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      What You'll Learn
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedItem.whatYouLearn.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#16a34a',
                            marginRight: '8px',
                            marginTop: '2px'
                          }}>✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table of Contents for Books */}
                {selectedItem.type === 'book' && selectedItem.tableOfContents && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Table of Contents
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedItem.tableOfContents.map((chapter, index) => (
                        <div key={index} style={{
                          padding: '6px 0',
                          borderBottom: index === selectedItem.tableOfContents.length - 1 ? 'none' : '1px solid #e2e8f0',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          {chapter}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Topics for Books */}
                {selectedItem.type === 'book' && selectedItem.keyTopics && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Key Topics Covered
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedItem.keyTopics.map((topic, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#7c3aed',
                            marginRight: '8px',
                            marginTop: '2px'
                          }}>•</span>
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plan Sections for Business Plans */}
                {selectedItem.type === 'business-plan' && selectedItem.planSections && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Plan Sections
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedItem.planSections.map((section, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: index === selectedItem.planSections.length - 1 ? '0' : '8px',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#dc2626',
                            fontWeight: '600',
                            marginRight: '8px',
                            minWidth: '20px'
                          }}>
                            {index + 1}.
                          </span>
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Includes for Business Plans */}
                {selectedItem.type === 'business-plan' && selectedItem.includes && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      What's Included
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedItem.includes.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#dc2626',
                            marginRight: '8px',
                            marginTop: '2px'
                          }}>✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedItem.tags && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Topics
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedItem.tags.map((tag, index) => (
                        <span key={index} style={{
                          fontSize: '12px',
                          color: '#16a34a',
                          backgroundColor: '#f0fdf4',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
