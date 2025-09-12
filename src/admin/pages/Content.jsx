import React, { useState, useEffect } from 'react'
import { resolveAssetUrl } from '../../lib/api-service'
import {
  Briefcase,
  FileText,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Star,
  Award,
  Download,
  Upload,
  Play,
  X,
  MessageSquare,
  SlidersHorizontal,
  Check
} from 'lucide-react'
import Post from '../../pages/Post'
import { apiService, jobsAPI, tendersAPI, opportunitiesAPI } from '../../lib/api-service'
import { countries, getCountryName, getCountryCode } from '../../utils/countries'

const Content = () => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })

  // Responsive grid functions
  const getGridColumns = (screenSize) => {
    if (screenSize.isMobile) return 1
    if (screenSize.isDesktop) return 3
    return 2
  }

  const getGridGap = (screenSize) => {
    if (screenSize.isMobile) return '16px'
    return '20px'
  }

  const [activeTab, setActiveTab] = useState('jobs')
  
  // Separate filter states for each content type
  const [jobsFilters, setJobsFilters] = useState({
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    dateFilter: ''
  })
  
  const [tendersFilters, setTendersFilters] = useState({
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    dateFilter: ''
  })
  
  const [opportunitiesFilters, setOpportunitiesFilters] = useState({
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    dateFilter: ''
  })
  
  const [coursesFilters, setCoursesFilters] = useState({
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    dateFilter: ''
  })
  
  const [contentFilters, setContentFilters] = useState({
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    dateFilter: ''
  })
  
  // Helper functions to get current filters based on active tab
  const getCurrentFilters = () => {
    switch (activeTab) {
      case 'jobs': return jobsFilters
      case 'tenders': return tendersFilters
      case 'opportunities': return opportunitiesFilters
      case 'courses': return coursesFilters
      case 'content': return contentFilters
      default: return jobsFilters
    }
  }
  
  const setCurrentFilters = (newFilters) => {
    switch (activeTab) {
      case 'jobs': setJobsFilters(newFilters); break
      case 'tenders': setTendersFilters(newFilters); break
      case 'opportunities': setOpportunitiesFilters(newFilters); break
      case 'courses': setCoursesFilters(newFilters); break
      case 'content': setContentFilters(newFilters); break
    }
  }
  
  const [selectedItems, setSelectedItems] = useState([])
  const [showPostPage, setShowPostPage] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [showApplicants, setShowApplicants] = useState(false)
  const [applicants, setApplicants] = useState([])
  const [activeCourseTab, setActiveCourseTab] = useState('videos')
  const [showCourseFilters, setShowCourseFilters] = useState(false)
  const [courseFilters, setCourseFilters] = useState({
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
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [applicantFilterStatus, setApplicantFilterStatus] = useState('all')
  const [showBulkSMS, setShowBulkSMS] = useState(false)
  const [message, setMessage] = useState('')
  const [messageFilterStatus, setMessageFilterStatus] = useState('all')

  // Course filter options (copied from Merit app)
  const courseFilterOptions = {
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

  const toggleCourseFilter = (category, value) => {
    const tabKey = activeCourseTab === 'business-plans' ? 'businessPlans' : activeCourseTab
    setCourseFilters(prev => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [category]: prev[tabKey][category].includes(value)
          ? prev[tabKey][category].filter(item => item !== value)
          : [...prev[tabKey][category], value]
      }
    }))
  }

  const clearAllCourseFilters = () => {
    const tabKey = activeCourseTab === 'business-plans' ? 'businessPlans' : activeCourseTab
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
    
    setCourseFilters(prev => ({
      ...prev,
      [tabKey]: defaultFilters[tabKey]
    }))
  }

  const getActiveCourseFilterCount = () => {
    const tabKey = activeCourseTab === 'business-plans' ? 'businessPlans' : activeCourseTab
    const currentFilters = courseFilters[tabKey]
    if (!currentFilters) return 0
    let count = 0
    Object.values(currentFilters).forEach(filterArray => {
      count += filterArray.length
    })
    return count
  }
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageType, setMessageType] = useState('email')
  const [jobsData, setJobsData] = useState([])
  const [tendersData, setTendersData] = useState([])
  const [opportunitiesData, setOpportunitiesData] = useState([])
  const [coursesData, setCoursesData] = useState([])
  const [applicantsData, setApplicantsData] = useState([])
  const [allContentData, setAllContentData] = useState([])
  const [courseFormData, setCourseFormData] = useState({
    type: 'video', // video, book, business-plan
    title: '',
    description: '',
    instructor: '',
    author: '',
    authorType: '',
    duration: '',
    duration_hours: '',
    duration_minutes: '',
    language: 'English',
    category: '',
    level: 'Beginner',
    format: '',
    price: 'Free',
    rating: 5,
    enrolledStudents: 0,
    thumbnailUrl: '',
    videoUrl: '',
    downloadUrl: '',
    tags: [],
    customTag: '',
    businessType: '',
    industrySector: '',
    stage: '',
    pageCount: '',
    fileSize: '',
    targetAudience: '',
    documents: []
  })

  // Load content from admin API
    const loadContent = async () => {
      try {
        console.log('🔄 Loading admin content using admin APIs...', new Date().toISOString())
        console.log('Auth token:', localStorage.getItem('auth-token'))
        console.log('User type:', localStorage.getItem('user-type'))
        const timestamp = Date.now()
        const [jobs, tenders, opportunities, courses, applications] = await Promise.all([
          apiService.get('/admin/content', { type: 'jobs', limit: 50, _t: timestamp }).catch((err) => {
            console.log('Jobs API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/content', { type: 'tenders', limit: 50, _t: timestamp }).catch((err) => {
            console.log('Tenders API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/content', { type: 'opportunities', limit: 50, _t: timestamp }).catch((err) => {
            console.log('Opportunities API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/content', { type: 'courses', limit: 50, _t: timestamp }).catch((err) => {
            console.log('Courses API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/applications/overview', { limit: 100 }).then((data) => {
            console.log('Applications API success:', data)
            return data
          }).catch((err) => {
            console.log('Applications API error:', err)
            console.log('Error details:', err.message, err.status)
            return { applications: [] }
          })
        ])
        
        console.log('API responses:', { jobs, tenders, opportunities, courses, applications })
        
        // Transform all content and combine into one array
        const allContent = [
          ...(jobs?.content || []).map(transformJobAdminItem),
          ...(tenders?.content || []).map(transformTenderAdminItem),
          ...(opportunities?.content || []).map(transformOpportunityAdminItem),
          ...(courses?.content || []).map(transformCourseAdminItem)
        ]
        
        // Sort all content by approval status first (pending at top), then by date (latest first)
        const sortedContent = allContent.sort((a, b) => {
          if (a.approval_status === 'pending' && b.approval_status !== 'pending') return -1
          if (a.approval_status !== 'pending' && b.approval_status === 'pending') return 1
          // If same approval status, sort by date (latest first)
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        
        // Split back into separate arrays for display (but now properly sorted)
        const jobsArr = sortedContent.filter(item => item.type === 'job')
        const tendersArr = sortedContent.filter(item => item.type === 'tender')
        const oppArr = sortedContent.filter(item => item.type === 'opportunity')
        const coursesArr = sortedContent.filter(item => item.type === 'course')
        
        // Process applicants data - group by user and show all their applications
        console.log('Applications API response:', applications)
        console.log('Applications type:', typeof applications)
        console.log('Applications success:', applications?.success)
        console.log('Applications message:', applications?.message)
        
        // Process applications data to get applicants
        const applicantsMap = new Map()
        const applicantsArr = []
        
        // Process applications data if available
        console.log('Raw applications data:', applications)
        
        if (applications && applications.applications && Array.isArray(applications.applications)) {
          applications.applications.forEach(app => {
            console.log('Processing application:', app)
            const applicantId = app.user_id || app.applicant_id || app.user?.id
            if (applicantId) {
              if (!applicantsMap.has(applicantId)) {
                applicantsMap.set(applicantId, {
                  id: applicantId,
                  name: app.user?.name || app.applicant?.name || app.user?.full_name || app.name || 'Unknown',
                  email: app.user?.email || app.applicant?.email || app.email || 'Unknown',
                  applications: []
                })
              }
              
              const applicant = applicantsMap.get(applicantId)
              applicant.applications.push({
                id: app.id,
                content_id: app.content_id || app.job_id || app.tender_id || app.opportunity_id || app.course_id,
                content_type: app.content_type || app.type || app.application_type,
                status: app.status || 'pending',
                applied_at: app.applied_at || app.created_at,
                created_at: app.created_at
              })
            }
          })
          
          // Convert map to array
          applicantsArr.push(...Array.from(applicantsMap.values()))
        } else if (applications && Array.isArray(applications)) {
          // Handle case where applications is directly an array
          applications.forEach(app => {
            console.log('Processing direct application:', app)
            const applicantId = app.user_id || app.applicant_id || app.user?.id
            if (applicantId) {
              if (!applicantsMap.has(applicantId)) {
                applicantsMap.set(applicantId, {
                  id: applicantId,
                  name: app.user?.name || app.applicant?.name || app.user?.full_name || app.name || 'Unknown',
                  email: app.user?.email || app.applicant?.email || app.email || 'Unknown',
                  applications: []
                })
              }
              
              const applicant = applicantsMap.get(applicantId)
              applicant.applications.push({
                id: app.id,
                content_id: app.content_id || app.job_id || app.tender_id || app.opportunity_id || app.course_id,
                content_type: app.content_type || app.type || app.application_type,
                status: app.status || 'pending',
                applied_at: app.applied_at || app.created_at,
                created_at: app.created_at
              })
            }
          })
          
          // Convert map to array
          applicantsArr.push(...Array.from(applicantsMap.values()))
        }
        
        console.log('Raw data arrays:', { jobsArr, tendersArr, oppArr, coursesArr, applicantsArr })
        console.log('📊 Applicants data loaded:', applicantsArr.length, 'applicants')
        console.log('Sample applicant:', applicantsArr[0])

        // Set real data into state used by the UI
        console.log('📊 Setting sorted content data:', sortedContent.length, 'total items')
        console.log('Content IDs:', sortedContent.map(j => j.id))
        console.log('First content data:', sortedContent[0])
        
        // Set the sorted content for unified display
        setJobsData([...jobsArr]) // Force new array reference
        setTendersData([...tendersArr])
        setOpportunitiesData([...oppArr])
        setCoursesData([...coursesArr])
        
        // Store the unified sorted content for the table view
        setAllContentData([...sortedContent])
        setApplicantsData([...applicantsArr])
        
        
        console.log('Loaded data:', {
          jobs: jobsArr.length,
          tenders: tendersArr.length,
          opportunities: oppArr.length,
          courses: coursesArr.length
        })
      } catch (e) {
        console.error('Failed to load admin content:', e)
        // Leave arrays as-is if API fails
      }
    }

  useEffect(() => {
    loadContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    if (showCourseForm) {
      const timer = setTimeout(() => setShowForm(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowForm(false)
    }
  }, [showCourseForm])

  const handleCloseCourseForm = () => {
    setShowCourseForm(false)
    setShowForm(false)
    // Reset form data
    setCourseFormData({
      type: 'video',
      title: '',
      description: '',
      instructor: '',
      author: '',
      authorType: '',
      duration: '',
    duration_hours: '',
    duration_minutes: '',
      language: 'English',
      category: '',
      level: 'Beginner',
      format: '',
      price: 'Free',
      rating: 5,
      enrolledStudents: 0,
      thumbnailUrl: '',
      videoUrl: '',
      downloadUrl: '',
      tags: [],
      customTag: '',
      businessType: '',
      industrySector: '',
      stage: '',
      pageCount: '',
      fileSize: '',
      targetAudience: '',
      documents: []
    })
  }

  const handleOpenCourseForm = () => {
    // Pre-select course type based on active tab
    let courseType = 'video'
    if (activeTab === 'courses') {
      if (activeCourseTab === 'videos') courseType = 'video'
      else if (activeCourseTab === 'books') courseType = 'book'
      else if (activeCourseTab === 'business-plans') courseType = 'business-plan'
    }
    
    setCourseFormData(prev => ({
      ...prev,
      type: courseType
    }))
    setShowCourseForm(true)
  }

  const handleCourseFormSubmit = async (e) => {
    e.preventDefault()
    
    // Validate duration for videos - at least one field must be filled
    if (courseFormData.type === 'video' && !courseFormData.duration_hours && !courseFormData.duration_minutes) {
      alert('Please enter either hours or minutes for video duration')
      return
    }
    
    try {
      const payload = {
        title: courseFormData.title,
        description: courseFormData.description,
        instructor: (courseFormData.instructor || courseFormData.author || ''),
        category: courseFormData.category,
        level: (courseFormData.level || 'Beginner').toLowerCase(),
        duration_hours: courseFormData.duration_hours ? parseInt(courseFormData.duration_hours, 10) : null,
        duration_minutes: courseFormData.duration_minutes ? parseInt(courseFormData.duration_minutes, 10) : null,
        price: courseFormData.price === 'Free' ? 0 : Number(courseFormData.price) || 0,
        currency: 'USD',
        thumbnail_url: courseFormData.thumbnailUrl || undefined,
        video_url: courseFormData.videoUrl || undefined,
        download_url: courseFormData.downloadUrl || undefined,
        materials: courseFormData.documents?.map(d => ({ name: d.name, size: d.size, type: d.type })) || [],
        learning_objectives: courseFormData.tags || [],
        course_type: courseFormData.type,
        language: courseFormData.language,
        format: courseFormData.format,
        author_type: courseFormData.authorType,
        business_type: courseFormData.businessType,
        industry_sector: courseFormData.industrySector,
        stage: courseFormData.stage,
        page_count: courseFormData.pageCount ? parseInt(courseFormData.pageCount) : null,
        file_size: courseFormData.fileSize,
        target_audience: courseFormData.targetAudience,
        status: 'published',
        approval_status: 'approved'
      }
      const res = await apiService.post('/courses', payload)
      const created = res?.course || res
      setCoursesData(prev => [{
        id: String(created.id),
        ...payload,
        type: courseFormData.type,
        course_type: courseFormData.type,
        title: payload.title,
        description: payload.description,
        instructor: payload.instructor,
        duration: courseFormData.duration_hours && courseFormData.duration_minutes ? 
          `${courseFormData.duration_hours}h ${courseFormData.duration_minutes}m` : 
          courseFormData.duration_hours ? `${courseFormData.duration_hours}h` :
          courseFormData.duration_minutes ? `${courseFormData.duration_minutes}m` :
          courseFormData.duration || '',
        language: courseFormData.language,
        category: payload.category,
        level: courseFormData.level,
        price: courseFormData.price,
        rating: 5,
        enrolledStudents: 0,
        thumbnailUrl: payload.thumbnail_url,
        thumbnail_url: payload.thumbnail_url,
        videoUrl: payload.video_url,
        downloadUrl: courseFormData.downloadUrl,
        tags: courseFormData.tags
      }, ...prev])
      
      // Switch to the appropriate tab based on course type
      if (courseFormData.type === 'video') {
        setActiveCourseTab('videos')
      } else if (courseFormData.type === 'book') {
        setActiveCourseTab('books')
      } else if (courseFormData.type === 'business-plan') {
        setActiveCourseTab('business-plans')
      }
      
      handleCloseCourseForm()
    } catch (err) {
      console.error('Create course failed', err)
      alert(err.message || 'Failed to create course')
    }
  }

  const handleCourseInputChange = (field, value) => {
    setCourseFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (courseFormData.customTag.trim() && !courseFormData.tags.includes(courseFormData.customTag.trim())) {
      setCourseFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.customTag.trim()],
        customTag: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setCourseFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleCourseFileUpload = (files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setCourseFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...fileArray]
    }))
  }

  const removeCourseDocument = (documentId) => {
    setCourseFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return 'N/A'
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type })
    setShowDetails(true)
  }

  const handleViewApplicants = async (item, type) => {
    try {
      setLoadingApplicants(true)
      setSelectedItem({ ...item, type })
      const response = await apiService.getApplicantsForItem(type, item.id.toString())
      setApplicants(response.applicants || [])
      setShowApplicants(true)
    } catch (error) {
      console.error('Error fetching applicants:', error)
      alert('Failed to fetch applicants: ' + error.message)
    } finally {
      setLoadingApplicants(false)
    }
  }

  const handleExportApplicants = () => {
    // Filter applicants based on selected status
    const filteredApplicants = applicantFilterStatus === 'all' 
      ? applicants 
      : applicants.filter(applicant => applicant.status === applicantFilterStatus)

    if (filteredApplicants.length === 0) {
      alert('No applicants found for the selected status')
      return
    }

    // Create CSV content
    const csvContent = [
      ['Full Name', 'Email', 'Phone'],
      ...filteredApplicants.map(applicant => [
        applicant.name || 'N/A',
        applicant.email || 'N/A',
        applicant.phone || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    // Create status-specific title
    const statusTitles = {
      'all': 'All Candidates',
      'pending': 'Pending Candidates',
      'approved': 'Approved Candidates',
      'shortlisted': 'Shortlisted Candidates',
      'rejected': 'Rejected Candidates'
    }

    const title = statusTitles[applicantFilterStatus] || 'Candidates'
    const filename = `${title.replace(/\s+/g, '_')}_${selectedItem.title.replace(/\s+/g, '_')}.csv`

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getTemplateMessage = (status, type) => {
    const templates = {
      all: {
        email: `Dear {name},

Thank you for your interest in our platform. We appreciate your application and will keep you updated on any relevant opportunities.

Best regards,
Merit Consultants Team`,
        sms: `Hi {name}! Thank you for your interest. We'll keep you updated on opportunities. - Merit Consultants`
      },
      pending: {
        email: `Dear {name},

Thank you for your application. We have received your application and it is currently under review. We will notify you of the outcome within 5-7 business days.

Best regards,
Merit Consultants Team`,
        sms: `Hi {name}! We received your application and it's under review. We'll notify you within 5-7 days. - Merit Consultants`
      },
      approved: {
        email: `Dear {name},

Congratulations! We are pleased to inform you that your application has been approved. Please check your email for further instructions and next steps.

We look forward to working with you.

Best regards,
Merit Consultants Team`,
        sms: `Congratulations {name}! Your application has been approved. Check your email for next steps. - Merit Consultants`
      },
      shortlisted: {
        email: `Dear {name},

Great news! Your application has been shortlisted. You are among the top candidates for this position. We will be in touch soon with further details about the next steps in the process.

Thank you for your interest.

Best regards,
Merit Consultants Team`,
        sms: `Great news {name}! You've been shortlisted. We'll contact you soon with next steps. - Merit Consultants`
      },
      rejected: {
        email: `Dear {name},
Thank you for your application. After careful consideration, we have decided not to proceed with your application at this time. We encourage you to apply for other opportunities that may be a better fit.
We appreciate your interest in our platform.
Best regards,
Merit Consultants Team`,
        sms: `Thank you for applying {name}. Unfortunately, we won't proceed this time. Please check other opportunities. - Merit Consultants`
      }
    }
    return templates[status]?.[type] || ''
  }

  const handleBulkSMS = (item) => {
    if (applicants.length === 0) {
      alert('No applicants loaded. Please click "View" to load applicants first.')
      return
    }
    setSelectedItem(item)
    setShowBulkSMS(true)
    // Set default message based on current filter
    setMessage(getTemplateMessage(messageFilterStatus, messageType))
  }

  // Load template message when modal opens
  useEffect(() => {
    if (showBulkSMS) {
      setMessage(getTemplateMessage(messageFilterStatus, messageType))
    }
  }, [showBulkSMS, messageFilterStatus, messageType])

  const handleMessageTypeChange = (type) => {
    setMessageType(type)
    // Update message with template for new type
    setMessage(getTemplateMessage(messageFilterStatus, type))
  }

  const handleMessageStatusChange = (status) => {
    setMessageFilterStatus(status)
    // Update message with template for new status
    setMessage(getTemplateMessage(status, messageType))
  }

  const handleSendBulkMessage = async () => {
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    // Filter applicants based on selected status
    const filteredApplicants = messageFilterStatus === 'all' 
      ? applicants 
      : applicants.filter(applicant => applicant.status === messageFilterStatus)

    if (filteredApplicants.length === 0) {
      alert('No applicants found for the selected status')
      return
    }

    const contactsWithMessages = filteredApplicants
      .filter(applicant => {
        if (messageType === 'email') {
          return applicant.email && applicant.email !== 'N/A'
        } else {
          return applicant.phone && applicant.phone !== 'N/A'
        }
      })
      .map(applicant => {
        // Personalize the message for each applicant
        const personalizedMessage = message.replace(/\{name\}/g, applicant.name)
        return {
          contact: messageType === 'email' ? applicant.email : applicant.phone,
          name: applicant.name,
          message: personalizedMessage,
          type: messageType
        }
      })

    if (contactsWithMessages.length === 0) {
      alert(`No valid ${messageType === 'email' ? 'email addresses' : 'phone numbers'} found for the selected applicants`)
      return
    }

    try {
      setSendingMessage(true)
      
      // Here you would integrate with your email/SMS service
      // For now, we'll just show a confirmation
      const confirmed = window.confirm(
        `Send ${messageType.toUpperCase()} to ${contactsWithMessages.length} applicants?\n\n` +
        `Status: ${messageFilterStatus === 'all' ? 'All' : messageFilterStatus}\n` +
        `Type: ${messageType === 'email' ? 'Email' : 'SMS'}\n` +
        `Message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"\n\n` +
        `Each message will be personalized with the applicant's name.\n` +
        `Recipients: ${contactsWithMessages.map(p => p.name).join(', ')}`
      )

      if (confirmed) {
        // TODO: Implement actual message sending logic here
        // await apiService.post('/admin/send-bulk-messages', { messages: contactsWithMessages })
        
        alert(`${messageType === 'email' ? 'Email' : 'SMS'} sent successfully to ${contactsWithMessages.length} applicants!`)
        setShowBulkSMS(false)
        setMessage('')
      }
    } catch (error) {
      console.error('Error sending bulk messages:', error)
      alert(`Failed to send ${messageType}: ` + error.message)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDelete = async (item, type) => {
    try {
      // Convert singular type to plural for API
      const apiType = type === 'job' ? 'jobs' : 
                     type === 'tender' ? 'tenders' : 
                     type === 'opportunity' ? 'opportunities' : 
                     type === 'course' ? 'courses' : type
      
      // Enhanced confirmation message
      const confirmMessage = `Are you sure you want to delete "${item.title || item.name}"?\n\nThis will permanently delete:\n• The ${type} content\n• All related applications\n• All associated data\n\nThis action cannot be undone.`
      
      if (!window.confirm(confirmMessage)) return
      
      // Show loading state
      const deleteButton = document.querySelector(`[data-delete-id="${item.id}"]`)
      if (deleteButton) {
        deleteButton.disabled = true
        deleteButton.textContent = 'Deleting...'
      }
      
      // Call API to delete with correct plural type
      await apiService.delete(`/admin/content/${apiType}/${item.id}`)
      
      // Update all data arrays to remove the deleted item
      const updateArrays = () => {
        if (type === 'job') setJobsData(prev => prev.filter(x => x.id !== item.id))
        if (type === 'tender') setTendersData(prev => prev.filter(x => x.id !== item.id))
        if (type === 'opportunity') setOpportunitiesData(prev => prev.filter(x => x.id !== item.id))
        if (type === 'course') setCoursesData(prev => prev.filter(x => x.id !== item.id))
        
        // Update the unified content data
        setAllContentData(prev => prev.filter(x => x.id !== item.id))
      }
      
      // Update UI immediately
      updateArrays()
      
      // Close details modal if open
      setShowDetails(false)
      
      // Show success message
      alert(`✅ "${item.title || item.name}" has been permanently deleted from the database.`)
      
    } catch (error) {
      console.error('Delete failed:', error)
      
      // Reset button state
      const deleteButton = document.querySelector(`[data-delete-id="${item.id}"]`)
      if (deleteButton) {
        deleteButton.disabled = false
        deleteButton.textContent = 'Delete'
      }
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete content'
      alert(`❌ Delete failed: ${errorMessage}`)
    }
  }

  const handleApprove = async (item, type) => {
    // Convert singular type to plural for API
    const apiType = type === 'job' ? 'jobs' : 
                   type === 'tender' ? 'tenders' : 
                   type === 'opportunity' ? 'opportunities' : 
                   type === 'course' ? 'courses' : type
    
    // Update UI immediately
      const updateItem = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: 'approved' } : x
      )
      if (type === 'job') setJobsData(updateItem)
      if (type === 'tender') setTendersData(updateItem)
      if (type === 'opportunity') setOpportunitiesData(updateItem)
      if (type === 'course') setCoursesData(updateItem)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${apiType}/${item.id}/approve`)
    } catch (e) {
      console.error('Approve failed', e)
      // Revert on error
      const revert = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: item.approval_status } : x
      )
      if (type === 'job') setJobsData(revert)
      if (type === 'tender') setTendersData(revert)
      if (type === 'opportunity') setOpportunitiesData(revert)
      if (type === 'course') setCoursesData(revert)
      alert(e.message || 'Approve failed')
    }
  }

  const handleReject = async (item, type) => {
    const rejectionReason = prompt('Please provide a reason for rejection:')
    if (!rejectionReason || rejectionReason.trim() === '') {
      alert('Rejection reason is required')
      return
    }
    
    // Convert singular type to plural for API
    const apiType = type === 'job' ? 'jobs' : 
                   type === 'tender' ? 'tenders' : 
                   type === 'opportunity' ? 'opportunities' : 
                   type === 'course' ? 'courses' : type
    
    // Update UI immediately
      const updateItem = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: 'rejected', rejection_reason: rejectionReason.trim() } : x
      )
      if (type === 'job') setJobsData(updateItem)
      if (type === 'tender') setTendersData(updateItem)
      if (type === 'opportunity') setOpportunitiesData(updateItem)
      if (type === 'course') setCoursesData(updateItem)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${apiType}/${item.id}/reject`, {
        rejection_reason: rejectionReason.trim()
      })
    } catch (e) {
      console.error('Reject failed', e)
      // Revert on error
      const revert = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: item.approval_status, rejection_reason: item.rejection_reason } : x
      )
      if (type === 'job') setJobsData(revert)
      if (type === 'tender') setTendersData(revert)
      if (type === 'opportunity') setOpportunitiesData(revert)
      if (type === 'course') setCoursesData(revert)
      alert(e.message || 'Reject failed')
    }
  }

  const handleStatusChange = async (item, type, nextStatus) => {
    // Convert singular type to plural for API
    const apiType = type === 'job' ? 'jobs' : 
                   type === 'tender' ? 'tenders' : 
                   type === 'opportunity' ? 'opportunities' : 
                   type === 'course' ? 'courses' : type
    
    // Update UI immediately
      const update = (arr) => arr.map(x => x.id === item.id ? { ...x, status: nextStatus } : x)
      if (type === 'job') setJobsData(update)
      if (type === 'tender') setTendersData(update)
      if (type === 'opportunity') setOpportunitiesData(update)
      if (type === 'course') setCoursesData(update)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${apiType}/${item.id}/status`, { status: nextStatus })
    } catch (e) {
      console.error('Status update failed', e)
      // Revert on error
      const revert = (arr) => arr.map(x => x.id === item.id ? { ...x, status: item.status } : x)
      if (type === 'job') setJobsData(revert)
      if (type === 'tender') setTendersData(revert)
      if (type === 'opportunity') setOpportunitiesData(revert)
      if (type === 'course') setCoursesData(revert)
      alert(e.message || 'Status update failed')
    }
  }

  const handlePriceToggle = async (item, type) => {
    const newPrice = item.price === 'Free' ? 'Pro' : 'Free'
    
    // Convert singular type to plural for API
    const apiType = type === 'job' ? 'jobs' : 
                   type === 'tender' ? 'tenders' : 
                   type === 'opportunity' ? 'opportunities' : 
                   type === 'course' ? 'courses' : type
    
    // Update UI immediately
    const update = (arr) => arr.map(x => x.id === item.id ? { ...x, price: newPrice } : x)
    if (type === 'job') setJobsData(update)
    if (type === 'tender') setTendersData(update)
    if (type === 'opportunity') setOpportunitiesData(update)
    if (type === 'course') setCoursesData(update)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${apiType}/${item.id}/price`, { price: newPrice })
    } catch (e) {
      console.error('Price update failed', e)
      // Revert on error
      const revert = (arr) => arr.map(x => x.id === item.id ? { ...x, price: item.price } : x)
      if (type === 'job') setJobsData(revert)
      if (type === 'tender') setTendersData(revert)
      if (type === 'opportunity') setOpportunitiesData(revert)
      if (type === 'course') setCoursesData(revert)
      alert(e.message || 'Price update failed')
    }
  }

  // Upload media to backend and set returned path in form state
  const handleFileUpload = async (kind, file) => {
    try {
      const category = kind === 'video' ? 'videos' : (kind === 'document' ? 'documents' : 'images')
      const API_BASE = (import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8000/api'
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE}/uploads?category=${category}`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      if (!data?.path) throw new Error('No path returned')
      setCourseFormData(prev => ({
        ...prev,
        thumbnailUrl: kind === 'thumbnail' ? data.path : prev.thumbnailUrl,
        videoUrl: kind === 'video' ? data.path : prev.videoUrl,
        downloadUrl: kind === 'document' ? data.path : prev.downloadUrl
      }))
    } catch (e) {
      console.error('Upload error', e)
      alert('Failed to upload file')
    }
  }

  const handleEdit = (item, type) => {
    // Debug logging
    console.log('Edit item received:', item);
    console.log('Contact email from item:', item.contact_email);
    console.log('Contact phone from item:', item.contact_phone);
    
    // Transform admin data to match Post form field names
    const editData = {
      ...item,
      type: type === 'tenders' ? 'tender' : type === 'opportunities' ? 'opportunity' : type,
      // Map job-specific fields to match Post form expectations
      title: item.title || '',
      description: item.description || '',
      company: item.company || '',
      location: item.location || '',
      country: item.country || '',
      work_type: item.work_type || '',
      salary_min: item.salary_min || '',
      salary_max: item.salary_max || '',
      currency: item.currency || 'USD',
      job_type: item.job_type || '',
      experience_level: item.experience_level || '',
      experience_years: item.experience_years || '',
      industry: item.industry || '',
      customIndustry: item.customIndustry || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''),
      benefits: Array.isArray(item.benefits) ? item.benefits.join(', ') : (item.benefits || ''),
      application_deadline: item.application_deadline || item.deadline || '',
      value: item.value || '',
      organization: item.organization || '',
      sector: item.sector || '',
      customSector: item.customSector || '',
      requirements: Array.isArray(item.requirements) ? item.requirements.join('\n') : (item.requirements || ''),
      project_scope: Array.isArray(item.project_scope) ? item.project_scope.join('\n') : (item.project_scope || ''),
      technical_requirements: Array.isArray(item.technical_requirements) ? item.technical_requirements.join('\n') : (item.technical_requirements || ''),
      submission_process: Array.isArray(item.submission_process) ? item.submission_process.join('\n') : (item.submission_process || ''),
      evaluation_criteria: Array.isArray(item.evaluation_criteria) ? item.evaluation_criteria.join('\n') : (item.evaluation_criteria || ''),
      external_url: item.external_url || item.application_url || '',
      contact_email: item.contact_email || '',
      contact_phone: item.contact_phone || '',
      price: item.price || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      customTag: '',
      documents: item.documents || [],
      companyLogo: null,
      coverImage: null,
      is_urgent: item.is_urgent || false
    }
    
    setShowPostPage(true)
    setSelectedItem(editData)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open':
      case 'published':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderColor: '#bbf7d0'
        }
      case 'pending':
      case 'under review':
      case 'shortlisted':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        }
      case 'expired':
      case 'closed':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        }
      case 'rejected':
      case 'cancelled':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderColor: '#fecaca'
        }
      case 'approved':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderColor: '#bbf7d0'
        }
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        }
    }
  }

  const TabButton = ({ value, children, isActive, onClick }) => (
    <button
      onClick={() => onClick(value)}
      style={{
        padding: '8px 16px',
        backgroundColor: isActive ? '#f97316' : 'transparent',
        color: isActive ? 'white' : '#64748b',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </button>
  )

  // Helper functions for different card types
  const getSectorIcon = (sector) => {
    const iconMap = {
      'Technology': Building,
      'Healthcare': Building,
      'Education': Building,
      'Infrastructure': Building,
      'default': Building
    }
    return iconMap[sector] || iconMap.default
  }

  const getSectorColor = (sector) => {
    const colorMap = {
      'Technology': '#3b82f6',
      'Healthcare': '#16a34a',
      'Education': '#8b5cf6',
      'Infrastructure': '#f59e0b',
      'default': '#64748b'
    }
    return colorMap[sector] || colorMap.default
  }

  const getTypeColor = (type) => {
    const colorMap = {
      'Scholarships': '#1d4ed8',      // Blue
      'Fellowships': '#7c3aed',       // Purple
      'Grants': '#dc2626',            // Red
      'Funds': '#ea580c',             // Orange
      'Internships': '#059669',       // Green
      'Programs': '#0891b2',          // Cyan
      'Competitions': '#f59e0b',      // Amber
      'Research': '#8b5cf6',          // Violet
      'Professional Development': '#ec4899', // Pink
      'Volunteer': '#ef4444',         // Red
      'Scholarship': '#1d4ed8',       // Blue (singular)
      'Fellowship': '#7c3aed',        // Purple (singular)
      'Grant': '#dc2626',             // Red (singular)
      'Fund': '#ea580c',              // Orange (singular)
      'Internship': '#059669',        // Green (singular)
      'Program': '#0891b2',           // Cyan (singular)
      'Competition': '#f59e0b',       // Amber (singular)
      'default': '#64748b'            // Gray
    }
    return colorMap[type] || colorMap.default
  }

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return 0
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Check if deadline has passed
  const isDeadlineExpired = (deadline) => {
    if (!deadline) return false
    try {
      const deadlineDate = new Date(deadline)
      const now = new Date()
      return deadlineDate < now
    } catch (error) {
      console.error('Error checking deadline:', error)
      return false
    }
  }

  // Format date to dd/mm/yyyy
  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return 'No deadline'
    try {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  // Normalize price badges to match merit app cards
  const isProBadge = (item) => {
    const price = item?.price
    return price === 'Pro' || item?.postedBy === 'platform' || item?.posted_by === 'platform' || item?.is_featured === true
  }

  const isFreeBadge = (item) => {
    const price = item?.price
    return price === 'Free' || price === 0 || item?.is_free === true
  }

  // Formatting helpers adapted from app
  const formatNumber = (n) => {
    const num = Number(n)
    return Number.isFinite(num) ? num.toLocaleString() : ''
  }

  const titleCaseDash = (val) => {
    if (!val) return ''
    return String(val)
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('-')
  }

  const capitalizeFirst = (val) => {
    if (!val) return ''
    const s = String(val)
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  // Ensure tags are always an array of strings
  const normalizeTags = (input) => {
    if (!input) return []
    if (Array.isArray(input)) return input.filter(Boolean).map(String)
    return String(input)
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  }

  // Match merit app card data for jobs
  const transformJobAdminItem = (apiJob) => {
    const min = apiJob?.salary_min != null ? Number(apiJob.salary_min) : undefined
    const max = apiJob?.salary_max != null ? Number(apiJob.salary_max) : undefined
    const fmt = (n) => typeof n === 'number' && !Number.isNaN(n) ? n.toLocaleString() : ''
    let salary
    if (min != null && max != null) {
      salary = min === max
        ? `${apiJob.currency} ${fmt(min)}`
        : `${apiJob.currency} ${fmt(min)} - ${apiJob.currency} ${fmt(max)}`
    } else if (min != null) {
      salary = `${apiJob.currency} ${fmt(min)}`
    } else if (max != null) {
      salary = `${apiJob.currency} ${fmt(max)}`
            } else {
      salary = 'Salary not specified'
    }
    return {
      ...apiJob,
      salary,
      type: 'job', // Content type identifier
      jobType: apiJob?.job_type ? apiJob.job_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : 'Not specified',
      workType: apiJob?.work_type ? apiJob.work_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : 'Not specified',
      experience: apiJob?.experience_years ? `${apiJob.experience_years} years` : 'Not specified',
      postedTime: apiJob?.created_at ? new Date(apiJob.created_at).toLocaleDateString() : 'Recently',
      deadline: apiJob?.application_deadline ? new Date(apiJob.application_deadline).toLocaleDateString() : 'No deadline',
      skills: apiJob.skills || [],
      description: apiJob.description,
      benefits: Array.isArray(apiJob.benefits) ? apiJob.benefits : (apiJob.benefits ? [apiJob.benefits] : []),
      tags: Array.isArray(apiJob.tags) ? apiJob.tags : (apiJob.tags ? [apiJob.tags] : []),
      external_url: apiJob.external_url || '',
      creator: apiJob.creator
    }
  }

  // Normalize tenders to show contract value like salary and keep labels
  const transformTenderAdminItem = (apiTender) => {
    // Use the contractValue from backend if available, otherwise compute it
    let amount = apiTender?.contractValue || 'Value not specified'
    
    // If contractValue is not available, try to compute it from raw fields
    if (amount === 'Value not specified') {
      const currency = apiTender?.currency || 'USD'
      const min = apiTender?.contract_value_min != null ? Number(apiTender.contract_value_min) : undefined
      const max = apiTender?.contract_value_max != null ? Number(apiTender.contract_value_max) : undefined
      
      if (min != null && max != null) {
        amount = min === max
          ? `${currency} ${formatNumber(min)}`
          : `${currency} ${formatNumber(min)} - ${currency} ${formatNumber(max)}`
      } else if (min != null) {
        amount = `${currency} ${formatNumber(min)}`
      } else if (max != null) {
        amount = `${currency} ${formatNumber(max)}`
      } else if (apiTender?.contract_value != null) {
        amount = `${currency} ${formatNumber(apiTender.contract_value)}`
      } else if (apiTender?.value != null) {
        amount = `${currency} ${formatNumber(apiTender.value)}`
      }
    }
    
    return {
      ...apiTender,
      amount,
      type: 'tender', // Content type identifier
      sector: (apiTender?.sector || '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('-'),
      postedTime: apiTender?.created_at ? new Date(apiTender.created_at).toLocaleDateString() : 'Recently',
      description: apiTender?.description || apiTender?.tender_description || '',
      tags: normalizeTags(apiTender?.tags || apiTender?.tag_list || apiTender?.categories)
    }
  }

  // Normalize opportunities for amount and type casing
  const transformOpportunityAdminItem = (apiOpp) => {
    const currency = apiOpp?.currency || 'USD'
    const min = apiOpp?.amount_min != null ? Number(apiOpp.amount_min) : undefined
    const max = apiOpp?.amount_max != null ? Number(apiOpp.amount_max) : undefined
    let amount
    if (min != null && max != null) {
      amount = min === max
        ? `${currency} ${formatNumber(min)}`
        : `${currency} ${formatNumber(min)} - ${currency} ${formatNumber(max)}`
    } else if (min != null) {
      amount = `${currency} ${formatNumber(min)}`
    } else if (max != null) {
      amount = `${currency} ${formatNumber(max)}`
    } else if (apiOpp?.amount != null) {
      amount = `${currency} ${formatNumber(apiOpp.amount)}`
    } else if (apiOpp?.value != null) {
      amount = `${currency} ${formatNumber(apiOpp.value)}`
    } else {
      amount = 'Amount not specified'
    }
    return {
      ...apiOpp,
      amount,
      type: 'opportunity', // Content type identifier
      opportunityType: apiOpp?.type ? titleCaseDash(apiOpp.type) : apiOpp?.type,
      postedTime: apiOpp?.created_at ? new Date(apiOpp.created_at).toLocaleDateString() : 'Recently',
      description: apiOpp?.description || apiOpp?.opportunity_description || '',
      detailed_description: apiOpp?.detailed_description || '',
      eligibility: apiOpp?.eligibility || [],
      applicationProcess: apiOpp?.applicationProcess || [],
      benefits: apiOpp?.benefits || [],
      requirements: apiOpp?.requirements || [],
      tags: normalizeTags(apiOpp?.tags || apiOpp?.tag_list || apiOpp?.categories),
      poster: apiOpp?.poster,
      external_url: apiOpp?.external_url,
      contact_email: apiOpp?.contact_email,
      documents: apiOpp?.documents || []
    }
  }

  // Transform course data for admin display
  const transformCourseAdminItem = (apiCourse) => {
    const courseType = apiCourse.course_type || 'video'
    const authorFromApi = apiCourse.author
    const instructorFromApi = apiCourse.instructor
    const normalizedInstructor = instructorFromApi || authorFromApi || ''


    const transformedData = {
      id: apiCourse.id,
      title: apiCourse.title || '',
      type: 'course',
      course_type: courseType,
      instructor: normalizedInstructor,
      author: authorFromApi || '',
      author_type: apiCourse.author_type || '',
      business_type: apiCourse.business_type || '',
      industry_sector: apiCourse.industry_sector || '',
      stage: apiCourse.stage || '',
      page_count: apiCourse.page_count || null,
      file_size: apiCourse.file_size || '',
      format: apiCourse.format || '',
      duration: apiCourse.duration_hours && apiCourse.duration_minutes ? 
        `${apiCourse.duration_hours}h ${apiCourse.duration_minutes}m` :
        apiCourse.duration_hours ? `${apiCourse.duration_hours}h` :
        apiCourse.duration_minutes ? `${apiCourse.duration_minutes}m` :
        apiCourse.duration || '',
      level: apiCourse.level || '',
      language: apiCourse.language || 'English',
      price: apiCourse.price || (apiCourse.is_free ? 'Free' : 'Pro') || 'Free',
      description: apiCourse.description || '',
      category: apiCourse.category || '',
      tags: Array.isArray(apiCourse?.learning_objectives) ? apiCourse.learning_objectives : [],
      approval_status: apiCourse.approval_status || 'approved',
      status: apiCourse.status || 'published',
      createdAt: apiCourse.createdAt,
      updatedAt: apiCourse.updatedAt,
      thumbnail_url: apiCourse.thumbnail_url,
      video_url: apiCourse.video_url,
      download_url: apiCourse.download_url,
      // Normalized counts
      downloads: (typeof apiCourse.downloads === 'number' ? apiCourse.downloads : (apiCourse.downloads_count ?? apiCourse.enrollment_count ?? 0)),
      download_count: apiCourse.downloads_count ?? apiCourse.enrollment_count ?? 0,
      materials: apiCourse.materials || [],
      requirements: apiCourse.requirements || [],
      learningOutcomes: apiCourse.learning_outcomes || [],
      target_audience: apiCourse.target_audience || ''
    }
    
    return transformedData
  }

  // Filter data based on status filter
  const filterDataByStatus = (data, statusFilter) => {
    if (statusFilter === 'all') return data
    
    const filtered = data.filter(item => {
      if (statusFilter === 'pending') return item.approval_status === 'pending'
      if (statusFilter === 'active') return item.approval_status === 'approved'
      if (statusFilter === 'expired') return item.status === 'expired'
      if (statusFilter === 'rejected') return item.approval_status === 'rejected'
      return true
    })
    
    return filtered
  }
  // Card component for individual items - renders different designs based on type
  const ContentCard = ({ item, type, columns }) => {

    // Admin Actions component
    const AdminActions = () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            handleViewDetails(item, type)
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6'
            e.target.style.color = '#16a34a'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.color = '#6b7280'
          }}
        >
          <Eye size={14} />
        </button>
        {item.approval_status === 'pending' && (
          <>
        <button 
          onClick={(e) => {
            e.stopPropagation()
                handleApprove(item, type)
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
                color: '#16a34a',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dcfce7'
                e.target.style.color = '#15803d'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#16a34a'
          }}
        >
              <CheckCircle size={14} />
        </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleReject(item, type)
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fee2e2'
                e.target.style.color = '#b91c1c'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#dc2626'
              }}
            >
              <XCircle size={14} />
            </button>
          </>
        )}
        {item.approval_status === 'rejected' && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(item, type)
          }}
          data-delete-id={item.id}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#dc2626',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#fee2e2'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
          }}
        >
          <Trash2 size={14} />
        </button>
        )}
      </div>
    )

    // Render different card types
    if (type === 'tenders') {
      const SectorIcon = getSectorIcon(item.sector || item.industry)
      const sectorColor = '#16a34a'
      const daysUntilDeadline = getDaysUntilDeadline(item.deadline)
      const isDeadlineUrgent = daysUntilDeadline <= 7

      return (
        <div style={{
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
        onClick={() => handleViewDetails(item, type)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}>
          
          {/* Edit Icon - Top Right */}
          {item.approval_status === 'pending' && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(item, type)
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#3b82f6',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3b82f6'
                e.target.style.color = 'white'
                e.target.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                e.target.style.color = '#3b82f6'
                e.target.style.borderColor = '#e5e7eb'
              }}
            >
              <Edit size={14} />
            </button>
          )}
          

          {/* Cover Image */}
          <div style={{ position: 'relative' }}>
            {item.coverImage ? (
              <img 
                src={item.coverImage} 
                alt={item.title}
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
                <SectorIcon size={48} color={sectorColor} />
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px',
                  color: 'white',
                  backgroundColor: sectorColor,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  minHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.sector || item.industry || 'General'}
                </span>
                {item.isUrgent && (
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
              {item.title}
            </h2>

            {/* Organization */}
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              {item.organization || item.company}
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
              {item.amount || item.contractValue || item.salary || 'Not specified'}
            </div>

            {/* Location and Deadline */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
                <MapPin size={14} />
                <span>{item.location || 'Not specified'}</span>
              </div>
              {item.country && (
                <>
                  <span style={{ color: '#e2e8f0' }}>•</span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{item.country}</span>
                </>
              )}
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
                <span>{isDeadlineExpired(item.deadline) ? 'Closed' : 'Deadline:'}</span>
                <span style={{ color: isDeadlineExpired(item.deadline) ? '#6b7280' : (isDeadlineUrgent ? '#dc2626' : '#64748b'), fontWeight: isDeadlineExpired(item.deadline) ? '500' : (isDeadlineUrgent ? '600' : '500') }}>
                {isDeadlineExpired(item.deadline) ? '' : formatDateDDMMYYYY(item.deadline)}
                </span>
              </div>
            </div>


            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              paddingBottom: '16px',
              borderTop: '1px solid #f1f5f9',
              marginTop: 'auto',
              flexShrink: 0
            }}>
              {type === 'jobs' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                fontSize: '12px',
                  fontWeight: '600',
                  color: item.price === 'Pro' ? '#3b82f6' : '#16a34a',
                  backgroundColor: item.price === 'Pro' ? '#dbeafe' : '#dcfce7',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${item.price === 'Pro' ? '#93c5fd' : '#bbf7d0'}`
                }}>
                  {item.price || 'Free'}
                </span>
                
                {/* Switch Toggle - only for non-rejected jobs */}
                {item.approval_status !== 'rejected' && (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePriceToggle(item, type)
                  }}
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '24px',
                    backgroundColor: item.price === 'Pro' ? '#3b82f6' : '#d1d5db',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'transform 0.3s ease',
                    transform: item.price === 'Pro' ? 'translateX(20px)' : 'translateX(0)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }} />
                </div>
                )}
              </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(type !== 'jobs' ? { marginLeft: 'auto' } : {})
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // handleDownloadDocs(item.id)
                  }}
                  style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa'
                    e.target.style.borderColor = '#16a34a'
                    e.target.style.color = '#16a34a'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.color = '#64748b'
                  }}
                >
                  <Download size={12} />
                  Docs
                </button>


                {item.approval_status === 'pending' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                        handleApprove(item, type)
                  }}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#15803d'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#16a34a'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReject(item, type)
                      }}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc2626'
                        e.target.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ef4444'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      Reject
                </button>
              </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: item.approval_status === 'approved' ? '#dcfce7' : '#fee2e2',
                      color: item.approval_status === 'approved' ? '#15803d' : '#b91c1c',
                      border: '1px solid',
                      borderColor: item.approval_status === 'approved' ? '#bbf7d0' : '#fecaca',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.approval_status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (type === 'opportunities') {
      const typeColor = getTypeColor(item.type)

      return (
        <div style={{
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
        onClick={() => handleViewDetails(item, type)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}>

          {/* Edit Icon - Top Right */}
          {item.approval_status === 'pending' && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(item, type)
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#3b82f6',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3b82f6'
                e.target.style.color = 'white'
                e.target.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                e.target.style.color = '#3b82f6'
                e.target.style.borderColor = '#e5e7eb'
              }}
            >
              <Edit size={14} />
            </button>
          )}

          {/* Poster Image */}
          <div style={{ position: 'relative' }}>
            <img 
              src={item.poster} 
              alt={item.title}
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover'
              }}
            />
            
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
                  backdropFilter: 'blur(10px)'
                }}>
                  {item.type}
                </span>
                {/* Urgent badge intentionally not shown for opportunities */}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px' }}>
            {/* Title */}
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: '0 0 12px 0',
              lineHeight: '1.3'
            }}>
              {item.title}
            </h2>

            {/* Organization (fallback to category) */}
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              {item.organization || item.category}
            </div>

            {/* Amount, Duration, Location */}
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
                color: '#16a34a',
                fontWeight: '600'
              }}>
                <DollarSign size={14} />
                {item.amount || item.salary}
              </div>
              <span style={{ color: '#e2e8f0' }}>•</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: '#64748b'
              }}>
                <Clock size={14} />
                {item.duration || 'Varies'}
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
                {item.location}
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
              <span>{isDeadlineExpired(item.deadline) ? 'Closed' : 'Deadline:'}</span>
              <span style={{ color: isDeadlineExpired(item.deadline) ? '#6b7280' : '#dc2626', fontWeight: '600' }}>
                {isDeadlineExpired(item.deadline) ? '' : formatDateDDMMYYYY(item.deadline)}
              </span>
            </div>

            {/* Tags - More prominent display */}
            <div style={{ marginBottom: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {item.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                  </span>
                ))}
                {item.tags.length > 2 && (
                  <span style={{
                    color: '#64748b',
                    fontSize: '12px',
                    padding: '6px 10px',
                    fontWeight: '500'
                  }}>
                    +{item.tags.length - 2} more
                  </span>
                )}
              </div>
            </div>


            {/* Footer */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingTop: '16px',
              paddingBottom: '16px',
              borderTop: '1px solid #f1f5f9',
              marginTop: 'auto',
              flexShrink: 0
            }}>
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    {item.tags.slice(0, 4).map((tag, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                      </span>
                    ))}
                    {item.tags.length > 4 && (
                      <span style={{
                        color: '#64748b',
                        fontSize: '12px',
                        padding: '4px 8px',
                        fontWeight: '500'
                      }}>
                        +{item.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px'
              }}>

              {item.approval_status === 'pending' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                      handleApprove(item, type)
                }}
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#15803d'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#16a34a'
                  e.target.style.transform = 'translateY(0)'
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'translateY(1px) scale(0.95)'
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'translateY(-1px) scale(1)'
                }}
              >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReject(item, type)
                    }}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc2626'
                      e.target.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ef4444'
                      e.target.style.transform = 'translateY(0)'
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = 'translateY(1px) scale(0.95)'
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = 'translateY(-1px) scale(1)'
                    }}
                  >
                    Reject
              </button>
            </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: item.approval_status === 'approved' ? '#dcfce7' : '#fee2e2',
                    color: item.approval_status === 'approved' ? '#15803d' : '#b91c1c',
                    border: '1px solid',
                    borderColor: item.approval_status === 'approved' ? '#bbf7d0' : '#fecaca',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {item.approval_status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Default job card design - EXACT copy from merit app
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px 12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      onClick={() => handleViewDetails(item, type)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}>
        
        {/* Edit Icon - Top Right */}
        {item.approval_status === 'pending' && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(item, type)
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#3b82f6'
              e.target.style.color = 'white'
              e.target.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
              e.target.style.color = '#3b82f6'
              e.target.style.borderColor = '#e5e7eb'
            }}
          >
            <Edit size={14} />
          </button>
        )}
        

        {/* Company Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <img 
              src={item.logo || item.company_logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop'} 
              alt={item.company}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '22px',
                objectFit: 'cover',
                border: '2px solid #f8f9fa'
              }}
            />
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
                {item.company}
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
                  {item.industry}
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
          {item.title}
          {item.urgentHiring && (
            <Star size={14} color="#3b82f6" fill="#3b82f6" />
          )}
        </h2>

        {/* Quick info: pairs + full-width deadline, with country name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 10px', marginBottom: '4px', fontSize: '12px', color: '#0f172a' }}> 
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
            <MapPin size={11} />
            <span>{item.location}</span>
          </div>
          <div><span>{getCountryName(item.country) || item.country || ''}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600 }}>
            <DollarSign size={12} />
            <span>{item.salary}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
            <Briefcase size={12} />
            <span>{item.type}</span>
          </div>
          <div style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: 500 }}>
            <Calendar size={12} />
            <span>{isDeadlineExpired(item.deadline) ? 'Closed' : 'Deadline:'}</span>
            <span style={{ color: isDeadlineExpired(item.deadline) ? '#6b7280' : '#dc2626', fontWeight: 600 }}>{isDeadlineExpired(item.deadline) ? '' : formatDateDDMMYYYY(item.deadline)}</span>
          </div>
        </div>

        {/* Quick Info removed to avoid duplicates (salary/type already shown above) */}


        {/* Tags */}
        <div style={{ marginBottom: '4px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {item.tags && item.tags.slice(0, 2).map((tag, index) => (
              <span key={index} style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block'
              }}>
                {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
              </span>
            ))}
            {item.tags && item.tags.length > 2 && (
              <span style={{
                color: '#64748b',
                fontSize: '11px',
                padding: '2px 6px',
                fontWeight: '500'
              }}>
                +{item.tags.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '4px',
          borderTop: '1px solid #f1f5f9'
        }}>
          {type === 'jobs' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: item.price === 'Pro' ? '#3b82f6' : '#16a34a',
              backgroundColor: item.price === 'Pro' ? '#dbeafe' : '#dcfce7',
              padding: '4px 8px',
              borderRadius: '6px',
              border: `1px solid ${item.price === 'Pro' ? '#93c5fd' : '#bbf7d0'}`
            }}>
              {item.price || 'Free'}
            </span>
            
            {/* Switch Toggle - only for non-rejected jobs */}
            {item.approval_status !== 'rejected' && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                handlePriceToggle(item, type)
              }}
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                backgroundColor: item.price === 'Pro' ? '#3b82f6' : '#d1d5db',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'transform 0.3s ease',
                transform: item.price === 'Pro' ? 'translateX(20px)' : 'translateX(0)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }} />
            </div>
            )}
          </div>
          )}

          {item.approval_status === 'pending' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
                  handleApprove(item, type)
            }}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#15803d'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#16a34a'
              e.target.style.transform = 'translateY(0)'
            }}
          >
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleReject(item, type)
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc2626'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ef4444'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Reject
          </button>
            </div>
          ) : (
            <span style={{
              backgroundColor: item.approval_status === 'approved' ? '#dcfce7' : '#fee2e2',
              color: item.approval_status === 'approved' ? '#15803d' : '#b91c1c',
              border: '1px solid',
              borderColor: item.approval_status === 'approved' ? '#bbf7d0' : '#fecaca',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {item.approval_status === 'approved' ? 'Approved' : 'Rejected'}
            </span>
          )}
        </div>
      </div>
    )
  }
  const ContentTable = ({ type, data, columns, showFilters = true }) => (
    <div style={{
      backgroundColor: 'transparent',
      borderRadius: 0,
      boxShadow: 'none',
      overflow: 'visible'
    }}>
      <div style={{
        padding: 0,
        borderBottom: 'none',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0,
            textTransform: 'capitalize'
          }}>
            {type} Management
          </h3>
          
        </div>

        {showFilters && !showCourseForm && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '16px',
              height: '16px'
            }} />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={getCurrentFilters().searchTerm}
              onChange={(e) => setCurrentFilters({...getCurrentFilters(), searchTerm: e.target.value})}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* Country Filter */}
          <div>
            <select
              value={getCurrentFilters().countryFilter}
              onChange={(e) => setCurrentFilters({...getCurrentFilters(), countryFilter: e.target.value})}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minWidth: '180px',
                backgroundColor: 'white'
              }}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div>
            <select
              value={getCurrentFilters().statusFilter}
              onChange={(e) => setCurrentFilters({...getCurrentFilters(), statusFilter: e.target.value})}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {selectedItems.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <CheckCircle size={16} />
                Approve ({selectedItems.length})
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <XCircle size={16} />
                Reject ({selectedItems.length})
              </button>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Card Grid */}
      <div style={{
        padding: 0,
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile 
          ? '1fr' 
          : screenSize.isDesktop 
            ? 'repeat(3, 1fr)' 
            : 'repeat(2, 1fr)',
        gap: '20px'
      }}>
            {data.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
                  padding: '48px',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  No {type} found
          </div>
            ) : (
              data.map((item) => (
            <ContentCard 
              key={item.id} 
              item={item} 
              type={type} 
              columns={columns} 
            />
          ))
        )}
      </div>
    </div>
  )

  const applyFilters = (items) => {
    const filters = getCurrentFilters()
    console.log('Applying filters:', filters)
    console.log('Items before filtering:', items.length)
    let out = items
    
    // Content type filter
    if (filters.typeFilter && filters.typeFilter !== 'all') {
      const beforeCount = out.length
      out = out.filter(i => i.type === filters.typeFilter)
      console.log(`Type filter (${filters.typeFilter}): ${beforeCount} -> ${out.length}`)
    }
    
    // Search filter
    if (filters.searchTerm) {
      const beforeCount = out.length
      const q = filters.searchTerm.toLowerCase()
      out = out.filter(i => (
        (i.title || '').toLowerCase().includes(q) ||
        (i.company || i.organization || '').toLowerCase().includes(q) ||
        (i.location || '').toLowerCase().includes(q)
      ))
      console.log(`Search filter ("${filters.searchTerm}"): ${beforeCount} -> ${out.length}`)
    }
    
    // Status filter
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      const beforeCount = out.length
      out = out.filter(i => {
        const status = i.approval_status || i.status || 'pending'
        return status.toLowerCase() === filters.statusFilter.toLowerCase()
      })
      console.log(`Status filter (${filters.statusFilter}): ${beforeCount} -> ${out.length}`)
    }
    
    // Date filter
    if (filters.dateFilter) {
      const beforeCount = out.length
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      console.log(`🔍 Date filter applied: ${filters.dateFilter}`)
      
      out = out.filter(i => {
        const itemDate = new Date(i.createdAt || i.created_at || i.posted_at || i.postedTime)
        if (isNaN(itemDate.getTime())) {
          return false
        }
        
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
        
        let matches = false
        switch (filters.dateFilter) {
          case 'today':
            matches = itemDateOnly.getTime() === today.getTime()
            break
          
          case 'this_week':
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            matches = itemDateOnly >= startOfWeek
            break
          
          case 'this_month':
            matches = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
            break
          
          case 'last_3_months':
            const threeMonthsAgo = new Date(now)
            threeMonthsAgo.setMonth(now.getMonth() - 3)
            matches = itemDate >= threeMonthsAgo
            break
          
          case 'last_6_months':
            const sixMonthsAgo = new Date(now)
            sixMonthsAgo.setMonth(now.getMonth() - 6)
            matches = itemDate >= sixMonthsAgo
            break
          
          case 'last_year':
            const oneYearAgo = new Date(now)
            oneYearAgo.setFullYear(now.getFullYear() - 1)
            matches = itemDate >= oneYearAgo
            break
          
          default:
            matches = true
        }
        
        
        return matches
      })
      console.log(`Date filter (${filters.dateFilter}): ${beforeCount} -> ${out.length}`)
    }
    
    console.log('Final filtered count:', out.length)
    return out
  }

  // Helper function to get applicants for a specific content item
  const getApplicantsForContent = (contentId, contentType) => {
    // The backend already provides applicant count in the content data
    // We don't need to process applicantsData separately
    console.log('Getting applicants for content:', contentId, contentType)
    return []
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <ContentTable
            type="jobs"
            data={applyFilters(filterDataByStatus(jobsData, getCurrentFilters().statusFilter))}
            columns={[
              { key: 'title', label: 'Job Title' },
              { key: 'company', label: 'Company' },
              { key: 'location', label: 'Location' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'postedDate', 
                label: 'Posted Date',
                render: (item) => formatDate(item.createdAt)
              }
            ]}
          />
        )

      case 'tenders':
        return (
          <ContentTable
            type="tenders"
            data={applyFilters(filterDataByStatus(tendersData, getCurrentFilters().statusFilter))}
            columns={[
              { key: 'title', label: 'Tender Title' },
              { key: 'organization', label: 'Organization' },
              { key: 'category', label: 'Category' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'deadline', 
                label: 'Deadline',
                render: (item) => isDeadlineExpired(item.deadline) ? 'Closed' : formatDateDDMMYYYY(item.deadline)
              }
            ]}
          />
        );
      case 'opportunities':
        return (
          <ContentTable
            type="opportunities"
            data={applyFilters(filterDataByStatus(opportunitiesData, getCurrentFilters().statusFilter))}
            columns={[
              { key: 'title', label: 'Opportunity Title' },
              { key: 'type', label: 'Type' },
              { key: 'organization', label: 'Organization' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'deadline', 
                label: 'Application Deadline',
                render: (item) => isDeadlineExpired(item.deadline) ? 'Closed' : formatDateDDMMYYYY(item.deadline)
              }
            ]}
          />
        );
      case 'courses':
        return (
          <div style={{ padding: '20px' }}>
            {/* Course Type Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setActiveCourseTab('videos')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: activeCourseTab === 'videos' ? '#3b82f6' : 'transparent',
                  color: activeCourseTab === 'videos' ? 'white' : '#6b7280',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveCourseTab('books')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: activeCourseTab === 'books' ? '#3b82f6' : 'transparent',
                  color: activeCourseTab === 'books' ? 'white' : '#6b7280',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Books
              </button>
              <button
                onClick={() => setActiveCourseTab('business-plans')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: activeCourseTab === 'business-plans' ? '#3b82f6' : 'transparent',
                  color: activeCourseTab === 'business-plans' ? 'white' : '#6b7280',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Business Plans
              </button>
            </div>

            {/* Course Filters */}
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
                  placeholder={`Search ${activeCourseTab}...`}
                  value={getCurrentFilters().searchTerm}
                  onChange={(e) => setCurrentFilters({...getCurrentFilters(), searchTerm: e.target.value})}
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
                onClick={() => setShowCourseFilters(true)}
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
                {getActiveCourseFilterCount() > 0 && (
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
                    {getActiveCourseFilterCount()}
                  </div>
                )}
              </button>
            </div>

            {/* Course Content Based on Active Tab */}
            {activeCourseTab === 'videos' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px',
                padding: '0'
              }}>
                {applyFilters(filterDataByStatus(coursesData.filter(c => c.course_type === 'video'), getCurrentFilters().statusFilter)).map((video) => (
                  <div key={video.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setSelectedItem({ ...video, type: 'course' }); setShowDetails(true) }}
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
                        src={video.thumbnail_url ? (video.thumbnail_url.startsWith('/uploads') ? `${(import.meta?.env?.VITE_API_BASE_ORIGIN)||'http://localhost:8000'}${video.thumbnail_url}` : video.thumbnail_url) : null} 
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
                        {video.price === 'Pro' && (
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
                    {video.status && video.status.toLowerCase() !== 'published' && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                        backgroundColor: getStatusColor(video.status).backgroundColor,
                        color: getStatusColor(video.status).color,
                        border: `1px solid ${getStatusColor(video.status).borderColor}`,
                        marginLeft: '12px',
                        whiteSpace: 'nowrap'
                      }}>
                        {video.status}
                    </span>
                    )}
                    {/* Pro badge near title removed to avoid duplication; top overlay badge remains */}
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

                      {/* Description removed per requirement */}

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
                            {(video.downloads ?? video.download_count ?? video.enrollment_count ?? 0)} downloads
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
                        {/* Free/Pro switch only (no price text) */}
                        <div
                          onClick={(e) => { e.stopPropagation(); handlePriceToggle(video, 'course') }}
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '24px',
                            backgroundColor: video.price === 'Pro' ? '#3b82f6' : '#d1d5db',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: 'transform 0.3s ease',
                            transform: video.price === 'Pro' ? 'translateX(20px)' : 'translateX(0)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCourseTab === 'books' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px',
                padding: '0'
              }}>
                {applyFilters(filterDataByStatus(coursesData.filter(c => c.course_type === 'book'), getCurrentFilters().statusFilter)).map((book) => (
                  <div key={book.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setSelectedItem({ ...book, type: 'course' }); setShowDetails(true) }}
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
                        src={book.thumbnail_url ? (book.thumbnail_url.startsWith('/uploads') ? `${(import.meta?.env?.VITE_API_BASE_ORIGIN)||'http://localhost:8000'}${book.thumbnail_url}` : book.thumbnail_url) : null} 
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
                        {book.price === 'Pro' && (
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
                        {book.status && book.status.toLowerCase() !== 'published' && (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: getStatusColor(book.status).backgroundColor,
                            color: getStatusColor(book.status).color,
                            border: `1px solid ${getStatusColor(book.status).borderColor}`,
                            marginLeft: '12px',
                            whiteSpace: 'nowrap'
                          }}>
                            {book.status}
                          </span>
                        )}
                        {/* Pro badge near title removed to avoid duplication; top overlay badge remains */}
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
                        by {book.instructor || book.author || 'Unknown Instructor'}
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

                      {/* Description removed per requirement */}

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
                            {book.page_count || 0} pages
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={14} />
                            {(book.downloads ?? book.download_count ?? 0)} downloads
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
                        <div
                          onClick={(e) => { e.stopPropagation(); handlePriceToggle(book, 'course') }}
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '24px',
                            backgroundColor: book.price === 'Pro' ? '#3b82f6' : '#d1d5db',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: 'transform 0.3s ease',
                            transform: book.price === 'Pro' ? 'translateX(20px)' : 'translateX(0)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeCourseTab === 'business-plans' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px',
                padding: '0'
              }}>
                {applyFilters(filterDataByStatus(coursesData.filter(c => c.course_type === 'business-plan'), getCurrentFilters().statusFilter)).map((plan) => (
                  <div key={plan.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setSelectedItem({ ...plan, type: 'course' }); setShowDetails(true) }}
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
                        src={plan.thumbnail_url ? (plan.thumbnail_url.startsWith('/uploads') ? `${(import.meta?.env?.VITE_API_BASE_ORIGIN)||'http://localhost:8000'}${plan.thumbnail_url}` : plan.thumbnail_url) : null} 
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
                        {plan.price === 'Pro' && (
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
                        {plan.status && plan.status.toLowerCase() !== 'published' && (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: getStatusColor(plan.status).backgroundColor,
                            color: getStatusColor(plan.status).color,
                            border: `1px solid ${getStatusColor(plan.status).borderColor}`,
                            marginLeft: '12px',
                            whiteSpace: 'nowrap'
                          }}>
                            {plan.status}
                          </span>
                        )}
                        {/* Pro badge near title removed to avoid duplication; top overlay badge remains */}
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
ill fau                          <span>{plan.category || '—'}</span>
                          <Briefcase size={14} />
                          <span style={{ fontWeight: 600 }}>{plan.business_type || '—'}</span>
                        </div>
                      </div>

                      {/* Description removed per requirement */}

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
                            {plan.page_count || 0} pages
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={14} />
                            {(plan.downloads ?? plan.download_count ?? plan.enrollment_count ?? 0)} downloads
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
                          {/* business_type moved next to instructor above to avoid duplication */}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <div
                          onClick={(e) => { e.stopPropagation(); handlePriceToggle(plan, 'course') }}
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '24px',
                            backgroundColor: plan.price === 'Pro' ? '#3b82f6' : '#d1d5db',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: 'transform 0.3s ease',
                            transform: plan.price === 'Pro' ? 'translateX(20px)' : 'translateX(0)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'content':
        // Use the unified sorted content for the table
        console.log('🔍 Content tab - allContentData:', allContentData.length, 'items')
        console.log('🔍 Content tab - allContentData types:', allContentData.map(item => ({ id: item.id, type: item.type, title: item.title })))
        
        const allContent = allContentData.map(item => ({ 
          ...item, 
          type: item.type === 'job' ? 'Job' : 
                item.type === 'tender' ? 'Tender' : 
                item.type === 'opportunity' ? 'Opportunity' : 
                item.type === 'course' ? 'Course' : 'Unknown',
          applicantCount: item.applications || item.applications_count || 0
        }))
        
        // Apply filters to the unified content
        const filteredContent = applyFilters(allContent)
        
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
              All Content ({filteredContent.length})
            </div>
            
            {/* Filters */}
              <div style={{ 
              backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
              marginBottom: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    width: '16px',
                    height: '16px'
                  }} />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={getCurrentFilters().searchTerm}
                    onChange={(e) => {
                      console.log('Search filter changed:', e.target.value)
                      setCurrentFilters({...getCurrentFilters(), searchTerm: e.target.value})
                    }}
                      style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Content Type Filter */}
                    <div>
                  <select
                    value={getCurrentFilters().typeFilter}
                    onChange={(e) => {
                      console.log('Type filter changed:', e.target.value)
                      setCurrentFilters({...getCurrentFilters(), typeFilter: e.target.value})
                    }}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      minWidth: '180px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="Job">Jobs</option>
                    <option value="Tender">Tenders</option>
                    <option value="Opportunity">Opportunities</option>
                    <option value="Course">Courses</option>
                  </select>
                    </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={getCurrentFilters().statusFilter}
                    onChange={(e) => {
                      console.log('Status filter changed:', e.target.value)
                      setCurrentFilters({...getCurrentFilters(), statusFilter: e.target.value})
                    }}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  </div>

                {/* Posted Date Filter */}
                  <div>
                  <select
                    value={getCurrentFilters().dateFilter}
                    onChange={(e) => {
                      console.log('Date filter changed:', e.target.value)
                      setCurrentFilters({...getCurrentFilters(), dateFilter: e.target.value})
                    }}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      minWidth: '150px'
                    }}
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="last_3_months">Last 3 Months</option>
                    <option value="last_6_months">Last 6 Months</option>
                    <option value="last_year">Last Year</option>
                  </select>
                  </div>

              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Type</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Title</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Organization</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Applicants</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Posted Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContent.map((item, index) => (
                      <tr key={`${item.type}-${item.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', color: '#374151', fontSize: '14px' }}>
                          {item.type}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px', fontSize: '14px' }}>
                            {item.title}
                            </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {item.location || 'Not specified'}
                  </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#374151', fontSize: '14px' }}>
                          {item.company || item.organization || 'Not specified'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                            fontSize: '12px',
                      fontWeight: '500',
                            backgroundColor: item.approval_status === 'approved' ? '#dcfce7' : 
                                           item.approval_status === 'rejected' ? '#fef2f2' : '#fef3c7',
                            color: item.approval_status === 'approved' ? '#166534' : 
                                   item.approval_status === 'rejected' ? '#991b1b' : '#92400e'
                          }}>
                            {item.approval_status || 'pending'}
                    </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                              fontSize: '12px',
                      fontWeight: '500',
                              backgroundColor: item.applicantCount > 0 ? '#dcfce7' : '#f1f5f9',
                              color: item.applicantCount > 0 ? '#166534' : '#6b7280'
                            }}>
                              {item.applicantCount || 0}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>
                          {console.log('🔍 Date debug for item', item.id, ':', {
                            createdAt: item.createdAt,
                            created_at: item.created_at,
                            posted_at: item.posted_at,
                            debug_created_at: item.debug_created_at,
                            debug_createdAt: item.debug_createdAt
                          })}
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 
                           item.created_at ? new Date(item.created_at).toLocaleDateString() :
                           item.posted_at ? new Date(item.posted_at).toLocaleDateString() : 'Not available'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleViewApplicants(item, item.type.toLowerCase())}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  fontSize: '12px'
                                }}
                                title="View Applicants"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button 
                                onClick={() => handleBulkSMS(item)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#f97316',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  fontSize: '12px'
                                }}
                                title="Send Message"
                              >
                                <MessageSquare size={14} />
                                Message
                              </button>
                            <button
                              onClick={() => handleDelete(item, item.type.toLowerCase())}
                              data-delete-id={item.id}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: '12px'
                              }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))}
                  </tbody>
                </table>
                    </div>
                  </div>
          </div>
        )

      default:
        return null
    }
  }
  return (
    <div style={{
      padding: 0
    }}>
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '12px',
        marginBottom: '20px' 
      }}>
        <button
          onClick={handleOpenCourseForm}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <BookOpen size={20} />
          {activeTab === 'courses' ? 
            (activeCourseTab === 'videos' ? 'Add Video' : 
             activeCourseTab === 'books' ? 'Add Book' : 
             activeCourseTab === 'business-plans' ? 'Add Business Plan' : 'Add Course') : 
            'Add Course'}
        </button>
        <button
          onClick={() => {
            setShowPostPage(true)
            setSelectedItem(null)
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ea580c'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f97316'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Plus size={20} />
          Post
        </button>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize.isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: '8px',
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <TabButton value="jobs" isActive={activeTab === "jobs"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16} />
              Jobs
            </div>
          </TabButton>
          <TabButton value="tenders" isActive={activeTab === "tenders"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} />
              Tenders
            </div>
          </TabButton>
          <TabButton value="opportunities" isActive={activeTab === "opportunities"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} />
              Opportunities
            </div>
          </TabButton>
          <TabButton value="courses" isActive={activeTab === "courses"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} />
              Courses
            </div>
          </TabButton>
          <TabButton value="content" isActive={activeTab === "content"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} />
              Content
            </div>
          </TabButton>

        </div>
      </div>

      {/* Content */}
      {showCourseForm ? null : (!showPostPage ? getTabContent() : <Post onClose={() => {
        setShowPostPage(false)
        setSelectedItem(null)
        // Always refresh the data after closing the edit modal
        loadContent()
      }} editItem={selectedItem} />)}

      {/* Course Form Modal */}
      {showCourseForm && (
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
        }}>
          <div style={{
            backgroundColor: 'white',
            width: screenSize.isMobile ? '100%' : 'min(600px, 90vw)',
            maxHeight: screenSize.isMobile ? '90vh' : '90vh',
            borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
            transform: showForm ? 'translateY(0)' : (screenSize.isMobile ? 'translateY(100%)' : 'scale(0.9)'),
            opacity: showForm ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
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
                Add New Course
              </h2>
              
              <button
                onClick={handleCloseCourseForm}
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

            {/* Form Content */}
            <div style={{
              padding: screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px',
              flex: 1
            }}>
              <form onSubmit={handleCourseFormSubmit} style={{
                maxWidth: screenSize.isMobile ? '100%' : '520px',
                margin: '0 auto'
              }}>
                {/* Course Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Course Type *
                  </label>
                  <select
                    value={courseFormData.type}
                    onChange={(e) => handleCourseInputChange('type', e.target.value)}
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
                    <option value="video">Video Course</option>
                    <option value="book">Book/eBook</option>
                    <option value="business-plan">Business Plan</option>
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
                    value={courseFormData.title}
                    onChange={(e) => handleCourseInputChange('title', e.target.value)}
                    placeholder={`Enter ${courseFormData.type === 'business-plan' ? 'business plan' : courseFormData.type} title...`}
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

                {/* Instructor/Author */}
                {courseFormData.type === 'video' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.instructor}
                      onChange={(e) => handleCourseInputChange('instructor', e.target.value)}
                      placeholder="Enter instructor name..."
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
                ) : courseFormData.type === 'book' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.author}
                      onChange={(e) => handleCourseInputChange('author', e.target.value)}
                      placeholder="Enter author name..."
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
                ) : (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Instructor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.instructor}
                      onChange={(e) => handleCourseInputChange('instructor', e.target.value)}
                      placeholder="Enter instructor name..."
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

                {/* Duration (for videos only) & Industry */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: screenSize.isMobile ? '1fr' : courseFormData.type === 'video' ? '1fr 1fr' : '1fr', 
                  gap: '12px', 
                  marginBottom: '16px' 
                }}>
                  {courseFormData.type === 'video' && (
                    <>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                          Duration (Hours)
                    </label>
                    <input
                          type="number"
                          min="0"
                          max="999"
                          value={courseFormData.duration_hours || ''}
                          onChange={(e) => handleCourseInputChange('duration_hours', e.target.value)}
                          placeholder="e.g., 2"
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
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={courseFormData.duration_minutes || ''}
                          onChange={(e) => handleCourseInputChange('duration_minutes', e.target.value)}
                          placeholder="e.g., 30"
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
                  <div>
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
                      value={courseFormData.category}
                      onChange={(e) => handleCourseInputChange('category', e.target.value)}
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
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                      <option value="Energy">Energy</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Consumer">Consumer</option>
                      <option value="Retail">Retail</option>
                      <option value="Food">Food</option>
                          <option value="Agriculture">Agriculture</option>
                      <option value="Media">Media</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Design">Design</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Construction">Construction</option>
                          <option value="Transportation">Transportation</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Government">Government</option>
                      <option value="Nonprofit">Nonprofit</option>
                      <option value="Legal">Legal</option>
                      <option value="HR">HR</option>
                      <option value="Business">Business</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Arts">Arts</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Personal Development">Personal Development</option>
                      <option value="Communication">Communication</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Coaching">Coaching</option>
                      <option value="Mentoring">Mentoring</option>
                      <option value="Motivation">Motivation</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Time Management">Time Management</option>
                      <option value="Goal Setting">Goal Setting</option>
                      <option value="Career Development">Career Development</option>
                      <option value="Networking">Networking</option>
                      <option value="Public Speaking">Public Speaking</option>
                      <option value="Team Building">Team Building</option>
                      <option value="Conflict Resolution">Conflict Resolution</option>
                      <option value="Emotional Intelligence">Emotional Intelligence</option>
                      <option value="Mindfulness">Mindfulness</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Relationships">Relationships</option>
                      <option value="Parenting">Parenting</option>
                      <option value="Finance & Money">Finance & Money</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Creativity">Creativity</option>
                      <option value="Problem Solving">Problem Solving</option>
                      <option value="Critical Thinking">Critical Thinking</option>
                      <option value="Research">Research</option>
                      <option value="Writing">Writing</option>
                      <option value="Language Learning">Language Learning</option>
                      <option value="Travel">Travel</option>
                      <option value="Culture">Culture</option>
                      <option value="History">History</option>
                      <option value="Philosophy">Philosophy</option>
                      <option value="Religion">Religion</option>
                      <option value="Spirituality">Spirituality</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Level & Language (for videos and books) */}
                {(courseFormData.type === 'video' || courseFormData.type === 'book') && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
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
                        Level *
                      </label>
                      <select
                        required
                        value={courseFormData.level}
                        onChange={(e) => handleCourseInputChange('level', e.target.value)}
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
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
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
                        Language *
                      </label>
                      <select
                        required
                        value={courseFormData.language}
                        onChange={(e) => handleCourseInputChange('language', e.target.value)}
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
                        <option value="English">English</option>
                        <option value="Swahili">Swahili</option>
                        <option value="Arabic">Arabic</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Italian">Italian</option>
                        <option value="Dutch">Dutch</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Author Type and Page Count for books */}
                {courseFormData.type === 'book' && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
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
                      Author Type *
                    </label>
                    <select
                      required
                      value={courseFormData.authorType || ''}
                      onChange={(e) => handleCourseInputChange('authorType', e.target.value)}
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
                      <option value="">Select author type</option>
                      <option value="Bestselling Author">Bestselling Author</option>
                      <option value="Industry Expert">Industry Expert</option>
                      <option value="Academic">Academic</option>
                      <option value="Entrepreneur">Entrepreneur</option>
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
                        Number of Pages *
                      </label>
                      <input
                        type="number"
                        required
                        value={courseFormData.pageCount}
                        onChange={(e) => handleCourseInputChange('pageCount', e.target.value)}
                        placeholder="e.g., 200"
                        min="1"
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
                )}

                {/* Business Plan specific fields */}
                {courseFormData.type === 'business-plan' && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr 1fr', 
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
                        Industry Sector *
                      </label>
                      <select
                        required
                        value={courseFormData.industrySector}
                        onChange={(e) => handleCourseInputChange('industrySector', e.target.value)}
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
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Energy">Energy</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Consumer">Consumer</option>
                        <option value="Retail">Retail</option>
                        <option value="Food">Food</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Media">Media</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Design">Design</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Construction">Construction</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Government">Government</option>
                        <option value="Nonprofit">Nonprofit</option>
                        <option value="Legal">Legal</option>
                        <option value="HR">HR</option>
                        <option value="Business">Business</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Arts">Arts</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Personal Development">Personal Development</option>
                        <option value="Communication">Communication</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Mentoring">Mentoring</option>
                        <option value="Motivation">Motivation</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Time Management">Time Management</option>
                        <option value="Goal Setting">Goal Setting</option>
                        <option value="Career Development">Career Development</option>
                        <option value="Networking">Networking</option>
                        <option value="Public Speaking">Public Speaking</option>
                        <option value="Team Building">Team Building</option>
                        <option value="Conflict Resolution">Conflict Resolution</option>
                        <option value="Emotional Intelligence">Emotional Intelligence</option>
                        <option value="Mindfulness">Mindfulness</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Mental Health">Mental Health</option>
                        <option value="Relationships">Relationships</option>
                        <option value="Parenting">Parenting</option>
                        <option value="Finance & Money">Finance & Money</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                        <option value="Innovation">Innovation</option>
                        <option value="Creativity">Creativity</option>
                        <option value="Problem Solving">Problem Solving</option>
                        <option value="Critical Thinking">Critical Thinking</option>
                        <option value="Research">Research</option>
                        <option value="Writing">Writing</option>
                        <option value="Language Learning">Language Learning</option>
                        <option value="Travel">Travel</option>
                        <option value="Culture">Culture</option>
                        <option value="History">History</option>
                        <option value="Philosophy">Philosophy</option>
                        <option value="Religion">Religion</option>
                        <option value="Spirituality">Spirituality</option>
                        <option value="Other">Other</option>
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
                        Business Type *
                      </label>
                      <select
                        required
                        value={courseFormData.businessType}
                        onChange={(e) => handleCourseInputChange('businessType', e.target.value)}
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
                        <option value="Startup">Startup</option>
                        <option value="Small Business">Small Business</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Non-profit">Non-profit</option>
                        <option value="Franchise">Franchise</option>
                        <option value="Online Business">Online Business</option>
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
                        Stage *
                      </label>
                      <select
                        required
                        value={courseFormData.stage}
                        onChange={(e) => handleCourseInputChange('stage', e.target.value)}
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
                        <option value="">Select stage</option>
                        <option value="Idea">Idea</option>
                        <option value="Planning">Planning</option>
                        <option value="Launch">Launch</option>
                        <option value="Growth">Growth</option>
                        <option value="Established">Established</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Number of Pages for Business Plans */}
                {courseFormData.type === 'business-plan' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Number of Pages *
                    </label>
                    <input
                      type="number"
                      required
                      value={courseFormData.pageCount}
                      onChange={(e) => handleCourseInputChange('pageCount', e.target.value)}
                      placeholder="e.g., 25"
                      min="1"
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

                {/* Format & Price */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
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
                      Format *
                    </label>
                    <select
                      required
                      value={courseFormData.format}
                      onChange={(e) => handleCourseInputChange('format', e.target.value)}
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
                      <option value="">Select format</option>
                      {courseFormData.type === 'video' ? (
                        <>
                          <option value="Course">Course</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Webinar">Webinar</option>
                          <option value="Documentary">Documentary</option>
                          <option value="Interview">Interview</option>
                          <option value="Workshop">Workshop</option>
                        </>
                      ) : courseFormData.type === 'book' ? (
                        <>
                          <option value="PDF">PDF</option>
                          <option value="EPUB">EPUB</option>
                          <option value="MOBI">MOBI</option>
                          <option value="Audiobook">Audiobook</option>
                          <option value="Physical">Physical</option>
                        </>
                      ) : (
                        <>
                          <option value="PDF">PDF Template</option>
                          <option value="Word">Word Document</option>
                          <option value="Interactive">Interactive Plan</option>
                          <option value="Editable">Editable Template</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                </div>

                

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
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
                    value={courseFormData.description}
                    onChange={(e) => handleCourseInputChange('description', e.target.value)}
                    placeholder={`Describe what learners will gain from this ${courseFormData.type === 'business-plan' ? 'business plan' : courseFormData.type}...`}
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

                                     {/* File Uploads */}
                     <div style={{ marginBottom: '16px' }}>
                       <label style={{
                         fontSize: '14px',
                         fontWeight: '500',
                         color: '#374151',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         File Uploads
                       </label>
                       
                       {/* Thumbnail/Image Upload */}
                       <div style={{ marginBottom: '12px' }}>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#6b7280',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Thumbnail/Image *
                         </label>
                         <div style={{
                           border: '2px dashed #d1d5db',
                           borderRadius: '8px',
                           padding: '20px',
                           textAlign: 'center',
                           backgroundColor: '#f9fafb',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease'
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
                           const files = Array.from(e.dataTransfer.files)
                           if (files.length > 0) {
                             handleFileUpload('thumbnail', files[0])
                           }
                         }}
                         onClick={() => document.getElementById('thumbnail-upload').click()}
                         >
                           {courseFormData.thumbnailUrl ? (
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                               <img 
                                 src={courseFormData.thumbnailUrl} 
                                 alt="Thumbnail" 
                                 style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                               />
                               <span style={{ fontSize: '14px', color: '#16a34a' }}>✓ Thumbnail uploaded</span>
                             </div>
                           ) : (
                             <div>
                               <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                               <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                 Click to upload or drag & drop
                               </div>
                               <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                 PNG, JPG, GIF up to 5MB
                               </div>
                             </div>
                           )}
                         </div>
                         <input
                           id="thumbnail-upload"
                           type="file"
                           accept="image/*"
                           style={{ display: 'none' }}
                           onChange={(e) => {
                             if (e.target.files.length > 0) {
                               handleFileUpload('thumbnail', e.target.files[0])
                             }
                           }}
                         />
                       </div>

                       {/* Video Upload (for video courses) */}
                       {courseFormData.type === 'video' && (
                         <div style={{ marginBottom: '12px' }}>
                           <label style={{
                             fontSize: '12px',
                             fontWeight: '500',
                             color: '#6b7280',
                             marginBottom: '4px',
                             display: 'block'
                           }}>
                             Video File *
                           </label>
                           <div style={{
                             border: '2px dashed #d1d5db',
                             borderRadius: '8px',
                             padding: '20px',
                             textAlign: 'center',
                             backgroundColor: '#f9fafb',
                             cursor: 'pointer',
                             transition: 'all 0.2s ease'
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
                             const files = Array.from(e.dataTransfer.files)
                             files.forEach(file => {
                               if (file.type.startsWith('video/')) {
                                 handleFileUpload('video', file)
                             }
                             })
                           }}
                           onClick={() => document.getElementById('video-upload').click()}
                           >
                             {courseFormData.videoUrl ? (
                               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                 <Play size={20} color="#16a34a" />
                                 <span style={{ fontSize: '14px', color: '#16a34a' }}>✓ Video uploaded</span>
                               </div>
                             ) : (
                               <div>
                                 <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                 <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                   Click to upload or drag & drop video
                                 </div>
                                 <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                   MP4, MOV, AVI up to 500MB
                                 </div>
                               </div>
                             )}
                           </div>
                           <input
                             id="video-upload"
                             type="file"
                             accept="video/*"
                             style={{ display: 'none' }}
                             onChange={(e) => {
                               const file = e.target.files[0]
                               if (file && file.type.startsWith('video/')) {
                                 handleFileUpload('video', file)
                               }
                             }}
                           />
                         </div>
                       )}

                       {/* Document Upload (for books and business plans) */}
                       {(courseFormData.type === 'book' || courseFormData.type === 'business-plan') && (
                         <div style={{ marginBottom: '12px' }}>
                           <label style={{
                             fontSize: '12px',
                             fontWeight: '500',
                             color: '#6b7280',
                             marginBottom: '4px',
                             display: 'block'
                           }}>
                             Document File *
                           </label>
                           <div style={{
                             border: '2px dashed #d1d5db',
                             borderRadius: '8px',
                             padding: '20px',
                             textAlign: 'center',
                             backgroundColor: '#f9fafb',
                             cursor: 'pointer',
                             transition: 'all 0.2s ease'
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
                             const files = Array.from(e.dataTransfer.files)
                             if (files.length > 0) {
                               handleFileUpload('document', files[0])
                             }
                           }}
                           onClick={() => document.getElementById('document-upload').click()}
                           >
                             {courseFormData.downloadUrl ? (
                               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                 <FileText size={20} color="#16a34a" />
                                 <span style={{ fontSize: '14px', color: '#16a34a' }}>✓ Document uploaded</span>
                               </div>
                             ) : (
                               <div>
                                 <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                 <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                   Click to upload or drag & drop
                                 </div>
                                 <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                   PDF, DOC, DOCX up to 50MB
                                 </div>
                               </div>
                             )}
                           </div>
                           <input
                             id="document-upload"
                             type="file"
                             accept=".pdf,.doc,.docx"
                             style={{ display: 'none' }}
                             onChange={(e) => {
                               if (e.target.files.length > 0) {
                                 handleFileUpload('document', e.target.files[0])
                               }
                             }}
                           />
                         </div>
                       )}

                     </div>

                     {/* Tags */}
                     <div style={{ marginBottom: '16px' }}>
                       <label style={{
                         fontSize: '14px',
                         fontWeight: '500',
                         color: '#374151',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Tags
                       </label>
                       <div style={{
                         display: 'flex',
                         gap: '8px',
                         marginBottom: '8px'
                       }}>
                         <input
                           type="text"
                           value={courseFormData.customTag}
                           onChange={(e) => handleCourseInputChange('customTag', e.target.value)}
                           placeholder="Add a tag..."
                           style={{
                             flex: 1,
                             padding: '8px 12px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '8px',
                             fontSize: '14px',
                             outline: 'none',
                             boxSizing: 'border-box'
                           }}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter') {
                               e.preventDefault()
                               handleAddTag()
                             }
                           }}
                         />
                         <button
                           type="button"
                           onClick={handleAddTag}
                           style={{
                             padding: '8px 16px',
                             backgroundColor: '#f3f4f6',
                             color: '#374151',
                             border: '1px solid #e2e8f0',
                             borderRadius: '8px',
                             fontSize: '14px',
                             cursor: 'pointer'
                           }}
                         >
                           Add
                         </button>
                       </div>
                       {courseFormData.tags.length > 0 && (
                         <div style={{
                           display: 'flex',
                           flexWrap: 'wrap',
                           gap: '6px'
                         }}>
                           {courseFormData.tags.map((tag, index) => (
                             <span
                               key={index}
                               style={{
                                 backgroundColor: '#f1f5f9',
                                 color: '#475569',
                                 padding: '4px 8px',
                                 borderRadius: '6px',
                                 fontSize: '12px',
                                 fontWeight: '500',
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '4px'
                               }}
                             >
                               {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                               <button
                                 type="button"
                                 onClick={() => handleRemoveTag(tag)}
                                 style={{
                                   background: 'none',
                                   border: 'none',
                                   cursor: 'pointer',
                                   padding: '0',
                                   display: 'flex',
                                   alignItems: 'center'
                                 }}
                               >
                                 <X size={12} color="#64748b" />
                               </button>
                             </span>
                           ))}
                         </div>
                       )}
                     </div>

                {/* Form Actions */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '32px'
                }}>
                  <button
                    type="button"
                    onClick={handleCloseCourseForm}
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
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Add {courseFormData.type === 'business-plan' ? 'Business Plan' : courseFormData.type}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Overview Modal */}
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
        }}>
          <div style={{
            backgroundColor: 'white',
            width: screenSize.isMobile ? '100%' : 'min(800px, 90vw)',
            maxHeight: screenSize.isMobile ? '90vh' : '90vh',
            borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'all 0.3s ease-in-out',
            boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
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
                {selectedItem.title || selectedItem.appliedFor || 'Details'}
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

            {/* Modal Content */}
            <div style={{
              padding: screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px',
              flex: 1
            }}>
              {selectedItem.type === 'jobs' && (
                <div>
                  {/* Company Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.logo} 
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
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedItem.company}
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
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span style={{ fontWeight: '500', color: '#0f172a' }}>Country: </span><span>{getCountryName(selectedItem.country)}</span>
                        <span>•</span>
                        <span>{isDeadlineExpired(selectedItem.deadline) ? 'Closed' : `Deadline: ${formatDateDDMMYYYY(selectedItem.deadline)}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete Job Details */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 16px 0'
                    }}>
                      Complete Job Details
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px'
                    }}>
                      {/* Basic Information */}
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Job Type
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.jobType || selectedItem.type}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Work Type
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.workType}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Experience Level
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.experience}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Industry
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.industry}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Location
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.location}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Country
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {getCountryName(selectedItem.country)}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Salary
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#16a34a',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          {selectedItem.salary}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Posted By
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.creator?.name || selectedItem.postedBy}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Contact Email
                        </label>
                        <a href={`mailto:${selectedItem.contact_email || 'no-email@example.com'}`} style={{
                          fontSize: '14px',
                          color: '#2563eb',
                          fontWeight: '500',
                          textDecoration: 'none'
                        }}>
                          {selectedItem.contact_email || 'No email provided'}
                        </a>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Contact Phone
                        </label>
                        <a href={`tel:${selectedItem.contact_phone || '0000000000'}`} style={{
                          fontSize: '14px',
                          color: '#2563eb',
                          fontWeight: '500',
                          textDecoration: 'none'
                        }}>
                          {selectedItem.contact_phone || 'No phone provided'}
                        </a>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Approval Status
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: selectedItem.approval_status === 'approved' ? '#16a34a' : selectedItem.approval_status === 'rejected' ? '#ef4444' : '#f59e0b',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          {selectedItem.approval_status}
                        </p>
                      </div>
                      {selectedItem.external_url && (
                        <div>
                          <label style={{
                            fontSize: '12px',
                            color: '#64748b',
                            fontWeight: '500',
                            marginBottom: '4px',
                            display: 'block'
                          }}>
                            Application URL
                          </label>
                          <a href={selectedItem.external_url} target="_blank" rel="noopener noreferrer" style={{
                            fontSize: '14px',
                            color: '#2563eb',
                            fontWeight: '500',
                            textDecoration: 'none'
                          }}>
                            {selectedItem.external_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Job Overview
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>


                  {/* Skills */}
                  {selectedItem.skills && selectedItem.skills.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 12px 0'
                      }}>
                        Required Skills
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(Array.isArray(selectedItem.skills) ? selectedItem.skills : 
                          (selectedItem.skills ? selectedItem.skills.split(',').map(s => s.trim()).filter(Boolean) : [])).map((skill, index) => (
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
                            <span>{typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Unknown'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedItem.benefits && selectedItem.benefits.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 12px 0'
                      }}>
                        Benefits
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Array.isArray(selectedItem.benefits) ? selectedItem.benefits.map((benefit, index) => (
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
                        )) : (
                          <div style={{
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
                            <span>{selectedItem.benefits}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 12px 0'
                      }}>
                        Tags
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {Array.isArray(selectedItem.tags) ? selectedItem.tags.map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                          </span>
                        )) : (
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {selectedItem.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedItem.requirements && selectedItem.requirements.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {Array.isArray(selectedItem.requirements) ? selectedItem.requirements.map((requirement, index) => (
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
                            {requirement}
                          </li>
                        )) : (
                          <li style={{
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
                            {selectedItem.requirements}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}


                  {/* Key Responsibilities */}
                  {selectedItem.responsibilities && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Key Responsibilities
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.responsibilities.map((responsibility, index) => (
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
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements & Qualifications */}
                  {selectedItem.requirements && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements & Qualifications
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.requirements.map((requirement, index) => (
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
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* About the Company */}
                  {selectedItem.companyInfo && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        About the Company
                      </h3>
                      <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#374151',
                        margin: '0 0 12px 0'
                      }}>
                        {selectedItem.companyInfo.mission}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span><strong>Size:</strong> {selectedItem.companyInfo.size}</span>
                        <span><strong>Founded:</strong> {selectedItem.companyInfo.founded}</span>
                        <span><strong>Stage:</strong> {selectedItem.companyInfo.funding}</span>
                      </div>
                    </div>
                  )}



                  {/* Additional Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    marginTop: '24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'course' && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img
                      src={selectedItem.thumbnail_url ? (selectedItem.thumbnail_url.startsWith('/uploads') ? `${(import.meta?.env?.VITE_API_BASE_ORIGIN)||'http://localhost:8000'}${selectedItem.thumbnail_url}` : selectedItem.thumbnail_url) : ''}
                      alt={selectedItem.title}
                      style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #f8f9fa' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 6px 0' }}>{selectedItem.title}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#64748b' }}>
                        <span>{selectedItem.category || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{selectedItem.level || 'Beginner'}</span>
                        {(selectedItem.type === 'video' || selectedItem.course_type === 'video') && (selectedItem.duration || selectedItem.duration_hours || selectedItem.duration_minutes) ? (<>
                          <span>•</span>
                          <span>{selectedItem.duration || 
                            (selectedItem.duration_hours && selectedItem.duration_minutes ? 
                              `${selectedItem.duration_hours}h ${selectedItem.duration_minutes}m` :
                              selectedItem.duration_hours ? `${selectedItem.duration_hours}h` :
                              `${selectedItem.duration_minutes}m`)}
                          </span>
                        </>) : null}
                        {(selectedItem.type === 'book' || selectedItem.course_type === 'book' || selectedItem.type === 'business-plan' || selectedItem.course_type === 'business-plan') && selectedItem.page_count ? (<>
                          <span>•</span>
                          <span>{selectedItem.page_count} pages</span>
                        </>) : null}
                      </div>
                    </div>
                  </div>




                  {/* Course Details */}
                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Course Details
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.course_type || selectedItem.type || 'N/A'}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Instructor</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.instructor || selectedItem.author || '—'}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Downloads</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.downloads ?? selectedItem.download_count ?? selectedItem.enrollment_count ?? 0}</p>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Category</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.category || 'N/A'}</p>
                    </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Level</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.level || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Industry</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.industry_sector || selectedItem.category || 'N/A'}</p>
                      </div>
                      {(selectedItem.type === 'video' || selectedItem.type === 'book' || selectedItem.course_type === 'video' || selectedItem.course_type === 'book') && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Language</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.language || 'English'}</p>
                        </div>
                      )}
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Format</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.format || 'N/A'}</p>
                      </div>
                      {(selectedItem.type === 'video' || selectedItem.course_type === 'video') && (selectedItem.duration || selectedItem.duration_hours || selectedItem.duration_minutes) && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Duration</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                            {selectedItem.duration || 
                              (selectedItem.duration_hours && selectedItem.duration_minutes ? 
                                `${selectedItem.duration_hours}h ${selectedItem.duration_minutes}m` :
                                selectedItem.duration_hours ? `${selectedItem.duration_hours}h` :
                                `${selectedItem.duration_minutes}m`)}
                          </p>
                        </div>
                      )}
                      {(selectedItem.type === 'book' || selectedItem.course_type === 'book') && selectedItem.page_count && (
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Pages</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.page_count} pages</p>
                      </div>
                    )}
                      {(selectedItem.type === 'business-plan' || selectedItem.course_type === 'business-plan') && selectedItem.page_count && (
                      <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Pages</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.page_count} pages</p>
                        </div>
                      )}
                      {selectedItem.author_type && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Author Type</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.author_type}</p>
                      </div>
                    )}
                    {selectedItem.business_type && (
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Business Type</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.business_type}</p>
                      </div>
                    )}
                      {selectedItem.stage && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Stage</label>
                          <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.stage}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Description */}
                  {selectedItem.description && selectedItem.description.trim() !== '' && (
                    <div style={{ marginTop: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Course Description
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        margin: 0,
                        whiteSpace: 'pre-line'
                      }}>
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Tags
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {Array.isArray(selectedItem.tags) ? selectedItem.tags.map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {tag}
                          </span>
                        )) : (
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {selectedItem.tags}
                          </span>
                    )}
                  </div>
                    </div>
                  )}


                </div>
              )}
              {selectedItem.type === 'tenders' && (
                <div>
                  {/* Organization Profile Header */}
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
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedItem.organization}
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
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span>{selectedItem.country}</span>
                        <span>•</span>
                        <span style={{ color: isDeadlineExpired(selectedItem.deadline) ? '#6b7280' : '#dc2626', fontWeight: '600' }}>
                          {isDeadlineExpired(selectedItem.deadline) ? 'Closed' : `Deadline: ${formatDateDDMMYYYY(selectedItem.deadline)}`}
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* Detailed Information */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Tender Details
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Organization</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.organization}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Sector</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.sector || selectedItem.industry}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contract Value</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: 0, fontWeight: '600' }}>{selectedItem.amount || selectedItem.value || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Location</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.location}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Country</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.country}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Duration</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.duration || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Posted By</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.postedBy || 'Admin'}</p>
                      </div>
                      {selectedItem.contact_email && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Email</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                            <a href={`mailto:${selectedItem.contact_email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contact_email}</a>
                          </p>
                        </div>
                      )}
                      {selectedItem.contact_phone && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Phone</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                            <a href={`tel:${selectedItem.contact_phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contact_phone}</a>
                          </p>
                        </div>
                      )}
                      {selectedItem.external_url && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Application URL</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>
                            <a href={selectedItem.external_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.external_url}</a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tender Description */}
                  {(selectedItem.description && selectedItem.description.trim() !== '') && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Tender Description
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-line'
                      }}>
                        {selectedItem.description}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {(selectedItem.requirements && (Array.isArray(selectedItem.requirements) ? selectedItem.requirements.length > 0 && selectedItem.requirements.some(item => item && item.trim() !== '') : selectedItem.requirements.trim() !== '')) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements & Qualifications
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {Array.isArray(selectedItem.requirements) ? selectedItem.requirements.map((requirement, index) => (
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
                            {requirement}
                          </li>
                        )) : (
                          <li style={{
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
                            {selectedItem.requirements}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Project Scope */}
                  {(selectedItem.project_scope && (Array.isArray(selectedItem.project_scope) ? selectedItem.project_scope.length > 0 && selectedItem.project_scope.some(item => item && item.trim() !== '') : selectedItem.project_scope.trim() !== '')) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Project Scope
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-line'
                      }}>
                        {Array.isArray(selectedItem.project_scope) ? selectedItem.project_scope.join('\n') : selectedItem.project_scope}
                      </div>
                    </div>
                  )}

                  {/* Technical Requirements */}
                  {(selectedItem.technical_requirements && (Array.isArray(selectedItem.technical_requirements) ? selectedItem.technical_requirements.length > 0 && selectedItem.technical_requirements.some(item => item && item.trim() !== '') : selectedItem.technical_requirements.trim() !== '')) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Technical Requirements
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-line'
                      }}>
                        {Array.isArray(selectedItem.technical_requirements) ? selectedItem.technical_requirements.join('\n') : selectedItem.technical_requirements}
                      </div>
                    </div>
                  )}

                  {/* Submission Process */}
                  {(selectedItem.submission_process && (Array.isArray(selectedItem.submission_process) ? selectedItem.submission_process.length > 0 && selectedItem.submission_process.some(item => item && item.trim() !== '') : selectedItem.submission_process.trim() !== '')) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Submission Process
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-line'
                      }}>
                        {Array.isArray(selectedItem.submission_process) ? selectedItem.submission_process.join('\n') : selectedItem.submission_process}
                      </div>
                    </div>
                  )}

                  {/* Evaluation Criteria */}
                  {(selectedItem.evaluation_criteria && (Array.isArray(selectedItem.evaluation_criteria) ? selectedItem.evaluation_criteria.length > 0 && selectedItem.evaluation_criteria.some(item => item && item.trim() !== '') : selectedItem.evaluation_criteria.trim() !== '')) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Evaluation Criteria
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-line'
                      }}>
                        {Array.isArray(selectedItem.evaluation_criteria) ? selectedItem.evaluation_criteria.join('\n') : selectedItem.evaluation_criteria}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Tags
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {Array.isArray(selectedItem.tags) ? selectedItem.tags.map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                          </span>
                        )) : (
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {selectedItem.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {selectedItem.contactInfo && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      marginTop: '24px'
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Contact Information
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span><strong>Contact:</strong> {selectedItem.contactInfo.name}</span>
                        <span><strong>Email:</strong> {selectedItem.contactInfo.email}</span>
                        <span><strong>Phone:</strong> {selectedItem.contactInfo.phone}</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {selectedItem.type === 'opportunities' && (
                <div>
                  {/* Organization Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.poster || selectedItem.coverImage || selectedItem.logo} 
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
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedItem.organization}
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
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span style={{ color: isDeadlineExpired(selectedItem.deadline) ? '#6b7280' : '#dc2626', fontWeight: '600' }}>
                          {isDeadlineExpired(selectedItem.deadline) ? 'Closed' : `Deadline: ${formatDateDDMMYYYY(selectedItem.deadline)}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Opportunity Details
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Organization</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.organization}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Opportunity Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.opportunityType || selectedItem.type}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Amount</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: 0, fontWeight: '600' }}>{selectedItem.amount || selectedItem.value || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Duration</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.duration || 'Not specified'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Location</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.location}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Posted By</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.postedBy || 'Admin'}</p>
                      </div>
                      {selectedItem.contact_email && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Email</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                            <a href={`mailto:${selectedItem.contact_email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contact_email}</a>
                          </p>
                        </div>
                      )}
                      {selectedItem.contact_phone && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Phone</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                            <a href={`tel:${selectedItem.contact_phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contact_phone}</a>
                          </p>
                        </div>
                      )}
                      {selectedItem.external_url && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Application URL</label>
                          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>
                            <a href={selectedItem.external_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.external_url}</a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opportunity Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Opportunity Overview
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Eligibility */}
                  {selectedItem.requirements && selectedItem.requirements.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Eligibility Requirements
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.requirements.map((requirement, index) => (
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
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benefits & Value */}
                  {selectedItem.benefits && selectedItem.benefits.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Benefits & Value
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.benefits.map((benefit, index) => (
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
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {((selectedItem.tags && selectedItem.tags.length > 0) || (selectedItem.benefits && selectedItem.benefits.length > 0)) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Tags
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {Array.isArray((selectedItem.tags && selectedItem.tags.length > 0) ? selectedItem.tags : selectedItem.benefits) ? ((selectedItem.tags && selectedItem.tags.length > 0) ? selectedItem.tags : selectedItem.benefits).map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Unknown'}
                          </span>
                        )) : (
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {(selectedItem.tags && selectedItem.tags.length > 0) ? selectedItem.tags : selectedItem.benefits}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedItem.type === 'courses' && (
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
                      src={selectedItem.thumbnail} 
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
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedItem.rating}</span>
                        </div>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                          {selectedItem.students} students enrolled
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
                      {selectedItem.description}
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
              {selectedItem.type === 'applications' && (
                <div>
                  {/* Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'} 
                      alt={selectedItem.applicant}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '40px',
                        objectFit: 'cover',
                        border: '3px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.applicant}
                      </h2>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#64748b',
                        margin: '0 0 12px 0'
                      }}>
                        {selectedItem.appliedFor} at {selectedItem.company}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span>📍 {selectedItem.location || 'Nairobi, Kenya'}</span>
                        <span>📧 {selectedItem.email}</span>
                        <span>📱 {selectedItem.phone || '+254 700 000 000'}</span>
                        <span>🌐 {selectedItem.website || 'portfolio.com'}</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px'
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        ...getStatusColor(selectedItem.status)
                      }}>
                        {selectedItem.status}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        Applied {selectedItem.appliedDate}
                      </span>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#166534'
                      }}>
                        Profile Completion
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#166534'
                      }}>
                        {selectedItem.profileCompletion || '85%'}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: selectedItem.profileCompletion || '85%',
                        height: '100%',
                        backgroundColor: '#16a34a',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* About Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      About
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.about}
                    </p>
                  </div>

                  {/* Skills Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Skills
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {(Array.isArray(selectedItem.skills) ? selectedItem.skills : []).map((skill, index) => (
                        <span key={index} style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {typeof skill === 'string' ? skill : skill?.name || skill?.title || 'Unknown'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Experience
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(Array.isArray(selectedItem.experience) ? selectedItem.experience : []).map((exp, index) => (
                        <div key={index} style={{
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <h4 style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              margin: 0
                            }}>
                              {exp.title}
                            </h4>
                            <span style={{
                              fontSize: '14px',
                              color: '#64748b',
                              fontWeight: '500'
                            }}>
                              {exp.duration}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#16a34a',
                            margin: '0 0 8px 0'
                          }}>
                            {exp.company}
                          </p>
                          <p style={{
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151',
                            margin: 0
                          }}>
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Education
                    </h3>
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: 0
                        }}>
                          {selectedItem.education?.degree || 'Bachelor of Science in Computer Science'}
                        </h4>
                        <span style={{
                          fontSize: '14px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {selectedItem.education?.duration || '2016 - 2020'}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#16a34a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.education?.institution || 'University of Nairobi'}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#374151',
                        margin: 0
                      }}>
                        {selectedItem.education?.description || 'Graduated with First Class Honours. Specialized in Software Engineering and Web Development.'}
                      </p>
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Certificates
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(Array.isArray(selectedItem.certificates) ? selectedItem.certificates : []).map((cert, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <img 
                            src={cert.image} 
                            alt={cert.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              margin: '0 0 4px 0'
                            }}>
                              {cert.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: '#64748b',
                              margin: 0
                            }}>
                              {cert.issuer} • {cert.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Documents
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(selectedItem.documents || [
                        {
                          name: 'Resume.pdf',
                          type: 'Resume',
                          size: '2.4 MB',
                          date: '2024-01-15'
                        },
                        {
                          name: 'Cover Letter.pdf',
                          type: 'Cover Letter',
                          size: '1.2 MB',
                          date: '2024-01-15'
                        },
                        {
                          name: 'Portfolio.pdf',
                          type: 'Portfolio',
                          size: '5.8 MB',
                          date: '2024-01-10'
                        }
                      ]).map((doc, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ fontSize: '16px', color: '#64748b' }}>📄</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              margin: '0 0 4px 0'
                            }}>
                              {doc.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: '#64748b',
                              margin: 0
                            }}>
                              {doc.type} • {doc.size} • {doc.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Timeline */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Application Timeline
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a'
                        }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          Application submitted on {selectedItem.appliedDate}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#f59e0b'
                        }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          Application under review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicants && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowApplicants(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ×
            </button>
            
            <div style={{ marginBottom: '20px', paddingRight: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                    Applicants for {selectedItem.title}
                  </h2>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                    {selectedItem.type} • {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                  <select
                    value={applicantFilterStatus}
                    onChange={(e) => setApplicantFilterStatus(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      minWidth: '120px'
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={handleExportApplicants}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📄 Export CSV
                  </button>
                </div>
              </div>
            </div>

            {loadingApplicants ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#64748b' }}>Loading applicants...</div>
              </div>
            ) : applicants.filter(applicant => applicantFilterStatus === 'all' || applicant.status === applicantFilterStatus).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#64748b' }}>
                  {applicantFilterStatus === 'all' ? 'No applicants found' : `No ${applicantFilterStatus} applicants found`}
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Full Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Phone</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants
                      .filter(applicant => applicantFilterStatus === 'all' || applicant.status === applicantFilterStatus)
                      .map((applicant, index) => (
                      <tr key={applicant.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>
                          {applicant.name}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>
                          {applicant.email || 'Not provided'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>
                          {applicant.phone || 'Not provided'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: applicant.status === 'pending' ? '#fed7aa' : 
                                           applicant.status === 'approved' ? '#d1fae5' : 
                                           applicant.status === 'shortlisted' ? '#dbeafe' : '#fee2e2',
                            color: applicant.status === 'pending' ? '#ea580c' : 
                                   applicant.status === 'approved' ? '#065f46' : 
                                   applicant.status === 'shortlisted' ? '#1e40af' : '#991b1b',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {applicant.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Bulk SMS Modal */}
      {showBulkSMS && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowBulkSMS(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ×
            </button>
            
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                Send Bulk Messages
              </h2>
              <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                Send {messageType === 'email' ? 'emails' : 'SMS'} to {applicants.length} applicants for "{selectedItem?.title || 'this content'}"
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Message Type
              </label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="messageType"
                    value="email"
                    checked={messageType === 'email'}
                    onChange={(e) => handleMessageTypeChange(e.target.value)}
                  />
                  <span style={{ fontSize: '14px' }}>Email</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="messageType"
                    value="sms"
                    checked={messageType === 'sms'}
                    onChange={(e) => handleMessageTypeChange(e.target.value)}
                  />
                  <span style={{ fontSize: '14px' }}>SMS</span>
                </label>
              </div>
            </div>


            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Filter by Status
              </label>
              <select
                value={messageFilterStatus}
                onChange={(e) => handleMessageStatusChange(e.target.value)}
                style={{
                  width: '200px',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  marginBottom: '20px'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {messageType === 'email' ? 'Email' : 'SMS'} Message
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
                  (Template loaded for {messageFilterStatus} status)
                </span>
              </label>
              

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Enter your ${messageType} message here...`}
                rows={messageType === 'email' ? 8 : 4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {message.length} characters • {messageType === 'email' ? 'Email' : 'SMS'} will be sent to {applicants.filter(applicant => 
                  messageFilterStatus === 'all' || applicant.status === messageFilterStatus
                ).length} recipients
                {messageType === 'sms' && message.length > 160 && (
                  <span style={{ color: '#dc2626', marginLeft: '8px' }}>
                    (SMS will be split into {Math.ceil(message.length / 160)} messages)
                  </span>
                )}
              </div>
            </div>


            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowBulkSMS(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendBulkMessage}
                disabled={sendingMessage || !message.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: sendingMessage ? '#9ca3af' : (messageType === 'email' ? '#3b82f6' : '#f97316'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: sendingMessage ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {sendingMessage ? 'Sending...' : `Send ${messageType === 'email' ? 'Email' : 'SMS'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Filter Modal */}
      {showCourseFilters && (
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
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => setShowCourseFilters(false)}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(800px, 90vw)',
            maxHeight: '85vh',
            borderRadius: '16px',
            padding: '32px',
            overflowY: 'auto',
            transform: showCourseFilters ? 'translateY(0)' : 'scale(0.9)',
            opacity: showCourseFilters ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
                {activeCourseTab === 'videos' ? 'Video' : activeCourseTab === 'books' ? 'Book' : 'Business Plan'} Filters
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={clearAllCourseFilters}
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
                  onClick={() => setShowCourseFilters(false)}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px'
            }}>
              {Object.entries(courseFilterOptions[activeCourseTab === 'business-plans' ? 'businessPlans' : activeCourseTab]).map(([categoryKey, options]) => {
                const tabKey = activeCourseTab === 'business-plans' ? 'businessPlans' : activeCourseTab
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
                    gridTemplateColumns: 'repeat(2, 1fr)', 
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
                          backgroundColor: courseFilters[tabKey][categoryKey].includes(option) ? '#16a34a' : 'transparent',
                          borderColor: courseFilters[tabKey][categoryKey].includes(option) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          flexShrink: 0
                        }}
                        onClick={() => toggleCourseFilter(categoryKey, option)}>
                          {courseFilters[tabKey][categoryKey].includes(option) && (
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
                onClick={() => setShowCourseFilters(false)}
                style={{
                  minWidth: '200px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#15803d'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#16a34a'
                }}
              >
                Apply Filters ({getActiveCourseFilterCount()})
              </button>
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
  )


}

export default Content