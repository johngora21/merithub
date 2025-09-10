import React, { useState, useEffect } from 'react'
import { RefreshCw, Download, Users, MapPin, DollarSign, Briefcase, Clock, Star, Search, SlidersHorizontal, X, Check, FileText, GraduationCap, Calendar, Building2, Shield, Factory } from 'lucide-react'
import { useResponsive, getGridColumns, getGridGap } from '../../hooks/useResponsive'
import { countries } from '../../utils/countries'
import ApplicantsList from './ApplicantsList'
import { apiService, resolveAssetUrl } from '../../lib/api-service'

const Applications = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('jobs')
  
  // Separate filter states for each content type
  const [jobsFilters, setJobsFilters] = useState({
    searchQuery: '',
    status: '',
    location: '',
    jobType: [],
    experienceLevel: [],
    industry: [],
    salaryMin: '',
    salaryMax: ''
  })
  
  const [tendersFilters, setTendersFilters] = useState({
    searchQuery: '',
    status: '',
    location: '',
    jobType: [],
    experienceLevel: [],
    industry: [],
    salaryMin: '',
    salaryMax: ''
  })
  
  const [opportunitiesFilters, setOpportunitiesFilters] = useState({
    searchQuery: '',
    status: '',
    location: '',
    jobType: [],
    experienceLevel: [],
    industry: [],
    salaryMin: '',
    salaryMax: ''
  })
  
  // Helper functions to get current filters based on active tab
  const getCurrentFilters = () => {
    switch (activeTab) {
      case 'jobs': return jobsFilters
      case 'tenders': return tendersFilters
      case 'opportunities': return opportunitiesFilters
      default: return jobsFilters
    }
  }
  
  const setCurrentFilters = (newFilters) => {
    switch (activeTab) {
      case 'jobs': setJobsFilters(newFilters); break
      case 'tenders': setTendersFilters(newFilters); break
      case 'opportunities': setOpportunitiesFilters(newFilters); break
    }
  }
  
  const [showFilters, setShowFilters] = useState(false)
  const [showOverview, setShowOverview] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showApplicantsList, setShowApplicantsList] = useState(false)
  const [selectedItemForApplicants, setSelectedItemForApplicants] = useState(null)

  // API-driven data (preserve UI and structure)
  const [jobsState, setJobsState] = useState([])
  const [tendersState, setTendersState] = useState([])
  const [opportunitiesState, setOpportunitiesState] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Map backend payloads to the exact UI fields used by the cards
  const isProBadge = (item) => {
    const price = item?.price
    return price === 'Pro' || item?.postedBy === 'platform' || item?.posted_by === 'platform' || item?.is_featured === true
  }

  const mapJob = (j) => {
    const resolveAssetUrl = (path) => {
      if (!path) return ''
      if (typeof path !== 'string') return ''
      if (path.startsWith('http')) return path
      const baseUrl = 'http://localhost:8000'
      return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
    }
    const formatDate = (value) => {
      if (!value) return ''
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return String(value)
      return d.toLocaleDateString()
    }
    const toTitleCase = (s) => (typeof s === 'string' && s.length)
      ? s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
      : s
    // Use EXACT same salary logic as main Merit app
    const min = j.salary_min != null ? Number(j.salary_min) : undefined
    const max = j.salary_max != null ? Number(j.salary_max) : undefined
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

    // Normalize country to full name if a code is provided (e.g., TZ -> Tanzania)
    const rawCountry = j.country || ''
    const countryFromList = countries.find(c => c.code === rawCountry || c.name === rawCountry)
    const normalizedCountry = countryFromList ? countryFromList.name : rawCountry

    const years = j.experience_years != null ? Number(j.experience_years) : undefined
    const experienceText = (typeof years === 'number' && !Number.isNaN(years))
      ? `${years} years`
      : (j.experience ? j.experience : (j.experience_level || ''))

    console.log('Job data for mapping:', j)
    return {
      id: j.id || j.job_id || `JOB-${j?.id || ''}`,
      title: j.title || j.position || '',
      company: j.company || j.company_name || '',
      industry: j.industry || j.category || '',
      location: j.location || j.country || '',
      country: normalizedCountry || '',
      type: toTitleCase(j.job_type || j.type || j.employment_type || ''),
      experience: experienceText,
      salary: salary,
      postedTime: j.postedTime || j.createdAt ? new Date(j.postedTime || j.createdAt).toLocaleDateString() : 'Recently',
      // Align with Content page: use application_deadline and format
      deadline: j.application_deadline ? new Date(j.application_deadline).toLocaleDateString() : 'No deadline',
      applicants: j.applicants || j.applicants_count || 0,
      description: j.description || '',
      skills: Array.isArray(j.skills) ? j.skills : [],
      tags: Array.isArray(j.tags) ? j.tags : [],
      benefits: Array.isArray(j.benefits) ? j.benefits : (j.benefits ? [j.benefits] : []),
      price: j.price || 'Free',
      logo: (() => {
        const resolved = resolveAssetUrl(j.logo || j.company_logo);
        console.log('Job logo resolved:', { original: j.logo || j.company_logo, resolved });
        return resolved;
      })(),
      urgentHiring: !!(j.is_urgent || j.urgentHiring),
      isRemote: !!(j.is_remote || j.remote),
      postedBy: j.posted_by || j.source || (j.creator ? (j.creator.name || j.creator.email) : 'platform'),
      contactEmail: j.contact_email || '',
      contactPhone: j.contact_phone || '',
      approvalStatus: j.approval_status || 'pending',
      externalUrl: j.external_url || '',
      workType: toTitleCase(j.work_type) || (j.isRemote ? 'Remote' : 'Not specified'),
      status: j.status || 'Active',
      isFeatured: j.is_featured || j.is_featured === true || false
    }
  }

  const mapTender = (t) => {
    const resolveAssetUrl = (path) => {
      if (!path) return ''
      if (typeof path !== 'string') return ''
      if (path.startsWith('http')) return path
      const baseUrl = 'http://localhost:8000'
      return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
    }
    const formatDate = (value) => {
      if (!value) return ''
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return String(value)
      return d.toLocaleDateString()
    }
    const toTitleCase = (s) => (typeof s === 'string' && s.length)
      ? s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
      : s
    
    // Use EXACT same contract value logic as Content page
    const min = t.contract_value_min != null ? Number(t.contract_value_min) : undefined
    const max = t.contract_value_max != null ? Number(t.contract_value_max) : undefined
    const fmt = (n) => typeof n === 'number' && !Number.isNaN(n) ? n.toLocaleString() : ''
    let budget
    if (min != null && max != null) {
      budget = min === max
        ? `${t.currency} ${fmt(min)}`
        : `${t.currency} ${fmt(min)} - ${t.currency} ${fmt(max)}`
    } else if (min != null) {
      budget = `${t.currency} ${fmt(min)}`
    } else if (max != null) {
      budget = `${t.currency} ${fmt(max)}`
    } else {
      budget = 'Value not specified'
    }

    // Normalize country to full name if a code is provided
    const rawCountry = t.country || ''
    const countryFromList = countries.find(c => c.code === rawCountry || c.name === rawCountry)
    const normalizedCountry = countryFromList ? countryFromList.name : rawCountry

    return {
    id: t.id || t.tender_id || `TENDER-${t?.id || ''}`,
    title: t.title || '',
    company: t.organization || t.company || '',
      industry: t.industry || t.sector || 'Not specified',
    location: t.location || t.country || '',
      country: normalizedCountry || '',
      budget: budget,
      deadline: t.deadline ? formatDate(t.deadline) : 'No deadline',
    postedTime: t.postedTime || t.createdAt ? new Date(t.postedTime || t.createdAt).toLocaleDateString() : 'Recently',
    applicants: t.applicants || t.applicants_count || 0,
      description: t.description || t.tender_description || '',
      coverImage: t.cover_image || t.coverImage || t.logo || t.organization_logo || '',
    requirements: Array.isArray(t.requirements) ? t.requirements : [],
      projectScope: Array.isArray(t.project_scope) ? t.project_scope : (t.project_scope ? [t.project_scope] : []),
      technicalRequirements: Array.isArray(t.technical_requirements) ? t.technical_requirements : (t.technical_requirements ? [t.technical_requirements] : []),
      submissionProcess: Array.isArray(t.submission_process) ? t.submission_process : (t.submission_process ? [t.submission_process] : []),
      evaluationCriteria: Array.isArray(t.evaluation_criteria) ? t.evaluation_criteria : (t.evaluation_criteria ? [t.evaluation_criteria] : []),
      benefits: Array.isArray(t.benefits) ? t.benefits : (t.benefits ? [t.benefits] : []),
      tags: Array.isArray(t.tags) ? t.tags : (t.tags ? [t.tags] : []),
    logo: resolveAssetUrl(t.logo || t.organization_logo),
      postedBy: t.postedBy,
      contactEmail: t.contactEmail,
      contactPhone: t.contactPhone,
      externalUrl: t.external_url || '',
    status: t.status || 'Active',
    type: 'Tender'
    }
  }

  const mapOpportunity = (o) => {
    // Use the SAME parseToArray function as the main app
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
    
    const resolveAssetUrl = (path) => {
      if (!path) return ''
      if (typeof path !== 'string') return ''
      if (path.startsWith('http')) return path
      const baseUrl = 'http://localhost:8000'
      return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
    }
    const formatDate = (value) => {
      if (!value) return ''
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return String(value)
      return d.toLocaleDateString()
    }
    const toTitleCase = (s) => (typeof s === 'string' && s.length)
      ? s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
      : s
    
    // Use the SAME amount logic as the main app
    const toNumber = (val) => {
      if (val === null || val === undefined || val === '') return null
      if (typeof val === 'number') return val
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9.]/g, '')
        const n = Number(cleaned)
        return isNaN(n) ? null : n
      }
      return null
    }
    
    const currency = o.currency || 'USD'
    const minVal = toNumber(o.amount_min)
    const maxVal = toNumber(o.amount_max)
    let stipend
    if (minVal !== null && maxVal !== null) {
      stipend = minVal === maxVal ? `${currency} ${minVal.toLocaleString()}` : `${currency} ${minVal.toLocaleString()} - ${currency} ${maxVal.toLocaleString()}`
    } else if (minVal !== null) {
      stipend = `${currency} ${minVal.toLocaleString()}`
    } else if (maxVal !== null) {
      stipend = `${currency} ${maxVal.toLocaleString()}`
    } else {
      stipend = 'Amount not specified'
    }

    // Normalize country to full name if a code is provided
    const rawCountry = o.country || ''
    const countryFromList = countries.find(c => c.code === rawCountry || c.name === rawCountry)
    const normalizedCountry = countryFromList ? countryFromList.name : rawCountry

    console.log('=== RAW OPPORTUNITY DATA ===', o)
    console.log('=== OPPORTUNITY KEYS ===', Object.keys(o))
    console.log('Amount fields:', { 
      amount_min: o.amount_min, 
      amount_max: o.amount_max, 
      currency: o.currency,
      amount: o.amount,
      value: o.value
    })
    console.log('Benefits & Requirements fields:', {
      benefits: o.benefits,
      requirements: o.requirements,
      eligibility_criteria: o.eligibility_criteria
    })
        console.log('Raw opportunity object keys:', Object.keys(o))
        console.log('Raw opportunity values:', Object.values(o))
        console.log('Raw external_url:', o.external_url)
    return {
    id: o.id || o.opportunity_id || `OPP-${o?.id || ''}`,
    title: o.title || '',
    company: o.organization || o.company || '',
    industry: o.industry || o.category || '',
    type: o.type || o.opportunity_type || '',
    location: o.location || o.country || 'Not specified',
      country: normalizedCountry || '',
    duration: o.duration || '',
      stipend: stipend,
      amount: stipend, // Add amount field
      deadline: o.deadline ? formatDate(o.deadline) : 'No deadline',
    postedTime: o.postedTime || o.createdAt ? new Date(o.postedTime || o.createdAt).toLocaleDateString() : 'Recently',
    applicants: o.applicants || o.applicants_count || 0,
      description: o.description || o.opportunity_description || '',
      benefits: parseToArray(o.benefits),
      tags: parseToArray(o.tags),
      requirements: parseToArray(o.requirements),
      eligibility: parseToArray(o.eligibility_criteria),
      applicationProcess: parseToArray(o.applicationProcess),
    logo: resolveAssetUrl(o.logo || o.organization_logo),
      poster: resolveAssetUrl(o.poster || o.cover_image || o.coverImage || o.logo || o.organization_logo),
      coverImage: resolveAssetUrl(o.cover_image || o.coverImage || o.poster || o.logo || o.organization_logo), // Add coverImage
      contactEmail: o.contact_email,
      externalUrl: o.external_url || '',
    status: o.status || 'Active'
    }
  }

  useEffect(() => {
    const fetchApplications = async () => {
      console.log('Fetching applications...')
      try {
        setLoadingData(true)
        setLoadError('')
        const resp = await apiService.get('/admin/applications/overview')
        console.log('API Response:', resp)
        const payload = resp?.data || resp || {}
        console.log('Payload:', payload)
        const jobs = Array.isArray(payload.jobs) ? payload.jobs : (payload.data?.jobs || [])
        const tenders = Array.isArray(payload.tenders) ? payload.tenders : (payload.data?.tenders || [])
        const opportunities = Array.isArray(payload.opportunities) ? payload.opportunities : (payload.data?.opportunities || [])
        
        // Debug: Check job data
        console.log('All jobs data:', jobs.map(j => ({ 
          id: j.id, 
          title: j.title, 
          type: j.type, 
          price: j.price,
          logo: j.logo,
          company_logo: j.company_logo
        })))

        // Enrich all data with detailed information from content endpoint
        let enrichedJobs = jobs
        let enrichedTenders = tenders  
        let enrichedOpportunities = opportunities

        try {
          // Enrich jobs
          const jobsDetailResp = await apiService.get('/admin/content?type=jobs&limit=50')
          const jobsDetailPayload = jobsDetailResp?.data || jobsDetailResp || {}
          const detailedJobs = Array.isArray(jobsDetailPayload)
            ? jobsDetailPayload
            : (jobsDetailPayload.content || jobsDetailPayload.data || jobsDetailPayload.jobs || [])
          const byId = new Map()
          detailedJobs.forEach(dj => { if (dj && dj.id != null) byId.set(dj.id, dj) })
          enrichedJobs = jobs.map(j => {
            const dj = byId.get(j.id) || {}
            return {
              ...j,
              application_deadline: j.application_deadline || dj.application_deadline || dj.deadline,
              benefits: Array.isArray(j.benefits) ? j.benefits : (Array.isArray(dj.benefits) ? dj.benefits : (dj.benefits ? [dj.benefits] : (j.benefits ? [j.benefits] : []))),
              tags: Array.isArray(j.tags) ? j.tags : (Array.isArray(dj.tags) ? dj.tags : (dj.tags ? [dj.tags] : [])),
              contact_email: j.contact_email || dj.contact_email,
              external_url: j.external_url || dj.external_url,
              job_type: j.job_type || dj.job_type,
              work_type: j.work_type || dj.work_type,
              experience_level: j.experience_level || dj.experience_level,
              experience_years: j.experience_years != null ? j.experience_years : dj.experience_years,
              approval_status: j.approval_status || dj.approval_status,
              creator: j.creator || dj.creator
            }
          })
        } catch (enrichErr) {
          console.error('Error enriching jobs:', enrichErr)
        }

        try {
          // Enrich tenders
          const tendersDetailResp = await apiService.get('/admin/content?type=tenders&limit=50')
          const tendersDetailPayload = tendersDetailResp?.data || tendersDetailResp || {}
          const detailedTenders = Array.isArray(tendersDetailPayload)
            ? tendersDetailPayload
            : (tendersDetailPayload.content || tendersDetailPayload.data || tendersDetailPayload.tenders || [])
          const tendersById = new Map()
          detailedTenders.forEach(dt => { if (dt && dt.id != null) tendersById.set(dt.id, dt) })
          enrichedTenders = tenders.map(t => {
            const dt = tendersById.get(t.id) || {}
            return {
              ...t,
              cover_image: t.cover_image || dt.cover_image,
              organization_logo: t.organization_logo || dt.organization_logo
            }
          })
        } catch (enrichErr) {
          console.error('Error enriching tenders:', enrichErr)
        }

        try {
          // Enrich opportunities
          const opportunitiesDetailResp = await apiService.get('/admin/content?type=opportunities&limit=50')
          const opportunitiesDetailPayload = opportunitiesDetailResp?.data || opportunitiesDetailResp || {}
          const detailedOpportunities = Array.isArray(opportunitiesDetailPayload)
            ? opportunitiesDetailPayload
            : (opportunitiesDetailPayload.content || opportunitiesDetailPayload.data || opportunitiesDetailPayload.opportunities || [])
          
          const opportunitiesById = new Map()
          detailedOpportunities.forEach(detail => { 
            if (detail && detail.id != null) {
              opportunitiesById.set(detail.id, detail) 
            }
          })
          
          enrichedOpportunities = opportunities.map(o => {
            const detail = opportunitiesById.get(o.id) || {}
            return {
              ...o,
              cover_image: o.cover_image || detail.cover_image || detail.poster || detail.logo,
              organization_logo: o.organization_logo || detail.organization_logo || detail.logo,
              poster: o.poster || detail.poster || o.cover_image || detail.cover_image || o.logo || detail.logo
            }
          })
        } catch (enrichErr) {
          console.error('Error enriching opportunities:', enrichErr)
        }

        // Set all enriched data at once
        setJobsState(enrichedJobs.map(mapJob))
        setTendersState(enrichedTenders.map(mapTender))
        setOpportunitiesState(enrichedOpportunities.map(mapOpportunity))
      } catch (e) {
        console.error('Error fetching applications:', e)
        setJobsState([])
        setTendersState([])
        setOpportunitiesState([])
        setLoadError(e?.message || 'Failed to load applications')
      } finally {
        setLoadingData(false)
      }
    }
    fetchApplications()
  }, [])

  // Removed mock data: use real API data only

  const filterOptions = {
    status: ['All Status', 'Active', 'Closed', 'Draft', 'Pending Review'],
    location: ['All Countries', ...countries.map(country => country.name)]
  }

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
    { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
    { code: 'RWF', symbol: 'RWF', name: 'Rwandan Franc' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
    { code: 'SOS', symbol: 'S', name: 'Somali Shilling' },
    { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc' },
    { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa' },
    { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
    { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' }
  ]

  const handleFilterChange = (category, value) => {
    setCurrentFilters({
      ...getCurrentFilters(),
      [category]: value
    })
  }

  const clearAllFilters = () => {
    setCurrentFilters({
      searchQuery: '',
      status: '',
      location: '',
      jobType: [],
      experienceLevel: [],
      industry: [],
      salaryMin: '',
      salaryMax: ''
    })
  }

  const getActiveFilterCount = () => {
    const currentFilters = getCurrentFilters()
    let count = 0
    if (currentFilters.status && currentFilters.status !== 'All Status') count += 1
    if (currentFilters.location && currentFilters.location !== 'All Countries') count += 1
    return count
  }

  const updateSalaryRange = (field, value) => {
    setCurrentFilters({
      ...getCurrentFilters(),
      [field]: value
    })
  }

  const toggleFilter = (category, value) => {
    const currentFilters = getCurrentFilters()
    const currentArray = currentFilters[category] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    setCurrentFilters({
      ...currentFilters,
      [category]: newArray
    })
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    switch(activeTab) {
      case 'jobs': return jobsState
      case 'tenders': return tendersState
      case 'opportunities': return opportunitiesState
      default: return jobsState
    }
  }

  // Filter and search applications
  const filteredApplications = getCurrentData().filter(item => {
    const currentFilters = getCurrentFilters()
    
    // Search filter
    if (currentFilters.searchQuery) {
      const query = currentFilters.searchQuery.toLowerCase()
      const matchesSearch = 
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.industry.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        (item.skills && item.skills.some(skill => skill.toLowerCase().includes(query))) ||
        (item.requirements && item.requirements.some(req => req.toLowerCase().includes(query))) ||
        (item.benefits && item.benefits.some(benefit => benefit.toLowerCase().includes(query))) ||
        item.description.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (currentFilters.status && currentFilters.status !== 'All Status' && item.status !== currentFilters.status) {
      return false
    }

    // Location filter
    if (currentFilters.location && currentFilters.location !== 'All Countries') {
      if (!item.location || !item.location.includes(currentFilters.location)) {
        return false
      }
    }

    return true
  })

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setShowOverview(true)
  }

  const handleViewApplicants = (item) => {
    setSelectedItemForApplicants({ ...item, __type: activeTab })
    setShowApplicantsList(true)
  }

  const handleBackFromApplicants = () => {
    setShowApplicantsList(false)
    setSelectedItemForApplicants(null)
    setShowOverview(false)
    setSelectedItem(null)
  }

  // Show applicants list page if active
  if (showApplicantsList && selectedItemForApplicants) {
    return (
      <ApplicantsList 
        selectedItem={selectedItemForApplicants} 
        onBack={handleBackFromApplicants} 
      />
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
        gap: '8px',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        {[
          { id: 'jobs', name: 'Jobs', icon: Briefcase },
          { id: 'tenders', name: 'Tenders', icon: FileText },
          { id: 'opportunities', name: 'Opportunities', icon: GraduationCap }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab.id ? '#f97316' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <tab.icon size={16} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px'
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
            placeholder={`Search ${activeTab}...`}
            value={getCurrentFilters().searchQuery}
            onChange={(e) => setCurrentFilters({...getCurrentFilters(), searchQuery: e.target.value})}
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
              e.target.style.borderColor = '#ea580c'
              e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
            }}
          />
        </div>
        
        {/* Status Filter */}
        <select
          value={getCurrentFilters().status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          style={{
            padding: '10px 16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '140px'
          }}>
          {filterOptions.status.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          value={getCurrentFilters().location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          style={{
            padding: '10px 16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '160px'
          }}>
          {filterOptions.location.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: '10px 16px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc'
              e.target.style.borderColor = '#cbd5e1'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#e2e8f0'
            }}>
            Clear
          </button>
        )}
      </div>

      {/* Cards Grid - EXACT COPY FROM MAIN APP */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
        gap: getGridGap(screenSize)
      }}>
        {filteredApplications.length === 0 ? (
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
              No applications found
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Try adjusting your search or filters to find more applications
            </p>
          </div>
        ) : (
          filteredApplications.map((item) => {
            // Render different card types based on activeTab
            if (activeTab === 'tenders') {
              const getSectorIcon = (sector) => {
                const icons = {
                  'Technology': FileText,
                  'Construction': Building2,
                  'Healthcare': Shield,
                  'Transportation': Briefcase,
                  'Energy': Factory,
                  'Education': GraduationCap,
                  'Finance': DollarSign,
                  'Government': Building2,
                  'Manufacturing': Factory,
                  'Agriculture': Factory,
                  'Telecommunications': FileText,
                  'Consulting': Briefcase,
                  'Real Estate': Building2,
                  'Retail': Briefcase,
                  'Hospitality': Building2,
                  'Media': FileText,
                  'Non-Profit': Shield,
                  'Research': FileText,
                  'Security': Shield,
                  'Logistics': Briefcase
                }
                return icons[sector] || FileText
              }

              const getSectorColor = (sector) => {
                switch (sector) {
                  case 'Government': return '#1d4ed8'
                  case 'Healthcare': return '#dc2626'
                  case 'Transportation': return '#059669'
                  case 'Private': return '#7c3aed'
                  case 'Manufacturing': return '#ea580c'
                  case 'Technology': return '#3b82f6'
                  case 'Construction': return '#f59e0b'
                  case 'Energy': return '#f97316'
                  case 'Education': return '#06b6d4'
                  case 'Finance': return '#84cc16'
                  case 'Agriculture': return '#22c55e'
                  case 'Telecommunications': return '#0ea5e9'
                  case 'Consulting': return '#a855f7'
                  case 'Real Estate': return '#f43f5e'
                  case 'Retail': return '#14b8a6'
                  case 'Hospitality': return '#f59e0b'
                  case 'Media': return '#8b5cf6'
                  case 'Non-Profit': return '#06b6d4'
                  case 'Research': return '#3b82f6'
                  case 'Security': return '#ef4444'
                  case 'Logistics': return '#10b981'
                  default: return '#16a34a'
                }
              }

              const getDaysUntilDeadline = (deadline) => {
                if (!deadline) return 0
                const now = new Date()
                const deadlineDate = new Date(deadline)
                const diffTime = deadlineDate - now
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              }

              const SectorIcon = getSectorIcon(item.sector || item.industry)
              const sectorColor = getSectorColor(item.sector || item.industry)
              const daysUntilDeadline = getDaysUntilDeadline(item.deadline)
              const isDeadlineUrgent = daysUntilDeadline <= 7
              

              return (
                <div key={item.id} style={{
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
                onClick={() => handleItemClick(item)}
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
                    {(() => {
                      const imageUrl = item.coverImage || item.cover_image || item.logo || item.organization_logo
                      if (imageUrl) {
                        return (
                          <img 
                            src={resolveAssetUrl(imageUrl)} 
                            alt={item.title || 'Tender'}
                            style={{
                              width: '100%',
                              height: '250px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        )
                      }
                      return null
                    })()}
                    <div style={{
                      width: '100%',
                      height: '250px',
                      backgroundColor: '#f8f9fa',
                      display: (item.coverImage || item.cover_image || item.logo || item.organization_logo) ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}>
                      <SectorIcon size={48} color={sectorColor} />
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
                          backgroundColor: sectorColor,
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
                          {item.sector || item.industry || 'Not specified'}
                        </span>
                        {item.urgentHiring && (
                          <span style={{
                            fontSize: '10px',
                            color: 'white',
                            backgroundColor: '#dc2626',
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
                      
                      {/* PRO Badge - Top Right */}
                      {isProBadge(item) && (
                        <span style={{
                          fontSize: '10px',
                          color: 'white',
                          backgroundColor: '#3b82f6',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          FEATURED
                        </span>
                      )}
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
                      {item.contractValue || item.salary || 'Not specified'}
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
                        {item.location}{item.country && `, ${item.country}`}
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
                        <span>Deadline:</span>
                        <span style={{ color: isDeadlineUrgent ? '#dc2626' : '#64748b', fontWeight: isDeadlineUrgent ? '600' : '500' }}>
                          {item.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ marginBottom: '12px', flex: 1 }}>
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
                              {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Not specified'}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span style={{
                              color: '#64748b',
                              fontSize: '12px',
                              padding: '4px 8px',
                              fontWeight: '500'
                            }}>
                              +{item.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

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
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px',
                          color: '#64748b'
                        }}>
                          <Users size={11} />
                          {item.applicants || 0} applicants
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewApplicants(item)
                        }}
                        style={{
                          backgroundColor: '#ea580c',
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
                          e.target.style.backgroundColor = '#ea580c'
                          e.target.style.transform = 'translateY(0)'
                        }}>
                        View Applicants
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            if (activeTab === 'opportunities') {
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

              const typeColor = getTypeColor(item.type)
              

              return (
                <div key={item.id} style={{
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
                onClick={() => handleItemClick(item)}
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
                    {(() => {
                      const imageUrl = item.poster || item.cover_image || item.coverImage || item.logo || item.organization_logo
                      if (imageUrl) {
                        return (
                          <img 
                            src={resolveAssetUrl(imageUrl)} 
                            alt={item.title || 'Opportunity'}
                            style={{
                              width: '100%',
                              height: '250px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        )
                      }
                      return null
                    })()}
                    <div style={{
                      width: '100%',
                      height: '250px',
                      backgroundColor: '#f8f9fa',
                      display: (item.poster || item.cover_image || item.coverImage || item.logo || item.organization_logo) ? 'none' : 'flex',
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
                          backdropFilter: 'blur(10px)'
                        }}>
                          {item.type}
                        </span>
                        {item.price === 'Pro' && (
                          <span style={{
                            fontSize: '10px',
                            color: 'white',
                            backgroundColor: '#3b82f6',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                          }}>
                            PRO
                          </span>
                        )}
                      </div>
                      
                      {/* PRO Badge - Top Right */}
                      {isProBadge(item) && (
                        <span style={{
                          fontSize: '10px',
                          color: 'white',
                          backgroundColor: '#3b82f6',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          FEATURED
                        </span>
                      )}
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
                      {item.organization || item.company || item.category}
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
                        {item.duration || 'Not specified'}
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
                      <span>Deadline:</span>
                      <span style={{ color: '#dc2626', fontWeight: '600' }}>{item.deadline}</span>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ marginBottom: '12px', flex: 1 }}>
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
                              {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Not specified'}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span style={{
                              color: '#64748b',
                              fontSize: '12px',
                              padding: '4px 8px',
                              fontWeight: '500'
                            }}>
                              +{item.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

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
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px',
                          color: '#64748b'
                        }}>
                          <Users size={11} />
                          {item.applicants || 0} applicants
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewApplicants(item)
                        }}
                        style={{
                          backgroundColor: '#ea580c',
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
                          e.target.style.backgroundColor = '#ea580c'
                          e.target.style.transform = 'translateY(0)'
                        }}>
                        View Applicants
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            // Default job card design - keep original simple structure
            return (
              <div key={item.id} style={{
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
            onClick={() => handleItemClick(item)}>
              
              {/* PRO Badge - Top Right */}
              {isProBadge(item) && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10
                }}>
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
                </div>
              )}

              {/* Company Profile Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  {item.logo && item.logo.trim() !== '' ? (
                    <img 
                      src={item.logo} 
                      alt={item.company}
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
                      {item.company ? item.company.charAt(0).toUpperCase() : '?'}
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
                  <Star size={14} color="#2563eb" fill="#2563eb" />
                )}
              </h2>

              {/* Removed old location/status and quick info to avoid duplicates */}

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
                  <span style={{ color: '#0f172a' }}>{item.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#0f172a' }}>{item.country || '-'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={12} color="#16a34a" />
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>{item.salary}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={12} />
                  <span style={{ color: '#0f172a' }}>{item.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                  <Calendar size={12} />
                  <span>Deadline:</span>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>{item.deadline}</span>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Not specified'}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span style={{ color: '#64748b', fontSize: '11px', padding: '2px 6px', fontWeight: '500' }}>
                        +{item.tags.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}


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
                  gap: '3px',
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  <Users size={11} />
                  {item.applicants || 0} applicants
                </div>

                <button
                  onClick={() => handleViewApplicants(item)}
                  style={{
                    backgroundColor: '#ea580c',
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
                    e.target.style.backgroundColor = '#ea580c'
                    e.target.style.transform = 'translateY(0)'
                  }}>
                  View Applicants
                </button>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* Filters Modal */}
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowFilters(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0
              }}>
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Filter Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Job Type */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Job Type
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterOptions.jobType.map((type) => (
                    <label key={type} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={getCurrentFilters().jobType.includes(type)}
                        onChange={() => toggleFilter('jobType', type)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Experience Level
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterOptions.experienceLevel.map((level) => (
                    <label key={level} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={getCurrentFilters().experienceLevel.includes(level)}
                        onChange={() => toggleFilter('experienceLevel', level)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Industry
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflow: 'auto' }}>
                  {filterOptions.industry.map((industry) => (
                    <label key={industry} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={getCurrentFilters().industry.includes(industry)}
                        onChange={() => toggleFilter('industry', industry)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {industry}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Location Type
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterOptions.location.map((location) => (
                    <label key={location} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={getCurrentFilters().location.includes(location)}
                        onChange={() => toggleFilter('location', location)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {location}
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Salary Range
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={getCurrentFilters().salaryMin}
                    onChange={(e) => updateSalaryRange('salaryMin', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <span style={{ color: '#64748b' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={getCurrentFilters().salaryMax}
                    onChange={(e) => updateSalaryRange('salaryMax', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={clearAllFilters}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#16a34a',
                  border: '1px solid #16a34a',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Modal */}
      {showOverview && selectedItem && !showApplicantsList && (
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
          padding: '20px'
        }}
        onClick={() => setShowOverview(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '24px 24px 0 24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {(selectedItem.logo || selectedItem.coverImage || selectedItem.poster) && (selectedItem.logo || selectedItem.coverImage || selectedItem.poster).trim() !== '' ? (
                    <img 
                      src={selectedItem.coverImage || selectedItem.poster || selectedItem.logo} 
                      alt={selectedItem.company}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '24px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '24px',
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#64748b'
                    }}>
                      {selectedItem.company ? selectedItem.company.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <div>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 4px 0'
                    }}>
                      {selectedItem.company}
                    </h2>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {selectedItem.type && ['Scholarships', 'Fellowships', 'Grants', 'Funds', 'Internships', 'Programs', 'Competitions', 'Research', 'Professional Development'].includes(selectedItem.type) ? selectedItem.type : selectedItem.industry}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOverview(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#64748b'
                  }}>
                  <X size={20} />
                </button>
              </div>
              
              {/* Debug logging */}
              {console.log('Modal selectedItem for opportunities:', selectedItem)}
              {console.log('Benefits:', selectedItem.benefits)}
              {console.log('Eligibility:', selectedItem.eligibility)}
              {console.log('Stipend:', selectedItem.stipend)}
              {console.log('External URL:', selectedItem.externalUrl)}
              
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 12px 0'
              }}>
                {selectedItem.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} />
                  {selectedItem.location}
                </div>
                <span>•</span>
                <span><strong>Deadline:</strong> <span style={{ color: '#dc2626' }}>{selectedItem.deadline}</span></span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Complete Details */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 12px 0'
                }}>
                  {selectedItem.type === 'job' ? 'Complete Job Details' : 
                   selectedItem.type === 'tender' ? 'Complete Tender Details' : 
                   selectedItem.type === 'opportunity' ? 'Opportunity Details' : 
                   'Complete Details'}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  {activeTab === 'jobs' && (
                    <>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Job Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.type}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Work Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.workType}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Experience Level</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.experience}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Industry</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.industry}</p>
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
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Salary</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: 0, fontWeight: '600' }}>{selectedItem.salary}</p>
                      </div>
                      {/* Remove Deadline from this section to match Content layout */}
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Posted By</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.postedBy}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Email</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                          <a href={`mailto:${selectedItem.contactEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contactEmail}</a>
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Phone</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                          <a href={`tel:${selectedItem.contactPhone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contactPhone}</a>
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Application URL</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>
                          <a href={selectedItem.externalUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.externalUrl}</a>
                        </p>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'tenders' && (
                    <>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Organization</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.company}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Sector</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.industry}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contract Value</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: 0, fontWeight: '600' }}>{selectedItem.budget}</p>
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
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Posted By</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.postedBy}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Email</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                          <a href={`mailto:${selectedItem.contactEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contactEmail}</a>
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Phone</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                          <a href={`tel:${selectedItem.contactPhone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contactPhone}</a>
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Application URL</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>
                          <a href={selectedItem.externalUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.externalUrl}</a>
                        </p>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'opportunities' && (
                    <>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Organization</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.company}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Opportunity Type</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.type}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Duration</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.duration}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Location</label>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{selectedItem.location}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Amount</label>
                        <p style={{ fontSize: '14px', color: '#16a34a', margin: 0, fontWeight: '600' }}>{selectedItem.stipend}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Contact Email</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                          <a href={`mailto:${selectedItem.contactEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.contactEmail}</a>
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Application URL</label>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>
                          <a href={selectedItem.externalUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedItem.externalUrl}</a>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description/Overview */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 12px 0'
                }}>
                  {activeTab === 'jobs' ? 'Job Overview' : activeTab === 'tenders' ? 'Tender Description' : 'Opportunity Overview'}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedItem.description}
                </p>
              </div>

              {/* Required Skills/Requirements */}
              {((activeTab === 'opportunities' && selectedItem.eligibility && selectedItem.eligibility.length > 0) || 
                (activeTab !== 'opportunities' && (selectedItem.skills || selectedItem.requirements))) && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    {activeTab === 'jobs' ? 'Required Skills' : activeTab === 'tenders' ? 'Requirements & Qualifications' : 'Eligibility & Requirements'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(activeTab === 'opportunities' ? selectedItem.eligibility : (selectedItem.skills || selectedItem.requirements || [])).map((skill, index) => (
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
              )}

              {/* Tender Specific Sections */}
              {activeTab === 'tenders' && selectedItem.projectScope && selectedItem.projectScope.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Project Scope
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedItem.projectScope.map((scope, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        marginBottom: '4px'
                      }}>
                        {scope}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tenders' && selectedItem.technicalRequirements && selectedItem.technicalRequirements.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Technical Requirements
                  </h3>
                        <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedItem.technicalRequirements.map((req, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        marginBottom: '4px'
                      }}>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tenders' && selectedItem.submissionProcess && selectedItem.submissionProcess.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Submission Process
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedItem.submissionProcess.map((step, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        marginBottom: '4px'
                      }}>
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tenders' && selectedItem.evaluationCriteria && selectedItem.evaluationCriteria.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Evaluation Criteria
                  </h3>
                        <div style={{
                display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedItem.evaluationCriteria.map((criteria, index) => (
                      <div key={index} style={{
                    fontSize: '14px',
                        color: '#0f172a',
                        marginBottom: '4px'
                      }}>
                        {criteria}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunity Specific Sections */}
              {activeTab === 'opportunities' && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Benefits & Value
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

              {activeTab === 'opportunities' && selectedItem.eligibility && selectedItem.eligibility.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Eligibility Criteria
                  </h3>
              <div style={{
                display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {selectedItem.eligibility.map((criteria, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f0f9ff',
                        color: '#0369a1',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {criteria}
                      </span>
                    ))}
              </div>
            </div>
              )}

              {activeTab === 'opportunities' && selectedItem.applicationProcess && selectedItem.applicationProcess.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Application Process
                  </h3>
              <div style={{
                display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {selectedItem.applicationProcess.map((step, index) => (
                      <div key={index} style={{
                    fontSize: '14px',
                        color: '#0f172a',
                        marginBottom: '4px'
                }}>
                        {step}
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
                    {activeTab === 'opportunities' ? 'Benefits & Value' : 'Benefits'}
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

              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 12px 0' }}>Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedItem.tags.map((tag, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer removed to match Content layout */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Applications
