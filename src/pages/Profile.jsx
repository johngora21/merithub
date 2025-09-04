import React, { useState, useEffect } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import { User, Edit3, Upload, Download, Eye, MapPin, Calendar, Mail, Phone, Globe, Briefcase, GraduationCap, Award, FileText, Save, X } from 'lucide-react'
import { apiService } from '../lib/api-service'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const screenSize = useResponsive()
  const { user, updateProfile, checkAuthStatus } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const tabs = [
    { id: 'personal', name: 'Personal' },
    { id: 'education', name: 'Education' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'experience', name: 'Experience' },
    { id: 'skills', name: 'Skills' },
    { id: 'documents', name: 'Documents' }
  ]

  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    joinDate: '',
    jobTitle: '',
    industry: '',
    yearsExperience: '',
    employmentStatus: '',
    maritalStatus: '',
    nationality: '',
    countryOfResidence: '',
    dateOfBirth: '',
    gender: '',
    disabilityStatus: '',
    languages: '',
    linkedinProfile: '',
    profileLink1: { name: '', url: '' },
    profileLink2: { name: '', url: '' },
    profileLink3: { name: '', url: '' },
    profileImage: ''
  })

  const [experience, setExperience] = useState([])

  const [education, setEducation] = useState([])

  const [certificates, setCertificates] = useState([])

  const [skills, setSkills] = useState([])

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProfileData()
  }, [])

  // Watch for changes in user data and refresh profile data
  useEffect(() => {
    if (user) {
      setProfileData(transformProfileData(user))
      setExperience(transformExperienceData(user.experience || []))
      setEducation(transformEducationData(user.education || []))
      setCertificates(transformCertificatesData(user.certificates || []))
      setSkills(transformSkillsData(user.skills || []))
      setDocuments(transformDocumentsData(user.documents || []))
    }
  }, [user])

  const transformProfileData = (apiProfile) => {
    return {
      name: `${apiProfile.first_name || ''} ${apiProfile.last_name || ''}`.trim() || '',
      username: apiProfile.username || '',
      email: apiProfile.email || '',
      phone: apiProfile.phone || '',
      location: apiProfile.location || '',
      website: apiProfile.website || '',
      bio: apiProfile.bio || '',
      joinDate: apiProfile.created_at ? new Date(apiProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
      jobTitle: apiProfile.current_job_title || '',
      industry: apiProfile.industry || '',
      yearsExperience: apiProfile.years_experience || '',
      employmentStatus: apiProfile.employment_status || '',
      maritalStatus: apiProfile.marital_status || '',
      nationality: apiProfile.nationality || '',
      countryOfResidence: apiProfile.country_of_residence || '',
      dateOfBirth: apiProfile.date_of_birth || '',
      gender: apiProfile.gender || '',
      disabilityStatus: apiProfile.disability_status || '',
      languages: apiProfile.languages || '',
      linkedinProfile: apiProfile.linkedin_url || '',
      profileLink1: { 
        name: apiProfile.profile_link1_name || '', 
        url: apiProfile.profile_link1_url || '' 
      },
      profileLink2: { 
        name: apiProfile.profile_link2_name || '', 
        url: apiProfile.profile_link2_url || '' 
      },
      profileLink3: { 
        name: apiProfile.profile_link3_name || '', 
        url: apiProfile.profile_link3_url || '' 
      },
      profileImage: apiProfile.profile_image || ''
    }
  }

  const transformExperienceData = (apiExperience) => {
    console.log('Raw experience data from API:', apiExperience)
    return apiExperience.map(exp => {
      const transformed = {
      id: exp.id,
        title: exp.title || exp.job_title || '',
        company: exp.company || exp.organization || '',
      location: exp.location || '',
      period: exp.start_date && exp.end_date 
        ? `${new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${exp.end_date === 'present' ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
          : exp.period || '',
        type: exp.employment_type || exp.type || '',
      description: exp.description || ''
      }
      console.log('Transformed experience item:', transformed)
      return transformed
    })
  }

  const transformEducationData = (apiEducation) => {
    console.log('Raw education data from API:', apiEducation)
    return apiEducation.map(edu => {
      const transformed = {
      id: edu.id,
        level: edu.level || edu.degree_level || '',
        program: edu.field_of_study || edu.program || '',
        school: edu.institution || edu.school || '',
      location: edu.location || '',
      period: edu.start_date && edu.end_date 
        ? `${new Date(edu.start_date).getFullYear()} - ${new Date(edu.end_date).getFullYear()}`
          : edu.period || '',
        gpa: edu.gpa || ''
      }
      console.log('Education item - Raw:', edu, 'Transformed:', transformed)
      return transformed
    })
  }

  const transformCertificatesData = (apiCertificates) => {
    console.log('Transforming certificates data:', apiCertificates)
    return apiCertificates.map(cert => {
      const transformed = {
      id: cert.id,
      name: cert.name || '',
      issuer: cert.issuing_organization || '',
      issueDate: cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
      expiryDate: cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null,
      credentialId: cert.credential_id || '',
      type: cert.certificate_type || '',
      certificateFile: cert.certificate_file
      }
      console.log('Transformed certificate:', transformed)
      return transformed
    })
  }

  const transformSkillsData = (apiSkills) => {
    console.log('Transforming skills data:', apiSkills)
    return apiSkills.map(skill => ({
      id: skill.id,
      name: skill.name || '',
      level: skill.level || '',
      category: skill.category || '',
      description: skill.description || ''
    }))
  }

  const transformDocumentsData = (apiDocuments) => {
    return apiDocuments.map(doc => ({
      id: doc.id,
      name: doc.name || '',
      type: doc.document_type || '',
      category: doc.category || '',
      file: doc.file_path,
      size: doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : '',
      updated: doc.updated_at ? new Date(doc.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      status: doc.status || '',
      description: doc.description || ''
    }))
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/auth/profile')
      const profile = response.data?.user || response.user
      
      console.log('Full profile response:', response)
      console.log('Profile data:', profile)
      console.log('Education data:', profile?.education)
      console.log('Experience data:', profile?.experience)
      
      if (profile) {
        console.log('Raw profile data from API:', profile)
        console.log('Employment status from API:', profile.employment_status)
        const transformedData = transformProfileData(profile)
        console.log('Transformed profile data:', transformedData)
        console.log('Transformed employment status:', transformedData.employmentStatus)
        setProfileData(transformedData)
        setExperience(transformExperienceData(profile.experience || []))
        setEducation(transformEducationData(profile.education || []))
        setCertificates(transformCertificatesData(profile.certificates || []))
        setSkills(transformSkillsData(profile.skills || []))
        setDocuments(transformDocumentsData(profile.documents || []))
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Keep existing static data as fallback
    } finally {
      setLoading(false)
    }
  }

  const [editData, setEditData] = useState({
    personal: profileData,
    experience: experience,
    education: education,
    certificates: certificates,
    skills: skills,
    documents: documents
  })

  const openEditModal = () => {
    setEditData({
      personal: {...profileData},
      experience: [...experience],
      education: [...education],
      certificates: [...certificates],
      skills: [...skills],
      documents: [...documents]
    })
    setShowEditModal(true)
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      // Helper function to validate and format date
      const formatDate = (dateString) => {
        if (!dateString || dateString === '') return null;
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return null;
          return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } catch (error) {
          return null;
        }
      };

      // Helper function to validate enum values
      const validateEnum = (value, allowedValues) => {
        if (!value || value === '') return null;
        return allowedValues.includes(value) ? value : null;
      };

      // Prepare data for backend with proper field mapping and validation
      const profileUpdateData = {
        // Basic fields
        first_name: editData.personal.name.split(' ')[0] || '',
        last_name: editData.personal.name.split(' ').slice(1).join(' ') || '',
        username: editData.personal.username,
        email: editData.personal.email,
        phone: editData.personal.phone,
        location: editData.personal.location,
        bio: editData.personal.bio,
        
        // Job-related fields
        current_job_title: editData.personal.jobTitle || null,
        industry: editData.personal.industry || null,
        years_experience: editData.personal.yearsExperience || null,
        employment_status: editData.personal.employmentStatus ? editData.personal.employmentStatus.toLowerCase() : null,
        
        // Personal information fields
        marital_status: editData.personal.maritalStatus || null,
        nationality: editData.personal.nationality || null,
        country_of_residence: editData.personal.countryOfResidence || null,
        date_of_birth: formatDate(editData.personal.dateOfBirth),
        gender: editData.personal.gender || null,
        disability_status: editData.personal.disabilityStatus || null,
        languages: editData.personal.languages || null,
        
        // Profile links
        linkedin_url: editData.personal.linkedinProfile || null,
        profile_link1_name: editData.personal.profileLink1.name || null,
        profile_link1_url: editData.personal.profileLink1.url || null,
        profile_link2_name: editData.personal.profileLink2.name || null,
        profile_link2_url: editData.personal.profileLink2.url || null,
        profile_link3_name: editData.personal.profileLink3.name || null,
        profile_link3_url: editData.personal.profileLink3.url || null,
        
        // Complex data fields
        education: editData.education,
        certificates: editData.certificates.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuing_organization: cert.issuer,
          issue_date: cert.issueDate,
          expiry_date: cert.expiryDate,
          credential_id: cert.credentialId,
          certificate_type: cert.type,
          certificate_file: cert.certificateFile
        })),
        experience: editData.experience,
        skills: editData.skills.map(skill => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category,
          description: skill.description
        })),
        documents: editData.documents
      }

      // Remove null/undefined values to avoid database issues
      Object.keys(profileUpdateData).forEach(key => {
        if (profileUpdateData[key] === null || profileUpdateData[key] === undefined || profileUpdateData[key] === '') {
          delete profileUpdateData[key];
        }
      });
      
      // Save to backend first
      console.log('Sending profile update data:', profileUpdateData)
      console.log('Certificate data being sent:', profileUpdateData.certificates)
      const result = await updateProfile(profileUpdateData)
      if (result.success) {
        console.log('Profile update successful, refreshing data...')
        // Only update local state if backend save was successful
    setProfileData({...editData.personal})
    setExperience([...editData.experience])
    setEducation([...editData.education])
    setCertificates([...editData.certificates])
    setSkills([...editData.skills])
    setDocuments([...editData.documents])
        
        // Refresh user data in AuthContext
        await checkAuthStatus()
        
        // Fetch fresh profile data to ensure we have the latest from backend
        await fetchProfileData()
        
    setShowEditModal(false)
        console.log('Profile updated successfully')
      } else {
        console.error('Failed to update profile:', result.message)
        alert('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // immediate preview
    const localUrl = URL.createObjectURL(file)
    setProfileData(prev => ({
      ...prev,
      profileImage: localUrl
    }))

    setUploadingImage(true)
    try {
      const result = await apiService.uploadProfileImage(file)
      const img = result?.profile_image || result?.file_url || result?.data?.profile_image || result?.data?.file_url
      const { resolveAssetUrl } = await import('../lib/api-service')
      setProfileData(prev => ({
        ...prev,
        profileImage: resolveAssetUrl(img)
      }))
      if (typeof checkAuthStatus === 'function') {
        await checkAuthStatus()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error?.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: '16px 12px 90px 12px'
      }}>
        
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px 12px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          position: 'relative'
        }}>
          {/* Edit Button */}
          <button
            onClick={openEditModal}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'white',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              fontWeight: '500',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#16a34a'
              e.target.style.color = '#16a34a'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.color = '#64748b'
            }}
          >
            <Edit3 size={14} />
            Edit Profile
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px', 
            marginBottom: '10px' 
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '22px',
                backgroundColor: profileData.profileImage ? 'transparent' : '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                overflow: 'hidden'
              }}>
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage.startsWith('http') ? profileData.profileImage : `http://localhost:8000${profileData.profileImage}`}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  'U'
                )}
              </div>
              <button 
                onClick={() => document.getElementById('profile-image-upload').click()}
                disabled={uploadingImage}
                style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '16px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                  cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  opacity: uploadingImage ? 0.6 : 1
              }}>
                <Upload size={8} color={uploadingImage ? "#9ca3af" : "#64748b"} />
              </button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 1px 0'
              }}>
                {profileData.name}
              </h1>
              
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 2px 0'
              }}>
                @{profileData.username}
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#64748b',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <MapPin size={10} />
                  {profileData.location}
                </div>
                <span>•</span>
                {profileData.jobTitle && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '13px' }}>
                    <Briefcase size={10} />
                    {profileData.jobTitle}
                </div>
                )}

              </div>
            </div>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: '#374151',
            margin: '0 0 6px 0',
            lineHeight: '1.4',
            maxHeight: '60px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          }}>
            {profileData.bio}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Mail size={10} />
              {profileData.email}
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Phone size={10} />
              {profileData.phone}
            </div>
            {profileData.linkedinProfile && (
              <>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Globe size={10} />
                  <a 
                    href={profileData.linkedinProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#64748b', 
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#16a34a'}
                    onMouseLeave={(e) => e.target.style.color = '#64748b'}
                  >
                    LinkedIn
                  </a>
            </div>
              </>
            )}

          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: '0 0 8px 0'
            }}>
              Personal Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Full Name
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.name}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Username
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    @{profileData.username}
                  </p>
                </div>
              </div>
              

              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                    Email
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                    padding: '3px 0'
                }}>
                    {profileData.email}
                </p>
              </div>
              
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Phone
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.phone}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Employment Status
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.employmentStatus}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Industry
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.industry}
                  </p>
                </div>
                



              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px' 
              }}>
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                    Nationality
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                  padding: '3px 0'
                }}>
                    {profileData.nationality || ''}
                </p>
              </div>
              
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Country of Residence
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.countryOfResidence || ''}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Date of Birth
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.dateOfBirth || ''}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Gender
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.gender || ''}
                  </p>
              </div>
              
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Disability Status
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.disabilityStatus || ''}
                  </p>
                </div>
                
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                    Languages
                  </label>
                  <p style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '3px 0'
                  }}>
                    {profileData.languages || ''}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {profileData.profileLink1.name && profileData.profileLink1.url && (
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                      {profileData.profileLink1.name}
                </label>
                    <a 
                      href={profileData.profileLink1.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                  fontSize: '14px',
                        color: '#16a34a',
                        textDecoration: 'none',
                  margin: 0,
                  padding: '3px 0'
                      }}
                    >
                      {profileData.profileLink1.url}
                    </a>
                </div>
                )}
                
                {profileData.profileLink2.name && profileData.profileLink2.url && (
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    marginBottom: '2px',
                    display: 'block'
                  }}>
                      {profileData.profileLink2.name}
                  </label>
                    <a 
                      href={profileData.profileLink2.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                    fontSize: '14px',
                        color: '#16a34a',
                        textDecoration: 'none',
                    margin: 0,
                    padding: '3px 0'
                      }}
                    >
                      {profileData.profileLink2.url}
                    </a>
                </div>
                )}
              
                {profileData.profileLink3.name && profileData.profileLink3.url && (
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                      {profileData.profileLink3.name}
                </label>
                    <a 
                      href={profileData.profileLink3.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                  fontSize: '14px',
                        color: '#16a34a',
                        textDecoration: 'none',
                  margin: 0,
                  padding: '3px 0'
                      }}
                    >
                      {profileData.profileLink3.url}
                    </a>
                  </div>
                )}
                
                {!profileData.profileLink1.name && !profileData.profileLink2.name && !profileData.profileLink3.name && (
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    No profile links added
                  </p>
                )}
              </div>
              
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '2px',
                  display: 'block'
                }}>
                  Bio
                </label>
                <p style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                  margin: 0,
                  padding: '3px 0',
                  lineHeight: '1.3'
                }}>
                  {profileData.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {education.map((edu) => (
              <div key={edu.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <GraduationCap size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {edu.program}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: '#16a34a',
                      margin: '0 0 2px 0',
                      fontWeight: '500'
                    }}>
                      {edu.level}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {edu.school} • {edu.location}
                    </p>
                  </div>

                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  <span>{edu.period}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {console.log('Rendering certificates:', certificates)}
            {certificates.map((cert) => {
              console.log('Rendering certificate:', cert)
              return (
              <div key={cert.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Award size={16} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 1px 0'
                    }}>
                      {cert.name}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Issued by {cert.issuer}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: (() => {
                      if (!cert.expiryDate) return '#f0fdf4' // No expiry = active
                      const today = new Date()
                      const expiry = new Date(cert.expiryDate)
                      return expiry > today ? '#f0fdf4' : '#fef2f2' // Active or expired
                    })(),
                    color: (() => {
                      if (!cert.expiryDate) return '#16a34a' // No expiry = active
                      const today = new Date()
                      const expiry = new Date(cert.expiryDate)
                      return expiry > today ? '#16a34a' : '#ef4444' // Active or expired
                    })(),
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    {(() => {
                      if (!cert.expiryDate) return 'Active'
                      const today = new Date()
                      const expiry = new Date(cert.expiryDate)
                      return expiry > today ? 'Active' : 'Expired'
                    })()}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '6px'
                }}>
                  <span>Issued: {cert.issueDate}</span>
                  {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                  {!cert.expiryDate && <span>No Expiration</span>}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    fontWeight: '500'
                  }}>
                    {cert.type}
                  </span>
                  <span>ID: {cert.credentialId}</span>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Eye size={10} />
                    View Certificate
                  </button>
                  
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Download size={10} />
                    Download
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Briefcase size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    {exp.type}
                  </span>
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  {exp.period}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{
                  fontSize: '14px',
                  color: '#374151',
                  margin: 0,
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1
                  }}>
                    {exp.description && exp.description.length > 150 
                      ? `${exp.description.substring(0, 150)}...` 
                      : exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {skills.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748b',
                fontSize: '14px'
              }}>
                No skills added yet. Click "Edit Profile" to add your skills.
              </div>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Award size={16} color="#16a34a" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 2px 0'
                      }}>
                        {skill.name}
                      </h3>
                      {skill.category && (
                        <p style={{
                          fontSize: '12px',
                          color: '#16a34a',
                          margin: '0 0 2px 0',
                          fontWeight: '500'
                        }}>
                          {skill.category}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {skill.level && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <span style={{ fontWeight: '500' }}>Level:</span>
                      <span style={{
                        backgroundColor: '#f8fafc',
                        color: '#64748b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {skill.level}
                      </span>
                    </div>
                  )}
                  
                  {skill.description && (
                    <p style={{
                      fontSize: '13px',
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {skill.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: screenSize.isMobile ? '10px' : screenSize.isTablet ? '12px' : '16px'
          }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <FileText size={16} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 1px 0'
                    }}>
                      {doc.name}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: '#16a34a',
                      margin: '0 0 1px 0',
                      fontWeight: '500'
                    }}>
                      {doc.category}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {doc.type}
                    </p>
                  </div>
                </div>
                
                {doc.description && (
                  <p style={{
                    fontSize: '13px',
                    color: '#374151',
                    margin: '0 0 6px 0',
                    lineHeight: '1.3'
                  }}>
                    {doc.description}
                  </p>
                )}
                
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  <span>Updated {doc.updated}</span>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Eye size={10} />
                    View Document
                  </button>
                  
                  <button style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Download size={10} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPREHENSIVE EDIT MODAL */}
        {showEditModal && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000
              }}
              onClick={() => setShowEditModal(false)}
            />
            
            {/* Modal */}
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: screenSize.isDesktop ? '32px' : '24px',
              width: screenSize.isMobile ? '95%' : '90%',
              maxWidth: screenSize.isDesktop ? '900px' : '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 1001,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  Edit Profile
                </h2>
                
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#64748b" />
                </button>
              </div>
              
              {/* Personal Information Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0'
                }}>
                  Personal Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.personal.name}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, name: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={editData.personal.username}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, username: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Bio
                    </label>
                    <textarea
                      value={editData.personal.bio}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= 150) {
                          setEditData({
                        ...editData,
                            personal: {...editData.personal, bio: newValue}
                          });
                        }
                      }}
                      rows={3}
                      maxLength={150}
                      placeholder="Tell us about yourself in a few words..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <div style={{
                      fontSize: '11px',
                      color: editData.personal.bio.length >= 150 ? '#dc2626' : editData.personal.bio.length > 120 ? '#f59e0b' : '#64748b',
                      textAlign: 'right',
                      marginTop: '4px',
                      fontWeight: editData.personal.bio.length >= 150 ? '600' : 'normal'
                    }}>
                      {editData.personal.bio.length}/150 characters
                      {editData.personal.bio.length >= 150 && ' (Limit reached)'}
                    </div>
                  </div>
                  
                  <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editData.personal.email}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, email: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#64748b',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editData.personal.phone}
                        onChange={(e) => setEditData({
                          ...editData,
                          personal: {...editData.personal, phone: e.target.value}
                        })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>
                  
                                     <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Location
                       </label>
                       <input
                         type="text"
                         value={editData.personal.location}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, location: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                   </div>
                   
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                       Current Position
                     </label>
                     <input
                       type="text"
                       value={editData.personal.jobTitle}
                       placeholder="e.g. Senior Software Engineer at Google"
                       onChange={(e) => setEditData({
                         ...editData,
                         personal: {...editData.personal, jobTitle: e.target.value}
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                     </div>
                   </div>
                   
                   <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Industry
                       </label>
                       <select
                         value={editData.personal.industry}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, industry: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="Technology">Technology</option>
                         <option value="Healthcare">Healthcare</option>
                         <option value="Finance">Finance</option>
                         <option value="Education">Education</option>
                         <option value="Manufacturing">Manufacturing</option>
                         <option value="Retail">Retail</option>
                         <option value="Construction">Construction</option>
                         <option value="Transportation">Transportation</option>
                         <option value="Energy">Energy</option>
                         <option value="Media & Entertainment">Media & Entertainment</option>
                         <option value="Agriculture">Agriculture</option>
                         <option value="Real Estate">Real Estate</option>
                         <option value="Consulting">Consulting</option>
                         <option value="Government">Government</option>
                         <option value="Non-Profit">Non-Profit</option>
                         <option value="Other">Other</option>
                       </select>
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Years of Experience
                       </label>
                       <select
                         value={editData.personal.yearsExperience}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, yearsExperience: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="0-1 years">0-1 years</option>
                         <option value="1-3 years">1-3 years</option>
                         <option value="3-5 years">3-5 years</option>
                         <option value="5-10 years">5-10 years</option>
                         <option value="10+ years">10+ years</option>
                       </select>
                     </div>
                   </div>
                   
                   <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                       Employment Status
                     </label>
                     <select
                       value={editData.personal.employmentStatus}
                       onChange={(e) => setEditData({
                         ...editData,
                         personal: {...editData.personal, employmentStatus: e.target.value}
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                     >
                       <option value="Employed">Employed</option>
                       <option value="Unemployed">Unemployed</option>
                       <option value="Freelancer">Freelancer</option>
                       <option value="Student">Student</option>
                       <option value="Self-Employed">Self-Employed</option>
                       <option value="Retired">Retired</option>
                     </select>
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Marital Status
                       </label>
                       <select
                         value={editData.personal.maritalStatus || ''}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, maritalStatus: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="">Select marital status</option>
                         <option value="Single">Single</option>
                         <option value="Married">Married</option>
                         <option value="Divorced">Divorced</option>
                         <option value="Widowed">Widowed</option>
                         <option value="Prefer not to say">Prefer not to say</option>
                       </select>
                     </div>
                   </div>
                   
                   <div style={{ 
                display: 'grid', 
                gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                gap: '16px' 
              }}>
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Nationality
                       </label>
                       <select
                         value={editData.personal.nationality || ''}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, nationality: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none',
                           backgroundColor: 'white'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       >
                         <option value="">Select nationality</option>
                         <option value="Afghanistan">Afghanistan</option>
                         <option value="Albania">Albania</option>
                         <option value="Algeria">Algeria</option>
                         <option value="Argentina">Argentina</option>
                         <option value="Australia">Australia</option>
                         <option value="Austria">Austria</option>
                         <option value="Bangladesh">Bangladesh</option>
                         <option value="Belgium">Belgium</option>
                         <option value="Brazil">Brazil</option>
                         <option value="Canada">Canada</option>
                         <option value="China">China</option>
                         <option value="Denmark">Denmark</option>
                         <option value="Egypt">Egypt</option>
                         <option value="Ethiopia">Ethiopia</option>
                         <option value="Finland">Finland</option>
                         <option value="France">France</option>
                         <option value="Germany">Germany</option>
                         <option value="Ghana">Ghana</option>
                         <option value="India">India</option>
                         <option value="Indonesia">Indonesia</option>
                         <option value="Ireland">Ireland</option>
                         <option value="Italy">Italy</option>
                         <option value="Japan">Japan</option>
                         <option value="Kenya">Kenya</option>
                         <option value="Malaysia">Malaysia</option>
                         <option value="Mexico">Mexico</option>
                         <option value="Netherlands">Netherlands</option>
                         <option value="Nigeria">Nigeria</option>
                         <option value="Norway">Norway</option>
                         <option value="Pakistan">Pakistan</option>
                         <option value="Philippines">Philippines</option>
                         <option value="Poland">Poland</option>
                         <option value="Portugal">Portugal</option>
                         <option value="Russia">Russia</option>
                         <option value="Rwanda">Rwanda</option>
                         <option value="Singapore">Singapore</option>
                         <option value="South Africa">South Africa</option>
                         <option value="South Korea">South Korea</option>
                         <option value="Spain">Spain</option>
                         <option value="Sweden">Sweden</option>
                         <option value="Switzerland">Switzerland</option>
                         <option value="Tanzania">Tanzania</option>
                         <option value="Thailand">Thailand</option>
                         <option value="Turkey">Turkey</option>
                         <option value="Uganda">Uganda</option>
                         <option value="Ukraine">Ukraine</option>
                         <option value="United Arab Emirates">United Arab Emirates</option>
                         <option value="United Kingdom">United Kingdom</option>
                         <option value="United States">United States</option>
                         <option value="Vietnam">Vietnam</option>
                         <option value="Zambia">Zambia</option>
                         <option value="Zimbabwe">Zimbabwe</option>
                       </select>
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Country of Residence
                       </label>
                       <select
                         value={editData.personal.countryOfResidence || ''}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, countryOfResidence: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none',
                           backgroundColor: 'white'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       >
                         <option value="">Select country of residence</option>
                         <option value="Afghanistan">Afghanistan</option>
                         <option value="Albania">Albania</option>
                         <option value="Algeria">Algeria</option>
                         <option value="Argentina">Argentina</option>
                         <option value="Australia">Australia</option>
                         <option value="Austria">Austria</option>
                         <option value="Bangladesh">Bangladesh</option>
                         <option value="Belgium">Belgium</option>
                         <option value="Brazil">Brazil</option>
                         <option value="Canada">Canada</option>
                         <option value="China">China</option>
                         <option value="Denmark">Denmark</option>
                         <option value="Egypt">Egypt</option>
                         <option value="Ethiopia">Ethiopia</option>
                         <option value="Finland">Finland</option>
                         <option value="France">France</option>
                         <option value="Germany">Germany</option>
                         <option value="Ghana">Ghana</option>
                         <option value="India">India</option>
                         <option value="Indonesia">Indonesia</option>
                         <option value="Ireland">Ireland</option>
                         <option value="Italy">Italy</option>
                         <option value="Japan">Japan</option>
                         <option value="Kenya">Kenya</option>
                         <option value="Malaysia">Malaysia</option>
                         <option value="Mexico">Mexico</option>
                         <option value="Netherlands">Netherlands</option>
                         <option value="Nigeria">Nigeria</option>
                         <option value="Norway">Norway</option>
                         <option value="Pakistan">Pakistan</option>
                         <option value="Philippines">Philippines</option>
                         <option value="Poland">Poland</option>
                         <option value="Portugal">Portugal</option>
                         <option value="Russia">Russia</option>
                         <option value="Rwanda">Rwanda</option>
                         <option value="Singapore">Singapore</option>
                         <option value="South Africa">South Africa</option>
                         <option value="South Korea">South Korea</option>
                         <option value="Spain">Spain</option>
                         <option value="Sweden">Sweden</option>
                         <option value="Switzerland">Switzerland</option>
                         <option value="Tanzania">Tanzania</option>
                         <option value="Thailand">Thailand</option>
                         <option value="Turkey">Turkey</option>
                         <option value="Uganda">Uganda</option>
                         <option value="Ukraine">Ukraine</option>
                         <option value="United Arab Emirates">United Arab Emirates</option>
                         <option value="United Kingdom">United Kingdom</option>
                         <option value="United States">United States</option>
                         <option value="Vietnam">Vietnam</option>
                         <option value="Zambia">Zambia</option>
                         <option value="Zimbabwe">Zimbabwe</option>
                       </select>
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Date of Birth
                       </label>
                       <input
                         type="date"
                         value={editData.personal.dateOfBirth || ''}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, dateOfBirth: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Gender
                       </label>
                       <select
                         value={editData.personal.gender || ''}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, gender: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="">Select gender</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         <option value="Prefer not to say">Prefer not to say</option>
                       </select>
                   </div>
                   
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                         Disability Status
                       </label>
                       <select
                         value={editData.personal.disabilityStatus || ''}
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, disabilityStatus: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                       >
                         <option value="">Select disability status</option>
                         <option value="No disability">No disability</option>
                         <option value="Physical disability">Physical disability</option>
                         <option value="Visual impairment">Visual impairment</option>
                         <option value="Hearing impairment">Hearing impairment</option>
                         <option value="Learning disability">Learning disability</option>
                         <option value="Mental health condition">Mental health condition</option>
                         <option value="Other">Other</option>
                         <option value="Prefer not to say">Prefer not to say</option>
                       </select>
                     </div>
                     
                     <div>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Languages
                       </label>
                       <input
                       type="text"
                         value={editData.personal.languages || ''}
                         placeholder="e.g. English, Swahili, French"
                         onChange={(e) => setEditData({
                           ...editData,
                           personal: {...editData.personal, languages: e.target.value}
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                       LinkedIn Profile *
                     </label>
                     <input
                       type="url"
                       value={editData.personal.linkedinProfile || ''}
                       placeholder="e.g. linkedin.com/in/username"
                       onChange={(e) => setEditData({
                         ...editData,
                         personal: {...editData.personal, linkedinProfile: e.target.value}
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div>
                       <label style={{
                         fontSize: '14px',
                         fontWeight: '600',
                         color: '#1a1a1a',
                         marginBottom: '12px',
                         display: 'block'
                       }}>
                         Additional Profile Links (Optional)
                       </label>
                       <p style={{
                         fontSize: '12px',
                         color: '#64748b',
                         marginBottom: '16px',
                         margin: '0 0 16px 0'
                       }}>
                         Add up to 3 additional professional or social profile links (e.g., GitHub, Portfolio, Canva, etc.)
                       </p>
                     </div>
                     
                     {/* Profile Link 1 */}
                     <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                       <div style={{ flex: '0 0 120px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                           Platform Name
                     </label>
                     <input
                       type="text"
                           value={editData.personal.profileLink1.name}
                           placeholder="e.g. GitHub"
                       onChange={(e) => setEditData({
                         ...editData,
                             personal: {
                               ...editData.personal, 
                               profileLink1: {...editData.personal.profileLink1, name: e.target.value}
                             }
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                     </div>
                       <div style={{ flex: 1 }}>
                     <label style={{
                       fontSize: '12px',
                       fontWeight: '500',
                       color: '#64748b',
                       marginBottom: '6px',
                       display: 'block'
                     }}>
                           URL
                     </label>
                       <input
                         type="url"
                           value={editData.personal.profileLink1.url}
                           placeholder="e.g. github.com/username"
                           onChange={(e) => setEditData({
                             ...editData,
                             personal: {
                               ...editData.personal, 
                               profileLink1: {...editData.personal.profileLink1, url: e.target.value}
                             }
                           })}
                           style={{
                             width: '100%',
                             padding: '10px 12px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '6px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                     
                     {/* Profile Link 2 */}
                     <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                       <div style={{ flex: '0 0 120px' }}>
                     <input
                       type="text"
                           value={editData.personal.profileLink2.name}
                           placeholder="e.g. Portfolio"
                       onChange={(e) => setEditData({
                         ...editData,
                             personal: {
                               ...editData.personal, 
                               profileLink2: {...editData.personal.profileLink2, name: e.target.value}
                             }
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                       </div>
                       <div style={{ flex: 1 }}>
                         <input
                           type="url"
                           value={editData.personal.profileLink2.url}
                         placeholder="e.g. yourname.com"
                         onChange={(e) => setEditData({
                           ...editData,
                             personal: {
                               ...editData.personal, 
                               profileLink2: {...editData.personal.profileLink2, url: e.target.value}
                             }
                         })}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '6px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                   </div>
                   
                     {/* Profile Link 3 */}
                     <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                       <div style={{ flex: '0 0 120px' }}>
                     <input
                       type="text"
                           value={editData.personal.profileLink3.name}
                           placeholder="e.g. Canva"
                       onChange={(e) => setEditData({
                         ...editData,
                             personal: {
                               ...editData.personal, 
                               profileLink3: {...editData.personal.profileLink3, name: e.target.value}
                             }
                       })}
                       style={{
                         width: '100%',
                         padding: '10px 12px',
                         border: '1px solid #e2e8f0',
                         borderRadius: '6px',
                         fontSize: '14px',
                         outline: 'none'
                       }}
                       onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                       onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                     />
                       </div>
                       <div style={{ flex: 1 }}>
                         <input
                           type="url"
                           value={editData.personal.profileLink3.url}
                           placeholder="e.g. canva.com/username"
                           onChange={(e) => setEditData({
                             ...editData,
                             personal: {
                               ...editData.personal, 
                               profileLink3: {...editData.personal.profileLink3, url: e.target.value}
                             }
                           })}
                           style={{
                             width: '100%',
                             padding: '10px 12px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '6px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                   </div>
                </div>
              </div>

                             {/* Education Section */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Education
                  </h3>
                  <button
                    onClick={() => setEditData({
                      ...editData,
                                             education: [...editData.education, {
                         id: Date.now(),
                         level: 'High School',
                         program: '',
                         school: '',
                         location: '',
                         period: '',
                         gpa: ''
                       }]
                    })}
                    style={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Education
                  </button>
                </div>
                
                {editData.education.map((edu, index) => (
                  <div key={edu.id} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}>
                                         <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Education Level
                         </label>
                         <select
                           value={edu.level}
                           onChange={(e) => {
                             const newEdu = [...editData.education]
                             newEdu[index] = {...edu, level: e.target.value}
                             setEditData({...editData, education: newEdu})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Ordinary Level">Ordinary Level</option>
                           <option value="High School">High School</option>
                           <option value="Certificate/Diploma">Certificate/Diploma</option>
                           <option value="Bachelor Degree">Bachelor Degree</option>
                           <option value="Masters Degree">Masters Degree</option>
                           <option value="Doctoral Degree(PhD)">Doctoral Degree(PhD)</option>
                         </select>
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Program/Major
                         </label>
                         <input
                           type="text"
                           value={edu.program}
                           placeholder="e.g. Computer Science, Business Administration"
                           onChange={(e) => {
                             const newEdu = [...editData.education]
                             newEdu[index] = {...edu, program: e.target.value}
                             setEditData({...editData, education: newEdu})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                    
                    <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                                                 }}>
                           Institution
                         </label>
                                                 <input
                           type="text"
                           value={edu.school}
                           placeholder="e.g. Harvard University, MIT, Stanford"
                           onChange={(e) => {
                             const newEdu = [...editData.education]
                             newEdu[index] = {...edu, school: e.target.value}
                             setEditData({...editData, education: newEdu})
                           }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, location: e.target.value}
                            setEditData({...editData, education: newEdu})
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>
                    
                    <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Period
                        </label>
                        <input
                          type="text"
                          value={edu.period}
                          placeholder="e.g. 2016 - 2020"
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, period: e.target.value}
                            setEditData({...editData, education: newEdu})
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          GPA/Division
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          placeholder="e.g. 3.8 or Division 1"
                          onChange={(e) => {
                            const newEdu = [...editData.education]
                            newEdu[index] = {...edu, gpa: e.target.value}
                            setEditData({...editData, education: newEdu})
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>
                    
                    
                    
                    <button
                      onClick={() => setEditData({
                        ...editData,
                        education: editData.education.filter((_, i) => i !== index)
                      })}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                             </div>

               {/* Certificates Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Certificates
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       certificates: [...editData.certificates, {
                         id: Date.now(),
                         name: '',
                         issuer: '',
                         issueDate: '',
                         expiryDate: '',
                         credentialId: '',
                         type: 'Professional Certification',
                         certificateFile: null
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '6px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer'
                     }}
                   >
                     + Add Certificate
                   </button>
                 </div>
                 
                 {editData.certificates.map((cert, index) => (
                   <div key={cert.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Certificate Name
                       </label>
                       <input
                         type="text"
                         value={cert.name}
                         placeholder="e.g. AWS Certified Solutions Architect"
                         onChange={(e) => {
                           const newCerts = [...editData.certificates]
                           newCerts[index] = {...cert, name: e.target.value}
                           setEditData({...editData, certificates: newCerts})
                         }}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Issuing Organization
                         </label>
                         <input
                           type="text"
                           value={cert.issuer}
                           placeholder="e.g. Amazon Web Services, Google"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, issuer: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Credential ID
                         </label>
                         <input
                           type="text"
                           value={cert.credentialId}
                           placeholder="e.g. AWS-SAA-123456"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, credentialId: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                     
                     <div style={{ 
                       display: 'grid', 
                       gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr', 
                       gap: '12px', 
                       marginBottom: '12px' 
                     }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Issue Date
                         </label>
                         <input
                           type="text"
                           value={cert.issueDate}
                           placeholder="e.g. March 2023"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, issueDate: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Expiry Date (optional)
                         </label>
                         <input
                           type="text"
                           value={cert.expiryDate || ''}
                           placeholder="e.g. March 2026 or leave blank"
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, expiryDate: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Type
                         </label>
                         <select
                           value={cert.type}
                           onChange={(e) => {
                             const newCerts = [...editData.certificates]
                             newCerts[index] = {...cert, type: e.target.value}
                             setEditData({...editData, certificates: newCerts})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Professional Certification">Professional Certification</option>
                           <option value="Industry Certification">Industry Certification</option>
                           <option value="Course Certificate">Course Certificate</option>
                           <option value="Training Certificate">Training Certificate</option>
                           <option value="License">License</option>
                           <option value="Achievement Badge">Achievement Badge</option>
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Certificate File
                       </label>
                       <button
                         type="button"
                         onClick={() => document.getElementById(`certificate-file-${index}`).click()}
                         style={{
                           backgroundColor: 'white',
                           color: '#64748b',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           padding: '8px 12px',
                           fontSize: '14px',
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '6px'
                         }}
                       >
                         <Upload size={14} />
                         {cert.fileName || 'Choose File'}
                       </button>
                       <input
                         id={`certificate-file-${index}`}
                         type="file"
                         accept=".pdf,.jpg,.jpeg,.png"
                         style={{ display: 'none' }}
                         onChange={async (e) => {
                           const file = e.target.files[0]
                           if (file) {
                             try {
                               const uploadResult = await apiService.uploadCertificateFile(file)
                               const newCerts = [...editData.certificates]
                               newCerts[index] = { 
                                 ...cert, 
                                 fileName: file.name, 
                                 file: file,
                                 certificateFile: uploadResult.file_url
                               }
                               setEditData({ ...editData, certificates: newCerts })
                             } catch (error) {
                               console.error('Failed to upload certificate file:', error)
                               alert(`Failed to upload certificate file: ${error.message}`)
                             }
                           }
                         }}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         certificates: editData.certificates.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>

               {/* Experience Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Experience
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       experience: [...editData.experience, {
                         id: Date.now(),
                         title: '',
                         company: '',
                         location: '',
                         period: '',
                         type: 'Full-time',
                         description: ''
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '6px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer'
                     }}
                   >
                     + Add Experience
                   </button>
                 </div>
                 
                 {editData.experience.map((exp, index) => (
                   <div key={exp.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Job Title
                         </label>
                         <input
                           type="text"
                           value={exp.title}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, title: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Company
                         </label>
                         <input
                           type="text"
                           value={exp.company}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, company: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                     </div>
                     
                     <div style={{ 
                       display: 'grid', 
                       gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr', 
                       gap: '12px', 
                       marginBottom: '12px' 
                     }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Location
                         </label>
                         <input
                           type="text"
                           value={exp.location}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, location: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Period
                         </label>
                         <input
                           type="text"
                           value={exp.period}
                           placeholder="e.g. Jan 2022 - Present"
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, period: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                           onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                         />
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Type
                         </label>
                         <select
                           value={exp.type}
                           onChange={(e) => {
                             const newExp = [...editData.experience]
                             newExp[index] = {...exp, type: e.target.value}
                             setEditData({...editData, experience: newExp})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Full-time">Full-time</option>
                           <option value="Part-time">Part-time</option>
                           <option value="Contract">Contract</option>
                           <option value="Internship">Internship</option>
                           <option value="Freelance">Freelance</option>
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Description ({exp.description?.length || 0}/200)
                       </label>
                       <textarea
                         value={exp.description}
                         onChange={(e) => {
                           const newExp = [...editData.experience]
                           newExp[index] = {...exp, description: e.target.value}
                           setEditData({...editData, experience: newExp})
                         }}
                         maxLength={200}
                         rows={2}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none',
                           resize: 'vertical'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         experience: editData.experience.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>

               {/* Documents Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Documents
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       documents: [...editData.documents, {
                         id: Date.now(),
                         name: '',
                         type: 'Resume/CV',
                         category: 'Job Application Documents',
                         file: null,
                         size: '',
                         updated: new Date().toLocaleDateString(),
                         status: 'Draft',
                         description: ''
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '6px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer'
                     }}
                   >
                     + Add Document
                   </button>
                 </div>
                 
                 {editData.documents.map((doc, index) => (
                   <div key={doc.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Document Name
                       </label>
                       <input
                         type="text"
                         value={doc.name}
                         placeholder="e.g. Software Engineer Resume"
                         onChange={(e) => {
                           const newDocs = [...editData.documents]
                           newDocs[index] = {...doc, name: e.target.value}
                           setEditData({...editData, documents: newDocs})
                         }}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '6px', 
                    marginBottom: '10px' 
                  }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Category
                         </label>
                         <select
                           value={doc.category}
                           onChange={(e) => {
                             const newDocs = [...editData.documents]
                             newDocs[index] = {...doc, category: e.target.value, type: 'Resume/CV'}
                             setEditData({...editData, documents: newDocs})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="Job Application Documents">Job Application Documents</option>
                           <option value="Academic Documents">Academic Documents</option>
                           <option value="Professional Credentials">Professional Credentials</option>
                           <option value="International Documents">International Documents</option>
                           <option value="Specialized Documents">Specialized Documents</option>
                         </select>
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Document Type
                         </label>
                         <select
                           value={doc.type}
                           onChange={(e) => {
                             const newDocs = [...editData.documents]
                             newDocs[index] = {...doc, type: e.target.value}
                             setEditData({...editData, documents: newDocs})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           {/* Job Application Documents */}
                           {doc.category === 'Job Application Documents' && (
                             <>
                               <option value="Resume/CV">Resume/CV</option>
                               <option value="Cover Letter Templates">Cover Letter Templates</option>
                               <option value="Portfolio">Portfolio</option>
                               <option value="References List">References List</option>
                               <option value="Recommendation Letters">Recommendation Letters</option>
                             </>
                           )}
                           
                           {/* Academic Documents */}
                           {doc.category === 'Academic Documents' && (
                             <>
                               <option value="Transcripts">Transcripts</option>
                               <option value="Diplomas/Degrees">Diplomas/Degrees</option>
                               <option value="Academic Certificates">Academic Certificates</option>
                               <option value="Research Papers">Research Papers</option>
                             </>
                           )}
                           
                           {/* Professional Credentials */}
                           {doc.category === 'Professional Credentials' && (
                             <>
                               <option value="Licenses">Licenses</option>
                               <option value="Training Certificates">Training Certificates</option>
                               <option value="Skills Assessments">Skills Assessments</option>
                             </>
                           )}
                           
                           {/* International Documents */}
                           {doc.category === 'International Documents' && (
                             <>
                               <option value="Passport">Passport</option>
                               <option value="Visa Documents">Visa Documents</option>
                               <option value="Language Certificates">Language Certificates</option>
                               <option value="Background Checks">Background Checks</option>
                             </>
                           )}
                           
                           {/* Specialized Documents */}
                           {doc.category === 'Specialized Documents' && (
                             <>
                               <option value="Project Documentation">Project Documentation</option>
                               <option value="Publications">Publications</option>
                               <option value="Patents">Patents</option>
                               <option value="Awards & Recognition">Awards & Recognition</option>
                               <option value="Professional Membership">Professional Membership</option>
                             </>
                           )}
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Description
                       </label>
                       <textarea
                         value={doc.description}
                         placeholder="Brief description of the document"
                         onChange={(e) => {
                           const newDocs = [...editData.documents]
                           newDocs[index] = {...doc, description: e.target.value}
                           setEditData({...editData, documents: newDocs})
                         }}
                         rows={2}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none',
                           resize: 'vertical'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Upload File
                       </label>
                       <button
                         type="button"
                         onClick={() => document.getElementById(`document-file-${index}`).click()}
                         style={{
                           backgroundColor: 'white',
                           color: '#64748b',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           padding: '8px 12px',
                           fontSize: '14px',
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '6px'
                         }}
                       >
                         <Upload size={14} />
                         {doc.fileName || 'Choose File'}
                       </button>
                       <input
                         id={`document-file-${index}`}
                         type="file"
                         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                         style={{ display: 'none' }}
                         onChange={async (e) => {
                           const file = e.target.files[0]
                           if (file) {
                             try {
                               const uploadResult = await apiService.uploadDocumentFile(file)
                               const newDocs = [...editData.documents]
                               newDocs[index] = { 
                                 ...doc, 
                                 fileName: file.name, 
                                 file: file,
                                 file_path: uploadResult.file_url
                               }
                               setEditData({ ...editData, documents: newDocs })
                             } catch (error) {
                               console.error('Failed to upload document file:', error)
                               alert(`Failed to upload document file: ${error.message}`)
                             }
                           }
                         }}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         documents: editData.documents.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>

               {/* Skills Section */}
               <div style={{ marginBottom: '32px' }}>
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   marginBottom: '16px'
                 }}>
                   <h3 style={{
                     fontSize: '16px',
                     fontWeight: '600',
                     color: '#1a1a1a',
                     margin: 0
                   }}>
                     Skills
                   </h3>
                   <button
                     onClick={() => setEditData({
                       ...editData,
                       skills: [...editData.skills, {
                         id: Date.now(),
                         name: '',
                         level: '',
                         category: '',
                         description: ''
                       }]
                     })}
                     style={{
                       backgroundColor: '#16a34a',
                       color: 'white',
                       border: 'none',
                       borderRadius: '6px',
                       padding: '8px 12px',
                       fontSize: '12px',
                       fontWeight: '500',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '4px'
                     }}
                   >
                     <Award size={14} />
                     Add Skill
                   </button>
                 </div>
                 
                 {editData.skills.map((skill, index) => (
                   <div key={skill.id} style={{
                     border: '1px solid #e2e8f0',
                     borderRadius: '8px',
                     padding: '16px',
                     marginBottom: '12px'
                   }}>
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Skill Name
                       </label>
                       <input
                         type="text"
                         value={skill.name}
                         placeholder="e.g. JavaScript, Project Management, Data Analysis"
                         onChange={(e) => {
                           const newSkills = [...editData.skills]
                           newSkills[index] = {...skill, name: e.target.value}
                           setEditData({...editData, skills: newSkills})
                         }}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <div style={{ 
                       display: 'grid', 
                       gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                       gap: '12px', 
                       marginBottom: '12px' 
                     }}>
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Skill Level
                         </label>
                         <select
                           value={skill.level}
                           onChange={(e) => {
                             const newSkills = [...editData.skills]
                             newSkills[index] = {...skill, level: e.target.value}
                             setEditData({...editData, skills: newSkills})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="">Select Level</option>
                           <option value="Beginner">Beginner</option>
                           <option value="Intermediate">Intermediate</option>
                           <option value="Advanced">Advanced</option>
                           <option value="Expert">Expert</option>
                         </select>
                       </div>
                       
                       <div>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#64748b',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Category
                         </label>
                         <select
                           value={skill.category}
                           onChange={(e) => {
                             const newSkills = [...editData.skills]
                             newSkills[index] = {...skill, category: e.target.value}
                             setEditData({...editData, skills: newSkills})
                           }}
                           style={{
                             width: '100%',
                             padding: '8px 10px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '4px',
                             fontSize: '14px',
                             outline: 'none'
                           }}
                         >
                           <option value="">Select Category</option>
                           <option value="Technical">Technical</option>
                           <option value="Soft Skills">Soft Skills</option>
                           <option value="Languages">Languages</option>
                           <option value="Tools & Software">Tools & Software</option>
                           <option value="Industry Knowledge">Industry Knowledge</option>
                           <option value="Certifications">Certifications</option>
                         </select>
                       </div>
                     </div>
                     
                     <div style={{ marginBottom: '12px' }}>
                       <label style={{
                         fontSize: '12px',
                         fontWeight: '500',
                         color: '#64748b',
                         marginBottom: '4px',
                         display: 'block'
                       }}>
                         Description (Optional)
                       </label>
                       <textarea
                         value={skill.description}
                         placeholder="Brief description of your experience with this skill"
                         onChange={(e) => {
                           const newSkills = [...editData.skills]
                           newSkills[index] = {...skill, description: e.target.value}
                           setEditData({...editData, skills: newSkills})
                         }}
                         rows={2}
                         style={{
                           width: '100%',
                           padding: '8px 10px',
                           border: '1px solid #e2e8f0',
                           borderRadius: '4px',
                           fontSize: '14px',
                           outline: 'none',
                           resize: 'vertical'
                         }}
                         onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                         onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                       />
                     </div>
                     
                     <button
                       onClick={() => setEditData({
                         ...editData,
                         skills: editData.skills.filter((_, i) => i !== index)
                       })}
                       style={{
                         backgroundColor: '#fee2e2',
                         color: '#ef4444',
                         border: 'none',
                         borderRadius: '4px',
                         padding: '6px 10px',
                         fontSize: '12px',
                         fontWeight: '500',
                         cursor: 'pointer'
                       }}
                     >
                       Remove
                     </button>
                   </div>
                 ))}
               </div>
               
               {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '6px',
                justifyContent: 'flex-end',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '20px'
              }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  style={{
                    backgroundColor: saving ? '#9ca3af' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile