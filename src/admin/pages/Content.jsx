import React, { useState, useEffect } from 'react'
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
  X
} from 'lucide-react'
import Post from '../../pages/Post'
import { apiService, jobsAPI, tendersAPI, opportunitiesAPI } from '../../lib/api-service'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [showPostPage, setShowPostPage] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [jobsData, setJobsData] = useState([])
  const [tendersData, setTendersData] = useState([])
  const [opportunitiesData, setOpportunitiesData] = useState([])
  const [coursesData, setCoursesData] = useState([])
  const [applicationsData, setApplicationsData] = useState([])
  const [courseFormData, setCourseFormData] = useState({
    type: 'video', // video, book, business-plan
    title: '',
    description: '',
    instructor: '',
    author: '',
    authorType: '',
    companyName: '',
    duration: '',
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
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Loading admin content using admin APIs...')
        const [jobs, tenders, opportunities, courses, applications] = await Promise.all([
          apiService.get('/admin/content', { type: 'jobs', limit: 50 }).catch((err) => {
            console.log('Jobs API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/content', { type: 'tenders', limit: 50 }).catch((err) => {
            console.log('Tenders API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/content', { type: 'opportunities', limit: 50 }).catch((err) => {
            console.log('Opportunities API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/content', { type: 'courses', limit: 50 }).catch((err) => {
            console.log('Courses API error:', err)
            return { content: [] }
          }),
          apiService.get('/admin/applications', { limit: 50 }).catch((err) => {
            console.log('Applications API error:', err)
            return { applications: [] }
          })
        ])
        
        console.log('API responses:', { jobs, tenders, opportunities, courses, applications })
        
        // Transform and sort by approval status (pending first for moderation)
        const jobsArr = (jobs?.content || [])
          .map(transformJobAdminItem)
          .sort((a, b) => {
            if (a.approval_status === 'pending' && b.approval_status !== 'pending') return -1
            if (a.approval_status !== 'pending' && b.approval_status === 'pending') return 1
            return 0
          })
        
        const tendersArr = (tenders?.content || [])
          .map(transformTenderAdminItem)
          .sort((a, b) => {
            if (a.approval_status === 'pending' && b.approval_status !== 'pending') return -1
            if (a.approval_status !== 'pending' && b.approval_status === 'pending') return 1
            return 0
          })
        
        const oppArr = (opportunities?.content || [])
          .map(transformOpportunityAdminItem)
          .sort((a, b) => {
            if (a.approval_status === 'pending' && b.approval_status !== 'pending') return -1
            if (a.approval_status !== 'pending' && b.approval_status === 'pending') return 1
            return 0
          })
        
        const coursesArr = (courses?.content || [])
        const appsArr = (applications?.applications || [])

        console.log('Raw data arrays:', { jobsArr, tendersArr, oppArr, coursesArr, appsArr })

        // Set real data into state used by the UI
        setJobsData(jobsArr)
        setTendersData(tendersArr)
        setOpportunitiesData(oppArr)
        setCoursesData(coursesArr)
        setApplicationsData(appsArr)
        
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
      companyName: '',
      duration: '',
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

  const handleCourseFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: courseFormData.title,
        description: courseFormData.description,
        instructor: courseFormData.instructor || courseFormData.author || 'Instructor',
        category: courseFormData.category,
        level: (courseFormData.level || 'Beginner').toLowerCase(),
        duration_hours: courseFormData.duration?.match(/\d+/) ? parseInt(courseFormData.duration.match(/\d+/)[0], 10) : null,
        price: courseFormData.price === 'Free' ? 0 : Number(courseFormData.price) || 0,
        currency: 'USD',
        thumbnail_url: courseFormData.thumbnailUrl || undefined,
        video_url: courseFormData.videoUrl || undefined,
        materials: courseFormData.documents?.map(d => ({ name: d.name, size: d.size, type: d.type })) || [],
        learning_objectives: courseFormData.tags || [],
        status: 'published'
      }
      const res = await apiService.post('/courses', payload)
      const created = res?.course || res
      setCoursesData(prev => [{
        id: String(created.id),
        ...payload,
        type: courseFormData.type,
        title: payload.title,
        description: payload.description,
        instructor: payload.instructor,
        duration: courseFormData.duration || '',
        language: courseFormData.language,
        category: payload.category,
        level: courseFormData.level,
        price: courseFormData.price,
        rating: 5,
        enrolledStudents: 0,
        thumbnailUrl: payload.thumbnail_url,
        videoUrl: payload.video_url,
        downloadUrl: courseFormData.downloadUrl,
        tags: courseFormData.tags
      }, ...prev])
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

  const handleDelete = async (item, type) => {
    try {
      if (!window.confirm('Delete this item?')) return
      await apiService.delete(`/admin/content/${type}/${item.id}`)
      if (type === 'jobs') setJobsData(prev => prev.filter(x => x.id !== item.id))
      if (type === 'tenders') setTendersData(prev => prev.filter(x => x.id !== item.id))
      if (type === 'opportunities') setOpportunitiesData(prev => prev.filter(x => x.id !== item.id))
      if (type === 'courses') setCoursesData(prev => prev.filter(x => x.id !== item.id))
    } catch (e) {
      console.error('Delete failed', e)
      alert(e.message || 'Delete failed')
    }
  }

  const handleApprove = async (item, type) => {
    // Update UI immediately
      const updateItem = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: 'approved' } : x
      )
      if (type === 'jobs') setJobsData(updateItem)
      if (type === 'tenders') setTendersData(updateItem)
      if (type === 'opportunities') setOpportunitiesData(updateItem)
      if (type === 'courses') setCoursesData(updateItem)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${type}/${item.id}/approve`)
    } catch (e) {
      console.error('Approve failed', e)
      // Revert on error
      const revert = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: item.approval_status } : x
      )
      if (type === 'jobs') setJobsData(revert)
      if (type === 'tenders') setTendersData(revert)
      if (type === 'opportunities') setOpportunitiesData(revert)
      if (type === 'courses') setCoursesData(revert)
      alert(e.message || 'Approve failed')
    }
  }

  const handleReject = async (item, type) => {
    const rejectionReason = prompt('Please provide a reason for rejection:')
    if (!rejectionReason || rejectionReason.trim() === '') {
      alert('Rejection reason is required')
      return
    }
    
    // Update UI immediately
      const updateItem = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: 'rejected', rejection_reason: rejectionReason.trim() } : x
      )
      if (type === 'jobs') setJobsData(updateItem)
      if (type === 'tenders') setTendersData(updateItem)
      if (type === 'opportunities') setOpportunitiesData(updateItem)
      if (type === 'courses') setCoursesData(updateItem)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${type}/${item.id}/reject`, {
        rejection_reason: rejectionReason.trim()
      })
    } catch (e) {
      console.error('Reject failed', e)
      // Revert on error
      const revert = (prev) => prev.map(x => 
        x.id === item.id ? { ...x, approval_status: item.approval_status, rejection_reason: item.rejection_reason } : x
      )
      if (type === 'jobs') setJobsData(revert)
      if (type === 'tenders') setTendersData(revert)
      if (type === 'opportunities') setOpportunitiesData(revert)
      if (type === 'courses') setCoursesData(revert)
      alert(e.message || 'Reject failed')
    }
  }

  const handleStatusChange = async (item, type, nextStatus) => {
    // Update UI immediately
      const update = (arr) => arr.map(x => x.id === item.id ? { ...x, status: nextStatus } : x)
      if (type === 'jobs') setJobsData(update)
      if (type === 'tenders') setTendersData(update)
      if (type === 'opportunities') setOpportunitiesData(update)
      if (type === 'courses') setCoursesData(update)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${type}/${item.id}/status`, { status: nextStatus })
    } catch (e) {
      console.error('Status update failed', e)
      // Revert on error
      const revert = (arr) => arr.map(x => x.id === item.id ? { ...x, status: item.status } : x)
      if (type === 'jobs') setJobsData(revert)
      if (type === 'tenders') setTendersData(revert)
      if (type === 'opportunities') setOpportunitiesData(revert)
      if (type === 'courses') setCoursesData(revert)
      alert(e.message || 'Status update failed')
    }
  }

  const handlePriceToggle = async (item, type) => {
    const newPrice = item.price === 'Free' ? 'Pro' : 'Free'
    
    // Update UI immediately
    const update = (arr) => arr.map(x => x.id === item.id ? { ...x, price: newPrice } : x)
    if (type === 'jobs') setJobsData(update)
    if (type === 'tenders') setTendersData(update)
    if (type === 'opportunities') setOpportunitiesData(update)
    if (type === 'courses') setCoursesData(update)
    
    // Then make API call
    try {
      await apiService.put(`/admin/content/${type}/${item.id}/price`, { price: newPrice })
    } catch (e) {
      console.error('Price update failed', e)
      // Revert on error
      const revert = (arr) => arr.map(x => x.id === item.id ? { ...x, price: item.price } : x)
      if (type === 'jobs') setJobsData(revert)
      if (type === 'tenders') setTendersData(revert)
      if (type === 'opportunities') setOpportunitiesData(revert)
      if (type === 'courses') setCoursesData(revert)
      alert(e.message || 'Price update failed')
    }
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
      'Scholarship': '#8b5cf6',
      'Fellowship': '#3b82f6',
      'Grant': '#16a34a',
      'Competition': '#f59e0b',
      'Volunteer': '#ef4444',
      'default': '#64748b'
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
      type: apiJob?.job_type ? apiJob.job_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : 'Not specified',
      experience: apiJob?.experience_level ? apiJob.experience_level.charAt(0).toUpperCase() + apiJob.experience_level.slice(1) + ' level' : 'Not specified',
      postedTime: apiJob?.created_at ? new Date(apiJob.created_at).toLocaleDateString() : 'Recently',
      skills: apiJob.skills || [],
      description: apiJob.description
    }
  }

  // Normalize tenders to show contract value like salary and keep labels
  const transformTenderAdminItem = (apiTender) => {
    const min = apiTender?.contract_value_min != null ? Number(apiTender.contract_value_min) : undefined
    const max = apiTender?.contract_value_max != null ? Number(apiTender.contract_value_max) : undefined
    let amount
    if (min != null && max != null) {
      amount = min === max
        ? `${apiTender.currency} ${formatNumber(min)}`
        : `${apiTender.currency} ${formatNumber(min)} - ${apiTender.currency} ${formatNumber(max)}`
    } else if (min != null) {
      amount = `${apiTender.currency} ${formatNumber(min)}`
    } else if (max != null) {
      amount = `${apiTender.currency} ${formatNumber(max)}`
    } else {
      amount = 'Value not specified'
    }
    return {
      ...apiTender,
      amount,
      postedTime: apiTender?.created_at ? new Date(apiTender.created_at).toLocaleDateString() : 'Recently',
      description: apiTender?.description || apiTender?.tender_description || '',
      tags: Array.isArray(apiTender?.tags) ? apiTender.tags : []
    }
  }

  // Normalize opportunities for amount and type casing
  const transformOpportunityAdminItem = (apiOpp) => {
    const min = apiOpp?.amount_min != null ? Number(apiOpp.amount_min) : undefined
    const max = apiOpp?.amount_max != null ? Number(apiOpp.amount_max) : undefined
    let amount
    if (min != null && max != null) {
      amount = min === max
        ? `${apiOpp.currency} ${formatNumber(min)}`
        : `${apiOpp.currency} ${formatNumber(min)} - ${apiOpp.currency} ${formatNumber(max)}`
    } else if (min != null) {
      amount = `${apiOpp.currency} ${formatNumber(min)}`
    } else if (max != null) {
      amount = `${apiOpp.currency} ${formatNumber(max)}`
    } else {
      amount = 'Amount not specified'
    }
    return {
      ...apiOpp,
      amount,
      type: apiOpp?.type ? titleCaseDash(apiOpp.type) : apiOpp?.type,
      postedTime: apiOpp?.created_at ? new Date(apiOpp.created_at).toLocaleDateString() : 'Recently',
      description: apiOpp?.description || apiOpp?.opportunity_description || '',
      detailed_description: apiOpp?.detailed_description || '',
      eligibility: apiOpp?.eligibility || [],
      applicationProcess: apiOpp?.applicationProcess || [],
      benefits: apiOpp?.benefits || [],
      requirements: apiOpp?.requirements || [],
      tags: Array.isArray(apiOpp?.tags) ? apiOpp.tags : [],
      poster: apiOpp?.poster, // Include the poster field from backend
      external_url: apiOpp?.external_url,
      contact_email: apiOpp?.contact_email,
      documents: apiOpp?.documents || []
    }
  }

  // Filter data based on status filter
  const filterDataByStatus = (data, statusFilter) => {
    if (statusFilter === 'all') return data
    return data.filter(item => {
      if (statusFilter === 'pending') return item.approval_status === 'pending'
      if (statusFilter === 'active') return item.approval_status === 'approved' || item.status === 'active'
      if (statusFilter === 'expired') return item.status === 'expired'
      if (statusFilter === 'rejected') return item.approval_status === 'rejected'
      return true
    })
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
      const sectorColor = getSectorColor(item.sector || item.industry)
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
          
          

          {/* Cover Image */}
          <div style={{ position: 'relative' }}>
            {item.coverImage ? (
              <img 
                src={item.coverImage} 
                alt={item.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
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
                  fontSize: '12px',
                  color: 'white',
                  backgroundColor: sectorColor,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)'
                }}>
                  {item.sector}
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
              {item.organization}
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
                {item.location}
              </div>
              <span style={{ color: '#e2e8f0' }}>•</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: isDeadlineUrgent ? '#dc2626' : '#64748b',
                fontWeight: isDeadlineUrgent ? '600' : '500'
              }}>
                <Calendar size={12} />
                Due: {new Date(item.deadline).toLocaleDateString()} ({daysUntilDeadline} days)
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: '#475569',
              lineHeight: '1.5',
              margin: '0 0 12px 0',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1
            }}>
              {item.description}
            </p>

            {/* Tags */}
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span style={{
                    color: '#64748b',
                    fontSize: '12px',
                    padding: '4px 8px',
                    fontWeight: '500'
                  }}>
                    +{item.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
              marginTop: 'auto',
              flexShrink: 0
            }}>
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
                
                {/* Switch Toggle */}
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
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
          cursor: 'pointer'
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

          {/* Poster Image */}
          <div style={{ position: 'relative' }}>
            <img 
              src={item.poster} 
              alt={item.title}
              style={{
                width: '100%',
                height: '200px',
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
                {item.duration}
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
              color: '#dc2626',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              <Calendar size={12} />
              Deadline: {new Date(item.deadline).toLocaleDateString()}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: '#475569',
              lineHeight: '1.5',
              margin: '0 0 12px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {item.detailedDescription || item.description}
            </p>

            {/* Tags */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span style={{
                    color: '#64748b',
                    fontSize: '12px',
                    padding: '4px 8px',
                    fontWeight: '500'
                  }}>
                    +{item.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9'
            }}>
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
                
                {/* Switch Toggle */}
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
              </div>

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
        cursor: 'pointer'
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

        {/* Job Location and Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#666',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MapPin size={11} />
            {item.location}
          </div>
          <span>•</span>
          <span>{item.postedTime}</span>
          {item.isRemote && (
            <>
              <span>•</span>
              <span style={{
                color: '#16a34a',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                Remote
              </span>
            </>
          )}
        </div>

        {/* Quick Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            color: '#16a34a',
            fontWeight: '600'
          }}>
            <DollarSign size={12} />
            {item.salary}
          </div>
          <span style={{ color: '#e2e8f0' }}>•</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <Briefcase size={12} />
            {item.type}
          </div>
          <span style={{ color: '#e2e8f0' }}>•</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <Clock size={12} />
            {item.experience}
          </div>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: '#475569',
          lineHeight: '1.4',
          margin: '0 0 8px 0',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.description}
        </p>

        {/* Skills */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {item.skills.slice(0, 4).map((skill, index) => (
              <span key={index} style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {skill}
              </span>
            ))}
            {item.skills.length > 4 && (
              <span style={{
                color: '#64748b',
                fontSize: '11px',
                padding: '2px 6px',
                fontWeight: '500'
              }}>
                +{item.skills.length - 4} more
              </span>
            )}
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
            
            {/* Switch Toggle */}
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
          </div>

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

  const ContentTable = ({ type, data, columns }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
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
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {selectedItems.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <CheckCircle size={16} />
                Approve ({selectedItems.length})
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <XCircle size={16} />
                Reject ({selectedItems.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Grid */}
      <div style={{
        padding: '24px',
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

  const getTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <ContentTable
            type="jobs"
            data={filterDataByStatus(jobsData, statusFilter)}
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
                render: (item) => formatDate(item.postedDate)
              }
            ]}
          />
        )

      case 'tenders':
        return (
          <ContentTable
            type="tenders"
            data={filterDataByStatus(tendersData, statusFilter)}
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
                render: (item) => formatDate(item.deadline)
              }
            ]}
          />
        )

      case 'opportunities':
        return (
          <ContentTable
            type="opportunities"
            data={filterDataByStatus(opportunitiesData, statusFilter)}
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
                render: (item) => formatDate(item.deadline)
              }
            ]}
          />
        )

      case 'courses':
        return (
          <ContentTable
            type="courses"
            data={coursesData}
            columns={[
              { key: 'title', label: 'Course Title' },
              { key: 'category', label: 'Category' },
              { key: 'instructor', label: 'Instructor' },
              { key: 'duration', label: 'Duration' },
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
                key: 'enrollments', 
                label: 'Enrollments',
                render: (item) => item.enrollments || 0
              }
            ]}
          />
        )

      case 'applications':
        return (
          <ContentTable
            type="applications"
            data={applicationsData}
            columns={[
              { key: 'applicant', label: 'Applicant' },
              { key: 'appliedFor', label: 'Applied For' },
              { key: 'type', label: 'Type' },
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
                key: 'appliedDate', 
                label: 'Applied Date',
                render: (item) => formatDate(item.appliedDate)
              }
            ]}
          />
        )



      default:
        return null
    }
  }

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: screenSize.isMobile ? '20px' : '32px'
    }}>
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '12px',
        marginBottom: '20px' 
      }}>
        <button
          onClick={() => setShowCourseForm(true)}
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
          Add Course
        </button>
        <button
          onClick={() => setShowPostPage(true)}
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
          <TabButton value="applications" isActive={activeTab === "applications"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} />
              Applications
            </div>
          </TabButton>

        </div>
      </div>

      {/* Content */}
      {showCourseForm ? null : (!showPostPage ? getTabContent() : <Post onClose={() => setShowPostPage(false)} />)}

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
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.companyName}
                      onChange={(e) => handleCourseInputChange('companyName', e.target.value)}
                      placeholder="Enter company name..."
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

                {/* Duration & Category */}
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
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.duration}
                      onChange={(e) => handleCourseInputChange('duration', e.target.value)}
                      placeholder={courseFormData.type === 'video' ? "e.g., 5h 30m" : courseFormData.type === 'book' ? "e.g., 200 pages" : "e.g., 25 pages"}
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
                      Category *
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
                      <option value="">Select category</option>
                      {courseFormData.type === 'video' ? (
                        <>
                          <option value="Business">Business</option>
                          <option value="Technology">Technology</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Finance">Finance</option>
                          <option value="Design">Design</option>
                          <option value="Health">Health</option>
                          <option value="Education">Education</option>
                          <option value="Personal Development">Personal Development</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Entrepreneurship">Entrepreneurship</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Programming">Programming</option>
                          <option value="Photography">Photography</option>
                          <option value="Music">Music</option>
                          <option value="Art">Art</option>
                        </>
                      ) : courseFormData.type === 'book' ? (
                        <>
                          <option value="Business">Business</option>
                          <option value="Technology">Technology</option>
                          <option value="Self-Help">Self-Help</option>
                          <option value="Biography">Biography</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Health">Health</option>
                          <option value="Education">Education</option>
                          <option value="Fiction">Fiction</option>
                          <option value="Non-Fiction">Non-Fiction</option>
                          <option value="History">History</option>
                          <option value="Science">Science</option>
                          <option value="Philosophy">Philosophy</option>
                        </>
                      ) : (
                        <>
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Retail">Retail</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Education">Education</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Energy">Energy</option>
                        </>
                      )}
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

                {/* Author Type for books */}
                {courseFormData.type === 'book' && (
                  <div style={{ marginBottom: '16px' }}>
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
                )}

                {/* Business Plan specific fields */}
                {courseFormData.type === 'business-plan' && (
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
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Price *
                    </label>
                    <select
                      required
                      value={courseFormData.price}
                      onChange={(e) => handleCourseInputChange('price', e.target.value)}
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
                                               <option value="Free">Free</option>
                         <option value="Pro">Pro</option>
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
                             if (files.length > 0) {
                               handleFileUpload('video', files[0])
                             }
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
                                   Click to upload or drag & drop
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
                               if (e.target.files.length > 0) {
                                 handleFileUpload('video', e.target.files[0])
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

                       {/* Additional Documents */}
                       <div style={{ marginBottom: '12px' }}>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#6b7280',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Additional Documents
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
                           files.forEach(file => handleAddDocument(file))
                         }}
                         onClick={() => document.getElementById('additional-docs-upload').click()}
                         >
                           <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                           <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                             Click to upload or drag & drop additional files
                           </div>
                           <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                             Any file type up to 20MB each
                           </div>
                         </div>
                         <input
                           id="additional-docs-upload"
                           type="file"
                           multiple
                           style={{ display: 'none' }}
                           onChange={(e) => {
                             Array.from(e.target.files).forEach(file => handleAddDocument(file))
                           }}
                         />
                         
                         {/* Display uploaded additional documents */}
                         {courseFormData.documents.length > 0 && (
                           <div style={{ marginTop: '12px' }}>
                             <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                               Uploaded Documents:
                             </div>
                             {courseFormData.documents.map((doc, index) => (
                               <div key={index} style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 padding: '8px 12px',
                                 backgroundColor: '#f3f4f6',
                                 borderRadius: '6px',
                                 marginBottom: '6px'
                               }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <FileText size={16} color="#6b7280" />
                                   <span style={{ fontSize: '14px', color: '#374151' }}>{doc.name}</span>
                                   <span style={{ fontSize: '12px', color: '#9ca3af' }}>({doc.size})</span>
                                 </div>
                                 <button
                                   type="button"
                                   onClick={() => handleRemoveDocument(index)}
                                   style={{
                                     background: 'none',
                                     border: 'none',
                                     cursor: 'pointer',
                                     padding: '4px',
                                     borderRadius: '4px',
                                     color: '#ef4444'
                                   }}
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
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
                               {tag}
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
                        <span>{selectedItem.type}</span>
                        <span>•</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedItem.salary}</span>
                      </div>
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

                  {/* Required Skills */}
                  {selectedItem.skills && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Required Skills
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits & Perks */}
                  {selectedItem.benefits && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Benefits & Perks
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.benefits.map((benefit, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {benefit}
                          </span>
                        ))}
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
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Applicants:</strong> {selectedItem.applicants}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                    </div>
                  </div>
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
                      src={selectedItem.logo} 
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
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedItem.value}</span>
                        <span>•</span>
                        <span>{selectedItem.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Project Overview
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

                  {/* Requirements */}
                  {selectedItem.requirements && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements
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

                  {/* Deliverables */}
                  {selectedItem.deliverables && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Deliverables
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.deliverables.map((deliverable, index) => (
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
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evaluation Criteria */}
                  {selectedItem.evaluationCriteria && (
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
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.evaluationCriteria.map((criteria, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {criteria}
                          </span>
                        ))}
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

                  {/* Additional Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    marginTop: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <span><strong>Deadline:</strong> {selectedItem.deadline}</span>
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                    </div>
                  </div>
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
                      src={selectedItem.logo} 
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
                        <span>{selectedItem.type}</span>
                        <span>•</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedItem.value}</span>
                        <span>•</span>
                        <span>{selectedItem.duration}</span>
                      </div>
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
                  {selectedItem.eligibility && (
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
                        {selectedItem.eligibility.map((requirement, index) => (
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

                  {/* Benefits */}
                  {selectedItem.benefits && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Benefits & Support
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
                            }}>•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Application Process */}
                  {selectedItem.applicationProcess && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Application Process
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.applicationProcess.map((step, index) => (
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
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Selection Criteria */}
                  {selectedItem.selectionCriteria && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Selection Criteria
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.selectionCriteria.map((criteria, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Focus Areas */}
                  {selectedItem.focusAreas && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Focus Areas
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.focusAreas.map((area, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {area}
                          </span>
                        ))}
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
                      <span><strong>Deadline:</strong> {selectedItem.deadline}</span>
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                    </div>
                  </div>
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
                        <span>{selectedItem.category}</span>
                        <span>•</span>
                        <span>{selectedItem.level}</span>
                        <span>•</span>
                        <span style={{ color: selectedItem.price === 'Free' ? '#16a34a' : '#f59e0b', fontWeight: '600' }}>
                          {selectedItem.price}
                        </span>
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

                  {/* Tags */}
                  {selectedItem.tags && (
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
                        {selectedItem.tags.map((tag, index) => (
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
                        ))}
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
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                      {selectedItem.language && <span><strong>Language:</strong> {selectedItem.language}</span>}
                      {selectedItem.format && <span><strong>Format:</strong> {selectedItem.format}</span>}
                    </div>
                  </div>
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
                          {skill}
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
    </div>
  )


}

export default Content
