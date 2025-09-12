import React, { useState, useEffect } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { apiService, resolveAssetUrl } from '../lib/api-service'
import { useAuth } from '../contexts/AuthContext'
import { countries } from '../utils/countries'
import { 
  generateCoverLetter, 
  generateProfileSummary, 
  generateExperienceSummary, 
  generateEducationSummary,
  getTypeColor,
  getTypeIcon
} from '../utils/contentGenerators'

import { 
  Bookmark, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  ExternalLink,
  Trash2,
  Filter,
  Star,
  Building2,
  Shield,
  Factory,
  Calendar,
  Users,
  X,
  Play,
  Building,
  Download
} from 'lucide-react'

// Helper available to the whole component to format deadlines
const formatDeadline = (deadline) => {
  if (!deadline) return 'Not specified'
  try {
    const date = new Date(deadline)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return deadline
  }
}

const Bookmarks = () => {
  const screenSize = useResponsive()
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState('video')
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')

  useEffect(() => {
    // Test if user is logged in
    const token = localStorage.getItem('auth-token')
    if (!token) {
      console.log('No auth token found - user not logged in')
      // Still show static data for testing
      const transformedStatic = staticBookmarks.map(transformBookmarkData)
      setBookmarks(transformedStatic)
    } else {
      console.log('Auth token found, fetching bookmarks...')
    fetchBookmarks()
    }
    // Listen for cross-page bookmark changes
    const handleAdded = () => fetchBookmarks()
    const handleRemoved = () => fetchBookmarks()
    window.addEventListener('bookmarkAdded', handleAdded)
    window.addEventListener('bookmarkRemoved', handleRemoved)
    return () => {
      window.removeEventListener('bookmarkAdded', handleAdded)
      window.removeEventListener('bookmarkRemoved', handleRemoved)
    }
  }, [])

  const transformBookmarkData = (apiBookmark) => {
    const baseData = {
      id: apiBookmark.id,
      saved: apiBookmark.created_at ? new Date(apiBookmark.created_at).toLocaleDateString() : 'Recently',
      featured: apiBookmark.is_featured || false
    }

    // Convert country code to full country name
    const getCountryName = (countryCode) => {
      if (!countryCode) return 'Not specified'
      const country = countries.find(c => c.code === countryCode)
      return country ? country.name : countryCode
    }

    // Format deadline
    const formatDeadline = (deadline) => {
      if (!deadline) return 'Not specified'
      try {
        const date = new Date(deadline)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      } catch {
        return deadline
      }
    }

    // Check if deadline has passed
    const isDeadlineExpired = (deadline) => {
      if (!deadline) return false
      try {
        const deadlineDate = new Date(deadline)
        const now = new Date()
        return deadlineDate < now
      } catch {
        return false
      }
    }

    if (apiBookmark.job) {
          const j = apiBookmark.job
          baseData.originalId = j.id
          const min = j?.salary_min != null ? Number(j.salary_min) : undefined
          const max = j?.salary_max != null ? Number(j.salary_max) : undefined
          const fmt = (n) => typeof n === 'number' && !Number.isNaN(n) ? n.toLocaleString() : ''
      let salary
      if (min != null && max != null) {
        salary = min === max
          ? `${j.currency} ${fmt(min)}`
          : `${j.currency} ${fmt(min)} - ${j.currency} ${fmt(max)}`
      } else if (min != null) {
        salary = `${j.currency} ${fmt(min)}`
      } else if (max != null) {
        salary = `${j.currency} ${fmt(max)}`
      } else {
        salary = 'Salary not specified'
      }

      return {
        ...baseData,
        type: 'job',
        title: j.title,
        company: j.company,
        industry: j.industry || 'Not specified',
        location: j.location,
        country: getCountryName(j.country),
        salary,
        workType: j.job_type ? j.job_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : 'Not specified',
        workTypeMode: j.work_type ? j.work_type.charAt(0).toUpperCase() + j.work_type.slice(1).replace('-', ' ') : 'Not specified',
        experience: j.experience_years ? `${j.experience_years} years` : (j.experience_level ? j.experience_level.charAt(0).toUpperCase() + j.experience_level.slice(1) + ' level' : 'Not specified'),
        skills: j.skills || [],
        tags: j.tags || [],
        description: j.description,
        benefits: j.benefits || [],
        posted: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Recently',
        isRemote: j.work_type === 'remote',
        urgentHiring: j.is_urgent || false,
        price: j.price || null,
        postedBy: j.posted_by || 'platform',
        externalUrl: j.external_url,
        contactEmail: j.contact_email,
        contactPhone: j.contact_phone,
        applicationDeadline: j.application_deadline,
        deadline: formatDeadline(j.application_deadline),
        isDeadlineExpired: isDeadlineExpired(j.application_deadline),
        isFeatured: j.is_featured || false,
        status: j.status || 'active',
        applicants: j.applicants || 0,
        logo: j.company_logo ? resolveAssetUrl(j.company_logo) : null
      }
    } else if (apiBookmark.opportunity) {
      const o = apiBookmark.opportunity
      baseData.originalId = o.id
      
      // Parse arrays from JSON strings (same logic as main Opportunities page)
      const parseToArray = (val) => {
        if (!val && val !== 0) return []
        if (Array.isArray(val)) {
          return val
            .map(item => typeof item === 'string' ? item.trim() : item)
            .filter(item => item !== null && item !== undefined && String(item).trim() !== '')
        }
        if (typeof val === 'string') {
          const str = val.trim()
          if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
            try { return parseToArray(JSON.parse(str)) } catch (_) {}
          }
          return str.split(/\r?\n|,/).map(s => s.trim()).filter(s => s.length > 0)
        }
        return [val]
      }
      
      console.log('Opportunity data:', {
        id: o.id,
        title: o.title,
        poster: o.poster,
        cover_image: o.cover_image,
        coverImage: o.coverImage,
        organization_logo: o.organization_logo
      })
      return {
        ...baseData,
        type: 'opportunity',
        title: o.title,
        organization: o.organization,
        company: o.organization,
        category: o.category || 'Not specified',
        industry: o.category || 'Not specified',
        location: o.location || 'Not specified',
        country: getCountryName(o.country),
        duration: o.duration || 'Not specified',
        salary: (() => {
          if (o.amount_min && o.amount_max) {
            const min = parseFloat(o.amount_min)
            const max = parseFloat(o.amount_max)
            if (min === max) {
              return `${o.currency} ${min.toLocaleString()}`
            } else {
              return `${o.currency} ${min.toLocaleString()} - ${o.currency} ${max.toLocaleString()}`
            }
          } else if (o.amount_min) {
            const min = parseFloat(o.amount_min)
            return `${o.currency} ${min.toLocaleString()}`
          }
          return 'Not specified'
        })(),
        opportunityType: o.type || 'Not specified',
        experience: o.experience_level || 'Not specified',
        skills: o.skills || [],
        tags: parseToArray(o.tags),
        description: o.description,
        benefits: parseToArray(o.benefits),
        requirements: parseToArray(o.requirements),
        posted: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: o.is_urgent || false,
        price: o.price || 'Free',
        postedBy: o.posted_by || 'platform',
        externalUrl: o.external_url,
        contactEmail: o.contact_email,
        applicationDeadline: o.deadline,
        deadline: formatDeadline(o.deadline),
        isDeadlineExpired: isDeadlineExpired(o.deadline),
        isFeatured: o.is_featured || false,
        status: o.status || 'active',
        applicants: o.applicants || 0,
        logo: o.organization_logo ? resolveAssetUrl(o.organization_logo) : null,
        poster: (() => {
          // Same logic as main Opportunities page
          const fromDocs = Array.isArray(o.documents) ? o.documents.find(d => d && d.type === 'cover') : null
          const url = fromDocs?.url || null
          const resolved = url ? (url.startsWith('http') ? url : `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`) : null
          if (resolved) return resolved
          if (o.organization_logo) {
            const logo = o.organization_logo.startsWith('http') ? o.organization_logo : `http://localhost:8000${o.organization_logo.startsWith('/') ? '' : '/'}${o.organization_logo}`
            return logo
          }
          return null
        })()
      }
      console.log('Transformed opportunity:', {
        id: o.id,
        title: o.title,
        poster: (() => {
          // Same logic as main Opportunities page
          const fromDocs = Array.isArray(o.documents) ? o.documents.find(d => d && d.type === 'cover') : null
          const url = fromDocs?.url || null
          const resolved = url ? (url.startsWith('http') ? url : `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`) : null
          if (resolved) return resolved
          if (o.organization_logo) {
            const logo = o.organization_logo.startsWith('http') ? o.organization_logo : `http://localhost:8000${o.organization_logo.startsWith('/') ? '' : '/'}${o.organization_logo}`
            return logo
          }
          return null
        })()
      })
    } else if (apiBookmark.tender) {
      const t = apiBookmark.tender
      baseData.originalId = t.id
      
      // Format contract value properly
      let contractValue = 'Not specified'
      if (t.contract_value_min && t.contract_value_max) {
        const min = parseFloat(t.contract_value_min)
        const max = parseFloat(t.contract_value_max)
        if (min === max) {
          contractValue = `${t.currency} ${min.toLocaleString()}`
        } else {
          contractValue = `${t.currency} ${min.toLocaleString()} - ${t.currency} ${max.toLocaleString()}`
        }
      } else if (t.contract_value_min) {
        const min = parseFloat(t.contract_value_min)
        contractValue = `${t.currency} ${min.toLocaleString()}`
      }
      
      return {
        ...baseData,
        type: 'tender',
        title: t.title,
        organization: t.organization,
        company: t.organization,
        sector: t.sector || 'Not specified',
        industry: t.sector || 'Not specified',
        location: t.location,
        country: getCountryName(t.country),
        contractValue,
        budget: contractValue,
        salary: contractValue,
        duration: t.duration || 'Not specified',
        tenderType: t.type || 'Not specified',
        experience: t.experience_level || 'Not specified',
        skills: t.skills || [],
        tags: t.tags || [],
        description: t.description,
        benefits: t.benefits || [],
        requirements: t.requirements || [],
        submissionProcess: t.submission_process || [],
        evaluationCriteria: t.evaluation_criteria || [],
        posted: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: t.is_urgent || false,
        isUrgent: t.is_urgent || false,
        price: t.price || 'Free',
        postedBy: t.posted_by || 'platform',
        externalUrl: t.external_url,
        contactEmail: t.contact_email,
        applicationDeadline: t.deadline,
        deadline: formatDeadline(t.deadline),
        isDeadlineExpired: isDeadlineExpired(t.deadline),
        isFeatured: t.is_featured || false,
        status: t.status || 'active',
        applicants: t.applicants || 0,
        logo: t.organization_logo ? resolveAssetUrl(t.organization_logo) : null,
        coverImage: (() => {
          const coverImg = t.cover_image || t.coverImage || t.organization_logo
          return coverImg ? resolveAssetUrl(coverImg) : null
        })()
      }
    } else if (apiBookmark.course) {
      const c = apiBookmark.course
      baseData.originalId = c.id
      const courseType = c.type || c.course_type || 'video'
      
      // Base course data
      const baseCourse = {
        ...baseData,
        type: courseType,
        title: c.title,
        description: c.description,
        tags: Array.isArray(c.learning_objectives) ? c.learning_objectives : [],
        isPro: c.is_free === false,
        rating: c.rating || 4.5,
        students: c.enrollment_count || c.students_count || 0,
        postedTime: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recently',
        language: c.language || 'English',
        format: c.format || null,
        author_type: c.author_type || null,
        level: c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : 'Beginner',
        page_count: c.page_count || null,
        duration_hours: c.duration_hours || null,
        duration_minutes: c.duration_minutes || null,
        duration: c.duration || (c.duration_hours && c.duration_minutes ? 
          `${c.duration_hours}h ${c.duration_minutes}m` :
          c.duration_hours ? `${c.duration_hours}h` :
          c.duration_minutes ? `${c.duration_minutes}m` : 'Not specified'),
        business_type: c.business_type || null,
        industry_sector: c.industry_sector || null,
        stage: c.stage || null,
        file_size: c.file_size || null,
        target_audience: c.target_audience || null,
        download_url: c.download_url || null,
        video_url: c.video_url || null,
        category: c.category || 'General',
        thumbnail_url: c.thumbnail_url || null
      }

      // Course type specific data
      if (courseType === 'video') {
        return {
          ...baseCourse,
          instructor: c.instructor || 'Unknown Instructor',
          thumbnail: c.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
          lessons: c.lessons_count || 0,
          curriculum: c.curriculum || [],
          prerequisites: c.prerequisites || [],
          whatYouWillLearn: Array.isArray(c.learning_objectives) ? c.learning_objectives : []
        }
      } else if (courseType === 'book') {
        return {
          ...baseCourse,
          author: c.instructor || c.author || 'Unknown Author',
          cover: c.thumbnail_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=240&fit=crop',
          pages: c.page_count || 0,
          chapters: c.chapters || [],
          keyTopics: c.key_topics || []
        }
      } else if (courseType === 'business-plan') {
        return {
          ...baseCourse,
          instructor: c.instructor || c.author || 'Unknown Instructor',
          preview: c.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
          pages: c.page_count || 0,
          sections: c.sections_count || 0,
          downloads: c.downloads_count || 0,
          planSections: c.plan_sections || [],
          includes: c.includes || []
        }
      }

      return baseCourse
    }

    return baseData
  }

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      console.log('Fetching bookmarks...')
      console.log('Auth token:', localStorage.getItem('auth-token'))
      
      const response = await apiService.get('/saved-items')
      console.log('Bookmarks API response:', response)
      console.log('Response success:', response.success)
      console.log('Response data:', response.data)
      console.log('Response items:', response.data?.items)
      console.log('Items length:', response.data?.items?.length)
      
      if (response.success && response.data && response.data.items && response.data.items.length > 0) {
        console.log('Found bookmarks in API, transforming...')
        const transformedBookmarks = response.data.items.map(transformBookmarkData)
        console.log('Transformed bookmarks:', transformedBookmarks)
        console.log('Bookmark types:', transformedBookmarks.map(b => ({ id: b.id, type: b.type })))
      setBookmarks(transformedBookmarks)
      } else {
        console.log('No bookmarks found in API response')
        console.log('Response success:', response.success)
        console.log('Response data exists:', !!response.data)
        console.log('Items exist:', !!response.data?.items)
        console.log('Items length:', response.data?.items?.length)
        console.log('Using static data as fallback')
        // Use static data as fallback
        const transformedStatic = staticBookmarks.map(transformBookmarkData)
        setBookmarks(transformedStatic)
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      console.error('Error details:', error.message)
      console.log('Using static data due to error')
      // Use static data as fallback
      const transformedStatic = staticBookmarks.map(transformBookmarkData)
      setBookmarks(transformedStatic)
    } finally {
      setLoading(false)
    }
  }

  // Static bookmarks data as fallback - formatted like API response
  const staticBookmarks = [
    {
      id: 'test-job-1',
      created_at: '2024-01-15T10:00:00Z',
      is_featured: false,
      job: {
        id: 'job-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        industry: 'Technology',
        location: 'San Francisco',
        country: 'US',
        salary_min: 80000,
        salary_max: 120000,
        currency: 'USD',
        job_type: 'full-time',
        experience_level: 'mid',
        skills: ['React', 'Node.js', 'JavaScript'],
        tags: ['React', 'Node.js', 'JavaScript'],
        description: 'Great opportunity for a software engineer',
        benefits: ['Health insurance', 'Remote work'],
        created_at: '2024-01-15T10:00:00Z',
        work_type: 'hybrid',
        is_urgent: false,
        price: 'Free',
        posted_by: 'platform',
        external_url: null,
        contact_email: 'hr@techcorp.com',
        application_deadline: '2024-02-15T23:59:59Z',
        is_featured: false,
        status: 'active',
        applicants: 25,
        company_logo: null
      }
    },
    {
      id: 'test-tender-1',
      created_at: '2024-01-20T10:00:00Z',
      is_featured: false,
      tender: {
        id: 'tender-1',
        title: 'IT Infrastructure Upgrade',
        organization: 'City Government',
        sector: 'Government',
        location: 'New York',
        country: 'US',
        contract_value_min: 500000,
        currency: 'USD',
        type: 'Infrastructure',
        skills: ['Cloud', 'Security'],
        tags: ['Infrastructure', 'Cloud', 'Security'],
        description: 'Major IT infrastructure upgrade project',
        benefits: ['Long-term contract'],
        created_at: '2024-01-20T10:00:00Z',
        is_urgent: false,
        price: 'Free',
        posted_by: 'platform',
        external_url: null,
        contact_email: 'procurement@city.gov',
        deadline: '2024-03-01T23:59:59Z',
        is_featured: false,
        status: 'active',
        applicants: 12,
        organization_logo: null,
        cover_image: null,
        coverImage: null
      }
    },
    {
      id: 'test-opportunity-1',
      created_at: '2024-01-25T10:00:00Z',
      is_featured: false,
      opportunity: {
        id: 'opportunity-1',
        title: 'Scholarship Program',
        organization: 'Education Foundation',
        category: 'Education',
        location: 'Remote',
        country: 'US',
        duration: '1 year',
        amount_min: 5000,
        currency: 'USD',
        type: 'Scholarship',
        experience_level: 'entry',
        skills: ['Academic'],
        tags: ['Education', 'Scholarship', 'Students'],
        description: 'Full scholarship for outstanding students',
        benefits: ['Full tuition', 'Living allowance'],
        created_at: '2024-01-25T10:00:00Z',
        is_urgent: false,
        price: 'Free',
        posted_by: 'platform',
        external_url: null,
        contact_email: 'scholarships@edfoundation.org',
        deadline: '2024-02-28T23:59:59Z',
        is_featured: false,
        status: 'active',
        applicants: 150,
        organization_logo: null,
        poster: null,
        cover_image: null,
        coverImage: null
      }
    }
  ]

  const filters = [
    { id: 'job', name: 'Jobs', count: bookmarks.filter(b => b.type === 'job').length, icon: Briefcase },
    { id: 'opportunity', name: 'Opportunities', count: bookmarks.filter(b => b.type === 'opportunity').length, icon: GraduationCap },
    { id: 'tender', name: 'Tenders', count: bookmarks.filter(b => b.type === 'tender').length, icon: FileText },
    { id: 'video', name: 'Videos', count: bookmarks.filter(b => b.type === 'video').length, icon: Play },
    { id: 'book', name: 'Books', count: bookmarks.filter(b => b.type === 'book').length, icon: BookOpen },
    { id: 'business-plan', name: 'Business Plans', count: bookmarks.filter(b => b.type === 'business-plan').length, icon: FileText }
  ]

  const filteredBookmarks = bookmarks.filter(bookmark => {
    return bookmark.type === selectedFilter
  })

  const removeBookmark = async (id) => {
    try {
      // Find the bookmark to get its type and original ID
      const bookmark = bookmarks.find(b => b.id === id)
      if (!bookmark) return

      // Check if user is authenticated
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Please log in to manage bookmarks.')
        return
      }

      // Create the key for API call
      let key
      if (bookmark.type === 'video' || bookmark.type === 'book' || bookmark.type === 'business-plan') {
        // For course items, use 'course' as the type
        key = `course_${bookmark.originalId || bookmark.id}`
      } else {
        key = `${bookmark.type}_${bookmark.originalId || bookmark.id}`
      }

      // Delete from API
      await apiService.delete(`/saved-items/${key}`)
      
      // Remove from local state
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id))
      
      // Update localStorage to sync with other pages
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '{}')
      
      if (bookmark.type === 'job') {
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
        const updatedJobs = savedJobs.filter(jobId => jobId !== bookmark.originalId)
        localStorage.setItem('savedJobs', JSON.stringify(updatedJobs))
        delete savedItems[`job_${bookmark.originalId}`]
      } else if (bookmark.type === 'tender') {
        const savedTenders = JSON.parse(localStorage.getItem('savedTenders') || '[]')
        const updatedTenders = savedTenders.filter(tenderId => tenderId !== bookmark.originalId)
        localStorage.setItem('savedTenders', JSON.stringify(updatedTenders))
        delete savedItems[`tender_${bookmark.originalId}`]
      } else if (bookmark.type === 'opportunity') {
        const savedOpportunities = JSON.parse(localStorage.getItem('savedOpportunities') || '[]')
        const updatedOpportunities = savedOpportunities.filter(oppId => oppId !== bookmark.originalId)
        localStorage.setItem('savedOpportunities', JSON.stringify(updatedOpportunities))
        delete savedItems[`opportunity_${bookmark.originalId}`]
      } else if (bookmark.type === 'video' || bookmark.type === 'book' || bookmark.type === 'business-plan') {
        // Handle course bookmarks
        const savedCourseItems = JSON.parse(localStorage.getItem('savedCourseItems') || '{}')
        delete savedCourseItems[key]
        localStorage.setItem('savedCourseItems', JSON.stringify(savedCourseItems))
      }
      
      localStorage.setItem('savedItems', JSON.stringify(savedItems))
      
      // Trigger a custom event to notify other pages
      window.dispatchEvent(new CustomEvent('bookmarkRemoved', { 
        detail: { 
          type: bookmark.type, 
          originalId: bookmark.originalId 
        } 
      }))
      
    } catch (error) {
      console.error('Error removing bookmark:', error)
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        alert('Please log in to manage bookmarks.')
      } else {
      alert('Failed to remove bookmark')
      }
    }
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setShowDetails(true)
  }

  const handleApply = async (item) => {
    console.log('Apply clicked for:', item.type, item.id)
    
    // Check if deadline has expired
    if (item.isDeadlineExpired) {
      alert(`This ${item.type} application is closed. The deadline has passed.`)
      return
    }
    
    if (item.type === 'job') {
      // Handle job application - EXACT same logic as Jobs.jsx
      // Check if user is authenticated
      if (!user) {
        alert('Please log in to apply for jobs.')
        return
      }

      // Check profile completeness for automatic application
      const isProfileComplete = checkProfileCompleteness()
      
      if (!isProfileComplete.complete) {
        // Show profile completion modal
        alert('Please complete your profile to apply for jobs. Go to your profile page to add missing information.')
        return
      }

      // Submit automatic application
      try {
        const applicationData = {
          application_type: 'job',
          job_id: parseInt(item.id),
          cover_letter: generateCoverLetter(item, user),
          application_data: {
            profile_summary: generateProfileSummary(user),
            skills: user.skills || [],
            experience_summary: generateExperienceSummary(user),
            education_summary: generateEducationSummary(user)
          }
        }

        console.log('Submitting application with data:', applicationData)
        console.log('User token:', localStorage.getItem('auth-token') ? 'Present' : 'Missing')
        
        const response = await apiService.post('/applications', applicationData)
        
        console.log('Application response:', response)
        
        if (response.success) {
          alert('Application submitted successfully! The company will review your profile and contact you if interested.')
          // Refresh bookmarks to update application count
          fetchBookmarks()
        } else {
          console.error('Application failed:', response.message)
          alert(response.message || 'Failed to submit application. Please try again.')
        }
      } catch (error) {
        console.error('Application error:', error)
        console.error('Error details:', error.message)
        alert(`Failed to submit application: ${error.message}`)
      }
    } else if (item.type === 'tender') {
      // Handle tender application - same logic as Tenders.jsx
      if (item.externalUrl) {
        window.open(item.externalUrl, '_blank')
      } else {
        // Show tender details modal as fallback
        setSelectedItem(item)
        setShowDetails(true)
      }
    } else if (item.type === 'opportunity') {
      // Handle opportunity application - same logic as Opportunities.jsx
      if (item.externalUrl) {
        window.open(item.externalUrl, '_blank')
      } else {
        // Fallback - could show a modal with external link or redirect
        alert('Please visit the organization\'s website to apply for this opportunity.')
      }
    }
  }

  const checkProfileCompleteness = () => {
    const requiredFields = [
      user?.first_name,
      user?.last_name,
      user?.email,
      user?.phone,
      user?.location,
      user?.industry,
      user?.current_job_title
    ]

    const hasRequiredFields = requiredFields.every(field => field && field.trim() !== '')
    const hasEducation = user?.education && user.education.length > 0
    const hasExperience = user?.experience && user.experience.length > 0

    return {
      complete: hasRequiredFields && (hasEducation || hasExperience),
      missingFields: {
        basicInfo: !hasRequiredFields,
        education: !hasEducation,
        experience: !hasExperience
      }
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job': return Briefcase
      case 'opportunity': return GraduationCap
      case 'tender': return FileText
      case 'course': return BookOpen
      default: return Bookmark
    }
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '16px 12px 90px 12px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: 0
        }}>
          Bookmarks
        </h1>
        
        <div style={{
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Bookmark size={12} />
          {bookmarks.length} saved items
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {filters.map(filter => {
          const Icon = filter.icon
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              style={{
                backgroundColor: selectedFilter === filter.id ? '#16a34a' : 'white',
                color: selectedFilter === filter.id ? 'white' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={12} />
              {filter.name}
              <span style={{
                backgroundColor: selectedFilter === filter.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: selectedFilter === filter.id ? 'white' : '#64748b',
                borderRadius: '12px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {filter.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Bookmarks Grid */}
      {loading ? (
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '16px', color: '#64748b' }}>Loading bookmarks...</div>
          </div>
        </div>
      ) : (
      <div style={{
        display: 'grid',
          gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
          gap: getGridGap(screenSize)
      }}>
        {(() => {
          console.log('Filtering bookmarks...')
          console.log('Selected filter:', selectedFilter)
          console.log('All bookmark types:', bookmarks.map(b => ({ id: b.id, type: b.type })))
          
          const filteredBookmarks = bookmarks.filter(bookmark => {
            const matches = bookmark.type === selectedFilter
            console.log(`Bookmark ${bookmark.id} (type: ${bookmark.type}) matches filter ${selectedFilter}:`, matches)
            return matches
          })
          
          console.log('Current bookmarks:', bookmarks)
          console.log('Filtered bookmarks:', filteredBookmarks)
          
          return filteredBookmarks.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
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
                🔍
              </div>
            <h3 style={{
                fontSize: '18px',
              fontWeight: '600',
                color: '#1a1a1a',
              margin: '0 0 8px 0'
            }}>
                No bookmarks found
            </h3>
            <p style={{
                fontSize: '14px',
                color: '#64748b',
              margin: 0
            }}>
                Start saving jobs, opportunities, and courses to access them here
            </p>
          </div>
        ) : (
            filteredBookmarks.map((bookmark) => {
              // Helper functions for tender and opportunity cards
              const getSectorIcon = (sector) => {
                switch (sector?.toLowerCase()) {
                  case 'technology': return <Building2 size={48} color="#3b82f6" />
                  case 'government': return <Shield size={48} color="#16a34a" />
                  case 'manufacturing': return <Factory size={48} color="#f59e0b" />
                  default: return <Building2 size={48} color="#64748b" />
                }
              }

              const getSectorColor = (sector) => {
                switch (sector?.toLowerCase()) {
                  case 'technology': return '#3b82f6'
                  case 'government': return '#16a34a'
                  case 'manufacturing': return '#f59e0b'
                  default: return '#64748b'
                }
              }

              const getTypeColor = (type) => {
                switch (type) {
                  case 'Scholarships': return '#1d4ed8'      // Blue
                  case 'Fellowships': return '#7c3aed'       // Purple
                  case 'Grants': return '#dc2626'            // Red
                  case 'Funds': return '#ea580c'             // Orange
                  case 'Internships': return '#059669'       // Green
                  case 'Programs': return '#0891b2'          // Cyan
                  case 'Competitions': return '#f59e0b'      // Amber
                  case 'Research': return '#8b5cf6'          // Violet
                  case 'Professional Development': return '#ec4899' // Pink
                  default: return '#64748b'                  // Gray
                }
              }

              // Render tender cards with exact structure from Tenders.jsx
              if (bookmark.type === 'tender') {
                const sectorColor = getSectorColor(bookmark.sector)
                const SectorIcon = () => getSectorIcon(bookmark.sector)
                const isDeadlineUrgent = bookmark.deadline && new Date(bookmark.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            
            return (
                  <div key={bookmark.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    height: '480px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  onClick={() => handleItemClick(bookmark)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleItemClick(bookmark) }}>
                    
                    {/* Cover Image */}
                    <div style={{ position: 'relative' }}>
                      {bookmark.coverImage ? (
                        <img 
                          src={resolveAssetUrl(bookmark.coverImage)} 
                          alt={bookmark.title}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                    <div style={{
                          width: '100%',
                          height: '250px',
                          backgroundColor: '#f8f9fa',
                      display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748b'
                        }}>
                          <SectorIcon />
                        </div>
                      )}
                      
                      {/* Overlay badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                        left: '12px',
                    right: '12px',
                        display: 'flex',
                      justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            fontSize: '12px',
                            color: 'white',
                            backgroundColor: sectorColor,
                            padding: '4px 8px',
                    borderRadius: '6px',
                            fontWeight: '600',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {bookmark.sector || 'Not specified'}
                          </span>
                          {bookmark.isUrgent && (
                            <span style={{
                    fontSize: '10px',
                              color: 'white',
                              backgroundColor: '#3b82f6',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              letterSpacing: '0.5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '20px',
                              lineHeight: '1'
                            }}>
                              URGENT
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeBookmark(bookmark.id)
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'white'
                            e.target.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'
                            e.target.style.transform = 'scale(1)'
                          }}
                        >
                          <Bookmark 
                            size={16} 
                            color="#dc2626"
                            fill="#dc2626"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title */}
                      <h2 style={{
                        fontSize: '18px',
                    fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0',
                        lineHeight: '1.3'
                      }}>
                        {bookmark.title}
                      </h2>

                      {/* Organization */}
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        {bookmark.organization || bookmark.company}
                      </div>

                      {/* Contract Value */}
                      <div style={{
                    display: 'flex',
                    alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        color: '#16a34a',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}>
                        <DollarSign size={14} />
                        {bookmark.contractValue || bookmark.budget || 'Not specified'}
                  </div>

                      {/* Location and Deadline */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                        flexShrink: 0
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          <MapPin size={14} />
                          {bookmark.location}{bookmark.country && `, ${bookmark.country}`}
                        </div>
                        <span style={{ color: '#e2e8f0' }}>•</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          <Calendar size={12} />
                          <span>{bookmark.isDeadlineExpired ? 'Closed' : 'Deadline:'}</span>
                          <span style={{ 
                            color: bookmark.isDeadlineExpired ? '#6b7280' : (isDeadlineUrgent ? '#dc2626' : '#64748b'), 
                            fontWeight: bookmark.isDeadlineExpired ? '500' : (isDeadlineUrgent ? '600' : '500') 
                          }}>
                            {bookmark.isDeadlineExpired ? '' : formatDeadline(bookmark.deadline)}
                          </span>
                        </div>
                  </div>
                  

                      {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        marginTop: 'auto',
                        flexShrink: 0
                }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApply(bookmark)
                          }}
                          disabled={bookmark.isDeadlineExpired}
                          style={{
                            backgroundColor: bookmark.isDeadlineExpired ? '#6b7280' : '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: bookmark.isDeadlineExpired ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            opacity: bookmark.isDeadlineExpired ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (!bookmark.isDeadlineExpired) {
                              e.target.style.backgroundColor = '#15803d'
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!bookmark.isDeadlineExpired) {
                              e.target.style.backgroundColor = '#16a34a'
                            }
                          }}
                        >
                          {bookmark.isDeadlineExpired ? 'Closed' : 'Apply Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }

              // Render opportunity cards with exact structure from Opportunities.jsx
              if (bookmark.type === 'opportunity') {
                console.log('Rendering opportunity card:', {
                  id: bookmark.id,
                  title: bookmark.title,
                  poster: bookmark.poster,
                  coverImage: bookmark.coverImage,
                  cover_image: bookmark.cover_image
                })
                const typeColor = getTypeColor(bookmark.type)

                return (
                  <div key={bookmark.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    height: '480px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  onClick={() => handleItemClick(bookmark)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleItemClick(bookmark) }}>
                    
                    {/* Poster Image */}
                    <div style={{ position: 'relative' }}>
                      {bookmark.poster ? (
                        <img 
                          src={bookmark.poster} 
                          alt={bookmark.title || 'Opportunity'}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            console.log('Image failed to load:', e.target.src)
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', e.target.src)
                          }}
                        />
                      ) : null}
                      <div style={{
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#f8f9fa',
                        display: bookmark.poster ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b'
                      }}>
                        <GraduationCap size={48} color={typeColor} />
                      </div>
                      
                      {/* Overlay badges */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            fontSize: '12px',
                            color: 'white',
                            backgroundColor: typeColor,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            backdropFilter: 'blur(10px)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            minHeight: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {bookmark.opportunityType}
                          </span>
                        </div>
                        
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeBookmark(bookmark.id)
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'white'
                            e.target.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'
                            e.target.style.transform = 'scale(1)'
                          }}
                        >
                          <Bookmark 
                            size={16} 
                            color="#dc2626"
                            fill="#dc2626"
                          />
                        </button>
                  </div>
                </div>

                {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title */}
                      <h2 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                  margin: '0 0 12px 0',
                        lineHeight: '1.3'
                      }}>
                        {bookmark.title}
                      </h2>

                      {/* Organization */}
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        {bookmark.organization || bookmark.company || bookmark.category}
                      </div>

                      {/* Key Info Row */}
                <div style={{
                  display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                          fontSize: '13px',
                      color: '#64748b'
                    }}>
                          <Clock size={14} />
                          {bookmark.duration || 'Not specified'}
                        </div>
                        <span style={{ color: '#e2e8f0' }}>•</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          <MapPin size={14} />
                      {bookmark.location}
                    </div>
                      </div>
                  
                      {/* Deadline */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        <Calendar size={12} />
                        <span>{bookmark.isDeadlineExpired ? 'Closed' : 'Deadline:'}</span>
                        <span style={{ 
                          color: bookmark.isDeadlineExpired ? '#6b7280' : '#dc2626', 
                          fontWeight: '600' 
                        }}>
                          {bookmark.isDeadlineExpired ? '' : formatDeadline(bookmark.deadline)}
                        </span>
                      </div>

                  
                      {/* Footer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        marginTop: 'auto',
                        flexShrink: 0
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApply(bookmark)
                          }}
                          disabled={bookmark.isDeadlineExpired}
                          style={{
                            backgroundColor: bookmark.isDeadlineExpired ? '#6b7280' : '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: bookmark.isDeadlineExpired ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            opacity: bookmark.isDeadlineExpired ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (!bookmark.isDeadlineExpired) {
                              e.target.style.backgroundColor = '#15803d'
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!bookmark.isDeadlineExpired) {
                              e.target.style.backgroundColor = '#16a34a'
                            }
                          }}
                        >
                          {bookmark.isDeadlineExpired ? 'Closed' : 'Apply Now'}
                        </button>
                    </div>
                    </div>
                  </div>
                )
              }

              // Course card rendering - exact copy from Courses.jsx
              if (bookmark.type === 'video') {
                return (
                  <div key={bookmark.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => handleItemClick(bookmark)}
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
                        src={bookmark.thumbnail_url ? (bookmark.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${bookmark.thumbnail_url}` : bookmark.thumbnail_url) : bookmark.thumbnail} 
                        alt={bookmark.title}
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
                        {bookmark.isPro && (
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
                          {bookmark.duration || 
                            (bookmark.duration_hours && bookmark.duration_minutes ? 
                              `${bookmark.duration_hours}h ${bookmark.duration_minutes}m` :
                              bookmark.duration_hours ? `${bookmark.duration_hours}h` :
                              bookmark.duration_minutes ? `${bookmark.duration_minutes}m` : 'N/A')}
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
                          {bookmark.title}
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
                        by {bookmark.instructor || bookmark.author || 'Unknown Instructor'}
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
                        <span>{bookmark.category || '—'}</span>
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
                            {(bookmark.downloads ?? bookmark.download_count ?? bookmark.enrollment_count ?? bookmark.students ?? 0)} downloads
                          </div>
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {bookmark.format || '—'}
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
                          {bookmark.level}
                        </span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (bookmark.video_url) {
                              const fullUrl = bookmark.video_url.startsWith('http')
                                ? bookmark.video_url
                                : `http://localhost:8000${bookmark.video_url}`;
                              setVideoUrl(fullUrl);
                              setVideoTitle(bookmark.title);
                              setShowVideoPlayer(true);
                            } else {
                              alert('Video file not available');
                            }
                          }}
                          style={{
                            backgroundColor: 'white',
                            color: '#16a34a',
                            border: '2px solid #16a34a',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}>
                          Watch
                        </button>
                        <button style={{
                          backgroundColor: '#16a34a',
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
                          if (bookmark.download_url || bookmark.video_url) {
                            apiService.incrementCourseDownloads(bookmark.id).catch(() => {})
                            const downloadUrl = bookmark.download_url || bookmark.video_url;
                            const fullUrl = downloadUrl.startsWith('http')
                              ? downloadUrl
                              : `http://localhost:8000${downloadUrl}`;
                            window.open(fullUrl, '_blank');
                          } else {
                            alert('Download file not available');
                          }
                        }}>
                          Download
                        </button>
                      </div>
                    </div>
                    {/* Bookmark button - bottom left of card */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          border: 'none',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'white'
                          e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        <Bookmark 
                          size={16} 
                          color="#dc2626"
                          fill="#dc2626"
                        />
                      </button>
                    </div>
                  </div>
                )
              }

              if (bookmark.type === 'book') {
                return (
                  <div key={bookmark.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => handleItemClick(bookmark)}
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
                        src={bookmark.thumbnail_url ? (bookmark.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${bookmark.thumbnail_url}` : bookmark.thumbnail_url) : bookmark.cover} 
                        alt={bookmark.title}
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
                        {bookmark.isPro && (
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
                          {bookmark.format || 'PDF'}
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
                          {bookmark.title}
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
                        by {bookmark.instructor || bookmark.author || 'Unknown Author'}
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
                        <span>{bookmark.category || '—'}</span>
                        {bookmark.author_type && (
                          <>
                            <span style={{ color: '#cbd5e1' }}>|</span>
                            <span>{bookmark.author_type}</span>
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
                            {bookmark.page_count || bookmark.pages || 0} pages
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={14} />
                            {(bookmark.downloads ?? bookmark.download_count ?? 0)} downloads
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
                            {bookmark.level || 'Beginner'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end'
                      }}>
                        <button style={{
                          backgroundColor: '#16a34a',
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
                          if (bookmark.download_url) {
                            apiService.incrementCourseDownloads(bookmark.id).catch(() => {})
                            const fullUrl = bookmark.download_url.startsWith('http')
                              ? bookmark.download_url
                              : `http://localhost:8000${bookmark.download_url}`;
                            window.open(fullUrl, '_blank');
                          } else {
                            alert('Download file not available');
                          }
                        }}>
                          Download
                        </button>
                      </div>
                    </div>
                    {/* Bookmark button - bottom left of card */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          border: 'none',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'white'
                          e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        <Bookmark 
                          size={16} 
                          color="#dc2626"
                          fill="#dc2626"
                        />
                      </button>
                    </div>
                  </div>
                )
              }

              if (bookmark.type === 'business-plan') {
                return (
                  <div key={bookmark.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => handleItemClick(bookmark)}
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
                        src={bookmark.thumbnail_url ? (bookmark.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${bookmark.thumbnail_url}` : bookmark.thumbnail_url) : bookmark.preview} 
                        alt={bookmark.title}
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
                        {bookmark.isPro && (
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
                            const fmt = (bookmark.format || '').toString().trim();
                            if (fmt) return fmt.toUpperCase();
                            const url = bookmark.download_url || '';
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
                          {bookmark.title}
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
                          <span>{bookmark.instructor || bookmark.author || 'Instructor'}</span>
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
                          <span>{bookmark.category || '—'}</span>
                          <Briefcase size={14} />
                          <span style={{ fontWeight: 600 }}>{bookmark.business_type || '—'}</span>
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
                            {bookmark.page_count || bookmark.pages || 0} pages
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={14} />
                            {(bookmark.downloads ?? bookmark.download_count ?? bookmark.enrollment_count ?? 0)} downloads
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
                            {bookmark.stage || 'Startup'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end'
                      }}>
                        <button style={{
                          backgroundColor: '#16a34a',
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
                          if (bookmark.download_url) {
                            apiService.incrementCourseDownloads(bookmark.id).catch(() => {})
                            const fullUrl = bookmark.download_url.startsWith('http')
                              ? bookmark.download_url
                              : `http://localhost:8000${bookmark.download_url}`;
                            window.open(fullUrl, '_blank');
                          } else {
                            alert('Download file not available');
                          }
                        }}>
                          Download
                        </button>
                      </div>
                    </div>
                    {/* Bookmark button - bottom left of card */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          border: 'none',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'white'
                          e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        <Bookmark 
                          size={16} 
                          color="#dc2626"
                          fill="#dc2626"
                        />
                      </button>
                    </div>
                  </div>
                )
              }

              // Default job card structure (unchanged)
              return (
                <div key={bookmark.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => handleItemClick(bookmark)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleItemClick(bookmark) }}>
                  
                  {/* PRO Badge and Remove Button - Top Right */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {bookmark.postedBy === 'platform' && (
                      <span style={{
                        fontSize: '10px',
                        color: 'white',
                        backgroundColor: '#3b82f6',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        PRO
                      </span>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBookmark(bookmark.id)
                      }}
                      style={{
                        background: '#f8f9fa',
                        border: '1px solid #e2e8f0',
                        padding: '6px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f1f5f9'
                        e.target.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      <Bookmark 
                        size={16} 
                        color="#dc2626"
                        fill="#dc2626"
                      />
                    </button>
                  </div>

                  {/* Company Profile Header */}
                    <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      {bookmark.logo && bookmark.logo.trim() !== '' ? (
                        <img 
                          src={bookmark.logo} 
                          alt={bookmark.company}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '22px',
                            objectFit: 'cover',
                            border: '2px solid #f8f9fa'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '22px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#64748b'
                        }}>
                          {bookmark.company ? bookmark.company.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 1px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {bookmark.company}
                        </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '500',
                    color: '#64748b'
                  }}>
                            {bookmark.industry || 'Not specified'}
                          </span>
                        </div>
                      </div>
                  </div>
                </div>

                  {/* Job Title */}
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {bookmark.title}
                    {bookmark.urgentHiring && (
                      <Star size={14} color="#2563eb" fill="#2563eb" />
                    )}
                  </h2>

                  {/* Quick Info: two columns (pairs) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 12px',
                    marginBottom: '10px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} />
                      <span style={{ color: '#0f172a' }}>{bookmark.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#0f172a' }}>{bookmark.country || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={12} color="#16a34a" />
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{bookmark.salary || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={12} />
                      <span style={{ color: '#0f172a' }}>{bookmark.workType || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} />
                      <span>{bookmark.isDeadlineExpired ? 'Closed' : 'Deadline:'}</span>
                      <span style={{ 
                        color: bookmark.isDeadlineExpired ? '#6b7280' : '#dc2626', 
                        fontWeight: 600 
                      }}>
                        {bookmark.isDeadlineExpired ? '' : (bookmark.deadline || 'Not specified')}
                      </span>
                    </div>
                  </div>


                  {/* Footer */}
                <div style={{
                  display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#16a34a',
                        backgroundColor: '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0',
                        letterSpacing: '0.5px'
                      }}>
                        FREE
                      </span>
                    </div>

                  <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApply(bookmark)
                      }}
                      disabled={bookmark.isDeadlineExpired}
                    style={{
                      backgroundColor: bookmark.isDeadlineExpired ? '#6b7280' : '#16a34a',
                      color: 'white',
                      border: 'none',
                        padding: '8px 16px',
                      borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                      cursor: bookmark.isDeadlineExpired ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        opacity: bookmark.isDeadlineExpired ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!bookmark.isDeadlineExpired) {
                          e.target.style.backgroundColor = '#15803d'
                          e.target.style.transform = 'translateY(-1px)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!bookmark.isDeadlineExpired) {
                          e.target.style.backgroundColor = '#16a34a'
                          e.target.style.transform = 'translateY(0)'
                        }
                      }}
                    >
                    {bookmark.isDeadlineExpired ? 'Closed' : 'Apply Now'}
                  </button>
                </div>
              </div>
            )
          })
        )
        })()}
        </div>
      )}

      {/* Popup Modals */}
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
            width: screenSize.isMobile ? '100%' : 'min(800px, 90vw)',
            maxHeight: '90vh',
            borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
            overflowY: 'auto',
            transition: 'all 0.3s ease-in-out',
            boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}>
            
            
            
            {/* Header (hidden for media types so image appears at the very top) */}
            {!(selectedItem.type === 'video' || selectedItem.type === 'book' || selectedItem.type === 'business-plan') && (
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: screenSize.isMobile ? '16px 12px 0 12px' : '24px 24px 0 24px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  {selectedItem.title}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '20px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} color="#64748b" />
                </button>
              </div>
            )}

            {/* Content - This will be populated based on selectedItem.type */}
            <div style={{ 
              padding: (selectedItem.type === 'video' || selectedItem.type === 'book' || selectedItem.type === 'business-plan')
                ? '0 0 90px 0'
                : (screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px'),
              flex: 1 
            }}>
              {selectedItem.type === 'job' && (
                <div>
                  {/* Company Profile Header (match admin) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={resolveAssetUrl(selectedItem.logo)} 
                      alt={selectedItem.company}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                        {selectedItem.company}
                      </h3>
                      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#64748b' }}>
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span style={{ fontWeight: '500', color: '#0f172a' }}>Country:</span>
                        <span>{selectedItem.country}</span>
                        <span>•</span>
                        <span>Deadline: {selectedItem.deadline || 'No deadline'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete Job Details (match admin) */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 16px 0' }}>
                      Complete Job Details
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: screenSize.isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '16px' 
                    }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Job Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', margin: 0 }}>{selectedItem.workType || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Work Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', margin: 0 }}>{selectedItem.workTypeMode || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Experience Level</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', margin: 0 }}>{selectedItem.experience || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Industry</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', margin: 0 }}>{selectedItem.industry || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Location</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', margin: 0 }}>{selectedItem.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Country</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', margin: 0 }}>{selectedItem.country || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Salary</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', fontWeight: '600', margin: 0 }}>{selectedItem.salary || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Job Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Job Overview
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

                  {/* Skills & Benefits */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '24px'
                  }}>
                    {/* Skills */}
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements & Qualifications
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedItem.skills.map((skill, index) => (
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
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    {Array.isArray(selectedItem.benefits) && selectedItem.benefits.length > 0 && (
                      <div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 12px 0'
                        }}>
                          Benefits & Perks
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedItem.benefits.map((benefit, index) => (
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
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 12px 0' }}>Tags</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedItem.tags.map((tag, index) => (
                          <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                            {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedItem.type === 'tender' && (
                <div>
                  {/* Organization Profile Header (match admin) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img
                      src={selectedItem.coverImage || selectedItem.logo}
                      alt={selectedItem.organization}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                        {selectedItem.organization}
                      </h3>
                      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#64748b' }}>
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span>{selectedItem.country}</span>
                        <span>•</span>
                        <span style={{ color: '#dc2626', fontWeight: '600' }}>
                          Deadline: {selectedItem.deadline || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tender Details */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Tender Details</h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '16px' 
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Organization</span>
                        <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0', fontWeight: '500' }}>{selectedItem.organization || 'Not specified'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Sector</span>
                        <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0', fontWeight: '500' }}>{selectedItem.sector || 'Not specified'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Contract Value</span>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: '2px 0 0 0', fontWeight: '600' }}>{selectedItem.contractValue || 'Not specified'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Location</span>
                        <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0', fontWeight: '500' }}>{selectedItem.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Country</span>
                        <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0', fontWeight: '500' }}>{selectedItem.country || 'Not specified'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Duration</span>
                        <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0', fontWeight: '500' }}>{selectedItem.duration || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tender Overview */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Tender Overview
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#4a5568',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Requirements & Qualifications */}
                  {Array.isArray(selectedItem.requirements) && selectedItem.requirements.some(i => i && String(i).trim() !== '') && (
                    <div style={{ marginBottom: '32px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 16px 0'
                      }}>
                        Requirements & Qualifications
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {selectedItem.requirements.map((req, index) => (
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
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}


                  {/* Submission Process */}
                  {Array.isArray(selectedItem.submissionProcess) && selectedItem.submissionProcess.some(i => i && String(i).trim() !== '') && (
                    <div style={{ marginBottom: '32px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 16px 0' }}>Submission Process</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedItem.submissionProcess.map((step, index) => (
                          <li key={index} style={{ fontSize: '14px', color: '#1a1a1a', lineHeight: '1.6', marginBottom: '6px' }}>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evaluation Criteria */}
                  {Array.isArray(selectedItem.evaluationCriteria) && selectedItem.evaluationCriteria.some(i => i && String(i).trim() !== '') && (
                    <div style={{ marginBottom: '32px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 16px 0' }}>Evaluation Criteria</h3>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-line'
                      }}>
                        {selectedItem.evaluationCriteria.join('\n')}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {Array.isArray(selectedItem.tags) && selectedItem.tags.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 16px 0' }}>Tags</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedItem.tags.map((tag, index) => {
                          const label = typeof tag === 'string' ? tag : (tag?.name || tag?.title || '')
                          if (!label) return null
                          return (
                            <span key={index} style={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              padding: '6px 10px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedItem.type === 'opportunity' && (
                <div>
                  {/* Organization Profile Header (match admin) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.poster || selectedItem.logo}
                      alt={selectedItem.organization}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                        {selectedItem.organization || ''}
                      </h3>
                      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#64748b' }}>
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span style={{ color: '#dc2626', fontWeight: '600' }}>
                          Deadline: {selectedItem.deadline || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Opportunity Details grid (match admin) */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 16px 0' }}>Opportunity Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Organization</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.organization || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Opportunity Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.opportunityType || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Amount</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: 0, fontWeight: '600' }}>{selectedItem.salary || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Duration</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.duration || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Location</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.location || 'Not specified'}</p>
                      </div>
                      {selectedItem.externalUrl && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Application URL</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>
                            <a href={selectedItem.externalUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.externalUrl}</a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opportunity Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Opportunity Overview</h3>
                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Eligibility Requirements */}
                  {Array.isArray(selectedItem.requirements) && selectedItem.requirements.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Eligibility Requirements</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedItem.requirements.map((requirement, index) => (
                          <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '14px', lineHeight: '1.5', color: '#374151' }}>
                            <span style={{ color: '#16a34a', fontSize: '16px', lineHeight: '1', marginTop: '2px' }}>✓</span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benefits & Value */}
                  {Array.isArray(selectedItem.benefits) && selectedItem.benefits.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Benefits & Value</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedItem.benefits.map((benefit, index) => (
                          <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '14px', lineHeight: '1.5', color: '#374151' }}>
                            <span style={{ color: '#16a34a', fontSize: '16px', lineHeight: '1', marginTop: '2px' }}>✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {((Array.isArray(selectedItem.tags) && selectedItem.tags.length > 0) || (Array.isArray(selectedItem.benefits) && selectedItem.benefits.length > 0)) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Tags</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {((Array.isArray(selectedItem.tags) && selectedItem.tags.length > 0) ? selectedItem.tags : selectedItem.benefits).map((tag, index) => (
                          <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                            {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedItem.type === 'video' && (
                <div>
                  {/* Header Image */}
                  <div style={{ position: 'relative', height: '250px', overflow: 'hidden', borderTopLeftRadius: screenSize.isMobile ? '20px' : '16px', borderTopRightRadius: screenSize.isMobile ? '20px' : '16px' }}>
                    <img 
                      src={selectedItem.thumbnail_url ? (selectedItem.thumbnail_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${selectedItem.thumbnail_url}` : selectedItem.thumbnail_url) : (selectedItem.thumbnail || selectedItem.cover || selectedItem.preview)} 
                      alt={selectedItem.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <button
                      onClick={() => setShowDetails(false)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '999px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={18} color="#ffffff" />
                    </button>
                  </div>

                  {/* Content - EXACT admin structure */}
                  <div style={{ padding: '0 24px 24px 24px', marginTop: '16px' }}>
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

                    {/* Category • Level • Duration/Pages */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.category}
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.level}
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.duration_hours ? `${selectedItem.duration_hours}h ${selectedItem.duration_minutes ? `${selectedItem.duration_minutes}m` : ''}` : 
                         selectedItem.page_count ? `${selectedItem.page_count} pages` : 'Not specified'}
                      </span>
                    </div>

                    {/* Course Details */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Course Details
                      </h3>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            video
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Instructor</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.instructor || selectedItem.author}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Downloads</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.enrollment_count || 0}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Category</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.category}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Level</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.level}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Industry</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.category}
                          </div>
                        </div>
                        {selectedItem.language && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Language</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.language}
                            </div>
                          </div>
                        )}
                        {selectedItem.format && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Format</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.format}
                            </div>
                          </div>
                        )}
                        {selectedItem.duration_hours && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Duration</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.duration_hours}h {selectedItem.duration_minutes ? `${selectedItem.duration_minutes}m` : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Course Description */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
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

                    {/* Tags */}
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
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
                  </div>
                </div>
              )}
              {selectedItem.type === 'book' && (
                <div>
                  {/* Header Image */}
                  <div style={{ position: 'relative', height: '250px', overflow: 'hidden', borderTopLeftRadius: screenSize.isMobile ? '20px' : '16px', borderTopRightRadius: screenSize.isMobile ? '20px' : '16px' }}>
                    <img 
                      src={selectedItem.thumbnail_url ? (selectedItem.thumbnail_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${selectedItem.thumbnail_url}` : selectedItem.thumbnail_url) : (selectedItem.thumbnail || selectedItem.cover || selectedItem.preview)} 
                      alt={selectedItem.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <button
                      onClick={() => setShowDetails(false)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '999px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={18} color="#ffffff" />
                    </button>
                  </div>

                  {/* Content - EXACT admin structure */}
                  <div style={{ padding: '0 24px 24px 24px', marginTop: '16px' }}>
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

                    {/* Category • Level • Duration/Pages */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.category}
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.level}
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.page_count ? `${selectedItem.page_count} pages` : 'Not specified'}
                      </span>
                    </div>

                    {/* Course Details */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Course Details
                      </h3>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            book
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Instructor</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.instructor || selectedItem.author}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Downloads</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.enrollment_count || 0}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Category</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.category}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Level</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.level}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Industry</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.category}
                          </div>
                        </div>
                        {selectedItem.language && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Language</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.language}
                            </div>
                          </div>
                        )}
                        {selectedItem.format && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Format</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.format}
                            </div>
                          </div>
                        )}
                        {selectedItem.page_count && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Pages</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.page_count} pages
                            </div>
                          </div>
                        )}
                        {selectedItem.author_type && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Author Type</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.author_type}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Course Description */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
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

                    {/* Tags */}
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
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
                  </div>
                </div>
              )}
              {selectedItem.type === 'business-plan' && (
                <div>
                  {/* Header Image */}
                  <div style={{ position: 'relative', height: '250px', overflow: 'hidden', borderTopLeftRadius: screenSize.isMobile ? '20px' : '16px', borderTopRightRadius: screenSize.isMobile ? '20px' : '16px' }}>
                    <img 
                      src={selectedItem.thumbnail_url ? (selectedItem.thumbnail_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${selectedItem.thumbnail_url}` : selectedItem.thumbnail_url) : (selectedItem.thumbnail || selectedItem.cover || selectedItem.preview)} 
                      alt={selectedItem.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <button
                      onClick={() => setShowDetails(false)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '999px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={18} color="#ffffff" />
                    </button>
                  </div>

                  {/* Content - EXACT admin structure */}
                  <div style={{ padding: '0 24px 24px 24px', marginTop: '16px' }}>
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

                    {/* Category • Level • Duration/Pages */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.category}
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.level}
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedItem.page_count ? `${selectedItem.page_count} pages` : 'Not specified'}
                      </span>
                    </div>

                    {/* Course Details */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Course Details
                      </h3>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            business-plan
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Instructor</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.instructor || selectedItem.author}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Downloads</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.enrollment_count || 0}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Category</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.category}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Level</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.level}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Industry</span>
                          <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                            {selectedItem.category}
                          </div>
                        </div>
                        {selectedItem.language && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Language</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.language}
                            </div>
                          </div>
                        )}
                        {selectedItem.format && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Format</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.format}
                            </div>
                          </div>
                        )}
                        {selectedItem.page_count && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Pages</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.page_count} pages
                            </div>
                          </div>
                        )}
                        {selectedItem.business_type && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Business Type</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.business_type}
                            </div>
                          </div>
                        )}
                        {selectedItem.stage && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Stage</span>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                              {selectedItem.stage}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Course Description */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
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

                    {/* Tags */}
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '18px',
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
                  </div>
                </div>
              )}
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
export default Bookmarks