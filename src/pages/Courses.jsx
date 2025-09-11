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
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
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
    // Match the exact structure from admin Content.jsx transformCourseAdminItem
    const baseCourse = {
      id: apiCourse.id.toString(),
      title: apiCourse.title,
      description: apiCourse.description,
      tags: Array.isArray(apiCourse.learning_objectives) ? apiCourse.learning_objectives : [],
      isPro: apiCourse.is_free === false,
      rating: apiCourse.rating || 4.5,
      students: apiCourse.enrollment_count || apiCourse.students_count || 0,
      postedTime: apiCourse.created_at ? new Date(apiCourse.created_at).toLocaleDateString() : 'Recently',
      // Additional fields from admin structure
      type: apiCourse.type || apiCourse.course_type || 'video',
      language: apiCourse.language || 'English',
      format: apiCourse.format || null,
      author_type: apiCourse.author_type || null,
      page_count: apiCourse.page_count || null,
      duration_hours: apiCourse.duration_hours || null,
      duration_minutes: apiCourse.duration_minutes || null,
      duration: apiCourse.duration || (apiCourse.duration_hours && apiCourse.duration_minutes ? 
        `${apiCourse.duration_hours}h ${apiCourse.duration_minutes}m` :
        apiCourse.duration_hours ? `${apiCourse.duration_hours}h` :
        apiCourse.duration_minutes ? `${apiCourse.duration_minutes}m` : 'Not specified'),
      business_type: apiCourse.business_type || null,
      industry_sector: apiCourse.industry_sector || null,
      stage: apiCourse.stage || null,
      file_size: apiCourse.file_size || null,
      target_audience: apiCourse.target_audience || null,
      download_url: apiCourse.download_url || null,
      video_url: apiCourse.video_url || null
    }

    // Transform based on course type
    if (apiCourse.type === 'video' || apiCourse.course_type === 'video') {
      return {
        ...baseCourse,
        instructor: apiCourse.instructor || 'Unknown Instructor',
        thumbnail: apiCourse.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
        lessons: apiCourse.lessons_count || 0,
        level: apiCourse.level || 'Beginner',
        curriculum: apiCourse.curriculum || [],
        prerequisites: apiCourse.prerequisites || [],
        whatYouWillLearn: Array.isArray(apiCourse.learning_objectives) ? apiCourse.learning_objectives : []
      }
    } else if (apiCourse.type === 'book' || apiCourse.course_type === 'book') {
      return {
        ...baseCourse,
        author: apiCourse.instructor || apiCourse.author || 'Unknown Author',
        cover: apiCourse.thumbnail_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=240&fit=crop',
        pages: apiCourse.page_count || 0,
        chapters: apiCourse.chapters || [],
        keyTopics: apiCourse.key_topics || []
      }
    } else if (apiCourse.type === 'business-plan' || apiCourse.course_type === 'business-plan') {
      return {
        ...baseCourse,
        preview: apiCourse.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
        pages: apiCourse.page_count || 0,
        sections: apiCourse.sections_count || 0,
        downloads: apiCourse.downloads_count || 0,
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
      const apiCourses = response.courses || []
      
      console.log('🔍 API Response:', response)
      console.log('📚 Raw courses:', apiCourses)
      console.log('📊 Course count:', apiCourses.length)
      
      // Transform and categorize courses
      const transformedCourses = {
        videos: apiCourses.filter(course => course.type === 'video' || course.course_type === 'video').map(transformCourseData),
        books: apiCourses.filter(course => course.type === 'book' || course.course_type === 'book').map(transformCourseData),
        businessPlans: apiCourses.filter(course => course.type === 'business-plan' || course.course_type === 'business-plan').map(transformCourseData)
      }
      
      console.log('🎯 Transformed courses:', transformedCourses)
      console.log('📹 Videos:', transformedCourses.videos.length)
      console.log('📖 Books:', transformedCourses.books.length)
      console.log('📋 Business Plans:', transformedCourses.businessPlans.length)
      
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
      category: ['Technology', 'Finance', 'Healthcare', 'Education', 'Energy', 'Utilities', 'Manufacturing', 'Industrial', 'Consumer', 'Retail', 'Food', 'Agriculture', 'Media', 'Entertainment', 'Marketing', 'Design', 'Real Estate', 'Construction', 'Transportation', 'Logistics', 'Government', 'Nonprofit', 'Legal', 'HR', 'Business', 'Consulting', 'Arts', 'Lifestyle', 'Leadership', 'Personal Development', 'Communication', 'Psychology', 'Coaching', 'Mentoring', 'Motivation', 'Productivity', 'Time Management', 'Goal Setting', 'Career Development', 'Networking', 'Public Speaking', 'Team Building', 'Conflict Resolution', 'Emotional Intelligence', 'Mindfulness', 'Wellness', 'Fitness', 'Nutrition', 'Mental Health', 'Relationships', 'Parenting', 'Finance & Money', 'Entrepreneurship', 'Innovation', 'Creativity', 'Problem Solving', 'Critical Thinking', 'Research', 'Writing', 'Language Learning', 'Travel', 'Culture', 'History', 'Philosophy', 'Religion', 'Spirituality', 'Other'],
      level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      language: ['English', 'Swahili', 'Arabic', 'French', 'Spanish', 'Portuguese', 'Italian', 'Dutch'],
      price: ['Free', 'Paid'],
      format: ['Course', 'Tutorial', 'Webinar', 'Documentary', 'Interview', 'Workshop']
    },
    books: {
      category: ['Technology', 'Finance', 'Healthcare', 'Education', 'Energy', 'Utilities', 'Manufacturing', 'Industrial', 'Consumer', 'Retail', 'Food', 'Agriculture', 'Media', 'Entertainment', 'Marketing', 'Design', 'Real Estate', 'Construction', 'Transportation', 'Logistics', 'Government', 'Nonprofit', 'Legal', 'HR', 'Business', 'Consulting', 'Arts', 'Lifestyle', 'Leadership', 'Personal Development', 'Communication', 'Psychology', 'Coaching', 'Mentoring', 'Motivation', 'Productivity', 'Time Management', 'Goal Setting', 'Career Development', 'Networking', 'Public Speaking', 'Team Building', 'Conflict Resolution', 'Emotional Intelligence', 'Mindfulness', 'Wellness', 'Fitness', 'Nutrition', 'Mental Health', 'Relationships', 'Parenting', 'Finance & Money', 'Entrepreneurship', 'Innovation', 'Creativity', 'Problem Solving', 'Critical Thinking', 'Research', 'Writing', 'Language Learning', 'Travel', 'Culture', 'History', 'Philosophy', 'Religion', 'Spirituality', 'Other'],
      format: ['PDF', 'EPUB', 'MOBI', 'Audiobook', 'Physical'],
      language: ['English', 'Swahili', 'Arabic', 'French', 'Spanish', 'Portuguese', 'Italian', 'Dutch'],
      authorType: ['Bestselling Author', 'Industry Expert', 'Academic', 'Entrepreneur']
    },
    businessPlans: {
      industrySector: ['Technology', 'Finance', 'Healthcare', 'Education', 'Energy', 'Utilities', 'Manufacturing', 'Industrial', 'Consumer', 'Retail', 'Food', 'Agriculture', 'Media', 'Entertainment', 'Marketing', 'Design', 'Real Estate', 'Construction', 'Transportation', 'Logistics', 'Government', 'Nonprofit', 'Legal', 'HR', 'Business', 'Consulting', 'Arts', 'Lifestyle', 'Leadership', 'Personal Development', 'Communication', 'Psychology', 'Coaching', 'Mentoring', 'Motivation', 'Productivity', 'Time Management', 'Goal Setting', 'Career Development', 'Networking', 'Public Speaking', 'Team Building', 'Conflict Resolution', 'Emotional Intelligence', 'Mindfulness', 'Wellness', 'Fitness', 'Nutrition', 'Mental Health', 'Relationships', 'Parenting', 'Finance & Money', 'Entrepreneurship', 'Innovation', 'Creativity', 'Problem Solving', 'Critical Thinking', 'Research', 'Writing', 'Language Learning', 'Travel', 'Culture', 'History', 'Philosophy', 'Religion', 'Spirituality', 'Other'],
      businessType: ['Startup', 'Small Business', 'Enterprise', 'Non-profit', 'Franchise', 'Online Business'],
      stage: ['Idea', 'Planning', 'Launch', 'Growth', 'Established']
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onClick={() => setSelectedItem({ ...video, type: 'course' })}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={video.thumbnail_url ? (video.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${video.thumbnail_url}` : video.thumbnail_url) : video.thumbnail} 
          alt={video.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          {video.isPro && (
            <span style={{
              backgroundColor: '#3b82f6',
          color: 'white',
          padding: '4px 8px',
              borderRadius: '6px',
          fontSize: '12px',
            fontWeight: '600'
          }}>
              PRO
          </span>
          )}
          <span style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {video.duration || 
              (video.duration_hours && video.duration_minutes ? 
                `${video.duration_hours}h ${video.duration_minutes}m` :
                video.duration_hours ? `${video.duration_hours}h` :
                video.duration_minutes ? `${video.duration_minutes}m` : 'N/A')}
          </span>
        </div>
            </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
        <h3 style={{
            fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
            margin: 0,
            lineHeight: '1.4',
            flex: 1
        }}>
          {video.title}
        </h3>
        </div>

        {/* Instructor */}
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Users size={14} />
          by {video.instructor || video.author || 'Unknown Instructor'}
        </p>

        {/* Industry (from category) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#64748b',
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          <Building size={14} />
          <span>{video.category || '—'}</span>
        </div>

        {/* Stats */}
                <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={14} />
              {(video.download_count ?? video.enrollment_count ?? video.students ?? 0)} downloads
            </div>
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '4px 8px',
            borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {video.format || '—'}
            </span>
          </div>
          <span style={{
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {video.level}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            backgroundColor: video.isPro ? '#3b82f6' : '#10b981',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {video.isPro ? 'Pro' : 'Free'}
          </span>
          <button style={{
            marginLeft: 'auto',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (video.video_url) {
              const fullUrl = video.video_url.startsWith('http')
                ? video.video_url
                : `http://localhost:8000${video.video_url}`;
              setVideoUrl(fullUrl);
              setVideoTitle(video.title);
              setShowVideoPlayer(true);
            } else {
              alert('Video file not available');
            }
          }}>
            Watch
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onClick={() => setSelectedItem({ ...book, type: 'course' })}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      {/* Cover */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={book.thumbnail_url ? (book.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${book.thumbnail_url}` : book.thumbnail_url) : book.cover} 
          alt={book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          {book.isPro && (
          <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
            fontWeight: '600'
          }}>
              PRO
          </span>
          )}
          <span style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {book.format || 'PDF'}
          </span>
        </div>
                </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
        <h3 style={{
            fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
            margin: 0,
            lineHeight: '1.4',
            flex: 1
        }}>
          {book.title}
        </h3>
        </div>

        {/* Author */}
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Users size={14} />
          by {book.instructor || book.author || 'Unknown Author'}
        </p>

        {/* Industry (from category) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#64748b',
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          <Building size={14} />
          <span>{book.category || '—'}</span>
          {book.author_type && (
            <>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span>{book.author_type}</span>
            </>
          )}
              </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={14} />
              {book.page_count || book.pages || 0} pages
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={14} />
              {(book.download_count ?? 0)} downloads
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
              fontWeight: '600'
            }}>
              {book.level || 'Beginner'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{
            display: 'flex',
          gap: '8px'
        }}>
          <span style={{
            backgroundColor: book.isPro ? '#3b82f6' : '#10b981',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {book.isPro ? 'Pro' : 'Free'}
          </span>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginLeft: 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (book.download_url) {
              const fullUrl = book.download_url.startsWith('http')
                ? book.download_url
                : `http://localhost:8000${book.download_url}`;
              window.open(fullUrl, '_blank');
            } else {
              alert('Download file not available');
            }
          }}>
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onClick={() => setSelectedItem({ ...plan, type: 'course' })}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      {/* Preview */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={plan.thumbnail_url ? (plan.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${plan.thumbnail_url}` : plan.thumbnail_url) : plan.preview} 
          alt={plan.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          {plan.isPro && (
          <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
            fontWeight: '600'
          }}>
              PRO
                  </span>
          )}
          <span style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {(() => {
              const fmt = (plan.format || '').toString().trim();
              if (fmt) return fmt.toUpperCase();
              const url = plan.download_url || '';
              const m = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
              const ext = m ? m[1].toLowerCase() : '';
              if (!ext) return 'N/A';
              if (ext === 'pdf') return 'PDF';
              if (ext === 'doc' || ext === 'docx') return 'DOCX';
              if (ext === 'ppt' || ext === 'pptx') return 'PPTX';
              if (ext === 'xls' || ext === 'xlsx') return 'XLSX';
              return ext.toUpperCase();
            })()}
                  </span>
        </div>
                </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
        <h3 style={{
            fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
            margin: 0,
            lineHeight: '1.4',
            flex: 1
        }}>
          {plan.title}
                </h3>
        </div>

        {/* Instructor line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} />
            <span>{plan.instructor || plan.author || 'Instructor'}</span>
          </div>
        </div>

        {/* Industry sector and Business type line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={14} />
            <span>{plan.category || '—'}</span>
            <Briefcase size={14} />
            <span style={{ fontWeight: 600 }}>{plan.business_type || '—'}</span>
                  </div>
                </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={14} />
              {plan.page_count || plan.pages || 0} pages
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={14} />
              {(plan.download_count ?? plan.enrollment_count ?? plan.downloads ?? 0)} downloads
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
              fontWeight: '600'
            }}>
              {plan.stage || 'Startup'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{
            display: 'flex',
          gap: '8px'
        }}>
          <span style={{
            backgroundColor: plan.isPro ? '#3b82f6' : '#10b981',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {plan.isPro ? 'Pro' : 'Free'}
          </span>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginLeft: 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (plan.download_url) {
              const fullUrl = plan.download_url.startsWith('http')
                ? plan.download_url
                : `http://localhost:8000${plan.download_url}`;
              window.open(fullUrl, '_blank');
            } else {
              alert('Download file not available');
            }
          }}>
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
                {/* Header with Type, Category, Level, Duration/Pages */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
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
                  <span style={{ color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedItem.category}
                  </span>
                  <span style={{ color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedItem.level || 'beginner'}
                  </span>
                  {(selectedItem.type === 'video' || selectedItem.type === 'video') && (selectedItem.duration || selectedItem.duration_hours || selectedItem.duration_minutes) && (
                    <>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.duration ||
                          (selectedItem.duration_hours && selectedItem.duration_minutes ?
                            `${selectedItem.duration_hours}h ${selectedItem.duration_minutes}m` :
                            selectedItem.duration_hours ? `${selectedItem.duration_hours}h` :
                            `${selectedItem.duration_minutes}m`)}
                      </span>
                    </>
                  )}
                  {(selectedItem.type === 'book' || selectedItem.type === 'business-plan') && selectedItem.page_count && (
                    <>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.page_count} pages
                      </span>
                    </>
                  )}
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

                {/* Course Details */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Course Details
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    {selectedItem.type === 'video' && (
                      <>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Video Course</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Instructor</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.instructor}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Duration</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.duration || 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Level</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.level}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Language</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.language}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Downloads</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.students || 0}</div>
                        </div>
                      </>
                    )}
                    {selectedItem.type === 'book' && (
                      <>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Book</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Author</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.author}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Pages</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.page_count || selectedItem.pages || 0}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Format</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.format}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Language</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.language}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Author Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.author_type || selectedItem.authorType}</div>
                        </div>
                      </>
                    )}
                    {selectedItem.type === 'business-plan' && (
                      <>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Business Plan</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Pages</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.page_count || selectedItem.pages || 0}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Industry</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.industry_sector || selectedItem.category}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Business Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.business_type}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Stage</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.stage}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Format</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{selectedItem.format}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0'
                  }}>
                    Course Description
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
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Tags
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

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  {selectedItem.type === 'video' && selectedItem.video_url && (
                    <button
                      onClick={() => {
                        const fullUrl = selectedItem.video_url.startsWith('http')
                          ? selectedItem.video_url
                          : `http://localhost:8000${selectedItem.video_url}`;
                        setVideoUrl(fullUrl);
                        setVideoTitle(selectedItem.title);
                        setShowVideoPlayer(true);
                      }}
                      style={{
                        backgroundColor: '#f97316',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#ea580c';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f97316';
                      }}
                    >
                      <Play size={18} />
                      Watch Video
                    </button>
                  )}

                  {(selectedItem.type === 'book' || selectedItem.type === 'business-plan') && selectedItem.download_url && (
                    <button
                      onClick={() => {
                        const fullUrl = selectedItem.download_url.startsWith('http')
                          ? selectedItem.download_url
                          : `http://localhost:8000${selectedItem.download_url}`;
                        window.open(fullUrl, '_blank');
                      }}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#3b82f6';
                      }}
                    >
                      <Download size={18} />
                      Download {selectedItem.type === 'book' ? 'Book' : selectedItem.type === 'business-plan' ? 'Business Plan' : 'File'}
                    </button>
                  )}
                </div>


              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {showVideoPlayer && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => setShowVideoPlayer(false)}>
            <div style={{
              position: 'relative',
              backgroundColor: 'black',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button
                onClick={() => setShowVideoPlayer(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  zIndex: 10
                }}
              >
                ×
              </button>

              {/* Video title */}
              {videoTitle && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  zIndex: 10,
                  maxWidth: 'calc(100% - 120px)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {videoTitle}
                </div>
              )}

              {/* Video player */}
              <video
                src={videoUrl}
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  minWidth: '400px',
                  minHeight: '300px',
                  maxWidth: '90vw',
                  maxHeight: '90vh'
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
