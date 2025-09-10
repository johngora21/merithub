import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  User, 
  Star, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Package, 
  MessageSquare, 
  Eye, 
  CheckCircle,
  Calendar,
  LogOut,
  Menu,
  Trash2
} from 'lucide-react'

import { apiService } from '../../lib/api-service'
import { countries } from '../../utils/countries'

const CRM = () => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })

  // State management
  const [customers, setCustomers] = useState([])
  const [interactions] = useState([])
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    vipCustomers: 0,
    totalRevenue: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showContactSelector, setShowContactSelector] = useState(false)
  const [contactType, setContactType] = useState('email')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [message, setMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  // Advanced filters modal
  const [showFilters, setShowFilters] = useState(false)
  // Multi-select filters using sets (checkbox UI)
  const [filterStatuses, setFilterStatuses] = useState(new Set())
  const [filterCountries, setFilterCountries] = useState(new Set())
  const [filterEducations, setFilterEducations] = useState(new Set())
  const [filterGenders, setFilterGenders] = useState(new Set())
  // Use the same dropdown values as profile edit page
  const educationOptions = [
    'Ordinary Level',
    'High School',
    'Certificate/Diploma',
    'Bachelor Degree',
    'Masters Degree',
    'Doctoral Degree(PhD)'
  ]

  const getActiveFilterCount = () =>
    (filterStatuses.size ? 1 : 0) + (filterCountries.size ? 1 : 0) + (filterEducations.size ? 1 : 0) + (filterGenders.size ? 1 : 0)

  // Match Applications profile helpers
  const getEducationLevel = (level) => {
    if (!level) return 0
    const s = String(level).toLowerCase()
    if (s.includes('phd') || s.includes('doctor')) return 7
    if (s.includes('master') || s.includes('mba') || s.includes('m.')) return 6
    if (s.includes('bachelor') || s.includes('bsc') || s.includes('ba')) return 5
    if (s.includes('associate')) return 4
    if (s.includes('diploma') || s.includes('certificate')) return 3
    if (s.includes('high school') || s.includes('secondary')) return 2
    if (s.includes('ordinary')) return 1.5
    return 1
  }
  const getHighestEducation = (education) => {
    if (!Array.isArray(education) || education.length === 0) return 'Not specified'
    const highest = education.reduce((h, c) => (getEducationLevel(c.level) > getEducationLevel(h.level) ? c : h), education[0])
    return highest.level || 'Not specified'
  }
  const getHighestEducationInstitution = (education) => {
    if (!Array.isArray(education) || education.length === 0) return 'Not specified'
    const highest = education.reduce((h, c) => (getEducationLevel(c.level) > getEducationLevel(h.level) ? c : h), education[0])
    return highest.institution || highest.school || highest.university || 'Not specified'
  }

  const normalizeStatus = (status) => {
    if (!status) return 'active'
    if (status === 'premium' || status === 'regular' || status === 'active') return 'active'
    if (status === 'vip') return 'vip'
    if (status === 'inactive') return 'inactive'
    return 'active'
  }

  const mapUserToCustomer = (u) => ({
    id: u.id || u._id || u.user_id || String(Date.now()),
    name: u.name || [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Unknown',
    email: u.email || 'N/A',
    phone: u.phone || 'N/A',
    company: u.employment_status || u.company || u.organization || '',
    location: u.location || u.country || '',
    status: normalizeStatus(u.status || u.subscription_type),
    userType: u.userType || (u.subscription_type ? u.subscription_type.charAt(0).toUpperCase() + u.subscription_type.slice(1) : 'Basic'),
    profileCompletion: u.profileCompletion || '0%',
    joinedDate: u.joinedDate || u.created_at || new Date().toISOString(),
    lastActivity: u.lastActivity || u.last_login || new Date().toISOString(),
    totalSpent: u.totalSpent || 0,
    jobsApplied: u.jobsApplied || 0,
    tendersSubmitted: u.tendersSubmitted || 0,
    opportunitiesApplied: u.opportunitiesApplied || 0,
    profilePicture: u.profilePicture || u.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    // Profile data from user profile
    bio: u.bio || '',
    industry: u.industry || '',
    experience_level: u.experience_level || '',
    skills: u.skills || [],
    education: u.education || [],
    certificates: u.certificates || [],
    experience: u.experience || [],
    documents: u.documents || [],
    // Additional profile fields
    username: u.username || '',
    current_job_title: u.current_job_title || '',
    years_experience: u.years_experience || '',
    employment_status: u.employment_status || '',
    marital_status: u.marital_status || '',
    nationality: u.nationality || '',
    country_of_residence: u.country_of_residence || '',
    date_of_birth: u.date_of_birth || '',
    gender: u.gender || '',
    disability_status: u.disability_status || '',
    languages: u.languages || '',
    linkedin_url: u.linkedin_url || '',
    profile_link1_name: u.profile_link1_name || '',
    profile_link1_url: u.profile_link1_url || '',
    profile_link2_name: u.profile_link2_name || '',
    profile_link2_url: u.profile_link2_url || '',
    profile_link3_name: u.profile_link3_name || '',
    profile_link3_url: u.profile_link3_url || ''
  })

  const loadUsers = async () => {
    try {
      setDataLoading(true)
      const params = { page, limit }
      if (searchTerm) params.search = searchTerm
      const resp = await apiService.get('/admin/users', params)
      const respUsers = resp?.users || []
      console.log('Raw user data from admin API:', respUsers)
      const normalized = respUsers.map(mapUserToCustomer)
      console.log('Normalized user data:', normalized)
      setCustomers(normalized)
      setTotalPages(parseInt(resp?.totalPages || 1, 10))
      const activeCount = normalized.filter(c => normalizeStatus(c.status) === 'active' || normalizeStatus(c.status) === 'vip').length
      const vipCount = normalized.filter(c => normalizeStatus(c.status) === 'vip').length
      setStats({
        totalCustomers: resp?.total || normalized.length,
        activeCustomers: activeCount,
        vipCustomers: vipCount,
        totalRevenue: 0
      })
    } catch (e) {
      console.error('Failed to load users', e)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm])
  
  // Filter states for bulk messaging
  const [bulkMessageStatusFilter, setBulkMessageStatusFilter] = useState('all')
  const [bulkMessageLocationFilter, setBulkMessageLocationFilter] = useState('all')
  const [bulkMessageSearchTerm, setBulkMessageSearchTerm] = useState('')

  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         customer.location?.toLowerCase().includes(searchTerm.toLowerCase())
    // Advanced filters (multi-select)
    const matchesStatus = filterStatuses.size === 0 || filterStatuses.has((customer.status || '').toLowerCase())
    const highestEdu = (getHighestEducation(customer.education) || '').toLowerCase()
    const matchesEducation = filterEducations.size === 0 || filterEducations.has(highestEdu)
    const customerCountry = (customer.country_of_residence || customer.location || '').toLowerCase()
    const matchesCountry = filterCountries.size === 0 || filterCountries.has(customerCountry)
    const matchesGender = filterGenders.size === 0 || filterGenders.has((customer.gender || '').toLowerCase())
    return matchesSearch && matchesStatus && matchesCountry && matchesEducation && matchesGender
  })

  // Filter customers for bulk messaging
  const bulkMessageFilteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase())) ||
                         customer.location?.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase())
    
    const matchesStatus = bulkMessageStatusFilter === 'all' || customer.status === bulkMessageStatusFilter
    const matchesLocation = bulkMessageLocationFilter === 'all' || customer.location === bulkMessageLocationFilter
    
    return matchesSearch && matchesStatus && matchesLocation
  })

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'vip': 
        return {
          backgroundColor: '#f3e8ff',
          color: '#7c3aed',
          borderColor: '#c4b5fd'
        }
      case 'active': 
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderColor: '#86efac'
        }
      case 'prospect': 
        return {
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
          borderColor: '#93c5fd'
        }
      case 'inactive': 
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        }
      default: 
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'vip': return <Star size={12} />
      case 'active': return <CheckCircle size={12} />
      case 'prospect': return <TrendingUp size={12} />
      case 'inactive': return <Clock size={12} />
      default: return <User size={12} />
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleAddCustomer = async (customerData) => {
    try {
      const created = await apiService.post('/admin/users', customerData)
      const user = created?.user || created
      const mapped = mapUserToCustomer(user)
      setCustomers([...customers, mapped])
    setShowAddCustomer(false)
    } catch (e) {
      console.error('Add customer failed', e)
      alert(e.message || 'Failed to add customer')
    }
  }

  const handleRouteToEmail = (customer) => {
    setContactType('email')
    setSelectedContacts([customer.email])
    setShowContactSelector(true)
  }
  const updateCustomer = async (id, updates) => {
    try {
      const res = await apiService.put(`/admin/users/${id}`, updates)
      const updated = res?.user || res
      const mapped = mapUserToCustomer(updated)
      setCustomers(prev => prev.map(c => c.id === id ? mapped : c))
    } catch (e) {
      console.error('Update customer failed', e)
      alert(e.message || 'Failed to update customer')
    }
  }

  const deleteCustomer = async (id) => {
    try {
      if (!window.confirm('Delete this user?')) return
      await apiService.delete(`/admin/users/${id}`)
      setCustomers(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      console.error('Delete customer failed', e)
      alert(e.message || 'Failed to delete customer')
    }
  }

  const handleSendSMS = (customer) => {
    setContactType('phone')
    setSelectedContacts([customer.phone])
    setShowContactSelector(true)
  }

  const sendBulkSMS = async (contacts, message) => {
    await apiService.post('/notifications/bulk', { channel: 'sms', recipients: contacts, message })
  }

  const sendBulkEmail = async (contacts, message) => {
    await apiService.post('/notifications/bulk', { channel: 'email', recipients: contacts, message })
  }

  const handleDeleteUser = (customer) => {
    setUserToDelete(customer)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setDeleteLoading(true)
      setError('')
      
      // Call the delete API endpoint
      await apiService.delete(`/admin/users/${userToDelete.id}`)
      
      setSuccess(`User ${userToDelete.name} has been deleted successfully and their email has been blocked.`)
      
      // Refresh the user list
      await loadUsers()
      
      // Close the confirmation dialog
      setShowDeleteConfirm(false)
      setUserToDelete(null)
      
    } catch (error) {
      console.error('Error deleting user:', error)
      setError(error?.response?.data?.message || 'Failed to delete user. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false)
    setUserToDelete(null)
  }

  // Contact Selector Modal Component
  const ContactSelectorModal = () => {
    if (!showContactSelector) return null

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '64rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0
                }}>
                  Send Bulk Message
                </h2>
                <p style={{
                  color: '#64748b',
                  marginTop: '4px',
                  margin: 0
                }}>
                  Select contacts and compose your message
                </p>
              </div>
              <button
                onClick={() => setShowContactSelector(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Contact Type Selection */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  checked={contactType === 'email'}
                  onChange={() => {
                    setContactType('email')
                    setSelectedContacts([])
                  }}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontWeight: '500' }}>Email</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  checked={contactType === 'phone'}
                  onChange={() => {
                    setContactType('phone')
                    setSelectedContacts([])
                  }}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontWeight: '500' }}>SMS</span>
              </label>
            </div>

            {/* Contact Selection */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Select Contacts ({contactType === 'email' ? 'Email' : 'SMS'})
              </label>
              
              {/* Search and Filter Controls */}
              <div style={{
                display: 'flex',
                flexDirection: screenSize.isMobile ? 'column' : 'row',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={bulkMessageSearchTerm}
                    onChange={(e) => setBulkMessageSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <select
                  value={bulkMessageStatusFilter}
                  onChange={(e) => setBulkMessageStatusFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">All Users</option>
                  <option value="vip">Premium</option>
                  <option value="active">Active</option>
                  <option value="prospect">New Prospects</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Contact List */}
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#f8fafc'
              }}>
                {/* Select All Option */}
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === bulkMessageFilteredCustomers.filter(customer => 
                      contactType === 'email' ? customer.email : customer.phone
                    ).length && bulkMessageFilteredCustomers.filter(customer => 
                      contactType === 'email' ? customer.email : customer.phone
                    ).length > 0}
                    onChange={(e) => {
                      const availableCustomers = bulkMessageFilteredCustomers.filter(customer => 
                        contactType === 'email' ? customer.email : customer.phone
                      )
                      if (e.target.checked) {
                        setSelectedContacts(availableCustomers.map(customer => 
                          contactType === 'email' ? customer.email : customer.phone
                        ))
                      } else {
                        setSelectedContacts([])
                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '600', color: '#374151' }}>
                    Select All ({bulkMessageFilteredCustomers.filter(customer => 
                      contactType === 'email' ? customer.email : customer.phone
                    ).length} contacts)
                  </span>
                </div>

                {/* Individual Contacts */}
                {bulkMessageFilteredCustomers
                  .filter(customer => contactType === 'email' ? customer.email : customer.phone)
                  .map((customer) => (
                    <div key={customer.id} style={{
                      padding: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'white'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contactType === 'email' ? customer.email : customer.phone)}
                        onChange={(e) => {
                          const contactValue = contactType === 'email' ? customer.email : customer.phone
                          if (e.target.checked) {
                            setSelectedContacts([...selectedContacts, contactValue])
                          } else {
                            setSelectedContacts(selectedContacts.filter(contact => contact !== contactValue))
                          }
                        }}
                      />
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#fed7aa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Users size={16} color="#f97316" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#0f172a'
                        }}>
                          {customer.name}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          {contactType === 'email' ? customer.email : customer.phone}
                        </div>
                        {customer.company && (
                          <div style={{
                            fontSize: '12px',
                            color: '#9ca3af'
                          }}>
                            {customer.company}
                          </div>
                        )}
                      </div>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        ...getStatusColor(customer.status)
                      }}>
                        {customer.status}
                      </span>
                    </div>
                  ))}

                {bulkMessageFilteredCustomers.filter(customer => 
                  contactType === 'email' ? customer.email : customer.phone
                ).length === 0 && (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: '#64748b'
                  }}>
                    No contacts available for {contactType === 'email' ? 'email' : 'SMS'}
                  </div>
                )}
              </div>

              {selectedContacts.length > 0 && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#16a34a',
                  fontWeight: '500'
                }}>
                  {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            {/* Message Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder={`Type your ${contactType === 'phone' ? 'SMS' : 'email'} message here...`}
              />
            </div>

            {/* Status Messages */}
            {error && <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div>}
            {success && <div style={{ color: '#10b981', fontSize: '14px' }}>{success}</div>}
          </div>

          {/* Action Buttons */}
          <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowContactSelector(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!message.trim()) {
                    setError("Please enter a message.")
                    return
                  }

                  setMessageLoading(true)
                  setSuccess("")
                  setError("")

                  try {
                    if (contactType === 'phone') {
                      await sendBulkSMS(selectedContacts, message)
                      setSuccess(`SMS sent successfully to ${selectedContacts.length} recipients!`)
                    } else {
                      await sendBulkEmail(selectedContacts, message)
                      setSuccess(`Email sent successfully to ${selectedContacts.length} recipients!`)
                    }
                    setSelectedContacts([])
                    setMessage("")
                  } catch (err) {
                    setError(err.message || "Failed to send message.")
                  } finally {
                    setMessageLoading(false)
                  }
                }}
                disabled={messageLoading || selectedContacts.length === 0}
                style={{
                  padding: '8px 16px',
                  backgroundColor: contactType === 'phone' ? '#f97316' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: messageLoading ? 'not-allowed' : 'pointer',
                  opacity: messageLoading || selectedContacts.length === 0 ? 0.6 : 1
                }}
              >
                {messageLoading ? "Sending..." : `Send ${contactType === 'phone' ? 'SMS' : 'Email'} (${selectedContacts.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Advanced Filters Modal
  const FiltersModal = () => {
    if (!showFilters) return null
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', width: 'min(560px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>Filters</h3>
            <button onClick={() => setShowFilters(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#9ca3af', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Status</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['vip','active','prospect','inactive'].map(opt => {
                  const checked = filterStatuses.has(opt)
                  return (
                    <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '9999px', cursor: 'pointer', backgroundColor: checked ? '#f97316' : 'white', color: checked ? 'white' : '#374151' }}>
                      <input type="checkbox" checked={checked} onChange={(e) => { const next = new Set(filterStatuses); if (e.target.checked) next.add(opt); else next.delete(opt); setFilterStatuses(next) }} style={{ display: 'none' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{opt}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Country of Residence</label>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', backgroundColor: '#f9fafb' }}>
                {countries.map(c => {
                  const key = (c.name || c).toLowerCase()
                  const checked = filterCountries.has(key)
                  return (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={checked} onChange={(e) => { const next = new Set(filterCountries); if (e.target.checked) next.add(key); else next.delete(key); setFilterCountries(next) }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{c.name || c}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Highest Level of Education</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {educationOptions.map(level => {
                  const key = level.toLowerCase()
                  const checked = filterEducations.has(key)
                  return (
                    <label key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '9999px', cursor: 'pointer', backgroundColor: checked ? '#f97316' : 'white', color: checked ? 'white' : '#374151' }}>
                      <input type="checkbox" checked={checked} onChange={(e) => { const next = new Set(filterEducations); if (e.target.checked) next.add(key); else next.delete(key); setFilterEducations(next) }} style={{ display: 'none' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{level}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Gender</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['male','female','other'].map(g => {
                  const checked = filterGenders.has(g)
                  return (
                    <label key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '9999px', cursor: 'pointer', backgroundColor: checked ? '#f97316' : 'white', color: checked ? 'white' : '#374151' }}>
                      <input type="checkbox" checked={checked} onChange={(e) => { const next = new Set(filterGenders); if (e.target.checked) next.add(g); else next.delete(g); setFilterGenders(next) }} style={{ display: 'none' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{g}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => { setFilterStatuses(new Set()); setFilterCountries(new Set()); setFilterEducations(new Set()); setFilterGenders(new Set()); setShowFilters(false) }} style={{ padding: '8px 14px', backgroundColor: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Clear</button>
            <button onClick={() => setShowFilters(false)} style={{ padding: '8px 14px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Apply</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: screenSize.isMobile ? '20px' : '32px'
    }}>


        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize.isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  margin: 0
                }}>
                  Total Customers
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0
                }}>
                  {stats.totalCustomers || customers.length}
                </p>
              </div>
              <div style={{
                backgroundColor: '#dbeafe',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <Users size={24} color="#3b82f6" />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  margin: 0
                }}>
                  Active Customers
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#16a34a',
                  margin: 0
                }}>
                  {stats.activeCustomers || customers.filter(c => c.status === 'active' || c.status === 'vip').length}
                </p>
              </div>
              <div style={{
                backgroundColor: '#dcfce7',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <CheckCircle size={24} color="#16a34a" />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  margin: 0
                }}>
                  VIP Customers
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#8b5cf6',
                  margin: 0
                }}>
                  {stats.vipCustomers || customers.filter(c => c.status === 'vip').length}
                </p>
              </div>
              <div style={{
                backgroundColor: '#f3e8ff',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <Star size={24} color="#8b5cf6" />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b',
                  margin: 0
                }}>
                  Total Revenue
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f97316',
                  margin: 0
                }}>
                  {formatCurrency(stats.totalRevenue || customers.reduce((sum, c) => sum + (c.totalRevenue || 0), 0))}
                </p>
              </div>
              <div style={{
                backgroundColor: '#fed7aa',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <DollarSign size={24} color="#f97316" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: screenSize.isMobile ? 'column' : 'row',
            alignItems: screenSize.isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: screenSize.isMobile ? 'column' : 'row',
              gap: '16px',
              flex: 1
            }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: screenSize.isMobile ? '100%' : '384px' }}>
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
                  placeholder="Search by name, email, employment status, or location..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
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

              <button
                onClick={() => setShowFilters(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                <SlidersHorizontal size={16} /> Filters
                {getActiveFilterCount() > 0 && (
                  <span style={{
                    marginLeft: '4px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '0 8px',
                    fontSize: '12px',
                    lineHeight: '18px',
                    height: '18px'
                  }}>{getActiveFilterCount()}</span>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>

              <button
                onClick={() => setShowContactSelector(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={16} />
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {dataLoading ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid #f97316',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }}></div>
              <p style={{ color: '#64748b', margin: 0 }}>Loading customers...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Customer
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Employment Status
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Location
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      User Type
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Profile %
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Joined Date
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'white', borderCollapse: 'collapse' }}>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'white'}>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#fed7aa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px'
                          }}>
                            <Users size={20} color="#f97316" />
                          </div>
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#0f172a'
                            }}>
                              {customer.name}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#64748b'
                            }}>
                              {customer.email}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#64748b'
                            }}>
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <div style={{
                          fontSize: '14px',
                          color: '#0f172a'
                        }}>
                          {customer.company || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <MapPin size={16} color="#9ca3af" style={{ marginRight: '4px' }} />
                          <span style={{
                            fontSize: '14px',
                            color: '#0f172a'
                          }}>
                            {customer.location}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          border: '1px solid',
                          ...getStatusColor(customer.status)
                        }}>
                          {getStatusIcon(customer.status)}
                          <span style={{ marginLeft: '4px', textTransform: 'capitalize' }}>
                            {customer.status}
                          </span>
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#0f172a' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {customer.userType || 'Job Seeker'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '40px',
                            height: '6px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${customer.profileCompletion || 0}%`,
                              height: '100%',
                              backgroundColor: '#16a34a',
                              borderRadius: '3px'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            {customer.profileCompletion || 0}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Calendar size={16} style={{ marginRight: '4px' }} />
                          {formatTimestamp(customer.joinedDate || customer.createdAt || new Date().toISOString())}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleRouteToEmail(customer)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#60a5fa',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Send Message"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <button
                            onClick={() => handleSendSMS(customer)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#fb923c',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Send SMS"
                          >
                            <Phone size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(customer)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredCustomers.length === 0 && !dataLoading && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Users size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#0f172a',
                margin: '0 0 8px 0'
              }}>
                No customers found
              </h3>
              <p style={{
                color: '#64748b',
                margin: 0
              }}>
                No customers match your current filters.
              </p>
            </div>
          )}
        </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
          display: 'flex',
          alignItems: screenSize.isMobile ? 'flex-end' : 'center',
          justifyContent: screenSize.isMobile ? 'stretch' : 'center',
          padding: '16px',
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
                {selectedCustomer.name}'s Profile
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
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
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px',
              flex: 1
            }}>
              {/* Mirror Applications header computed base */}
              {(() => {
                return null
              })()}
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
                  src={selectedCustomer.profilePicture ? 
                    (selectedCustomer.profilePicture.startsWith('http') ? 
                      selectedCustomer.profilePicture : 
                      `${(import.meta?.env?.VITE_API_BASE_URL)||'http://localhost:8000'}${selectedCustomer.profilePicture}`) : 
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'} 
                  alt={selectedCustomer.name}
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
                    {selectedCustomer.name}
                  </h2>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#64748b',
                    margin: '0 0 12px 0'
                  }}>
                    @{selectedCustomer.username || selectedCustomer.email?.split('@')[0] || 'user'}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    <span>📍 {selectedCustomer.location}</span>
                    <span>📧 {selectedCustomer.email}</span>
                    <span>📱 {selectedCustomer.phone}</span>
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
                    ...getStatusColor(selectedCustomer.status)
                  }}>
                    {selectedCustomer.status.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    {selectedCustomer.userType}
                  </span>
                </div>
              </div>

              {/* Profile Completion (hide to match Applications header compactness) */}
              {false && (
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
                    {selectedCustomer.profileCompletion}
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
                    width: selectedCustomer.profileCompletion,
                    height: '100%',
                    backgroundColor: '#16a34a',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              )}



              {/* Basic Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 16px 0' }}>Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Full Name</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.name}</p>
                  </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Username</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>@{selectedCustomer.username || selectedCustomer.email?.split('@')[0] || 'user'}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Email</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.email}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Phone</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.phone}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Employment Status</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.employment_status ? (selectedCustomer.employment_status.charAt(0).toUpperCase() + selectedCustomer.employment_status.slice(1)) : ''}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Industry</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.industry}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Nationality</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.nationality}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Country of Residence</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.country_of_residence}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Date of Birth</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.date_of_birth}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Gender</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.gender}</p>
                    </div>
                    <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Disability Status</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.disability_status || 'No disability'}</p>
                    </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '2px', display: 'block' }}>Languages</label>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, padding: '3px 0' }}>{selectedCustomer.languages}</p>
                  </div>
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
                  {selectedCustomer.bio || 'No bio provided'}
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
                  {(selectedCustomer.skills && selectedCustomer.skills.length > 0 ? selectedCustomer.skills : ['No skills listed']).map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {typeof skill === 'string' ? skill : skill.name || 'Unnamed Skill'}
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
                  {(selectedCustomer.experience && selectedCustomer.experience.length > 0 ? selectedCustomer.experience : [
                    { title: 'No experience listed', company: '', industry: '', description: '' }
                  ]).map((exp, index) => (
                    <div key={index} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                          {exp.title}
                        </h4>
                      {exp.company && (
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a', margin: '6px 0 6px 0' }}>
                        {exp.company}
                      </p>
                      )}
                      {exp.industry && (
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 6px 0' }}>
                          Industry: {exp.industry}
                        </p>
                      )}
                      {exp.description && (
                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#374151', margin: 0 }}>
                        {exp.description}
                      </p>
                      )}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Array.isArray(selectedCustomer.education) && selectedCustomer.education.length > 0 ? selectedCustomer.education : [
                    { level: 'No education listed', program: '', institution: '', location: '', gpa: '' }
                  ]).map((edu, idx) => (
                    <div key={idx} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                        {edu.level}
                    </h4>
                      {edu.program && (
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '6px 0 6px 0' }}>
                          {edu.program}
                        </p>
                      )}
                      {(edu.institution || edu.school || edu.university) && (
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 6px 0' }}>
                          {(edu.institution || edu.school || edu.university)}{(edu.location || edu.region) ? ` • ${edu.location || edu.region}` : ''}
                        </p>
                      )}
                      {(edu.gpa || edu.grade) && (
                        <p style={{ fontSize: '13px', color: '#059669', margin: 0 }}>
                          GPA: {edu.gpa || edu.grade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates Section (match Applications downloads) */}
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
                  {(selectedCustomer.certificates && selectedCustomer.certificates.length > 0 ? selectedCustomer.certificates : [
                    {
                      name: 'No certificates listed',
                      issuer: '',
                      date: '',
                      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=60&h=60&fit=crop'
                    }
                  ]).map((cert, index) => {
                    console.log('Certificate data:', cert);
                    console.log('Certificate fields:', Object.keys(cert));
                    console.log('Certificate file field:', cert.certificate_file);
                    console.log('Certificate file field (file):', cert.file);
                    console.log('Certificate file field (filePath):', cert.filePath);
                    console.log('Full certificate object:', JSON.stringify(cert, null, 2));
                    return (
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
                        src={cert.image ? 
                          (cert.image.startsWith('http') ? 
                            cert.image : 
                            `${(import.meta?.env?.VITE_API_BASE_URL)||'http://localhost:8000'}${cert.image}`) : 
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop'} 
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
                      {(cert.file_path || cert.certificate_file) && (
                        <button
                          onClick={() => {
                            const filePath = cert.file_path || cert.certificate_file
                            if (filePath && filePath.startsWith('/uploads/')) {
                              const apiBase = (import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8000'
                              const url = `${apiBase}/api/admin/download-by-path?path=${encodeURIComponent(filePath)}`
                              fetch(url, { credentials: 'include' })
                                .then(res => { if (!res.ok) throw new Error('Download failed'); return res.blob() })
                                .then(blob => { const blobUrl = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = blobUrl; a.download = (filePath.split('/').pop()) || `${cert.name||'certificate'}.pdf`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(blobUrl) })
                                .catch(() => alert('Failed to download the file. Please try again.'))
                            } else {
                              alert('File path not available for this certificate.')
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          📥 Download
                        </button>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents Section (match Applications downloads) */}
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
                  {(selectedCustomer.documents && selectedCustomer.documents.length > 0 ? selectedCustomer.documents : [
                    {
                      name: 'No documents uploaded',
                      type: 'Document',
                      size: '',
                      date: ''
                    }
                  ]).map((doc, index) => {
                    console.log('Document data:', doc);
                    console.log('Document fields:', Object.keys(doc));
                                            console.log('Document file field:', doc.file);
                        console.log('Document file field (file_path):', doc.file_path);
                        console.log('Document file field (filePath):', doc.filePath);
                    return (
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
                      {(doc.file_path || doc.certificate_file || doc.file) && (
                        <button
                          onClick={() => {
                            const filePath = doc.file_path || doc.certificate_file || doc.file
                            if (filePath && String(filePath).startsWith('/uploads/')) {
                              const apiBase = (import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8000'
                              const url = `${apiBase}/api/admin/download-by-path?path=${encodeURIComponent(filePath)}`
                              fetch(url, { credentials: 'include' })
                                .then(res => { if (!res.ok) throw new Error('Download failed'); return res.blob() })
                                .then(blob => { const blobUrl = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = blobUrl; a.download = (String(filePath).split('/').pop()) || `${doc.name||'document'}.pdf`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(blobUrl) })
                                .catch(() => alert('Failed to download the file. Please try again.'))
                            } else {
                              alert('File path not available for this document.')
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          📥 Download
                        </button>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Profile Links (bottom, clickable names only) */}
              {(selectedCustomer.profile_link1_name || selectedCustomer.profile_link2_name || selectedCustomer.profile_link3_name || selectedCustomer.linkedin_url) && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 16px 0' }}>Profile Links</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedCustomer.profile_link1_name && selectedCustomer.profile_link1_url && (
                      <a href={selectedCustomer.profile_link1_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {selectedCustomer.profile_link1_name}
                      </a>
                    )}
                    {selectedCustomer.profile_link2_name && selectedCustomer.profile_link2_url && (
                      <a href={selectedCustomer.profile_link2_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {selectedCustomer.profile_link2_name}
                      </a>
                    )}
                    {selectedCustomer.profile_link3_name && selectedCustomer.profile_link3_url && (
                      <a href={selectedCustomer.profile_link3_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {selectedCustomer.profile_link3_name}
                      </a>
                    )}
                    {selectedCustomer.linkedin_url && (
                      <a href={selectedCustomer.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Add New Customer
                  </h2>
                  <p style={{
                    color: '#64748b',
                    marginTop: '4px',
                    margin: 0
                  }}>
                    Enter customer information
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)

              try {
                // Get form values with proper validation
                const name = formData.get('name')
                const email = formData.get('email')
                const phone = formData.get('phone')
                const location = formData.get('location')
                const status = formData.get('status')

                // Validate required fields
                if (!name || !email || !phone || !location || !status) {
                  alert('Please fill in all required fields')
                  return
                }

                const customerData = {
                  name,
                  email,
                  phone,
                  company: formData.get('company') || undefined,
                  location,
                  status,
                  industry: formData.get('industry') || undefined,
                  userType: formData.get('userType') || 'job_seeker',
                  subscriptionPlan: formData.get('subscriptionPlan') || 'basic',
                  notes: formData.get('notes') || undefined
                }

                await handleAddCustomer(customerData)
              } catch (error) {
                console.error('Error in form submission:', error)
                alert('Error adding customer. Please try again.')
              }
            }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Basic Information */}
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 16px 0',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    Basic Information
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 16px 0',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    Professional Information
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Employment Status
                      </label>
                      <input
                        type="text"
                        name="company"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Enter employment status (e.g., Employed, Unemployed, Self-employed)"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Industry
                      </label>
                      <select
                        name="industry"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Select industry</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="construction">Construction</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="government">Government</option>
                        <option value="nonprofit">Non-profit</option>
                        <option value="consulting">Consulting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        User Type *
                      </label>
                      <select
                        name="userType"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="job_seeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                        <option value="tender_bidder">Tender Bidder</option>
                        <option value="course_student">Course Student</option>
                        <option value="opportunity_seeker">Opportunity Seeker</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Subscription Plan
                      </label>
                      <select
                        name="subscriptionPlan"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="basic">Basic (Free)</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Status *
                      </label>
                      <select
                        name="status"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="prospect">Prospect</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>
                  </div>
                </div>





                {/* Notes */}
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 16px 0',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    Additional Notes
                  </h4>
                  <textarea
                    name="notes"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Enter any additional notes about the customer's preferences, requirements, or interaction history..."
                  />
                </div>
              </div>

              <div style={{
                padding: '24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
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
                      padding: '8px 16px',
                      backgroundColor: '#f97316',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Add Customer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Message Modal */}
      <ContactSelectorModal />
      {/* Advanced Filters Modal */}
      <FiltersModal />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <Trash2 size={20} color="#ef4444" />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0
              }}>
                Delete User
              </h3>
            </div>
            
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? 
              This action will permanently delete their account and block their email address 
              <strong> {userToDelete?.email}</strong> from creating new accounts.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={cancelDeleteUser}
                disabled={deleteLoading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  opacity: deleteLoading ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleteLoading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  opacity: deleteLoading ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {deleteLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CRM
