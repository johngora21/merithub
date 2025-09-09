import React, { useState, useEffect } from 'react'
import { apiService } from '../lib/api-service'
import { useNavigate } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import { Bell, User, Bookmark, ArrowLeft, Plus, X, ChevronDown, Briefcase, FileText, GraduationCap, Upload, Trash2 } from 'lucide-react'
import { countries } from '../utils/countries'

const Post = ({ onClose, editItem = null }) => {
  // Only use navigate if not in admin context
  let navigate = null
  try {
    navigate = useNavigate()
  } catch (error) {
    // Router not available (admin context)
    navigate = null
  }
  
  const screenSize = useResponsive()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: editItem?.type || 'job',
    title: '',
    description: '',
    company: '',
    location: '',
    country: '',
    workType: '',
    salaryType: 'fixed',
    salaryMin: '',
    salaryMax: '',
    jobType: '',
    experience: '',
    industry: '',
    customIndustry: '',
    skills: '',
    benefits: '',
    deadline: '',
    value: '',
    organization: '',
    sector: '',
    customSector: '',
    requirements: '',
    projectScope: '',
    technicalRequirements: '',
    submissionProcess: '',
    evaluationCriteria: '',
    applicationUrl: '',
    contactEmail: '',
    contactPhone: '',
    price: '',
    currency: 'USD',
    tags: [],
    customTag: '',
    documents: [],
    companyLogo: null,
    coverImage: null,
    isUrgent: false
  })

  // Populate form data when editing an item
  useEffect(() => {
    if (editItem) {
      const normalizeCountryToCode = (input) => {
        if (!input) return ''
        const match = countries.find(c => c.code === input || c.name === input)
        return match ? match.code : input
      }

      const ensureArrayTags = (input) => {
        if (!input) return []
        if (Array.isArray(input)) {
          return input.map(t => {
            if (typeof t === 'string') return t
            if (t && typeof t === 'object') return t.name || t.title || t.label || ''
            return String(t)
          }).filter(Boolean)
        }
        return String(input)
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      }

      const ensureMultiline = (input) => {
        if (!input) return ''
        if (Array.isArray(input)) return input.join('\n')
        return String(input)
      }

      const isTender = ((editItem.type || '').toString().toLowerCase().replace(/s$/, '') === 'tender')
      const isOpportunity = ((editItem.content_type || editItem.type || '').toString().toLowerCase()) === 'opportunities'

      const tenderMin = editItem.contract_value_min ?? editItem.min_value ?? null
      const tenderMax = editItem.contract_value_max ?? editItem.max_value ?? null
      
      // Debug logging
      console.log('Edit item for tender:', editItem);
      console.log('Tender min:', tenderMin, 'Tender max:', tenderMax);
      console.log('Sector:', editItem.sector);
      const oppMin = editItem.salaryMin ?? editItem.amount_min ?? null
      const oppMax = editItem.salaryMax ?? editItem.amount_max ?? null
      const derivedSalaryType = isTender
        ? (tenderMin != null && tenderMax != null && tenderMin !== tenderMax ? 'range' : 'fixed')
        : isOpportunity
          ? (oppMin != null && oppMax != null && oppMin !== oppMax ? 'range' : 'fixed')
          : (editItem.salary_min && editItem.salary_max && editItem.salary_min !== editItem.salary_max ? 'range' : 'fixed')

      const initialMin = isTender ? (tenderMin ?? (editItem.value || ''))
                        : isOpportunity ? (oppMin ?? '')
                        : (editItem.salary_min || '')
      const initialMax = isTender ? (tenderMax ?? '')
                        : isOpportunity ? (oppMax ?? '')
                        : (editItem.salary_max || '')
      
      console.log('DEBUG - editItem:', editItem)
      console.log('DEBUG - editItem.type:', editItem.type)
      console.log('DEBUG - editItem.content_type:', editItem.content_type)
      console.log('DEBUG - editItem.opportunityType:', editItem.opportunityType)
      console.log('DEBUG - isOpportunity:', isOpportunity)
      console.log('DEBUG - isTender:', isTender)
      console.log('DEBUG - oppMin:', oppMin, 'oppMax:', oppMax)
      console.log('DEBUG - initialMin:', initialMin, 'initialMax:', initialMax)
      console.log('DEBUG - derivedSalaryType:', derivedSalaryType)
      
      console.log('Derived salary type:', derivedSalaryType);
      console.log('Initial min:', initialMin, 'Initial max:', initialMax);

      const newFormData = {
        // Use the provided type from editItem; normalize to expected singular lowercase values
        type: (editItem.type || 'job').toString().toLowerCase().replace(/s$/, ''),
        title: editItem.title || '',
        description: editItem.description || editItem.tender_description || '',
        company: editItem.company || editItem.organization || '',
        organization: editItem.organization || editItem.company || '',
        location: editItem.location || '',
        country: normalizeCountryToCode(editItem.country || ''),
        workType: editItem.work_type || '',
        salaryType: derivedSalaryType,
        salaryMin: initialMin,
        salaryMax: initialMax,
        jobType: editItem.job_type || '',
        experience: editItem.experience_years || editItem.experience_level || '',
        duration: editItem.duration || '',
        industry: editItem.industry || '',
        customIndustry: editItem.customIndustry || '',
        skills: Array.isArray(editItem.skills) ? editItem.skills.join(', ') : (editItem.skills || ''),
        benefits: Array.isArray(editItem.benefits) ? editItem.benefits.join(', ') : (editItem.benefits || ''),
        deadline: editItem.application_deadline || editItem.deadline || editItem.submission_deadline || '',
        applicationUrl: editItem.external_url || editItem.application_url || '',
        contactEmail: editItem.contact_email || '',
        price: editItem.price || '',
        currency: editItem.currency || 'USD',
        tags: ensureArrayTags(editItem.tags || editItem.benefits || []),
        customTag: '',
        documents: Array.isArray(editItem.documents) ? editItem.documents : [],
        companyLogo: editItem.company_logo || editItem.logo || null,
        coverImage: editItem.cover_image || editItem.coverImage || editItem.poster || null,
        isUrgent: editItem.is_urgent || false,
        // Tender-specific fields
        value: editItem.value || editItem.contract_value_min || editItem.contractValue || editItem.amount || '',
        sector: (editItem.sector || editItem.industry || '').toLowerCase(),
        customSector: editItem.customSector || '',
        requirements: ensureMultiline(editItem.requirements || editItem.requirements_summary || editItem.eligibility_criteria),
        projectScope: ensureMultiline(editItem.project_scope || editItem.scope),
        technicalRequirements: ensureMultiline(editItem.technical_requirements || editItem.technicalSpecs),
        submissionProcess: ensureMultiline(editItem.submission_process || editItem.submission),
        evaluationCriteria: ensureMultiline(editItem.evaluation_criteria || editItem.criteria),
        contactPhone: editItem.contact_phone || '',
        // Opportunity-specific fields
        duration: editItem.duration || '',
        opportunityType: editItem.opportunityType || editItem.type || editItem.opportunity_type || '',
        category: editItem.category || ''
      };
      
      console.log('DEBUG - opportunityType mapped to:', newFormData.opportunityType)
      console.log('DEBUG - salaryType mapped to:', newFormData.salaryType)
      console.log('DEBUG - newFormData.opportunityType:', newFormData.opportunityType)
      console.log('DEBUG - newFormData.salaryType:', newFormData.salaryType)
      setFormData(newFormData);
    }
  }, [editItem])

  // Show the form with a slight delay for animation
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleBackClick = () => {
    if (onClose) {
      onClose() // Admin context - use callback
    } else if (navigate) {
      navigate('/jobs') // Main app context - navigate
    }
  }

  const handleLogoChange = (e, field) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const normalizeJobType = (label) => {
    const map = {
      'Full-time': 'full-time',
      'Part-time': 'part-time',
      'Contract': 'contract',
      'Internship': 'internship',
      'full-time': 'full-time',
      'part-time': 'part-time',
      'contract': 'contract',
      'internship': 'internship'
    }
    return map[label] || ''
  }

  const normalizeWorkType = (label) => {
    const map = {
      'Remote': 'remote',
      'On-site': 'on-site',
      'Hybrid': 'hybrid',
      'remote': 'remote',
      'on-site': 'on-site',
      'hybrid': 'hybrid'
    }
    return map[label] || ''
  }

  const deriveExperienceLevel = (yearsStr) => {
    const years = parseFloat(yearsStr || '0')
    if (Number.isNaN(years)) return 'entry'
    if (years < 1) return 'entry'
    if (years < 3) return 'junior'
    if (years < 6) return 'mid'
    if (years < 10) return 'senior'
    return 'executive'
  }

  const normalizeOpportunityType = (label) => {
    const map = {
      'Scholarships': 'scholarship',
      'Fellowships': 'fellowship',
      'Grants': 'grant',
      'Funds': 'grant',
      'Internships': 'internship',
      'Programs': 'program',
      'Competitions': 'competition',
      'Research': 'program',
      'Professional Development': 'program'
    }
    return map[label] || 'program'
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        country: formData.country,
        deadline: formData.deadline || undefined,
        external_url: formData.applicationUrl || undefined,
        contact_email: formData.contactEmail || undefined,
        is_urgent: !!formData.isUrgent
      }

      if (formData.type === 'job') {
        const normalizedJobType = normalizeJobType(formData.jobType)
        const normalizedWork = normalizeWorkType(formData.workType)
        const experience_level = deriveExperienceLevel(formData.experience)
        if (!normalizedJobType || !normalizedWork) {
          alert('Please select valid Job Type and Work Type')
          return
        }
        // Process salary based on type (fixed or range)
        let salary_min
        let salary_max
        if (formData.salaryType === 'fixed') {
          salary_min = formData.salaryMin ? parseInt(formData.salaryMin) : undefined
          salary_max = formData.salaryMin ? parseInt(formData.salaryMin) : undefined
        } else if (formData.salaryType === 'range') {
          salary_min = formData.salaryMin ? parseInt(formData.salaryMin) : undefined
          salary_max = formData.salaryMax ? parseInt(formData.salaryMax) : undefined
        }
        // Submit with multipart form data to support logo upload
        const fd = new FormData()
        const jobBody = {
          ...payload,
          company: formData.company,
          job_type: normalizedJobType,
          work_type: normalizedWork,
          experience_level,
          experience_years: formData.experience ? parseInt(formData.experience) : undefined,
          industry: formData.industry === 'Other' ? formData.customIndustry : formData.industry,
          salary_min,
          salary_max,
          currency: formData.currency || 'USD',
          application_deadline: formData.deadline || undefined,
          posted_by: 'individual',
          country: formData.country || 'Global',
        }
        Object.entries(jobBody).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, String(v))
        })
        ;(formData.benefits ? formData.benefits.split(',').map(s => s.trim()).filter(Boolean) : []).forEach(b => fd.append('benefits[]', b))
        ;(formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []).forEach(s => fd.append('skills[]', s))
        ;(Array.isArray(formData.tags) ? formData.tags : (formData.tags || '').split(',').map(s => s.trim()).filter(Boolean)).forEach(t => fd.append('tags[]', t))
        if (formData.companyLogo instanceof File) fd.append('companyLogo', formData.companyLogo)

        const url = editItem ? `http://localhost:8000/api/jobs/${editItem.id}` : 'http://localhost:8000/api/jobs'
        const method = editItem ? 'PUT' : 'POST'
        
        await fetch(url, {
          method,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}` },
          body: fd
        }).then(async r => { if (!r.ok) throw new Error((await r.json()).message || `Failed to ${editItem ? 'update' : 'create'} job`); return r.json() })
      } else if (formData.type === 'tender') {
        if (!payload.location) {
          alert('City/Town is required for tenders')
          return
        }
        const fd2 = new FormData()
        // Process contract value based on type (fixed or range)
        let contract_value_min
        let contract_value_max
        if (formData.salaryType === 'fixed') {
          contract_value_min = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
          contract_value_max = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
        } else if (formData.salaryType === 'range') {
          contract_value_min = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
          contract_value_max = formData.salaryMax ? parseFloat(formData.salaryMax) : undefined
        }

        const tenderBody = {
          ...payload,
          organization: formData.organization,
          contract_value_min,
          contract_value_max,
          sector: formData.sector === 'Other' ? formData.customSector : formData.sector,
          category: 'general',
          submission_type: 'electronic',
          duration: formData.experience || undefined,
          price: formData.price || 'Free',
          currency: formData.currency || 'USD',
          external_url: formData.applicationUrl || undefined,
          contact_email: formData.contactEmail || undefined,
          contact_phone: formData.contactPhone || undefined
        }
        Object.entries(tenderBody).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd2.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
        })
        ;(Array.isArray(formData.tags) ? formData.tags : (formData.tags || '').split(',').map(s => s.trim()).filter(Boolean)).forEach(t => fd2.append('tags[]', t))
        ;(formData.requirements ? formData.requirements.split('\n').filter(Boolean) : []).forEach(r => fd2.append('requirements[]', r))
        ;(formData.projectScope ? formData.projectScope.split('\n').filter(Boolean) : []).forEach(s => fd2.append('project_scope[]', s))
        ;(formData.technicalRequirements ? formData.technicalRequirements.split('\n').filter(Boolean) : []).forEach(t => fd2.append('technical_requirements[]', t))
        ;(formData.submissionProcess ? formData.submissionProcess.split('\n').filter(Boolean) : []).forEach(sp => fd2.append('submission_process[]', sp))
        ;(formData.evaluationCriteria ? formData.evaluationCriteria.split('\n').filter(Boolean) : []).forEach(ec => fd2.append('evaluation_criteria[]', ec))
        if (formData.coverImage instanceof File) fd2.append('coverImage', formData.coverImage)
        if (typeof formData.coverImage === 'string' && formData.coverImage) fd2.append('cover_image', formData.coverImage)
        ;(formData.documents || []).forEach(doc => {
          if (doc instanceof File) fd2.append('documents', doc)
          else if (typeof doc === 'string') fd2.append('documents[]', doc)
        })

        const tenderUrl = editItem ? `http://localhost:8000/api/tenders/${editItem.id}` : 'http://localhost:8000/api/tenders'
        const tenderMethod = editItem ? 'PUT' : 'POST'
        await fetch(tenderUrl, {
          method: tenderMethod,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}` },
          body: fd2
        }).then(async r => { if (!r.ok) throw new Error((await r.json()).message || 'Failed to create tender'); return r.json() })
      } else if (formData.type === 'opportunity') {
        // multipart so we can upload cover + organization logo
        const fd3 = new FormData()
        
        // Process amount based on type (fixed or range) for opportunities
        let amount_min
        let amount_max
        if (formData.salaryType === 'fixed') {
          amount_min = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
          amount_max = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
        } else if (formData.salaryType === 'range') {
          amount_min = formData.salaryMin ? parseFloat(formData.salaryMin) : undefined
          amount_max = formData.salaryMax ? parseFloat(formData.salaryMax) : undefined
        }
        
        const oppBody = {
          ...payload,
          organization: formData.organization,
          type: formData.opportunityType, // Store display value directly
          category: 'general',
          benefits: formData.benefits ? formData.benefits.split(',').map(s => s.trim()).filter(Boolean) : [],
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          duration: formData.experience || undefined,
          currency: formData.currency || 'USD',
          amount_min: amount_min,
          amount_max: amount_max,
          // price is admin-only via onClose
          price: onClose ? (formData.price || undefined) : undefined
        }
        Object.entries(oppBody).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd3.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
        })
        ;(Array.isArray(formData.tags) ? formData.tags : (formData.tags || '').split(',').map(s => s.trim()).filter(Boolean)).forEach(t => fd3.append('tags[]', t))
        if (formData.organizationLogo instanceof File) fd3.append('organizationLogo', formData.organizationLogo)
        if (formData.coverImage instanceof File) fd3.append('coverImage', formData.coverImage)
        if (typeof formData.coverImage === 'string' && formData.coverImage) fd3.append('cover_image', formData.coverImage)

        const oppUrl = editItem ? `http://localhost:8000/api/opportunities/${editItem.id}` : 'http://localhost:8000/api/opportunities'
        const oppMethod = editItem ? 'PUT' : 'POST'
        await fetch(oppUrl, {
          method: oppMethod,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}` },
          body: fd3
        }).then(async r => { if (!r.ok) throw new Error((await r.json()).message || 'Failed to create opportunity'); return r.json() })
      }

      // Show success message
      alert(editItem ? 'Job updated successfully!' : 'Job created successfully!')
      
      if (onClose) {
        onClose()
      } else if (navigate) {
        navigate('/jobs')
      }
    } catch (error) {
      console.error('Post submit failed:', error)
      const message = error?.response?.data?.message || error?.message || 'Failed to submit. Please try again.'
      alert(message)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...fileArray]
    }))
  }

  const handleCoverUpload = (file) => {
    if (!file) return
    setFormData(prev => ({
      ...prev,
      coverImage: file
    }))
  }

  const removeDocument = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
  }

  const handleAddTag = () => {
    if (formData.customTag && formData.customTag.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        tags: [...(Array.isArray(prev.tags) ? prev.tags : (prev.tags || '').split(',').filter(t => t.trim())), prev.customTag.trim()],
        customTag: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: (Array.isArray(prev.tags) ? prev.tags : (prev.tags || '').split(',').filter(t => t.trim())).filter(tag => tag !== tagToRemove)
    }))
  }

  const typeOptions = [
    { value: 'job', label: 'Job', icon: Briefcase, color: '#16a34a' },
    { value: 'tender', label: 'Tender', icon: FileText, color: '#dc2626' },
    { value: 'opportunity', label: 'Opportunity', icon: GraduationCap, color: '#3b82f6' }
  ]

  return (
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
        width: screenSize.isMobile ? '100%' : 'min(500px, 90vw)',
        maxHeight: screenSize.isMobile ? '80vh' : '85vh',
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
            {editItem ? `Edit ${editItem.type.charAt(0).toUpperCase() + editItem.type.slice(1)}` : 'Create New Post'}
          </h2>
          
          {screenSize.isMobile && (
            <button
              onClick={handleBackClick}
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
          )}

          {!screenSize.isMobile && (
            <button
              onClick={handleBackClick}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <X size={20} color="#64748b" />
            </button>
          )}
        </div>

        {/* Form Content */}
        <div style={{
          padding: screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px',
          flex: 1
        }}>
          <form onSubmit={handleFormSubmit} style={{
            maxWidth: screenSize.isMobile ? '100%' : '420px',
            margin: '0 auto'
          }}>
            {/* Type Selection Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
                display: 'block'
              }}>
                Post Type *
              </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  disabled={!!editItem}
                  style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: editItem ? '#f9fafb' : 'white',
                  color: editItem ? '#6b7280' : '#374151',
                  boxSizing: 'border-box',
                  cursor: editItem ? 'not-allowed' : 'pointer'
                }}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={`Enter ${formData.type} title...`}
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

            {/* Dynamic Fields Based on Type */}
            {formData.type === 'job' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
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
                      Job Type *
                    </label>
                    <select
                      required
                      value={formData.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
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
                      <option value="">Select job type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
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
                      Work Type *
                    </label>
                    <select
                      required
                      value={formData.workType}
                      onChange={(e) => handleInputChange('workType', e.target.value)}
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
                      <option value="">Select work type</option>
                      <option value="remote">Remote</option>
                      <option value="on-site">On-site</option>
                      <option value="hybrid">Hybrid</option>
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
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 3"
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
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

                <div style={{ marginBottom: '16px' }}>
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
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
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
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Media">Media</option>
                    <option value="Government">Government</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Construction">Construction</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Energy">Energy</option>
                    <option value="Defense">Defense</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Mining">Mining</option>
                    <option value="Security">Security</option>
                    <option value="Environment">Environment</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Aviation">Aviation</option>
                    <option value="Maritime/Shipping">Maritime/Shipping</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Travel">Travel</option>
                    <option value="Sports">Sports</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Custom Industry Input - shown when "Other" is selected */}
                {formData.industry === 'Other' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Specify Industry *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customIndustry}
                      onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                      placeholder="e.g., Agriculture, Mining, Aerospace..."
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

                {/* City/Town field - show for jobs unless explicitly Remote, and for tenders */}
                {(((formData.type === 'job' && formData.workType !== 'Remote') || 
                  (formData.type === 'tender'))) && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      City/Town{formData.type === 'job' ? ' *' : ''}
                    </label>
                    <input
                      type="text"
                      required={formData.type === 'job'}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder={
                        formData.type === 'job' 
                          ? "e.g., New York, NY" 
                          : "Enter city/town..."
                      }
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

                {/* Country field */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
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
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency selection */}
                {(formData.type === 'job' || formData.type === 'tender') && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
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
                    {['TZS','KES','UGX','RWF','BIF','SSP','ETB','SOS','ZAR','ZMW','NGN','USD','EUR','GBP'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  </div>
                )}
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Salary Type *
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="salaryType"
                        value="fixed"
                        checked={formData.salaryType === 'fixed'}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Fixed Salary
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="salaryType"
                        value="range"
                        checked={formData.salaryType === 'range'}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Salary Range
                    </label>
                  </div>
                  
                  {formData.salaryType === 'fixed' ? (
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Fixed Salary Amount
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMin || ''}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="e.g., 80000"
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Minimum Salary
                        </label>
                        <input
                          type="number"
                          value={formData.salaryMin || ''}
                          onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                          placeholder="e.g., 80000"
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
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Maximum Salary
                        </label>
                        <input
                          type="number"
                          value={formData.salaryMax || ''}
                          onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                          placeholder="e.g., 120000"
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
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Job Overview *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={`Describe the ${formData.type} requirements and details...`}
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Skills Required *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="e.g., React, Node.js, TypeScript (comma separated)"
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Benefits
                  </label>
                  <input
                    type="text"
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    placeholder="e.g., Health Insurance, Remote Work, 401k (comma separated)"
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Application URL
                  </label>
                  <input
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                    placeholder="https://company.com/careers/apply"
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

            {formData.type === 'tender' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="e.g., City of San Francisco, State Department..."
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Sector *
                  </label>
                  <select
                    required
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select sector</option>
                    <option value="construction">Construction</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="government">Government</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="logistics">Logistics</option>
                    <option value="energy">Energy</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="transportation">Transportation</option>
                    <option value="utilities">Utilities</option>
                    <option value="consulting">Consulting</option>
                    <option value="media">Media</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="legal">Legal</option>
                    <option value="non_profit">Non-Profit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Custom Sector Input - shown when "Other" is selected */}
                {formData.sector === 'Other' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Specify Sector *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customSector}
                      onChange={(e) => handleInputChange('customSector', e.target.value)}
                      placeholder="e.g., Aerospace, Defense, etc."
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

                {/* Country - Tender specific */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
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
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Location - Tender specific (City/Town) */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    City/Town
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter city/town..."
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

                {/* Duration */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Duration (Project Timeline)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
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
                    <option value="">Select duration</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="1.5 years">1.5 years</option>
                    <option value="2 years">2 years</option>
                    <option value="3 years">3 years</option>
                    <option value="5 years">5 years</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>

                {/* Submission Deadline */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Submission Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
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

                {/* Application URL */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Application URL
                  </label>
                  <input
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                    placeholder="https://procurement.gov/tender/123"
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

                {/* Contact Email */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="procurement@organization.gov"
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

                {/* Contact Phone */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+255 123 456 789"
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
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Contract Value Type *
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="salaryType"
                        value="fixed"
                        checked={formData.salaryType === 'fixed'}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Fixed Value
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="salaryType"
                        value="range"
                        checked={formData.salaryType === 'range'}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Value Range
                    </label>
                  </div>
                  
                  {formData.salaryType === 'fixed' ? (
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Fixed Contract Value
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMin || ''}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="e.g., 2500000"
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Minimum Value
                        </label>
                        <input
                          type="number"
                          value={formData.salaryMin || ''}
                          onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                          placeholder="e.g., 2500000"
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
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Maximum Value
                        </label>
                        <input
                          type="number"
                          value={formData.salaryMax || ''}
                          onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                          placeholder="e.g., 5200000"
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
                </div>

                {/* Currency */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
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
                    {['TZS','KES','UGX','RWF','BIF','SSP','ETB','SOS','ZAR','ZMW','NGN','USD','EUR','GBP'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Tender Overview */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Tender Overview *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the tender, its objectives, and what contractors can expect..."
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

                {/* Requirements */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Requirements *
                  </label>
                  <textarea
                    required
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="List key requirements, qualifications, and criteria..."
                    rows={3}
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

                {/* Evaluation Criteria */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Evaluation Criteria
                  </label>
                  <textarea
                    value={formData.evaluationCriteria}
                    onChange={(e) => handleInputChange('evaluationCriteria', e.target.value)}
                    placeholder={'e.g.\nTechnical proposal 40%\nFinancial proposal 40%\nExperience 20%'}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submission Process */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Submission Process
                  </label>
                  <textarea
                    value={formData.submissionProcess}
                    onChange={(e) => handleInputChange('submissionProcess', e.target.value)}
                    placeholder={'e.g.\nRegister on portal\nUpload documents\nSubmit before deadline'}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Mark as urgent - Tender specific */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id="isUrgentTender"
                      checked={!!formData.isUrgent}
                      onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <label htmlFor="isUrgentTender" style={{ fontSize: '14px', color: '#374151' }}>
                      Mark as urgent
                    </label>
                  </div>
                </div>

                {/* Tags - Tender specific */}
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
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={formData.customTag || ''}
                      onChange={(e) => handleInputChange('customTag', e.target.value)}
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
                          e.preventDefault();
                          if (formData.customTag && formData.customTag.trim()) {
                            const newTags = [...(formData.tags || []), formData.customTag.trim()];
                            handleInputChange('tags', newTags);
                            handleInputChange('customTag', '');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.customTag && formData.customTag.trim()) {
                          const newTags = [...(formData.tags || []), formData.customTag.trim()];
                          handleInputChange('tags', newTags);
                          handleInputChange('customTag', '');
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags && (Array.isArray(formData.tags) ? formData.tags.length > 0 : formData.tags.trim()) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',')).filter(t => t.trim()).map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: '#e2e8f0',
                            color: '#374151',
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = formData.tags.filter((_, i) => i !== index);
                              handleInputChange('tags', newTags);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              fontSize: '12px',
                              padding: '0',
                              marginLeft: '4px'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {formData.type === 'opportunity' && (
              <>
                {/* Organization */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="e.g., Google, NASA, United Nations..."
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

                {/* Opportunity Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Opportunity Type *
                  </label>
                  <select
                    required
                    value={formData.opportunityType}
                    onChange={(e) => handleInputChange('opportunityType', e.target.value)}
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
                    <option value="Scholarships">Scholarships</option>
                    <option value="Fellowships">Fellowships</option>
                    <option value="Funds">Funds</option>
                    <option value="Grants">Grants</option>
                    <option value="Internships">Internships</option>
                    <option value="Programs">Programs</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Research">Research</option>
                    <option value="Professional Development">Professional Development</option>
                  </select>
                </div>

                {/* Location */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
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
                    <option value="">Select Location</option>
                    <option value="Global">Global</option>
                    <option value="Online">Online</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                {/* Contact Email */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="opportunities@organization.com"
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

                {/* Application URL */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Application URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.applicationUrl}
                    onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                    placeholder="https://organization.com/apply"
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

                {/* Application Duration */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Application Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
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
                    <option value="">Select duration</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="4 months">4 months</option>
                    <option value="5 months">5 months</option>
                    <option value="6 months">6 months</option>
                    <option value="7 months">7 months</option>
                    <option value="8 months">8 months</option>
                    <option value="9 months">9 months</option>
                    <option value="10 months">10 months</option>
                    <option value="11 months">11 months</option>
                    <option value="1 year">1 year</option>
                    <option value="1.5 years">1.5 years</option>
                    <option value="2 years">2 years</option>
                    <option value="2.5 years">2.5 years</option>
                    <option value="3 years">3 years</option>
                    <option value="4 years">4 years</option>
                    <option value="5 years">5 years</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>

                {/* Application Deadline */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
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

                {/* Stipend/Amount Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Stipend/Amount Type *
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="salaryType"
                        value="fixed"
                        checked={formData.salaryType === 'fixed'}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Fixed Amount
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="salaryType"
                        value="range"
                        checked={formData.salaryType === 'range'}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Amount Range
                    </label>
                  </div>
                  
                  {formData.salaryType === 'fixed' ? (
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Fixed Amount
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMin || ''}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="e.g., 50000"
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Minimum Amount
                        </label>
                        <input
                          type="number"
                          value={formData.salaryMin || ''}
                          onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                          placeholder="e.g., 50000"
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
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Maximum Amount
                        </label>
                        <input
                          type="number"
                          value={formData.salaryMax || ''}
                          onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                          placeholder="e.g., 100000"
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
                </div>

                {/* Currency */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
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
                    {['TZS','KES','UGX','RWF','BIF','SSP','ETB','SOS','ZAR','ZMW','NGN','USD','EUR','GBP'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Overview */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Overview *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the opportunity, its purpose, and what participants can expect..."
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

                {/* Eligibility & Requirements */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Eligibility & Requirements *
                  </label>
                  <textarea
                    required
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Describe eligibility criteria, requirements, and qualifications..."
                    rows={3}
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

                {/* Benefits & Value */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Benefits & Value
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    placeholder="Describe the benefits, value, and what participants will gain from this opportunity..."
                    rows={3}
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
              </>
            )}

            {/* Cover Image (opportunities only) */}
            {formData.type === 'opportunity' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Cover Image
                </label>
                <div style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease-in-out',
                  backgroundColor: '#fafafa'
                }}
                onClick={() => document.getElementById('opportunity-cover-upload').click()}
                onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Click to upload cover image
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Only images are allowed (Max 5MB)
                  </div>
                </div>
                <input
                  id="opportunity-cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e, 'coverImage')}
                  style={{ display: 'none' }}
                />
                {formData.coverImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <img src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : (formData.coverImage || '')} alt="cover image" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#374151' }}>{formData.coverImage instanceof File ? formData.coverImage.name : 'Cover Image'}</div>
                  </div>
                )}
              </div>
            )}


            {/* Common Fields */}

            {/* Company Logo upload (jobs only) */}
            {formData.type === 'job' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  {formData.type === 'job' ? 'Company Logo' : 'Organization Logo'} (PNG/JPG)
                </label>
                <div
                  onClick={() => document.getElementById(formData.type === 'job' ? 'company-logo-upload' : 'org-logo-upload').click()}
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <Upload size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '13px', color: '#374151' }}>
                    Click to upload company logo
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Only images are allowed (Max 5MB)
                  </div>
                </div>
                <input
                  id="company-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e, 'companyLogo')}
                  style={{ display: 'none' }}
                />
                {formData.companyLogo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <img 
                      src={formData.companyLogo instanceof File ? URL.createObjectURL(formData.companyLogo) : formData.companyLogo} 
                      alt="company logo" 
                      style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                    <div style={{ fontSize: '12px', color: '#374151' }}>
                      {formData.companyLogo instanceof File ? formData.companyLogo.name : 'Current logo'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cover Image (tenders only) */}
            {formData.type === 'tender' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Cover Image
                </label>
                <div style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease-in-out',
                  backgroundColor: '#fafafa'
                }}
                onClick={() => document.getElementById('cover-image-upload').click()}
                onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Click to upload cover image
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Only images are allowed (Max 5MB)
                  </div>
                </div>
                <input
                  id="cover-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e, 'coverImage')}
                  style={{ display: 'none' }}
                />
                {formData.coverImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <img src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : (formData.coverImage || '')} alt="cover image" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#374151' }}>{formData.coverImage instanceof File ? formData.coverImage.name : 'Cover Image'}</div>
                  </div>
                )}
              </div>
            )}


            {/* Urgent flag (jobs only - tender has its own) */}
            {formData.type === 'job' && (
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="isUrgent"
                  type="checkbox"
                  checked={!!formData.isUrgent}
                  onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="isUrgent" style={{ fontSize: '14px', color: '#374151' }}>
                  Mark as urgent
                </label>
              </div>
            )}




            {/* Tags Section (jobs and opportunities only - tender has its own) */}
            {formData.type !== 'tender' && (
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
                  value={formData.customTag || ''}
                  onChange={(e) => handleInputChange('customTag', e.target.value)}
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
              {formData.tags && (Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',')).filter(t => t.trim()).length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {(Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',')).filter(t => t.trim()).map((tag, index) => (
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
            )}


            {/* Document Upload Section: tenders only */}
            {formData.type === 'tender' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
                display: 'block'
              }}>
                Supporting Documents
                {' (Recommended)'}
              </label>
              
              {/* Upload Area */}
              <div
                onClick={() => document.getElementById('file-upload').click()}
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease-in-out',
                  marginBottom: formData.documents.length > 0 ? '12px' : '0'
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
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  handleFileUpload(e.dataTransfer.files)
                }}
              >
                <Upload size={24} color="#6b7280" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  Click to upload or drag and drop
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  PDF, DOC, DOCX, XLS, XLSX (Max 10MB each)
                </div>
              </div>

              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />

              {/* Uploaded Documents List */}
              {formData.documents.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  {formData.documents.map(doc => (
                    <div
                      key={doc.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        marginBottom: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <FileText size={16} color="#6b7280" style={{ marginRight: '8px' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Form Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={handleBackClick}
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
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {editItem ? 'Update' : `Post ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Post