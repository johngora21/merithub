import React, { useState } from 'react'
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
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
  Menu
} from 'lucide-react'

const CRM = () => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })

  // State management
  const [customers, setCustomers] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+254 700 123 456',
      company: 'TechCorp Solutions',
      location: 'Nairobi, Kenya',
      status: 'vip',
      userType: 'Premium',
      profileCompletion: '95%',
      joinedDate: '2023-01-15',
      lastActivity: '2024-01-15T10:30:00Z',
      totalSpent: 25000,
      jobsApplied: 12,
      tendersSubmitted: 8,
      opportunitiesApplied: 15,
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+254 700 234 567',
      company: 'Digital Innovations Ltd',
      location: 'Mombasa, Kenya',
      status: 'active',
      userType: 'Premium',
      profileCompletion: '88%',
      joinedDate: '2023-03-20',
      lastActivity: '2024-01-14T14:20:00Z',
      totalSpent: 18000,
      jobsApplied: 8,
      tendersSubmitted: 5,
      opportunitiesApplied: 12,
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+254 700 345 678',
      company: 'Global Solutions Inc',
      location: 'Kisumu, Kenya',
      status: 'active',
      userType: 'Free',
      profileCompletion: '72%',
      joinedDate: '2023-06-10',
      lastActivity: '2024-01-13T09:15:00Z',
      totalSpent: 8500,
      jobsApplied: 15,
      tendersSubmitted: 3,
      opportunitiesApplied: 8,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+254 700 456 789',
      company: 'StartupXYZ',
      location: 'Nakuru, Kenya',
      status: 'prospect',
      userType: 'Free',
      profileCompletion: '45%',
      joinedDate: '2023-09-05',
      lastActivity: '2024-01-12T16:45:00Z',
      totalSpent: 3200,
      jobsApplied: 6,
      tendersSubmitted: 1,
      opportunitiesApplied: 4,
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop'
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+254 700 567 890',
      company: 'Enterprise Corp',
      location: 'Eldoret, Kenya',
      status: 'vip',
      userType: 'Premium',
      profileCompletion: '98%',
      joinedDate: '2022-11-30',
      lastActivity: '2024-01-15T11:20:00Z',
      totalSpent: 42000,
      jobsApplied: 25,
      tendersSubmitted: 12,
      opportunitiesApplied: 20,
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+254 700 678 901',
      company: 'Creative Agency',
      location: 'Thika, Kenya',
      status: 'active',
      userType: 'Premium',
      profileCompletion: '82%',
      joinedDate: '2023-04-12',
      lastActivity: '2024-01-14T13:30:00Z',
      totalSpent: 15600,
      jobsApplied: 10,
      tendersSubmitted: 6,
      opportunitiesApplied: 14,
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop'
    },
    {
      id: '7',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '+254 700 789 012',
      company: 'Tech Startup',
      location: 'Nairobi, Kenya',
      status: 'prospect',
      userType: 'Free',
      profileCompletion: '38%',
      joinedDate: '2023-12-01',
      lastActivity: '2024-01-11T10:00:00Z',
      totalSpent: 1200,
      jobsApplied: 3,
      tendersSubmitted: 0,
      opportunitiesApplied: 2,
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
    },
    {
      id: '8',
      name: 'Jennifer Garcia',
      email: 'jennifer.garcia@email.com',
      phone: '+254 700 890 123',
      company: 'Marketing Solutions',
      location: 'Mombasa, Kenya',
      status: 'active',
      userType: 'Premium',
      profileCompletion: '91%',
      joinedDate: '2023-02-28',
      lastActivity: '2024-01-15T08:45:00Z',
      totalSpent: 22000,
      jobsApplied: 18,
      tendersSubmitted: 9,
      opportunitiesApplied: 16,
      profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop'
    },
    {
      id: '9',
      name: 'Thomas Martinez',
      email: 'thomas.martinez@email.com',
      phone: '+254 700 901 234',
      company: 'Consulting Group',
      location: 'Kisumu, Kenya',
      status: 'inactive',
      userType: 'Free',
      profileCompletion: '65%',
      joinedDate: '2023-07-15',
      lastActivity: '2023-12-20T14:30:00Z',
      totalSpent: 5800,
      jobsApplied: 7,
      tendersSubmitted: 2,
      opportunitiesApplied: 5,
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop'
    },
    {
      id: '10',
      name: 'Amanda Taylor',
      email: 'amanda.taylor@email.com',
      phone: '+254 700 012 345',
      company: 'Design Studio',
      location: 'Nakuru, Kenya',
      status: 'vip',
      userType: 'Premium',
      profileCompletion: '96%',
      joinedDate: '2022-08-20',
      lastActivity: '2024-01-15T12:15:00Z',
      totalSpent: 38000,
      jobsApplied: 30,
      tendersSubmitted: 15,
      opportunitiesApplied: 25,
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop'
    }
  ])
  const [interactions] = useState([])
  const [stats] = useState({
    totalCustomers: 10,
    activeCustomers: 6,
    vipCustomers: 3,
    totalRevenue: 189300
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
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
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
    const newCustomer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setCustomers([...customers, newCustomer])
    setShowAddCustomer(false)
  }

  const handleRouteToEmail = (customer) => {
    setContactType('email')
    setSelectedContacts([customer.email])
    setShowContactSelector(true)
  }

  const handleSendSMS = (customer) => {
    setContactType('phone')
    setSelectedContacts([customer.phone])
    setShowContactSelector(true)
  }

  const sendBulkSMS = async (contacts, message) => {
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Sending SMS to:', contacts, 'Message:', message)
  }

  const sendBulkEmail = async (contacts, message) => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Sending email to:', contacts, 'Message:', message)
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
                  placeholder="Search by name, email, company, or location..."
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
                <option value="vip">VIP</option>
                <option value="active">Active</option>
                <option value="prospect">Prospect</option>
                <option value="inactive">Inactive</option>
              </select>
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
                      Company
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
                {selectedCustomer.name}
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
                  src={selectedCustomer.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'} 
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
                    {selectedCustomer.company}
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



              {/* Personal Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0'
                }}>
                  Personal Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                      @{selectedCustomer.username || 'johnsmith'}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
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
                        Industry
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        margin: 0,
                        padding: '3px 0'
                      }}>
                        {selectedCustomer.industry || 'Technology'}
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
                        Experience
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        margin: 0,
                        padding: '3px 0'
                      }}>
                        {selectedCustomer.yearsExperience || '5-10 years'}
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
                        Status
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        margin: 0,
                        padding: '3px 0'
                      }}>
                        {selectedCustomer.employmentStatus || 'Employed'}
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
                        LinkedIn
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        margin: 0,
                        padding: '3px 0'
                      }}>
                        {selectedCustomer.linkedinProfile || 'linkedin.com/in/johnsmith'}
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
                        GitHub
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        margin: 0,
                        padding: '3px 0'
                      }}>
                        {selectedCustomer.githubProfile || 'github.com/johnsmith'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      marginBottom: '2px',
                      display: 'block'
                    }}>
                      Other Profiles
                    </label>
                    <p style={{
                      fontSize: '14px',
                      color: '#1a1a1a',
                      margin: 0,
                      padding: '3px 0'
                    }}>
                      {selectedCustomer.otherProfiles || 'behance.com/johnsmith'}
                    </p>
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
                  {selectedCustomer.about || 'Experienced software developer with 5+ years of expertise in frontend development, specializing in React, TypeScript, and modern web technologies. Passionate about creating user-friendly applications and contributing to innovative projects.'}
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
                  {(selectedCustomer.skills || ['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Git', 'AWS']).map((skill, index) => (
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
                  {(selectedCustomer.experience || [
                    {
                      title: 'Senior Frontend Developer',
                      company: 'TechCorp Solutions',
                      duration: '2022 - Present',
                      description: 'Led development of multiple React applications, mentored junior developers, and implemented best practices for code quality and performance.'
                    },
                    {
                      title: 'Frontend Developer',
                      company: 'Digital Innovations Ltd',
                      duration: '2020 - 2022',
                      description: 'Developed responsive web applications using React and TypeScript, collaborated with design and backend teams.'
                    }
                  ]).map((exp, index) => (
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
                      {selectedCustomer.education?.degree || 'Bachelor of Science in Computer Science'}
                    </h4>
                    <span style={{
                      fontSize: '14px',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {selectedCustomer.education?.duration || '2016 - 2020'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#16a34a',
                    margin: '0 0 8px 0'
                  }}>
                    {selectedCustomer.education?.institution || 'University of Nairobi'}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#374151',
                    margin: 0
                  }}>
                    {selectedCustomer.education?.description || 'Graduated with First Class Honours. Specialized in Software Engineering and Web Development.'}
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
                  {(selectedCustomer.certificates || [
                    {
                      name: 'React Developer Certification',
                      issuer: 'Meta',
                      date: '2023',
                      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=60&h=60&fit=crop'
                    },
                    {
                      name: 'AWS Certified Developer',
                      issuer: 'Amazon Web Services',
                      date: '2022',
                      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop'
                    }
                  ]).map((cert, index) => (
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
                  {(selectedCustomer.documents || [
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
                        Company/Organization
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
                        placeholder="Enter company name"
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
    </div>
  )
}

export default CRM
